import axios from 'axios';
import configs from '@configs/configs';

interface SePayQRData {
  accountNo: string;
  accountName: string;
  bankCode: string;
  amount: number;
  content: string;
  orderId: string;
}

interface SePayTransaction {
  id?: string;
  transactionId?: string;
  amount?: number;
  money?: number; // SePay có thể dùng field này
  content?: string;
  description?: string;
  message?: string;
  orderId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'success' | 'SUCCESS' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Cho phép các field khác từ SePay API
}

class SePayService {
  // Đọc cấu hình từ configs để có thể override bằng ENV khi deploy
  private static readonly IS_SANDBOX = configs.sepayConfig.isSandbox;
  private static readonly API_TOKEN = configs.sepayConfig.isSandbox 
    ? configs.sepayConfig.sandboxApiToken 
    : configs.sepayConfig.apiToken;
  // Endpoint tạo ảnh QR VietQR cho MBBank
  // Docs: https://qr.sepay.vn/img?acc=SO_TAI_KHOAN&bank=MBBank&amount=SO_TIEN&des=NOI_DUNG&template=TEMPLATE
  private static readonly QR_IMG_API_URL = 'https://qr.sepay.vn/img';
  private static readonly API_BASE_URL = configs.sepayConfig.isSandbox
    ? configs.sepayConfig.sandboxApiBaseUrl
    : configs.sepayConfig.apiBaseUrl;
  private static readonly BANK_CODE = configs.sepayConfig.bankCode;
  private static readonly ACCOUNT_NO = configs.sepayConfig.isSandbox
    ? configs.sepayConfig.sandboxAccountNo
    : configs.sepayConfig.accountNo;
  private static readonly ACCOUNT_NAME = configs.sepayConfig.isSandbox
    ? configs.sepayConfig.sandboxAccountName
    : configs.sepayConfig.accountName;

  /**
   * Tạo QR code động cho thanh toán
   * @param amount Số tiền cần thanh toán
   * @param orderId Mã đơn hàng
   * @param description Mô tả thanh toán
   * @returns URL QR code hoặc data QR code
   */
  public static async createQRCode(amount: number, orderId: string, description?: string): Promise<{
    qrCode: string;
    qrData: string;
    accountNo: string;
    accountName: string;
    bankCode: string;
    amount: number;
    content: string;
  }> {
    try {
      // Log mode hiện tại
      if (this.IS_SANDBOX) {
        console.log('🧪 SePay SANDBOX MODE - Using test account for QR code generation');
      }
      
      // Làm tròn số tiền để đảm bảo không có số thập phân (ngân hàng chỉ chấp nhận số nguyên)
      const roundedAmount = Math.round(amount);
      
      // Tạo nội dung chuyển khoản với mã đơn hàng
      const content = description 
        ? `${description} - ${orderId}` 
        : `Thanh toan don hang ${orderId}`;

      // Tạo URL ảnh QR code động theo chuẩn VietQR (SePay)
      // https://qr.sepay.vn/img?acc=SO_TAI_KHOAN&bank=MBBank&amount=SO_TIEN&des=NOI_DUNG&template=compact
      const qrParams = new URLSearchParams({
        acc: this.ACCOUNT_NO,
        bank: 'MBBank',
        amount: roundedAmount.toString(), // Dùng số đã làm tròn
        des: content,
        template: 'compact', // hoặc qronly / để trống
      });

      const qrCodeUrl = `${this.QR_IMG_API_URL}?${qrParams.toString()}`;

      // Tạo data QR code để hiển thị (theo chuẩn VietQR)
      const qrData = this.generateVietQRData({
        accountNo: this.ACCOUNT_NO,
        accountName: this.ACCOUNT_NAME,
        bankCode: this.BANK_CODE,
        amount: roundedAmount, // Dùng số đã làm tròn
        content: content
      });

      const result = {
        qrCode: qrCodeUrl,
        qrData: qrData,
        accountNo: this.ACCOUNT_NO,
        accountName: this.ACCOUNT_NAME,
        bankCode: this.BANK_CODE,
        amount: roundedAmount, // Trả về số đã làm tròn
        content: content
      };

      if (this.IS_SANDBOX) {
        console.log('🧪 SePay SANDBOX QR Code created:', {
          orderId,
          amount: roundedAmount,
          accountNo: this.ACCOUNT_NO,
          accountName: this.ACCOUNT_NAME,
          note: 'This is a TEST transaction - no real money will be transferred'
        });
      }

      return result;
    } catch (error: any) {
      console.error('❌ SePay create QR code error:', error);
      throw new Error(`Failed to create QR code: ${error.message}`);
    }
  }

  /**
   * Tạo data QR code theo chuẩn VietQR
   */
  private static generateVietQRData(data: {
    accountNo: string;
    accountName: string;
    bankCode: string;
    amount: number;
    content: string;
  }): string {
    // Format theo chuẩn VietQR: 
    // 00020101021238570010A00000072701270006...
    // Hoặc đơn giản hơn, tạo string chứa thông tin để library QR code có thể tạo
    const qrString = `0002010102123857${data.bankCode}0010A00000072701270006${data.accountNo}0208QRIBFTTA5303704540${data.amount}5802VN62${data.content.length.toString().padStart(2, '0')}${data.content}6304`;
    
    // Hoặc format đơn giản hơn cho MB Bank
    return `MB${data.accountNo}|${data.accountName}|${data.amount}|${data.content}`;
  }

  /**
   * Lấy danh sách giao dịch từ SePay API
   */
  public static async getTransactions(params?: {
    fromDate?: string;
    toDate?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<SePayTransaction[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/v1/transactions`, {
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        params: params || {}
      });

      return response.data.data || [];
    } catch (error: any) {
      console.error('❌ SePay get transactions error:', error);
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
  }

  /**
   * Tìm giao dịch từ SePay API theo orderId (fallback khi webhook không hoạt động)
   */
  public static async findTransactionByOrderId(orderId: string, expectedAmount?: number): Promise<{
    found: boolean;
    transaction?: any;
    amount?: number;
  }> {
    try {
      // Lấy transactions trong 24h gần đây
      const fromDate = new Date();
      fromDate.setHours(fromDate.getHours() - 24);
      const toDate = new Date();

      const transactions = await this.getTransactions({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
        status: 'success', // Chỉ lấy giao dịch thành công
        limit: 100 // Lấy tối đa 100 giao dịch gần nhất
      });

      // Tìm transaction có content chứa orderId
      for (const transaction of transactions) {
        const content = (transaction.content || transaction.description || transaction.message || '').toString();
        
        // Kiểm tra nếu content chứa orderId
        if (content.includes(orderId)) {
          const transactionAmount = transaction.amount || transaction.money || 0;
          
          // Nếu có expectedAmount, kiểm tra số tiền với tolerance
          if (expectedAmount !== undefined) {
            const amountDiff = Math.abs(Math.round(expectedAmount) - Math.round(transactionAmount));
            // Cho phép sai lệch ±1 VND
            if (amountDiff <= 1) {
              console.log(`✅ Found matching transaction for order ${orderId}`, {
                transactionId: transaction.id || transaction.transactionId,
                expectedAmount: Math.round(expectedAmount),
                actualAmount: Math.round(transactionAmount),
                diff: amountDiff
              });
              return {
                found: true,
                transaction: transaction,
                amount: transactionAmount
              };
            } else {
              console.warn(`⚠️ Transaction found but amount mismatch for order ${orderId}`, {
                expectedAmount: Math.round(expectedAmount),
                actualAmount: Math.round(transactionAmount),
                diff: amountDiff
              });
            }
          } else {
            // Không có expectedAmount, chỉ cần match orderId
            return {
              found: true,
              transaction: transaction,
              amount: transactionAmount
            };
          }
        }
      }

      return { found: false };
    } catch (error: any) {
      console.error(`❌ SePay find transaction by orderId error for ${orderId}:`, error);
      return { found: false };
    }
  }

  /**
   * Xác thực webhook từ SePay
   */
  public static verifyWebhook(token: string, payload: any): boolean {
    // Xác thực Bearer Token
    const isValid = token === `Bearer ${this.API_TOKEN}` || token === this.API_TOKEN;
    
    if (this.IS_SANDBOX && isValid) {
      console.log('🧪 SePay SANDBOX webhook verified - TEST mode');
    }
    
    return isValid;
  }

  /**
   * Xử lý webhook callback từ SePay
   */
  public static async handleWebhook(payload: any): Promise<{
    success: boolean;
    orderId?: string;
    transactionId?: string;
    amount?: number;
    status?: string;
  }> {
    try {
      // Log payload để debug
      console.log('📥 SePay webhook payload:', JSON.stringify(payload, null, 2));

      // Parse payload từ SePay webhook
      // Format có thể khác nhau tùy theo SePay API
      const {
        orderId: payloadOrderId,
        transactionId,
        amount,
        status,
        content,
        description,
        message,
        // SePay có thể dùng các field khác
        code,
        reference_code,
        order_code
      } = payload;

      // Extract orderId từ nhiều nguồn
      let orderId = payloadOrderId || order_code || reference_code || code;

      // Nếu không có orderId trực tiếp, thử extract từ content/description
      if (!orderId && (content || description || message)) {
        const text = (content || description || message || '').toString();
        
        // Tìm pattern VPC + số + chữ (format: VPC{timestamp}{random})
        const vpcPattern = /VPC\d+[A-Z0-9]+/gi;
        const match = text.match(vpcPattern);
        if (match && match.length > 0) {
          orderId = match[0];
          console.log(`🔍 Extracted orderId from content: ${orderId}`);
        }
      }

      // Kiểm tra status - SePay có thể dùng nhiều format
      const isSuccess = 
        status === 'success' || 
        status === 'completed' || 
        status === 'paid' ||
        status === 'SUCCESS' ||
        status === 'COMPLETED' ||
        status === 'PAID' ||
        (typeof status === 'number' && status === 1) ||
        (typeof status === 'boolean' && status === true);

      return {
        success: isSuccess,
        orderId: orderId,
        transactionId: transactionId || payload.id || payload.transaction_id,
        amount: amount || payload.amount || payload.money,
        status: status
      };
    } catch (error: any) {
      console.error('❌ SePay webhook handling error:', error);
      throw new Error(`Failed to handle webhook: ${error.message}`);
    }
  }
}

export default SePayService;


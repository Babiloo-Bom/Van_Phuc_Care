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
  id: string;
  amount: number;
  content: string;
  orderId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

class SePayService {
  // Đọc cấu hình từ configs để có thể override bằng ENV khi deploy
  private static readonly API_TOKEN = configs.sepayConfig.apiToken;
  // Endpoint tạo ảnh QR VietQR cho MBBank
  // Docs: https://qr.sepay.vn/img?acc=SO_TAI_KHOAN&bank=MBBank&amount=SO_TIEN&des=NOI_DUNG&template=TEMPLATE
  private static readonly QR_IMG_API_URL = 'https://qr.sepay.vn/img';
  private static readonly API_BASE_URL = configs.sepayConfig.apiBaseUrl;
  private static readonly BANK_CODE = configs.sepayConfig.bankCode;
  private static readonly ACCOUNT_NO = configs.sepayConfig.accountNo;
  private static readonly ACCOUNT_NAME = configs.sepayConfig.accountName;

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
      // Tạo nội dung chuyển khoản với mã đơn hàng
      const content = description 
        ? `${description} - ${orderId}` 
        : `Thanh toan don hang ${orderId}`;

      // Tạo URL ảnh QR code động theo chuẩn VietQR (SePay)
      // https://qr.sepay.vn/img?acc=SO_TAI_KHOAN&bank=MBBank&amount=SO_TIEN&des=NOI_DUNG&template=compact
      const qrParams = new URLSearchParams({
        acc: this.ACCOUNT_NO,
        bank: 'MBBank',
        amount: amount.toString(),
        des: content,
        template: 'compact', // hoặc qronly / để trống
      });

      const qrCodeUrl = `${this.QR_IMG_API_URL}?${qrParams.toString()}`;

      // Tạo data QR code để hiển thị (theo chuẩn VietQR)
      const qrData = this.generateVietQRData({
        accountNo: this.ACCOUNT_NO,
        accountName: this.ACCOUNT_NAME,
        bankCode: this.BANK_CODE,
        amount: amount,
        content: content
      });

      return {
        qrCode: qrCodeUrl,
        qrData: qrData,
        accountNo: this.ACCOUNT_NO,
        accountName: this.ACCOUNT_NAME,
        bankCode: this.BANK_CODE,
        amount: amount,
        content: content
      };
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
   * Xác thực webhook từ SePay
   */
  public static verifyWebhook(token: string, payload: any): boolean {
    // Xác thực Bearer Token
    return token === `Bearer ${this.API_TOKEN}` || token === this.API_TOKEN;
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
      // Parse payload từ SePay webhook
      // Format có thể khác nhau tùy theo SePay API
      const {
        orderId,
        transactionId,
        amount,
        status,
        content
      } = payload;

      return {
        success: status === 'success' || status === 'completed',
        orderId: orderId,
        transactionId: transactionId,
        amount: amount,
        status: status
      };
    } catch (error: any) {
      console.error('❌ SePay webhook handling error:', error);
      throw new Error(`Failed to handle webhook: ${error.message}`);
    }
  }
}

export default SePayService;


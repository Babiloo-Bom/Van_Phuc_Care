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
  amount_in?: string;
  amount_out?: string;
  transaction_content?: string;
  reference_number?: string;
  transaction_date?: string;
  account_number?: string;
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
   * Format Date to 'YYYY-MM-DD HH:mm:ss' for SePay
   */
  private static formatDateForSepay(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const HH = pad(date.getHours());
    const MM = pad(date.getMinutes());
    const SS = pad(date.getSeconds());
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
  }

  /**
   * Lấy danh sách giao dịch từ SePay API
   * Hỗ trợ cả key chính thức của SePay và alias (for backward compatibility):
   * - SePay keys: account_number, transaction_date_min, transaction_date_max, since_id, limit, reference_number, amount_in, amount_out
   * - Aliases: fromDate -> transaction_date_min, toDate -> transaction_date_max, offset -> since_id
   */
  public static async getTransactions(params?: {
    account_number?: string;
    transaction_date_min?: string;
    transaction_date_max?: string;
    since_id?: string | number;
    limit?: number;
    reference_number?: string;
    amount_in?: number | string;
    amount_out?: number | string;
    // backward compatible aliases
    fromDate?: string;
    toDate?: string;
    offset?: string | number;
  }, options?: { fallback?: boolean }): Promise<SePayTransaction[]> {
    try {
      // Map friendly/legacy keys to SePay's expected keys
      const query: any = {};

      if (params) {
        if (params.transaction_date_min) query.transaction_date_min = params.transaction_date_min;
        else if ((params as any).fromDate) query.transaction_date_min = (params as any).fromDate;

        if (params.transaction_date_max) query.transaction_date_max = params.transaction_date_max;
        else if ((params as any).toDate) query.transaction_date_max = (params as any).toDate;

        if (params.since_id) query.since_id = params.since_id;
        else if ((params as any).offset) query.since_id = (params as any).offset;

        if (params.account_number) query.account_number = params.account_number;
        if (params.reference_number) query.reference_number = params.reference_number;
        if (params.amount_in !== undefined) query.amount_in = params.amount_in;
        if (params.amount_out !== undefined) query.amount_out = params.amount_out;

        if (params.limit !== undefined) {
          const limitNum = Number(params.limit) || 0;
          // SePay cap at 5000 per docs
          query.limit = Math.min(limitNum, 5000);
        }
      }

      // Default to configured account if not explicitly provided
      if (!query.account_number && this.ACCOUNT_NO) {
        query.account_number = this.ACCOUNT_NO;
      }

      // Debug/logging for troubleshooting
      if (this.IS_SANDBOX) {
        console.log('🧪 SePay getTransactions request', {
          url: `${this.API_BASE_URL}/userapi/transactions/list`,
          params: query
        });
      }

      const response = await axios.get(`${this.API_BASE_URL}/userapi/transactions/list`, {
        headers: {
          'Authorization': `Bearer ${this.API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        params: query
      });

      // SePay can return different shapes. Normalize the result to an array of transactions.
      const resp = response.data || {};

      // Common variants
      let transactions: any = [];
      if (Array.isArray(resp.transactions)) transactions = resp.transactions;
      else if (Array.isArray(resp.transaction)) transactions = resp.transaction;
      else if (Array.isArray(resp.data?.transactions)) transactions = resp.data.transactions;
      else if (Array.isArray(resp.data)) transactions = resp.data;
      else if (resp.transaction) transactions = [resp.transaction];
      else if (resp.transactions) transactions = [resp.transactions];

      // If no transactions found and fallback allowed, retry with looser filters (remove amount_in) once
      if ((Array.isArray(transactions) && transactions.length === 0) && options?.fallback) {
        console.log('ℹ️ SePay getTransactions: no results, retrying with relaxed filters');
        const relaxedQuery = { ...query };
        delete (relaxedQuery as any).amount_in;
        try {
          const retryResp = await axios.get(`${this.API_BASE_URL}/userapi/transactions/list`, {
            headers: {
              'Authorization': `Bearer ${this.API_TOKEN}`,
              'Content-Type': 'application/json'
            },
            params: relaxedQuery
          });
          const r = retryResp.data || {};
          if (Array.isArray(r.transactions)) transactions = r.transactions;
          else if (Array.isArray(r.transaction)) transactions = r.transaction;
          else if (Array.isArray(r.data?.transactions)) transactions = r.data.transactions;
          else if (Array.isArray(r.data)) transactions = r.data;
          else if (r.transaction) transactions = [r.transaction];
          else if (r.transactions) transactions = [r.transactions];
        } catch (retryError: any) {
          console.warn('⚠️ SePay getTransactions retry failed:', retryError?.message || retryError);
        }
      }

      if (this.IS_SANDBOX) {
        console.log(`🔍 SePay API returned ${Array.isArray(transactions) ? transactions.length : 0} transactions`);
      }

      if (Array.isArray(transactions)) return transactions as SePayTransaction[];
      return [];
    } catch (error: any) {
      console.error('❌ SePay get transactions error:', error?.response?.data || error?.message || error);
      throw new Error(`Failed to get transactions: ${error.message}`);
    }
  }

  /**
   * Tìm giao dịch từ SePay API theo orderId (fallback khi webhook không hoạt động)
   */
  public static async findTransactionByOrderId(orderId: string, expectedAmount?: number, opts?: { accountNumber?: string; hours?: number }): Promise<{
    found: boolean;
    transaction?: any;
    amount?: number;
  }> {
    try {
      console.log('findTransactionByOrderId: ', { orderId, expectedAmount, opts });

      const hours = opts?.hours ?? 24;
      const fromDate = new Date();
      fromDate.setHours(fromDate.getHours() - hours);
      const toDate = new Date();

      // First attempt: use amount filter if provided and default account number
      const transactions = await this.getTransactions({
        transaction_date_min: this.formatDateForSepay(fromDate),
        transaction_date_max: this.formatDateForSepay(toDate),
        amount_in: expectedAmount !== undefined ? Math.round(expectedAmount) : undefined,
        account_number: opts?.accountNumber || this.ACCOUNT_NO,
        limit: 200 // Lấy một số lượng hợp lý
      }, { fallback: true });

      console.log(`🔍 Retrieved ${transactions.length} transactions from SePay for orderId ${orderId}`);

      // Helper to extract amount from diverse field names
      const extractAmount = (tx: any) => {
        const cand = tx.transferAmount || tx.transfer_amount || tx.transfer || tx.amount_in || tx.amount || tx.money || tx.amount_out || tx.value || 0;
        return Number(cand || 0);
      };

      // Helper to stringify and look for orderId in any field
      const txMatchesOrder = (tx: any) => {
        const fields = [
          tx.transaction_content,
          tx.transactionContent,
          tx.content,
          tx.description,
          tx.message,
          tx.reference_number,
          tx.referenceNumber,
          tx.referenceCode,
          tx.order_code,
          tx.code,
          tx.id
        ];
        for (const f of fields) {
          try {
            if (f && f.toString().includes(orderId)) return true;
          } catch (e) {
            // ignore
          }
        }
        // As last resort, stringified whole object
        try {
          if (JSON.stringify(tx).includes(orderId)) return true;
        } catch (e) {
          // ignore
        }
        return false;
      };

      for (const transaction of transactions) {
        const content = (transaction.transaction_content || transaction.transactionContent || transaction.content || transaction.description || transaction.message || '').toString();
        const reference = (transaction.reference_number || transaction.referenceNumber || transaction.referenceCode || '').toString();

        console.log('checking transaction content/ref:', content, reference);

        if (txMatchesOrder(transaction) || content.includes(orderId) || reference.includes(orderId)) {
          const transactionAmount = extractAmount(transaction);

          if (expectedAmount !== undefined) {
            const amountDiff = Math.abs(Math.round(expectedAmount) - Math.round(transactionAmount));
            // Allow small rounding diffs
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
            // No amount to verify, accept match
            return {
              found: true,
              transaction: transaction,
              amount: extractAmount(transaction)
            };
          }
        }
      }

      // If none found and we used amount filter, try again without amount and wider window as last resort
      if (expectedAmount !== undefined) {
        console.log('ℹ️ No matching transaction found with amount filter, retrying without amount and wider window');
        const widerFrom = new Date();
        widerFrom.setHours(widerFrom.getHours() - Math.max(hours, 72));
        const fallbackTransactions = await this.getTransactions({
          transaction_date_min: this.formatDateForSepay(widerFrom),
          transaction_date_max: this.formatDateForSepay(toDate),
          account_number: opts?.accountNumber || this.ACCOUNT_NO,
          limit: 500
        }, { fallback: true });

        console.log(`🔍 Fallback retrieved ${fallbackTransactions.length} transactions`);

        for (const transaction of fallbackTransactions) {
          if (txMatchesOrder(transaction)) {
            const transactionAmount = extractAmount(transaction);
            const amountDiff = Math.abs(Math.round(expectedAmount) - Math.round(transactionAmount));
            if (amountDiff <= 1) {
              console.log(`✅ Found matching transaction on fallback for order ${orderId}`, { transactionId: transaction.id || transaction.transactionId });
              return { found: true, transaction, amount: transactionAmount };
            } else {
              console.warn(`⚠️ Fallback found transaction but amount mismatch for order ${orderId}`);
            }
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
    console.log('this.API_TOKEN:', this.API_TOKEN);
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


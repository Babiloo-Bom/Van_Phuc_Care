export interface VNPayPaymentData {
  fullName: string
  email: string
  phone: string
  address?: string
  paymentMethod: 'vnpay' | 'qr'
  items: any[]
  total: number
}

export interface TransactionData {
  title: string
  items: any[]
  customer: {
    fullName: string
    email: string
    phone: string
    address?: string
  }
  total: number
  paymentConfirmation?: string
  registerId?: string
  target: string
  type: 'vnpay' | 'qr'
  origin: string
}

export const usePaymentApi = () => {
  const config = useRuntimeConfig()
  // Hardcode localhost for testing
  const apiBase = 'http://localhost:3000'

  return {
    // Thanh toán qua VNPay
    async vnpay(data: VNPayPaymentData) {
      return await $fetch(`${apiBase}/api/e/payment/vnpay`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      })
    },

    // Xác thực thanh toán VNPay (callback)
    async vnpayReturn(params: any) {
      return await $fetch(`${apiBase}/api/e/payment/vnpay/return`, {
        method: 'GET',
        params,
        credentials: 'include',
      })
    },

    // Tạo giao dịch (thanh toán QR)
    async createTransaction(data: TransactionData) {
      return await $fetch(`${apiBase}/api/e/transactions`, {
        method: 'POST',
        body: data,
        credentials: 'include',
      })
    },

    // Lấy danh sách giao dịch
    async getTransactions(params?: any) {
      return await $fetch(`${apiBase}/api/e/transactions`, {
        method: 'GET',
        params,
        credentials: 'include',
      })
    },

    // Lấy chi tiết giao dịch
    async getTransactionDetail(transactionId: string) {
      return await $fetch(`${apiBase}/api/e/transactions/${transactionId}`, {
        method: 'GET',
        credentials: 'include',
      })
    },

    // Cập nhật trạng thái giao dịch
    async updateTransaction(transactionId: string, data: any) {
      return await $fetch(`${apiBase}/api/e/transactions/${transactionId}`, {
        method: 'PUT',
        body: data,
        credentials: 'include',
      })
    },
  }
}


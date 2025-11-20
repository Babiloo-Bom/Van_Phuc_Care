import { ref, computed } from 'vue';
import { paymentMethods, getPaymentMethod, getPaymentMethodFees, validatePaymentAmount, type PaymentMethodConfig } from '~/configs/paymentMethods';

export const usePayment = () => {
  const selectedMethod = ref<string>('vnpay');
  const amount = ref<number>(0);
  const isLoading = ref<boolean>(false);
  const error = ref<string>('');

  // Computed
  const enabledMethods = computed(() => {
    return paymentMethods.filter(method => method.enabled);
  });

  const currentMethod = computed(() => {
    return getPaymentMethod(selectedMethod.value);
  });

  const fees = computed(() => {
    return getPaymentMethodFees(selectedMethod.value, amount.value);
  });

  const totalAmount = computed(() => {
    return amount.value + fees.value;
  });

  const validation = computed(() => {
    return validatePaymentAmount(selectedMethod.value, amount.value);
  });

  // Methods
  const selectMethod = (methodId: string) => {
    selectedMethod.value = methodId;
    error.value = '';
  };

  const setAmount = (newAmount: number) => {
    amount.value = newAmount;
    error.value = '';
  };

  const processPayment = async (orderData: any) => {
    if (!validation.value.valid) {
      error.value = validation.value.message || 'Số tiền không hợp lệ';
      return { success: false, error: error.value };
    }

    isLoading.value = true;
    error.value = '';

    try {
      const method = currentMethod.value;
      if (!method) {
        throw new Error('Phương thức thanh toán không hợp lệ');
      }

      // Tạo payment data
      const paymentData = {
        method: method.id,
        amount: amount.value,
        fees: fees.value,
        total: totalAmount.value,
        orderId: orderData.orderId,
        customerInfo: orderData.customerInfo,
        items: orderData.items,
        timestamp: new Date().toISOString(),
      };

      // Xử lý theo từng phương thức
      let result;
      switch (method.id) {
        case 'vnpay':
          result = await processVNPayPayment(paymentData);
          break;
        case 'momo':
          result = await processMoMoPayment(paymentData);
          break;
        case 'qr':
          result = await processQRPayment(paymentData);
          break;
        case 'bank_transfer':
          result = await processBankTransfer(paymentData);
          break;
        case 'bypass':
          result = await processBypassPayment(paymentData);
          break;
        default:
          throw new Error('Phương thức thanh toán không được hỗ trợ');
      }

      return result;
    } catch (err: any) {
      error.value = err.message || 'Có lỗi xảy ra khi xử lý thanh toán';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // VNPay Payment
  const processVNPayPayment = async (paymentData: any) => {
    // TODO: Implement VNPay integration
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
      transactionId: `VNP_${Date.now()}`,
      method: 'vnpay',
    };
  };

  // MoMo Payment
  const processMoMoPayment = async (paymentData: any) => {
    // TODO: Implement MoMo integration
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      paymentUrl: 'https://test-payment.momo.vn/v2/gateway/api/create',
      transactionId: `MOMO_${Date.now()}`,
      method: 'momo',
    };
  };

  // QR Code Payment
  const processQRPayment = async (paymentData: any) => {
    // TODO: Implement QR payment
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      transactionId: `QR_${Date.now()}`,
      method: 'qr',
    };
  };

  // Bank Transfer
  const processBankTransfer = async (paymentData: any) => {
    // TODO: Implement bank transfer
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      bankInfo: currentMethod.value?.bankInfo,
      reference: `VPC${Date.now()}`,
      method: 'bank_transfer',
    };
  };

  // Bypass Payment (Demo)
  const processBypassPayment = async (paymentData: any) => {
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      transactionId: `BYPASS_${Date.now()}`,
      method: 'bypass',
      message: 'Payment bypassed for demo purposes',
    };
  };

  const reset = () => {
    selectedMethod.value = 'vnpay';
    amount.value = 0;
    isLoading.value = false;
    error.value = '';
  };

  return {
    // State
    selectedMethod,
    amount,
    isLoading,
    error,
    
    // Computed
    enabledMethods,
    currentMethod,
    fees,
    totalAmount,
    validation,
    
    // Methods
    selectMethod,
    setAmount,
    processPayment,
    reset,
  };
};

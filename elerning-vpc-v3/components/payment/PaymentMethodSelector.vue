<template>
  <div class="payment-method-selector">
    <div class="mb-6">
      <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <div class="w-8 h-8 bg-prim-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="fill-none stroke-white">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6m8 0V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4.01" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        Phương thức thanh toán
      </h3>
    </div>

    <div class="space-y-4">
      <div
        v-for="method in enabledMethods"
        :key="method.id"
        :class="[
          'payment-option',
          'border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 group',
          selectedMethod === method.id
            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02] selected'
            : 'border-gray-200 hover:border-blue-400 hover:shadow-lg hover:bg-blue-25 hover:transform hover:scale-[1.01] hover:-translate-y-1'
        ]"
        @click="selectMethod(method.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <!-- Radio Button -->
            <div class="relative">
              <input
                type="radio"
                :id="`payment-${method.id}`"
                :value="method.id"
                v-model="selectedMethod"
                class="sr-only"
                @change="selectMethod(method.id)"
              />
              <div
                :class="[
                  'radio-button w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer group-hover:scale-110',
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-500 shadow-lg ring-2 ring-blue-200'
                    : 'border-gray-300 bg-white group-hover:border-blue-400 group-hover:shadow-md group-hover:bg-blue-50'
                ]"
                @click="selectMethod(method.id)"
              >
                <div
                  v-if="selectedMethod === method.id"
                  class="radio-dot w-3 h-3 rounded-full bg-white shadow-sm relative z-10"
                ></div>
              </div>
            </div>

            <!-- Payment Method Info -->
            <div class="flex items-center gap-4 flex-1">
              <!-- Icon -->
              <div
                :class="[
                  'w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg',
                  `bg-[${method.color}]`
                ]"
                :style="{ backgroundColor: method.color }"
              >
                <img
                  v-if="method.icon"
                  :src="method.icon"
                  :alt="method.name"
                  class="w-8 h-8 object-contain"
                  @error="handleImageError"
                />
                <span v-else class="text-white font-bold">
                  {{ method.name.charAt(0) }}
                </span>
              </div>

              <!-- Details -->
              <div class="flex-1">
                <h4 class="font-semibold text-gray-800 text-lg group-hover:text-primary-100 transition-colors duration-300">
                  {{ method.name }}
                </h4>
                <p class="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                  {{ method.description }}
                </p>
                
                <!-- Features -->
                <div v-if="method.features && method.features.length > 0" class="flex gap-2 mt-2">
                  <span
                    v-for="feature in method.features.slice(0, 3)"
                    :key="feature"
                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full group-hover:bg-prim-100 group-hover:text-white transition-all duration-300"
                  >
                    {{ getFeatureLabel(feature) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Fees Info -->
          <div v-if="method.fees" class="text-right">
            <div class="text-sm text-gray-600 group-hover:text-primary-100 group-hover:font-semibold transition-all duration-300">
              <span v-if="method.fees.percentage">
                {{ method.fees.percentage }}% phí
              </span>
              <span v-else-if="method.fees.fixed === 0">
                Miễn phí
              </span>
              <span v-else>
                {{ method.fees.fixed?.toLocaleString('vi-VN') }} VND
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QR Code Display (if QR method selected) -->
    <div v-if="selectedMethod === 'qr' && showQRCode" class="mt-6 p-6 bg-gray-50 rounded-xl">
      <h4 class="text-lg font-semibold text-gray-800 mb-4 text-center">
        Quét mã QR để thanh toán
      </h4>
      <div class="flex justify-center">
        <div class="w-64 h-64 bg-white rounded-lg p-4 shadow-lg">
          <div class="w-full h-full bg-gray-200 rounded flex items-center justify-center">
            <span class="text-gray-500">QR Code sẽ hiển thị ở đây</span>
          </div>
        </div>
      </div>
      <p class="text-center text-sm text-gray-600 mt-4">
        Sử dụng ứng dụng ngân hàng để quét mã QR này
      </p>
    </div>

    <!-- Bank Transfer Info (if bank method selected) -->
    <div v-if="selectedMethod === 'bank_transfer' && bankInfo" class="mt-6 p-6 bg-blue-50 rounded-xl">
      <h4 class="text-lg font-semibold text-gray-800 mb-4">
        Thông tin chuyển khoản
      </h4>
      <div class="space-y-3">
        <div class="flex justify-between">
          <span class="text-gray-600">Ngân hàng:</span>
          <span class="font-semibold">{{ bankInfo.bankName }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Số tài khoản:</span>
          <span class="font-semibold font-mono">{{ bankInfo.accountNumber }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Chủ tài khoản:</span>
          <span class="font-semibold">{{ bankInfo.accountHolder }}</span>
        </div>
        <div v-if="bankInfo.branch" class="flex justify-between">
          <span class="text-gray-600">Chi nhánh:</span>
          <span class="font-semibold">{{ bankInfo.branch }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Nội dung chuyển khoản:</span>
          <span class="font-semibold font-mono text-primary-100">{{ paymentReference }}</span>
        </div>
      </div>
      <p class="text-sm text-gray-600 mt-4">
        Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { paymentMethods, getPaymentMethod, type PaymentMethodConfig } from '~/configs/paymentMethods'

interface Props {
  modelValue?: string
  amount?: number
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'methodSelected', method: PaymentMethodConfig): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  amount: 0
})

const emit = defineEmits<Emits>()

// Reactive data
const selectedMethod = ref(props.modelValue || 'vnpay')
const showQRCode = ref(false)

// Computed
const enabledMethods = computed(() => {
  return paymentMethods.filter(method => method.enabled)
})

const bankInfo = computed(() => {
  const method = getPaymentMethod(selectedMethod.value)
  return method?.bankInfo
})

const paymentReference = computed(() => {
  const timestamp = Date.now()
  return `VPC${timestamp}`
})

// Methods
const selectMethod = (methodId: string) => {
  selectedMethod.value = methodId
  emit('update:modelValue', methodId)
  
  const method = getPaymentMethod(methodId)
  if (method) {
    emit('methodSelected', method)
  }
  
  // Show QR code for QR method
  showQRCode.value = methodId === 'qr'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const getFeatureLabel = (feature: string): string => {
  const labels: Record<string, string> = {
    instant: 'Tức thì',
    secure: 'Bảo mật',
    refund: 'Hoàn tiền',
    mobile: 'Di động',
    qr: 'QR Code',
    manual: 'Thủ công',
    low_fee: 'Phí thấp',
    demo: 'Demo',
    free: 'Miễn phí'
  }
  return labels[feature] || feature
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue !== selectedMethod.value) {
    selectedMethod.value = newValue
  }
})

// Initialize
if (!selectedMethod.value && enabledMethods.value.length > 0) {
  selectMethod(enabledMethods.value[0].id)
}
</script>

<style scoped>
.payment-option {
  transition: all 0.3s ease-in-out;
}

.payment-option:hover {
  transform: translateY(-4px) scale(1.01);
}

.payment-option:active {
  transform: translateY(-2px) scale(1.005);
}

/* Custom background color for hover state */
.group:hover .group-hover\:bg-prim-25 {
  background-color: rgba(29, 78, 216, 0.05);
}

.group:hover .group-hover\:bg-prim-100 {
  background-color: #1D4ED8;
}

/* Enhanced radio button styles */
.payment-option .radio-button {
  position: relative;
  overflow: hidden;
}

/* Selected state with gradient background */
.payment-option.selected .radio-button {
  background: linear-gradient(135deg, #3B82F6, #1D4ED8) !important;
  border-color: #1D4ED8 !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
}

/* Hover state for unselected */
.payment-option:not(.selected):hover .radio-button {
  border-color: #3B82F6 !important;
  background-color: rgba(59, 130, 246, 0.1) !important;
  transform: scale(1.1);
}

/* Pulse animation for selected state */
@keyframes radio-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.payment-option.selected .radio-dot {
  animation: radio-pulse 1.5s infinite;
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Ring effect for selected state */
.payment-option.selected .radio-button::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: ring-pulse 2s infinite;
}

@keyframes ring-pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>

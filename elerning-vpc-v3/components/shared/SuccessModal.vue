<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- Text Content Container -->
      <div class="text-content">
        <!-- Title Container -->
        <div class="title-container">
          <!-- Success Icon -->
          <div class="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Title -->
          <h2 class="modal-title">{{ title }}</h2>
        </div>

        <!-- Description -->
        <p class="modal-description">{{ description }}</p>
      </div>

      <!-- CTA Container -->
      <div class="cta-container">
        <!-- Action Button -->
        <button @click="handleConfirm" class="confirm-button">
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  description?: string
  buttonText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Đăng ký thành công',
  description: 'Email xác nhận đã được gửi về tài khoản của bạn, vui lòng truy cập và xác nhận.',
  buttonText: 'Về trang chủ'
})

const emit = defineEmits<Emits>()

const handleConfirm = () => {
  emit('confirm')
}

const handleOverlayClick = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  position: relative;
  width: 332px;
  height: 312px;
  background: #FFFFFF;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 40px;
  gap: 16px;
  width: 332px;
  height: 224px;
  background: #FFFFFF;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 0;
  width: 252px;
  height: 48px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.success-icon {
  margin: 0 auto;
  width: 48px;
  height: 48px;
  background: #249F5D;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin-bottom: 16px;
}

.modal-title {
  width: auto;
  height: 24px;
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #232325;
  margin: 0;
  flex: none;
  order: 1;
  flex-grow: 0;
  text-align: center;
}

.modal-description {
  width: 252px;
  height: 72px;
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #6F727A;
  margin: 0;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
}

.cta-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 40px 24px;
  width: 332px;
  height: 88px;
  background: #FFFFFF;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
}

.confirm-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  width: 252px;
  height: 48px;
  background: #317BC4;
  border-radius: 8px;
  border: none;
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #FFFFFF;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.confirm-button:hover {
  background: #2563EB;
}

.confirm-button:active {
  background: #1D4ED8;
}

/* Responsive */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-container {
    width: 90vw;
    max-width: 332px;
    height: auto;
    min-height: 312px;
  }

  .text-content {
    width: 100%;
    padding: 20px 24px;
    gap: 12px;
    height: auto;
    min-height: 224px;
  }

  .title-container {
    width: 100%;
    gap: 20px;
    justify-content: center;
    height: auto;
  }

  .success-icon {
    width: 40px;
    height: 40px;
  }

  .success-icon svg {
    width: 20px;
    height: 20px;
  }

  .modal-title {
    width: auto;
    font-size: 18px;
    line-height: 22px;
  }

  .modal-description {
    width: 100%;
    font-size: 14px;
    line-height: 20px;
    height: auto;
    min-height: 72px;
  }

  .cta-container {
    width: 100%;
    padding: 16px 24px 20px;
    justify-content: center;
    height: auto;
    min-height: 88px;
  }

  .confirm-button {
    width: 100%;
    max-width: 252px;
    font-size: 14px;
  }
}
</style>

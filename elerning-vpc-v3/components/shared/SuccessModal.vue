<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <!-- Text Content Container -->
      <div class="text-content">
        <!-- Title Container -->
        <div class="title-container">
          <!-- Success Icon -->
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24 43.2001C29.0922 43.2001 33.9758 41.1772 37.5765 37.5765C41.1772 33.9758 43.2001 29.0922 43.2001 24C43.2001 18.9079 41.1772 14.0243 37.5765 10.4236C33.9758 6.8229 29.0922 4.80005 24 4.80005C18.9079 4.80005 14.0243 6.8229 10.4236 10.4236C6.8229 14.0243 4.80005 18.9079 4.80005 24C4.80005 29.0922 6.8229 33.9758 10.4236 37.5765C14.0243 41.1772 18.9079 43.2001 24 43.2001ZM32.8968 20.8968C33.334 20.4442 33.5759 19.838 33.5705 19.2087C33.565 18.5794 33.3126 17.9775 32.8676 17.5325C32.4226 17.0875 31.8207 16.8351 31.1914 16.8296C30.5621 16.8242 29.9559 17.0661 29.5033 17.5033L21.6 25.4065L18.4968 22.3032C18.0442 21.8661 17.438 21.6242 16.8087 21.6296C16.1794 21.6351 15.5775 21.8875 15.1325 22.3325C14.6875 22.7775 14.4351 23.3794 14.4296 24.0087C14.4242 24.638 14.6661 25.2442 15.1032 25.6968L19.9032 30.4968C20.3533 30.9468 20.9637 31.1995 21.6 31.1995C22.2364 31.1995 22.8468 30.9468 23.2968 30.4968L32.8968 20.8968Z"
                fill="#249F5D"
              />
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
  visible: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
}

interface Emits {
  (e: "confirm"): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Đăng ký thành công",
  description: "Email xác nhận đã được gửi về tài khoản của bạn, vui lòng truy cập và xác nhận.",
  buttonText: "Về trang chủ",
});

const emit = defineEmits<Emits>();

const handleConfirm = () => {
  emit("confirm");
};

const handleOverlayClick = () => {
  emit("close");
};
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
  width: 420px;
  height: auto;
  background: #ffffff;
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
  padding: 24px 48px;
  gap: 16px;
  width: 100%;
  height: auto;
  min-height: 224px;
  background: #ffffff;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
  border-radius: 12px;
}

.title-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px;
  gap: 0;
  width: 100%;
  height: auto;
  min-height: 48px;
  flex: none;
  order: 0;
  align-self: stretch;
  flex-grow: 0;
}

.success-icon {
  margin: 0 auto;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin-bottom: 16px;
}

.modal-title {
  width: auto;
  height: 24px;
  font-family: "SVN-Gilroy";
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
  width: 100%;
  max-width: 324px;
  height: auto;
  min-height: 48px;
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #6f727a;
  margin: 0;
  flex: none;
  order: 2;
  align-self: stretch;
  flex-grow: 0;
}

.cta-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 16px 48px 24px;
  width: 100%;
  height: auto;
  min-height: 88px;
  background: #ffffff;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  border-radius: 12px;
}

.confirm-button {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  width: 100%;
  max-width: 324px;
  height: 48px;
  background: #317bc4;
  border-radius: 8px;
  border: none;
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex: none;
  order: 0;
  flex-grow: 1;
}

.confirm-button:hover {
  background: #2563eb;
}
.confirm-button:active {
  background: #1d4ed8;
}
.success-icon svg {
  flex-shrink: 0;
}
/* Mobile - smaller modal */
@media (max-width: 480px) {
  .modal-overlay {
    padding: 16px;
  }

  .modal-container {
    width: 90vw;
    max-width: 332px;
    height: auto;
  }

  .text-content {
    width: 100%;
    padding: 20px 20px;
    gap: 12px;
    height: auto;
    min-height: 200px;
    border-radius: 12px;
  }

  .title-container {
    width: 100%;
    justify-content: center;
    height: auto;
  }

  .success-icon {
    width: 40px;
    height: 40px;
  }

  .modal-title {
    width: auto;
    font-size: 18px;
    line-height: 22px;
  }

  .modal-description {
    width: auto;
    max-width: 200px;
    margin: 0 auto;
    font-size: 13px;
    line-height: 18px;
    height: auto;
    min-height: 54px;
    letter-spacing: 0.2px;
    text-align: center;
    align-self: center;
    flex: 0 0 auto;
  }

  .cta-container {
    width: 100%;
    padding: 16px 24px 20px;
    justify-content: center;
    height: auto;
    min-height: 88px;
    border-radius: 12px;
  }

  .confirm-button {
    width: 100%;
    max-width: 252px;
    font-size: 14px;
  }
}
</style>

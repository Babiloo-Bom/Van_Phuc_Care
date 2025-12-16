<template>
  <div class="verify-otp-container">
    <div class="verify-content">
      <a-spin v-if="loading" size="large" tip="Đang xác minh tài khoản..." />
      <div v-else-if="verified" class="success-message">
        <div class="success-icon">✓</div>
        <h2>Xác minh thành công!</h2>
        <p>Đang chuyển hướng về trang chủ...</p>
      </div>
      <div v-else-if="error" class="error-message">
        <div class="error-icon">✗</div>
        <h2>Xác minh thất bại</h2>
        <p>{{ errorMessage }}</p>
        <a-button type="primary" @click="navigateTo('/')">
          Về trang chủ
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";

// Use auth layout
definePageMeta({
  layout: "auth",
});

// SEO
useHead({
  title: "Xác minh tài khoản - Van Phuc Care CRM",
  meta: [
    {
      name: "description",
      content: "Xác minh tài khoản tại Van Phuc Care CRM",
    },
  ],
});

const route = useRoute();
const authStore = useAuthStore();
const loading = ref<boolean>(true);
const verified = ref<boolean>(false);
const error = ref<boolean>(false);
const errorMessage = ref<string>("");

const verifyOtp = async () => {
  const otp = route.query.otp as string;
  const email = route.query.email as string;

  if (!otp || !email) {
    message.error("Link xác minh không hợp lệ");
    error.value = true;
    errorMessage.value = "Link xác minh không hợp lệ hoặc đã hết hạn";
    loading.value = false;
    return;
  }

  try {
    loading.value = true;
    
    // Call verify email API
    const result = await authStore.verifyEmail(email, otp);
    
    if (result.success) {
      verified.value = true;
      message.success("Xác minh tài khoản thành công!");
      
      // Redirect to home page after 2 seconds (user is already logged in)
      setTimeout(() => {
        navigateTo("/");
      }, 2000);
    } else {
      error.value = true;
      errorMessage.value = result.error || "Xác minh tài khoản thất bại";
      message.error(errorMessage.value);
    }
  } catch (err: any) {
    error.value = true;
    errorMessage.value = err?.message || "Xác minh tài khoản thất bại";
    message.error("Xác minh tài khoản thất bại");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await verifyOtp();
});
</script>

<style scoped>
.verify-otp-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #317bc4 0%, #1a5a9e 100%);
}

.verify-content {
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  text-align: center;
  min-width: 320px;
}

.success-message,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #52c41a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

.error-icon {
  width: 64px;
  height: 64px;
  background: #ff4d4f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

.success-message h2 {
  color: #52c41a;
  margin: 0;
  font-size: 24px;
}

.error-message h2 {
  color: #ff4d4f;
  margin: 0;
  font-size: 24px;
}

.success-message p,
.error-message p {
  color: #666;
  margin: 0;
  font-size: 16px;
}
</style>

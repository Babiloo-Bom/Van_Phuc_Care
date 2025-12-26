<template>
  <div class="reset-password-container">
    <!-- Left Side - Reset Password Form -->
    <div class="reset-password-form-section">
      <div class="content-wrapper">
        <!-- Logo (mobile absolute positioning) -->
        <div class="logo-section">
          <img
            src="/images/logo-vanphuc-new-mobile.png"
            alt="Van Phuc Care"
            class="lg:hidden logo"
          />
          <img
            src="/images/logo-vanphuc-new.png"
            alt="Van Phuc Care"
            class="hidden lg:block logo"
          />
        </div>

        <!-- Title and Subtitle (mobile absolute positioning) -->
        <div class="title-section">
          <h1 class="main-title">Tạo mật khẩu mới</h1>
          <p class="subtitle">Cập nhật thay đổi mật khẩu</p>
        </div>
        <!-- Reset Password Form -->
        <form @submit.prevent="handlePasswordSubmit" class="reset-password-form" v-if="canReset">
          <div class="form-group">
            <label class="form-label">Mật khẩu mới</label>
            <div class="input-container">
              <input v-model="form.newPassword" :type="showNewPassword ? 'text' : 'password'" placeholder="Mật khẩu mới" class="form-input" required />
              <button type="button" @click="showNewPassword = !showNewPassword" class="password-toggle">
                <span v-if="showNewPassword">Ẩn</span>
                <span v-else>Hiện</span>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Xác nhận mật khẩu</label>
            <div class="input-container">
              <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Xác nhận mật khẩu" class="form-input" required />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="password-toggle">
                <span v-if="showConfirmPassword">Ẩn</span>
                <span v-else>Hiện</span>
              </button>
            </div>
          </div>
          <button type="submit" :disabled="loading || !isFormValid" class="submit-btn">
            {{ loading ? "Đang xử lý..." : "Tạo mật khẩu mới" }}
          </button>
        </form>
      </div>
    </div>

    <!-- Right Side - Marketing Section -->
    <div class="marketing-section">
      <!-- Background Circles -->
      <div class="background-circles">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Dragon Banner -->
      <div class="dragon-banner">
        <img
          src="/images/dragon_banner.png"
          alt="Dragon Character"
          class="dragon-image"
        />
      </div>

      <!-- Marketing Text -->
      <div class="marketing-text">
        <h2 class="marketing-title">Hành trình cùng mẹ, trải đầy yêu thương</h2>
        <p class="marketing-description">
          Vạn Phúc Care là người bạn đồng hành đáng tin cậy của cha mẹ trong
          hành trình chăm sóc sức khoẻ Mẹ và Bé
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "nuxt/app";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";

definePageMeta({ layout: "auth" });
useHead({
  title: "Lấy lại mật khẩu - Van Phuc Care E-Learning",
  meta: [
    { name: "description", content: "Tạo mật khẩu mới tại Van Phuc Care E-Learning" },
  ],
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const canReset = ref(false);

const form = reactive({
  email: '',
  otp: '',
  newPassword: '',
  confirmPassword: '',
});

onMounted(async () => {
  // Get email and otp from query params
  if (route.query.email && route.query.otp) {
    form.email = route.query.email as string;
    form.otp = route.query.otp as string;
    loading.value = true;
    // Call API verify OTP
    const result = await authStore.verifyOtp(form.email, form.otp);
    loading.value = false;
    if (result.success) {
      canReset.value = true;
    } else {
      message.error('Liên kết không hợp lệ hoặc đã hết hạn');
      router.push('/login');
    }
  } else {
    message.error('Liên kết không hợp lệ hoặc đã hết hạn');
    router.push('/login');
  }
});

const isFormValid = computed(() => {
  return (
    form.newPassword.length >= 6 &&
    form.confirmPassword.length >= 6 &&
    form.newPassword === form.confirmPassword
  );
});

const handlePasswordSubmit = async () => {
  if (!isFormValid.value) {
    message.error('Mật khẩu phải có ít nhất 6 ký tự và khớp nhau');
    return;
  }
  loading.value = true;
  try {
    // Call API reset password
    const result = await authStore.resetPassword(form.email, form.otp, form.newPassword);
    if (result.success) {
      message.success('Mật khẩu đã được cập nhật thành công');
      router.push('/login');
    } else {
      message.error(result.error || 'Không thể cập nhật mật khẩu');
    }
  } catch (error: any) {
    message.error('Lỗi cập nhật mật khẩu');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #ffffff;
  font-family: "SVN-Gilroy", sans-serif;
  overflow: hidden;
}

/* Left Side - Reset Password Form */
.reset-password-form-section {
  position: relative;
  width: 50%;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex: 0 0 50%;
}

.content-wrapper {
  width: 430px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  padding: 40px 20px;
}

.logo-section {
  position: relative;
  width: 100%;
  margin-top: 0;
  text-align: center;
}

.logo {
  width: 149.71px;
  height: 70.48px;
  object-fit: contain;
}

.title-section {
  position: relative;
  width: 100%;
  text-align: left;
  margin-bottom: 20px;
}

.main-title {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 60px;
  letter-spacing: 0.3px;
  text-transform: capitalize;
  color: #000000;
  margin: 0;
}

.subtitle {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #4a4a4a;
  margin: 0;
}

.reset-password-form {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 400px;
}

.form-label {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #4a4a4a;
}

.input-container {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 15px 20px;
  gap: 10px;
  width: 100%;
  height: 54px;
  background: #fafbff;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  box-sizing: border-box;
}

.form-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #4a4a4a;
  outline: none;
}

.form-input::placeholder {
  color: #8c8c8c;
  text-align: left;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: #4a4a4a;
}

.submit-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  gap: 10px;
  width: 100%;
  height: 60px;
  background: #317bc4;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  color: #fff;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn span {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #ffffff;
}

.login-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  width: 242px;
  height: 24px;
  margin: 0 auto;
  justify-content: center;
}

.login-link span {
  font-family: "SVN-Gilroy";
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #4a4a4a;
}

.login-text {
  font-family: "SVN-Gilroy";
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #317bc4;
  text-decoration: none;
}

.login-text:hover {
  text-decoration: underline;
}

/* Right Side - Marketing Section */
.marketing-section {
  position: relative;
  width: 50%;
  height: 100vh;
  background: #317bc4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex: 0 0 50%;
}

.background-circles {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    180deg,
    rgba(59, 140, 220, 0.9) 0%,
    rgba(73, 145, 216, 0.351) 100%
  );
}

.circle-1 {
  width: 488.7px;
  height: 488.7px;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
}

.circle-2 {
  width: 278.9px;
  height: 277.38px;
  right: 10%;
  top: 5%;
}

.circle-3 {
  width: 109.28px;
  height: 108.69px;
  left: 5%;
  bottom: 20%;
  transform: rotate(-32.63deg);
}

.dragon-banner {
  position: absolute;
  width: 603.74px;
  height: 603.74px;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.dragon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.marketing-text {
  position: absolute;
  width: 90%;
  max-width: 526.45px;
  left: 50%;
  top: 75%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
}

.marketing-title {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: 0.3px;
  color: #ffffff;
  margin: 0 0 12px 0;
}

.marketing-description {
  font-family: "SVN-Gilroy";
  font-style: italic;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #ffffff;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1023.5px) {
  .reset-password-form-section,
  .marketing-section {
    width: 100%;
    height: 50vh;
    min-height: 500px;
  }

  .reset-password-form-section {
    padding: 40px 20px;
  }

  .logo-section,
  .title-section,
  .reset-password-form {
    position: static;
    margin-bottom: 20px;
  }

  .background-circles,
  .dragon-banner,
  .marketing-text {
    display: none;
  }

  .reset-password-container {
    position: relative;
    width: 375px;
    margin: 0 auto;
    flex-direction: column;
  }

  .marketing-section {
    display: none;
  }

  .reset-password-form-section {
    position: absolute;
    width: 343px;
    height: 453.04px;
    left: 16px;
    top: calc(50% - 453.04px / 2 - 12px);
    background: transparent;
    padding: 0;
  }

  .content-wrapper {
    width: 100%;
    gap: 0;
    padding: 0;
  }

  /* Logo */
  .logo-section {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo {
    width: 80.1px;
    height: 62.09px;
  }

  /* Title group */
  .title-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
  .main-title {
    width: 265px;
    height: 32px;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.3px;
    margin: 0;
  }
  .subtitle {
    width: 265px;
    height: 24px;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.3px;
    margin: 0;
    text-align: center;
  }

  /* Form */
  .reset-password-form {
    width: 343px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 36px;
  }

  /* First field block */
  .form-group {
    width: 343px;
  }
  .form-label {
    width: 343px;
    font-size: 16px;
  }
  .input-container {
    width: 343px;
    height: 48px;
    padding: 15px 20px;
  }
  .form-input {
    font-size: 14px;
  }

  /* Submit */
  .submit-btn {
    width: 343px;
    height: 52px;
    align-self: flex-start;
  }

  .login-link {
    width: 242px;
    height: 24px;
    align-self: flex-start;
  }
}
</style>

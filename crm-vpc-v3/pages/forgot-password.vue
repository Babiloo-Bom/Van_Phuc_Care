<template>
  <div class="forgot-password-container">
    <!-- Left Side - Forgot Password Form -->
    <div class="forgot-password-form-section">
      <div class="content-wrapper">
        <!-- Logo -->
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

        <!-- Title and Subtitle -->
        <div class="title-section">
          <h1 class="main-title">Quên mật khẩu</h1>
          <p class="subtitle">Chỉ mất 1 phút để lấy lại mật khẩu!</p>
        </div>

        <!-- Forgot Password Form -->
        <form @submit.prevent="handleSubmit" class="forgot-password-form">
          <!-- Email/Phone Field -->
          <div class="form-group">
            <label class="form-label">Email/ Số điện thoại</label>
            <div class="input-container">
              <input
                v-model="form.emailOrPhone"
                type="text"
                placeholder="Email/SĐT"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" :disabled="loading" class="submit-btn">
            {{ loading ? "Đang xử lý..." : "Lấy lại mật khẩu" }}
          </button>

          <!-- Login Link -->
          <div class="login-link">
            <span>Bạn đã có tài khoản.</span>
            <a href="/login" class="login-text">Đăng nhập ngay</a>
          </div>
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
        <img src="/images/dragon_banner.png" alt="Dragon Character" class="dragon-image" />
      </div>

      <!-- Marketing Text -->
      <div class="marketing-text">
        <h2 class="marketing-title">Chào mừng đến với Vạn Phúc Care</h2>
        <p class="marketing-description">Hệ thống chăm sóc sức khỏe toàn diện và hiện đại</p>
      </div>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :visible="showSuccessModal"
      title="Lấy lại mật khẩu"
      description="Email tạo lại mật khẩu đã được gửi về tài khoản, vui lòng truy cập để tạo mật khẩu mới."
      button-text="Xác nhận"
      @confirm="handleSuccessConfirm"
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { message } from 'ant-design-vue'
import SuccessModal from '~/components/shared/SuccessModal.vue'

// Use auth layout
definePageMeta({
  layout: 'auth'
})

// SEO
useHead({
  title: 'Quên mật khẩu - Van Phuc Care CRM',
  meta: [
    {
      name: 'description',
      content: 'Lấy lại mật khẩu tại Van Phuc Care CRM'
    }
  ]
})

const authStore = useAuthStore()
const loading = ref(false)
const showSuccessModal = ref(false)

const form = reactive({
  emailOrPhone: ''
})

const handleSubmit = async () => {
  try {
    loading.value = true

    // Call forgot password API
    const result = await authStore.forgotPassword(form.emailOrPhone)

    if (result.success) {
      // Show success modal instead of message
      showSuccessModal.value = true
    } else {
      message.error(result.error || 'Không thể lấy lại mật khẩu')
    }
  } catch (error: any) {
    console.error('Forgot password error:', error)
    message.error('Không thể lấy lại mật khẩu')
  } finally {
    loading.value = false
  }
}

const handleSuccessConfirm = () => {
  showSuccessModal.value = false
  navigateTo('/login')
}

const handleSuccessClose = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
.forgot-password-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #ffffff;
  font-family: 'SVN-Gilroy', sans-serif;
  overflow: hidden;
}

/* Left Side - Forgot Password Form */
.forgot-password-form-section {
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
  gap: 36px;
  padding-top: 80px;
  padding-bottom: 30px;
}

.logo-section {
  position: relative;
  width: 100%;
  margin-top: 0;
}

.logo {
  width: 150px;
  height: 70px;
  object-fit: contain;
}

.title-section {
  position: relative;
  width: 100%;
  text-align: left;
}

.main-title {
  font-family: 'SVN-Gilroy';
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
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #4a4a4a;
  margin: 0;
}

.forgot-password-form {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 36px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.form-label {
  font-family: 'SVN-Gilroy';
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
  font-family: 'SVN-Gilroy';
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
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #ffffff;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  height: 24px;
}

.login-link span {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #4a4a4a;
}

.login-text {
  font-family: 'SVN-Gilroy';
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
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: 0.3px;
  color: #ffffff;
  margin: 0 0 12px 0;
}

.marketing-description {
  font-family: 'SVN-Gilroy';
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
  .forgot-password-container {
    width: 100%;
    flex-direction: column;
  }

  .marketing-section {
    display: none;
  }

  .forgot-password-form-section {
    width: 100%;
  }

  .content-wrapper {
    width: 90%;
    max-width: 343px;
  }

  .logo {
    width: 80px;
    height: 62px;
  }

  .main-title {
    font-size: 24px;
    line-height: 32px;
  }

  .subtitle {
    font-size: 14px;
  }
}

    if (result.success) {
      success.value = 'Mã xác thực đã được gửi vào email của bạn'
      message.success('Đã gửi OTP vào email')
      showOtpInput.value = true
    } else {
      error.value = result.error || 'Gửi OTP thất bại'
    }
  } catch (validationError) {
    console.error('Validation error:', validationError)
  } finally {
    loading.value = false
  }
}

// Handle verify OTP
const handleVerifyOtp = async () => {
  try {
    await otpFormRef.value.validate()

    loading.value = true
    error.value = ''

    // Verify OTP and get token
    const result = await authStore.verifyOtpForPassword(
      emailForm.email,
      otpForm.otp
    )

    if (result.success && result.token) {
      message.success('Xác thực OTP thành công!')

      // Redirect to reset password page with email and token
      router.push({
        path: '/reset-password',
        query: {
          email: emailForm.email,
          token: result.token
        }
      })
    } else {
      error.value = result.error || 'Mã OTP không chính xác'
    }
  } catch (validationError) {
    console.error('Validation error:', validationError)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Custom styles */
</style>


<template>
  <div class="register-container">
    <!-- Left Side - Registration Form -->
    <div class="register-form-section">
      <div class="content-wrapper">
        <!-- Logo -->
        <div class="logo-section">
          <img src="/images/logo_van_phuc.png" alt="Van Phuc Care" class="logo" />
        </div>

        <!-- Title and Subtitle -->
        <div class="title-section">
          <h1 class="main-title">Đăng ký</h1>
          <p class="subtitle">Chào mừng bạn đến với Vạn Phúc Care</p>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="handleSubmit" class="register-form">
          <!-- Full Name Field -->
          <div class="form-group">
            <label class="form-label">Họ và tên</label>
            <div class="input-container">
              <input
                v-model="form.fullname"
                type="text"
                placeholder="Email/SĐT"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-container">
              <input
                v-model="form.email"
                type="email"
                placeholder="Email/SĐT"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Phone Field -->
          <div class="form-group">
            <label class="form-label">Số điện thoại</label>
            <div class="input-container">
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Email/SĐT"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label">Mật khẩu</label>
            <div class="input-container">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Mật khẩu"
                class="form-input"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group">
            <label class="form-label">Xác nhận mật khẩu</label>
            <div class="input-container">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Mật khẩu"
                class="form-input"
                required
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="password-toggle"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <!-- Register Button -->
          <button type="submit" :disabled="loading" class="register-btn">
            {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
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
        <img src="/images/dragon_banner_dang_ki.png" alt="Dragon Character" class="dragon-image" />
      </div>

      <!-- Marketing Text -->
      <div class="marketing-text">
        <h2 class="marketing-title">Hành trình cùng mẹ, trải đầy yêu thương</h2>
        <p class="marketing-description">
          Vạn Phúc Care là người bạn đồng hành đáng tin cậy của cha mẹ trong hành trình chăm sóc sức khoẻ Mẹ và Bé
        </p>
      </div>
    </div>

    <!-- Success Modal -->
    <SuccessModal
      :visible="showSuccessModal"
      title="Đăng ký thành công"
      description="Email xác nhận đã được gửi về tài khoản của bạn, vui lòng truy cập và xác nhận."
      button-text="Về trang chủ"
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
  title: 'Đăng ký - Van Phuc Care CRM Portal',
  meta: [
    {
      name: 'description',
      content: 'Đăng ký tài khoản mới tại Van Phuc Care CRM Portal',
    },
  ],
})

const authStore = useAuthStore()
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const showSuccessModal = ref(false)

const form = reactive({
  fullname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const handleSubmit = async () => {
  try {
    // Debug password values
    console.log('🔍 Password validation:', {
      password: form.password,
      confirmPassword: form.confirmPassword,
      passwordLength: form.password.length,
      confirmPasswordLength: form.confirmPassword.length,
      areEqual: form.password === form.confirmPassword
    })
    
    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp')
      return
    }

    loading.value = true
    
    const result = await authStore.register(
      form.email,
      form.password,
      form.confirmPassword,
      form.fullname,
      form.phone
    )
    
    if (result.success) {
      // Show success modal instead of message
      showSuccessModal.value = true
    } else {
      message.error(result.error || 'Đăng ký thất bại')
    }
  } catch (error: any) {
    console.error('Register error:', error)
    message.error('Đăng ký thất bại')
  } finally {
    loading.value = false
  }
}

const handleSuccessConfirm = () => {
  showSuccessModal.value = false
  navigateTo('/')
}

const handleSuccessClose = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
.register-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #FFFFFF;
  font-family: 'SVN-Gilroy', sans-serif;
  overflow: hidden;
}

/* Base styles - will be overridden by media queries */
.register-form-section {
  position: relative;
  width: 50%;
  height: 100vh;
  background: #FFFFFF;
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
}

.logo-section {
  position: relative;
  width: 100%;
}

.logo {
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
  color: #000000;
  margin: 0;
}

.subtitle {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 500;
  color: #4A4A4A;
  margin: 0;
}

.register-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-label {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  color: #4A4A4A;
}

.input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #FAFBFF;
  border: 1px solid #D9D9D9;
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
  color: #4A4A4A;
  outline: none;
}

.form-input::placeholder {
  color: #8C8C8C;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin: 0;
}

.register-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: #317BC4;
  border-radius: 12px;
  border: none;
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  color: #FFFFFF;
  cursor: pointer;
}

.login-link {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.login-link span {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  color: #4A4A4A;
}

.login-text {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  color: #317BC4;
  text-decoration: none;
}

.marketing-section {
  position: relative;
  width: 50%;
  height: 100vh;
  background: #317BC4;
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
  background: linear-gradient(180deg, rgba(59, 140, 220, 0.9) 0%, rgba(73, 145, 216, 0.351) 100%);
}

.circle-1 {
  width: 488.7px;
  height: 488.7px;
  left: 50%;
  top: 20%;
  transform: translate(-50%, -50%);
}

.circle-2 {
  width: 368.29px;
  height: 368.29px;
  right: 10%;
  top: 30%;
  transform: translate(50%, -50%);
}

.circle-3 {
  width: 284.37px;
  height: 284.37px;
  left: 5%;
  bottom: 20%;
  transform: translate(-50%, 50%);
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
  width: 526.45px;
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
  color: #FFFFFF;
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
  color: #FFFFFF;
  margin: 0;
}

@media (max-width: 1024px) {
  .marketing-section {
    display: none;
  }
}
.register-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #FFFFFF;
  font-family: 'SVN-Gilroy', sans-serif;
  overflow: hidden;
}

/* Left Side - Registration Form */
.register-form-section {
  position: relative;
  width: 50%;
  height: 100vh;
  background: #FFFFFF;
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
  padding-top: 93.64px;
  padding-bottom: 50px;
}

.logo-section {
  position: relative;
  width: 100%;
  margin-top: 20px;
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
  color: #4A4A4A;
  margin: 0;
}

.register-form {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
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
  color: #4A4A4A;
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
  background: #FAFBFF;
  border: 1px solid #D9D9D9;
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
  color: #4A4A4A;
  outline: none;
}

.form-input::placeholder {
  color: #8C8C8C;
  text-align: left;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin: 0;
}

.register-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  gap: 10px;
  width: 100%;
  height: 60px;
  background: #317BC4;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
}

.register-btn:hover:not(:disabled) {
  background: #2563eb;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-btn span {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #FFFFFF;
}

.login-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  width: 242px;
  height: 24px;
  margin: 0 auto;
}

.login-link span {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #4A4A4A;
}

.login-text {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #317BC4;
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
  background: #317BC4;
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
  background: linear-gradient(180deg, rgba(59, 140, 220, 0.9) 0%, rgba(73, 145, 216, 0.351) 100%);
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
  width: 546.06px;
  height: 546.06px;
  left: 50%;
  top: 40%;
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
  width: 526.45px;
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
  color: #FFFFFF;
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
  color: #FFFFFF;
  margin: 0;
}

@media (max-width: 1024px) {
  .marketing-section {
    display: none;
  }
}

/* Desktop styles */
@media (min-width: 769px) {
  .register-container {
    width: 100vw;
    height: 100vh;
  }
  
  .register-form-section {
    position: relative;
    width: 50%;
    height: 100vh;
    background: #FFFFFF;
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
    padding-top: 93.64px;
    padding-bottom: 50px;
  }
  
  .logo-section {
    position: relative;
    width: 100%;
    margin-top: 20px;
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
  }
  
  .main-title {
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0.3px;
    color: #000000;
    margin: 0 0 8px 0;
  }
  
  .subtitle {
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 0.3px;
    color: #4A4A4A;
    margin: 0;
  }
  
  .register-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
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
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .input-container {
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 20px;
    gap: 10px;
    background: #FAFBFF;
    border: 1px solid #D9D9D9;
    border-radius: 12px;
  }
  
  .form-input {
    width: 100%;
    height: 24px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: left;
    letter-spacing: 0.3px;
    color: #000000;
    border: none;
    background: transparent;
    outline: none;
  }
  
  .form-input::placeholder {
    color: #8C8C8C;
  }
  
  .password-toggle {
    font-size: 16px;
  }
  
  .register-btn {
    width: 100%;
    height: 56px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 30px;
    gap: 10px;
    background: #317BC4;
    border-radius: 12px;
    border: none;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #FFFFFF;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .register-btn:hover:not(:disabled) {
    background: #2563EB;
  }
  
  .register-btn:disabled {
    background: #9CA3AF;
    cursor: not-allowed;
  }
  
  .login-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    justify-content: center;
    margin-top: 20px;
  }
  
  .login-link span {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .login-text {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #317BC4;
    text-decoration: none;
  }
  
  /* Right Side - Marketing Section */
  .marketing-section {
    position: relative;
    width: 50%;
    height: 100vh;
    background: #317BC4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex: 0 0 50%;
  }
}

/* Mobile Design - Single Column Layout */
@media (max-width: 768px) {
  .register-container {
    position: relative;
    width: 375px;
    min-height: 100vh;
    height: auto;
    margin: 0 auto;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .register-form-section {
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 20px 16px 40px;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .content-wrapper {
    width: 100%;
    max-width: 343px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding-bottom: 20px;
  }
  
  .logo-section {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    margin-top: 40px;
  }
  
  .logo {
    width: 80.1px;
    height: 62.09px;
    object-fit: contain;
  }
  
  .title-section {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
  }
  
  .main-title {
    width: 100%;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 32px;
    text-align: center;
    letter-spacing: 0.3px;
    text-transform: capitalize;
    color: #000000;
    margin: 0;
  }
  
  .subtitle {
    width: 100%;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4A4A4A;
    margin: 0;
    text-align: center;
  }
  
  .register-form {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  
  .form-group {
    width: 100%;
    height: auto;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .form-label {
    width: 100%;
    height: auto;
    min-height: 24px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .input-container {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 20px;
    gap: 10px;
    background: #FAFBFF;
    border: 1px solid #D9D9D9;
    border-radius: 12px;
  }
  
  .form-input {
    width: 100%;
    height: 24px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-align: left;
    letter-spacing: 0.3px;
    color: #8C8C8C;
    border: none;
    background: transparent;
    outline: none;
  }
  
  .form-input::placeholder {
    color: #8C8C8C;
  }
  
  .register-btn {
    width: 100%;
    height: 52px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 30px;
    gap: 10px;
    background: #317BC4;
    border-radius: 12px;
    border: none;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #FFFFFF;
    cursor: pointer;
  }
  
  .login-link {
    width: 100%;
    height: auto;
    min-height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  
  .login-link span {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .login-text {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #317BC4;
    text-decoration: none;
  }
  
  /* Hide marketing section on mobile */
  .marketing-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .register-container {
    width: 100%;
    max-width: 375px;
  }
  
  .register-form-section {
    width: 100%;
    padding: 20px 16px;
  }
  
  .content-wrapper {
    width: 100%;
  }
  
  .register-form {
    width: 100%;
  }
  
  .form-group {
    width: 100%;
  }
  
  .input-container {
    width: 100%;
  }
  
  .register-btn {
    width: 100%;
  }
  
  .login-link {
    width: 100%;
    justify-content: center;
  }
}
</style>

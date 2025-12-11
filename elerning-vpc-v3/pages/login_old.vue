<template>
  <div class="login-container">
    <!-- Mobile Header -->
    <div class="mobile-header">
      <h1 class="mobile-title">Đăng nhập</h1>
    </div>

    <!-- Left Side - Login Form -->
    <div class="login-form-section">
      <div class="content-wrapper">
        <!-- Logo -->
        <div class="logo-section">
          <img src="/images/logo_van_phuc.png" alt="Van Phuc Care" class="logo" />
        </div>

        <!-- Title and Subtitle -->
        <div class="title-section">
          <h1 class="main-title">Đăng nhập</h1>
          <p class="subtitle">Chào mừng bạn đến với Vạn Phúc Care</p>
        </div>

        <!-- Google Login Button -->
        <div class="google-login-section">
          <button @click="handleGoogleLogin" class="google-login-btn">
            <div class="google-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#FBBD00" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#0F9D58" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#31AA52" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#3C79E6" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                <path fill="#CF2D48" d="M1 12c0-1.78.43-3.45 1.18-4.93L5.84 7.07c-.22.66-.35 1.36-.35 2.09s.13 1.43.35 2.09L1 12z"/>
                <path fill="#EB4132" d="M12 1c2.97 0 5.46.98 7.28 2.66l-3.15 3.15C14.06 5.94 12.62 5.38 12 5.38c-2.86 0-5.29 1.93-6.16 4.53L2.18 7.07C3.99 3.47 7.7 1 12 1z"/>
              </svg>
            </div>
            <span class="google-text">Đăng nhập bằng tài khoản Google</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="divider">
          <span class="divider-text">hoặc</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Email/Phone Field -->
        <div class="form-group">
          <label class="form-label">Email/ Số điện thoại</label>
          <div class="input-container">
            <input
              v-model="form.username"
              type="text"
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

        <!-- Remember Me and Forgot Password -->
        <div class="form-options">
          <div class="remember-me">
            <input
              v-model="form.remindAccount"
              type="checkbox"
              id="remember"
              class="checkbox"
            />
            <label for="remember" class="checkbox-label">Nhớ tài khoản</label>
          </div>
          <a href="/forgot-password" class="forgot-password">Quên mật khẩu?</a>
        </div>

        <!-- Login Button -->
        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        </button>

        <!-- Register Link -->
        <div class="register-link">
          <span>Bạn chưa có tài khoản.</span>
          <a href="/register" class="register-text">Đăng ký ngay</a>
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
        <h2 class="marketing-title">Hành trình cùng mẹ, trải đầy yêu thương</h2>
        <p class="marketing-description">
          Vạn Phúc Care là người bạn đồng hành đáng tin cậy của cha mẹ trong hành trình chăm sóc sức khoẻ Mẹ và Bé
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { message } from 'ant-design-vue'

// Use auth layout
definePageMeta({
  layout: 'auth'
})

// SEO
useHead({
  title: 'Đăng nhập - Van Phuc Care E-Learning',
  meta: [
    {
      name: 'description',
      content: 'Đăng nhập vào hệ thống E-Learning Van Phuc Care',
    },
  ],
})

const authStore = useAuthStore()
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
  remindAccount: true,
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleGoogleLogin = async () => {
  try {
    const { getGoogleLoginUrl } = useGoogleAuth()
    const authUrl = getGoogleLoginUrl()
    window.location.href = authUrl
  } catch (error: any) {
    message.error(error.message || 'Lỗi đăng nhập Google')
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    const result = await authStore.login(
      form.username,
      form.password,
      form.remindAccount
    )
    
    if (result.success) {
      message.success('Đăng nhập thành công')
      await navigateTo('/')
    } else {
      message.error(result.error || 'Tên đăng nhập hoặc mật khẩu không chính xác')
    }
  } catch (error: any) {
    message.error('Tên đăng nhập hoặc mật khẩu không chính xác')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #FFFFFF;
  font-family: 'SVN-Gilroy', sans-serif;
  overflow: hidden; /* avoid horizontal whitespace */
}

.mobile-header {
  display: none;
}

/* Desktop styles */
@media (min-width: 769px) {
  .mobile-header {
    display: none;
  }
  
  .login-container {
    width: 100vw;
    height: 100vh;
  }
  
  .login-form-section {
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
    gap: 24px;
    padding-top: 80px;
    padding-bottom: 30px;
  }
  
  .logo-section {
    position: relative;
    width: 100%;
    margin-top: 0;
  }
  
  .logo {
    width: 300px;
    height: 100px;
    object-fit: contain;
  }
  
  .title-section,
  .google-login-section,
  .divider,
  .login-form {
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
  
  .google-login-btn {
    width: 100%;
    height: 56px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 30px;
    gap: 10px;
    border: 1px solid #D9D9D9;
    border-radius: 12px;
    background: #FFFFFF;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
  }
  
  .divider::before {
    content: '';
    flex: 1;
    height: 1px;
    background: #D9D9D9;
    margin-right: 16px;
  }
  
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #D9D9D9;
    margin-left: 16px;
  }
  
  .divider-text {
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
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
  
  .form-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 24px;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .remember-checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #D9D9D9;
    background: #FFFFFF;
  }
  
  .remember-text {
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: #4A4A4A;
  }
  
  .forgot-password {
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    text-align: right;
    letter-spacing: 0.3px;
    color: #317BC4;
    text-decoration: none;
  }
  
  .submit-btn {
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
  }
  
  .register-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    justify-content: center;
  }
  
  .register-text {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .register-link-text {
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
}

/* Left Side - Login Form - Desktop styles moved to media query above */

/* All desktop styles moved to media query above */

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

.google-login-section {
  position: relative;
  width: 100%;
}

.google-login-btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 30px;
  gap: 10px;
  width: 100%;
  height: 60px;
  border: 1px solid #D9D9D9;
  border-radius: 12px;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s ease;
}

.google-login-btn:hover {
  background: #FAFBFF;
  border-color: #317BC4;
}

.google-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-text {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #4A4A4A;
}

.divider {
  position: relative;
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
}

.divider-line {
  width: 170.94px;
  height: 0px;
  border: 1px solid #D9D9D9;
}

.divider-text {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #4A4A4A;
}

.login-form {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
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
  text-align: center;
}

.password-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  margin: 0;
}

.form-options {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
  height: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox {
  width: 14.88px;
  height: 14.88px;
  border: 1px solid #D9D9D9;
  border-radius: 2px;
  cursor: pointer;
}

.checkbox-label {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 15px;
  color: #4A4A4A;
  cursor: pointer;
}

.forgot-password {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  text-align: right;
  letter-spacing: 0.3px;
  color: #317BC4;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
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
}

.login-btn:hover:not(:disabled) {
  background: #2563eb;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-btn span {
  font-family: 'SVN-Gilroy';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #FFFFFF;
}

.register-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  width: 238px;
  height: 24px;
}

.register-link span {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: left;
  letter-spacing: 0.3px;
  color: #4A4A4A;
}

.register-text {
  font-family: 'SVN-Gilroy';
  font-style: italic;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: left;
  letter-spacing: 0.3px;
  color: #317BC4;
  text-decoration: none;
}

.register-text:hover {
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
  flex: 0 0 50%; /* equal width with white section */
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

/* Responsive Design */
@media (max-width: 1440px) {
  .login-container {
    transform: scale(0.8);
    transform-origin: top left;
  }
}

@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  
  .login-form-section,
  .marketing-section {
    width: 100%;
    height: 50vh;
    min-height: 500px;
  }
  
  .login-form-section {
    padding: 40px 20px;
  }
  
  .logo-section,
  .title-section,
  .google-login-section,
  .divider,
  .login-form {
    position: static;
    margin-bottom: 20px;
  }
  
  .background-circles,
  .dragon-banner,
  .marketing-text {
    display: none;
  }
}

/* Mobile Design - Single Column Layout */
@media (max-width: 768px) {
  .login-container {
    position: relative;
    width: 375px;
    height: 812px;
    margin: 0 auto;
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
  }
  
  .mobile-header {
    display: none;
  }
  
  .login-form-section {
    position: absolute;
    width: 343px;
    height: 570.09px;
    left: 16px;
    top: calc(50% - 570.09px/2 - 0px);
    background: transparent;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  
  .logo-section {
    position: absolute;
    width: 80.1px;
    height: 62.09px;
    left: calc(50% - 80.1px/2 - 1.14px);
    top: 120.96px;
    text-align: center;
  }
  
  .logo {
    width: 80.1px;
    height: 62.09px;
    object-fit: contain;
  }
  
  .title-section {
    position: absolute;
    width: 265px;
    height: 56px;
    left: 55px;
    top: 197.04px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }
  
  .main-title {
    width: 265px;
    height: 32px;
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
    width: 265px;
    height: 24px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4A4A4A;
    margin: 0;
  }
  
  .google-login-section {
    position: absolute;
    width: 343px;
    height: 48px;
    left: 16px;
    top: 261.04px;
  }
  
  .google-login-btn {
    width: 343px;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 30px;
    gap: 10px;
    border: 1px solid #D9D9D9;
    border-radius: 12px;
    background: #FFFFFF;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .divider {
    position: absolute;
    width: 343px;
    height: 24px;
    left: 16px;
    top: 323.04px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .divider::before {
    content: '';
    position: absolute;
    width: 136.54px;
    height: 0px;
    left: 0px;
    border: 1px dashed #D9D9D9;
  }
  
  .divider::after {
    content: '';
    position: absolute;
    width: 136.54px;
    height: 0px;
    right: 0px;
    border: 1px dashed #D9D9D9;
  }
  
  .divider-text {
    position: absolute;
    width: 39px;
    height: 24px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .login-form {
    position: absolute;
    width: 343px;
    height: 330px;
    left: calc(50% - 343px/2);
    top: 361.04px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
  }
  
  .form-group {
    width: 343px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .form-label {
    width: 343px;
    height: 24px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .input-container {
    width: 343px;
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
  
  .form-options {
    width: 343px;
    height: 24px;
    position: relative;
  }
  
  .remember-me {
    position: absolute;
    width: 111.7px;
    height: 16.51px;
    left: 0px;
    top: 0px;
    display: flex;
    align-items: center;
    gap: 8.7px;
  }
  
  .remember-checkbox {
    width: 11.86px;
    height: 14.88px;
    border: 1px solid #D9D9D9;
    background: #FFFFFF;
  }
  
  .remember-text {
    width: 91px;
    height: 15px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 15px;
    color: #4A4A4A;
  }
  
  .forgot-password {
    position: absolute;
    height: 24px;
    right: 0px;
    top: 0px;
    font-family: 'SVN-Gilroy';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    text-align: right;
    letter-spacing: 0.3px;
    color: #317BC4;
  }
  
  .submit-btn {
    width: 343px;
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
  }
  
  .register-link {
    width: 238px;
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }
  
  .register-text {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4A4A4A;
  }
  
  .register-link-text {
    font-family: 'SVN-Gilroy';
    font-style: italic;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #317BC4;
  }
  
  /* Hide marketing section on mobile */
  .marketing-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-form-section {
    padding: 16px;
  }
  
  .content-wrapper {
    gap: 20px;
  }
  
  .main-title {
    font-size: 24px;
    line-height: 32px;
  }
  
  .subtitle {
    font-size: 14px;
    line-height: 20px;
  }
  
  .google-login-btn {
    height: 48px;
    font-size: 14px;
  }
  
  .input-container {
    height: 48px;
    padding: 12px 16px;
  }
  
  .submit-btn {
    height: 48px;
    font-size: 16px;
  }
}
</style>
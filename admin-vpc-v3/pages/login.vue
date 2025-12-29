<template>
  <div class="login-container">
    <!-- Left Side - Login Form -->
    <div class="login-form-section">
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
          <h2 class="main-title">Đăng nhập</h2>
          <p class="subtitle">Chào mừng bạn đến với Vạn Phúc Care</p>
        </div>
        
        <!-- Xóa phần Google Login Button (dòng 21-54) -->
        <!-- Xóa phần Divider (dòng 56-59) -->

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit" class="login-form">
          <!-- Email Field -->
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <div class="input-container">
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="Email"
                required
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password" class="form-label">Mật khẩu</label>
            <div class="input-container">
              <input
          id="password"
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="Mật khẩu"
                required
              />
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <div class="remember-me">
              <input
                type="checkbox"
                id="remember"
                class="remember-checkbox"
                v-model="form.remember"
              />
              <label for="remember" class="remember-text">Nhớ tài khoản</label>
            </div>
            <a href="/forgot-password" class="forgot-password"
              >Quên mật khẩu?</a
            >
      </div>

          <!-- Submit Button -->
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
          </button>
        </form>
      </div>
    </div>

    <!-- Right Side - Marketing Section -->
    <div class="marketing-section">
      <!-- Background Circles -->
      <div class="background-circles">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
        <div class="circle-3"></div>
    </div>

      <!-- Dragon Banner -->
      <div class="dragon-banner">
        <img
          src="/images/dragon_banner.png"
          alt="Dragon Banner"
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
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";

// SEO
useHead({
  title: "Đăng nhập - Vạn Phúc Care Admin",
  meta: [
    {
      name: "description",
      content:
        "Đăng nhập vào hệ thống quản trị Vạn Phúc Care",
    },
  ],
});

// Page meta
definePageMeta({
  layout: "auth",
  middleware: "guest",
});

// Auth store
const authStore = useAuthStore();

// Form data
const form = reactive({
  email: "",
  password: "",
  remember: false,
});

// Loading state
const loading = ref(false);

// Load saved credentials on mount
const loadSavedCredentials = () => {
  try {
    const authDataStr = localStorage.getItem('auth_data');
    if (authDataStr) {
      const authData = JSON.parse(authDataStr);
      if (authData.remindAccount && authData.username) {
        form.email = authData.username;
        form.remember = true;
      }
    }
  } catch (error) {
    console.error('Error loading saved credentials:', error);
  }
};

// Xóa function handleGoogleCallback (dòng 199-299)
// Xóa function handleGoogleLogin (dòng 347-373)

// Check for Google callback on mount
onMounted(() => {
  // Xóa: handleGoogleCallback();
  loadSavedCredentials();
});

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;

    const result = await authStore.login(form.email, form.password, form.remember);

    if (result.success) {
      message.success("Đăng nhập thành công!");
      
      // Wait a bit for auth state to be fully saved
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check redirect path from localStorage
      const redirectPath = process.client 
        ? localStorage.getItem('redirect_after_login') || '/'
        : '/'
      
      if (process.client && redirectPath) {
        localStorage.removeItem('redirect_after_login')
      }
      
      // Use window.location for reliable redirect
      if (process.client) {
        window.location.href = redirectPath
      } else {
        await navigateTo(redirectPath)
      }
    } else {
      message.error(result.error || "Đăng nhập thất bại");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    const errorMessage = error.message || error.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác";
    message.error(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  background: #ffffff;
  font-family: "SVN-Gilroy", sans-serif;
  overflow: hidden;
}

.mobile-header {
  display: none;
}

.main-title {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  letter-spacing: 0.3px;
  color: #000000;
  margin: 0 0 8px 0;
}

.subtitle {
  font-family: "SVN-Gilroy";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.3px;
  color: #4a4a4a;
  margin: 0;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .mobile-header {
    display: none;
  }

  .login-container {
    width: 100vw;
    min-height: 100vh;
    overflow-y: auto;
  }

  .login-form-section {
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
    gap: 20px;
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
    display: none;
  }

  .google-login-section,
  .divider,
  .login-form {
    position: relative;
    width: 100%;
    text-align: left;
  }

  .main-title {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0.3px;
    color: #000000;
    margin: 0 0 8px 0;
  }

  .subtitle {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
    letter-spacing: 0.3px;
    color: #4a4a4a;
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
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    background: #ffffff;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .google-login-btn:hover {
    background: #f8f9fa;
    border-color: #b0b0b0;
  }

  .google-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .google-text {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0;
  }

  .divider::before {
    content: "";
    flex: 1;
    height: 1px;
    background: #d9d9d9;
    margin-right: 16px;
  }

  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #d9d9d9;
    margin-left: 16px;
  }

  .divider-text {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
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
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4a4a4a;
  }

  .input-container {
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 20px;
    gap: 10px;
    background: #fafbff;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
  }

  .form-input {
    width: 100%;
    height: 24px;
    font-family: "SVN-Gilroy";
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
    color: #8c8c8c;
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
    border: 1px solid #d9d9d9;
    background: #ffffff;
  }

  .remember-text {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    color: #4a4a4a;
  }

  .forgot-password {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    text-align: right;
    letter-spacing: 0.3px;
    color: #317bc4;
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
    background: #317bc4;
    border-radius: 12px;
    border: none;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:hover {
    background: #2563eb;
  }

  .submit-btn:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  /* Right Side - Marketing Section */
  .marketing-section {
    position: fixed;
    top: 0;
    width: 50%;
    height: auto;
    background: #317bc4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
    flex: 0 0 50%;
    overflow: hidden;
    right: 0;
    bottom: 0;
  }

  .background-circles {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .circle-1 {
    position: absolute;
    width: 200px;
    height: 200px;
    left: 10%;
    top: 10%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: rotate(45deg);
  }

  .circle-2 {
    position: absolute;
    width: 150px;
    height: 150px;
    right: 15%;
    top: 20%;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    transform: rotate(-30deg);
  }

  .circle-3 {
    position: absolute;
    width: 109.28px;
    height: 108.69px;
    left: 5%;
    bottom: 20%;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 50%;
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
}

/* Mobile Design - Single Column Layout */
@media (max-width: 1023.5px) {
  .login-container {
    position: relative;
    width: 375px;
    height: 812px;
    margin: 0 auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .mobile-header {
    display: block;
    padding: 20px;
    background: #f5f5f5;
  }

  .mobile-title {
    font-family: "SVN-Gilroy", sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
  }

  .login-form-section {
    position: absolute;
    width: 343px;
    height: 570.09px;
    left: 16px;
    top: calc(25% - 570.09px / 2 - 0px);
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
    top: 120.96px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    width: 80.1px;
    height: 62.09px;
    object-fit: contain;
  }

  .title-section {
    display: none;
  }

  .google-login-section {
    position: absolute;
    width: 343px;
    height: 48px;
    left: 16px;
    top: 261.04px;
  }

  .google-login-btn {
    width: 100%;
    height: 48px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 30px;
    gap: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
    background: #ffffff;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
    cursor: pointer;
  }

  .google-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .google-text {
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
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
    content: "";
    position: absolute;
    width: 136.54px;
    height: 0px;
    left: 0px;
    border: 1px dashed #d9d9d9;
  }

  .divider::after {
    content: "";
    position: absolute;
    width: 136.54px;
    height: 0px;
    right: 0px;
    border: 1px dashed #d9d9d9;
  }

  .divider-text {
    position: absolute;
    width: 39px;
    height: 24px;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
  }

  .login-form {
    position: absolute;
    width: 343px;
    height: 330px;
    left: calc(50% - 343px / 2);
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
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.3px;
    color: #4a4a4a;
  }

  .input-container {
    width: 343px;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 20px;
    gap: 10px;
    background: #fafbff;
    border: 1px solid #d9d9d9;
    border-radius: 12px;
  }

  .form-input {
    width: 100%;
    height: 24px;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-align: left;
    letter-spacing: 0.3px;
    color: #8c8c8c;
    border: none;
    background: transparent;
    outline: none;
  }

  .form-input::placeholder {
    color: #8c8c8c;
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
    border: 1px solid #d9d9d9;
    background: #ffffff;
  }

  .remember-text {
    width: 91px;
    height: 15px;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 15px;
    color: #4a4a4a;
  }

  .forgot-password {
    position: absolute;
    width: 340.14px;
    height: 24px;
    right: 0px;
    top: 0px;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
    text-align: right;
    letter-spacing: 0.3px;
    color: #317bc4;
    text-decoration: none;
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
    background: #317bc4;
    border-radius: 12px;
    border: none;
    font-family: "SVN-Gilroy";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #ffffff;
    cursor: pointer;
  }

  /* Hide marketing section on mobile */
  .marketing-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-container {
    width: 100%;
    max-width: 375px;
  }

  .login-form-section {
    width: calc(100% - 32px);
    left: 16px;
  }

  .google-login-section,
  .divider,
  .login-form {
    width: calc(100% - 32px);
    left: 16px;
  }

  .form-group {
    width: 100%;
  }

  .input-container {
    width: 100%;
  }

  .form-options {
    width: 100%;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>

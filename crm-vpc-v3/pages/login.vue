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
        <!-- Google Login Button -->
        <div class="google-login-section">
          <button @click="handleGoogleLogin" class="google-login-btn">
            <div class="google-icon">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="#FBBD00"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#0F9D58"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#31AA52"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#3C79E6"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path
                  fill="#CF2D48"
                  d="M1 12c0-1.78.43-3.45 1.18-4.93L5.84 7.07c-.22.66-.35 1.36-.35 2.09s.13 1.43.35 2.09L1 12z"
                />
                <path
                  fill="#EB4132"
                  d="M12 1c2.97 0 5.46.98 7.28 2.66l-3.15 3.15C14.06 5.94 12.62 5.38 12 5.38c-2.86 0-5.29 1.93-6.16 4.53L2.18 7.07C3.99 3.47 7.7 1 12 1z"
                />
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

          <!-- Register Link -->
          <div class="register-link">
            <span class="register-text">Bạn chưa có tài khoản.</span>
            <a href="/register" class="register-link-text">Đăng ký ngay</a>
          </div>
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
  title: "Đăng nhập - Vạn Phúc Care",
  meta: [
    {
      name: "description",
      content:
        "Đăng nhập vào hệ thống Vạn Phúc Care để truy cập các dịch vụ chăm sóc sức khỏe",
    },
  ],
});

// Page meta
definePageMeta({
  layout: "auth",
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

// Handle Google OAuth callback
const handleGoogleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const googleSuccess = urlParams.get("google_success");
  const googleError = urlParams.get("google_error");
  const token = urlParams.get("token");

  if (googleSuccess && token) {
    // Store token and redirect
    localStorage.setItem("auth_token", token);
    message.success("Đăng nhập Google thành công!");
    navigateTo("/");
  } else if (googleError) {
    message.error("Đăng nhập Google thất bại");
  }
};

// Check for Google callback on mount
onMounted(() => {
  handleGoogleCallback();
});

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;

    const result = await authStore.login(form.email, form.password);

    if (result.success) {
      message.success("Đăng nhập thành công!");
      await navigateTo("/");
    } else {
      message.error(result.error || "Đăng nhập thất bại");
    }
  } catch (error: any) {
    console.error("Login error:", error);
    message.error("Tên đăng nhập hoặc mật khẩu không chính xác");
  } finally {
    loading.value = false;
  }
};

// Handle Google login
const handleGoogleLogin = async () => {
  try {
    const baseFrontend = window.location.origin.replace(/\/$/, "");
    // Redirect về trang chủ sau khi đăng nhập Google
    const redirectUri = baseFrontend;
    const frontendUrl = baseFrontend;

    // Sử dụng Nuxt server route /api/auth/google
    // Route này sẽ redirect đến backend OAuth endpoint
    const url = `/api/auth/google?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&frontend_url=${encodeURIComponent(frontendUrl)}`;
    
    window.location.href = url;
  } catch (error: any) {
    console.error("Google login error:", error);
    message.error("Đăng nhập Google thất bại");
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

  .register-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    justify-content: center;
    margin-top: 20px;
  }

  .register-text {
    font-family: "SVN-Gilroy";
    font-style: italic;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
  }

  .register-link-text {
    font-family: "SVN-Gilroy";
    font-style: italic;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #317bc4;
    text-decoration: none;
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

  .register-link {
    width: 238px;
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
  }

  .register-text {
    font-family: "SVN-Gilroy";
    font-style: italic;
    font-weight: 600;
    font-size: 13px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #4a4a4a;
  }

  .register-link-text {
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

  .register-link {
    width: 100%;
    justify-content: center;
  }
}
</style>

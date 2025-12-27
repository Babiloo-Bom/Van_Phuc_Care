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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5.625 12.0002C5.625 10.8111 5.95261 9.69721 6.52177 8.74344V4.69775H2.47608C0.870375 6.78313 0 9.32464 0 12.0002C0 14.6757 0.870375 17.2172 2.47608 19.3026H6.52177V15.2569C5.95261 14.3031 5.625 13.1893 5.625 12.0002Z"
                  fill="#FBBD00"
                />
                <path
                  d="M12 18.3749L9.1875 21.1874L12 23.9999C14.6756 23.9999 17.217 23.1295 19.3024 21.5238V17.4824H15.261C14.2989 18.0536 13.1804 18.3749 12 18.3749Z"
                  fill="#0F9D58"
                />
                <path
                  d="M6.52176 15.2568L2.47607 19.3025C2.79398 19.7154 3.14015 20.1108 3.51473 20.4854C5.78123 22.7519 8.79468 24.0001 12 24.0001V18.3751C9.67387 18.3751 7.63514 17.1226 6.52176 15.2568Z"
                  fill="#31AA52"
                />
                <path
                  d="M24 11.9999C24 11.2699 23.9339 10.5384 23.8035 9.82603L23.698 9.24951H12V14.8745H17.6931C17.1402 15.9742 16.2902 16.8715 15.261 17.4825L19.3024 21.5239C19.7153 21.206 20.1106 20.8598 20.4853 20.4853C22.7518 18.2187 24 15.2053 24 11.9999Z"
                  fill="#3C79E6"
                />
                <path
                  d="M16.5078 7.49217L17.005 7.98933L20.9825 4.01189L20.4853 3.51473C18.2188 1.24823 15.2054 0 12 0L9.1875 2.8125L12 5.625C13.7028 5.625 15.3037 6.28809 16.5078 7.49217Z"
                  fill="#CF2D48"
                />
                <path
                  d="M12 5.625V0C8.79473 0 5.78128 1.24823 3.51473 3.51469C3.14015 3.88927 2.79398 4.28466 2.47607 4.69758L6.52176 8.74327C7.63518 6.8775 9.67392 5.625 12 5.625Z"
                  fill="#EB4132"
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
          <!-- Email/Phone Field -->
          <div class="form-group">
            <label for="email" class="form-label">Email/ Số điện thoại</label>
            <div class="input-container">
              <input
                id="email"
                v-model="form.email"
                type="text"
                class="form-input"
                placeholder="Email/SĐT"
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

// Constants for localStorage keys
const REMEMBER_KEY = "elearning_remember_account";
const SAVED_EMAIL_KEY = "elearning_saved_email";
const SAVED_PASSWORD_KEY = "elearning_saved_password";

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

// Load saved credentials on mount
const loadSavedCredentials = () => {
  try {
    const remembered = localStorage.getItem(REMEMBER_KEY);
    if (remembered === "true") {
      const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
      const savedPassword = localStorage.getItem(SAVED_PASSWORD_KEY);

      if (savedEmail) {
        form.email = atob(savedEmail); // Decode from base64
      }
      if (savedPassword) {
        form.password = atob(savedPassword); // Decode from base64
      }
      form.remember = true;
    }
  } catch (error) {
    console.error("Error loading saved credentials:", error);
    // Clear corrupted data
    clearSavedCredentials();
  }
};

// Save credentials to localStorage
const saveCredentials = () => {
  try {
    localStorage.setItem(REMEMBER_KEY, "true");
    localStorage.setItem(SAVED_EMAIL_KEY, btoa(form.email)); // Encode to base64
    localStorage.setItem(SAVED_PASSWORD_KEY, btoa(form.password)); // Encode to base64
  } catch (error) {
    console.error("Error saving credentials:", error);
  }
};

// Clear saved credentials
const clearSavedCredentials = () => {
  localStorage.removeItem(REMEMBER_KEY);
  localStorage.removeItem(SAVED_EMAIL_KEY);
  localStorage.removeItem(SAVED_PASSWORD_KEY);
};

// Handle Google OAuth callback
const handleGoogleCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const googleSuccess = urlParams.get("google_success");
  const googleError = urlParams.get("google_error");
  const errorParam = urlParams.get("error"); // Also check 'error' parameter (from callback page redirect)
  const token = urlParams.get("token");

  if (googleSuccess && token) {
    // Store token and redirect
    localStorage.setItem("auth_token", token);
    message.success("Đăng nhập Google thành công!");
    navigateTo("/");
  } else if (googleError || errorParam) {
    // Decode error message from URL parameter
    const errorMessage = decodeURIComponent(
      (googleError || errorParam) === "true"
        ? "Đăng nhập Google thất bại"
        : googleError || errorParam || "Đăng nhập Google thất bại"
    );
    message.error(errorMessage);
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

// Check for Google callback and load saved credentials on mount
onMounted(() => {
  handleGoogleCallback();
  loadSavedCredentials();
});

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;

    const result = await authStore.login(form.email, form.password);

    if (result.success) {
      // Handle remember account
      if (form.remember) {
        saveCredentials();
      } else {
        clearSavedCredentials();
      }

      message.success("Đăng nhập thành công!");
      await navigateTo("/");
    } else {
      message.error(result.error || "Đăng nhập thất bại");
    }
  } catch (error: any) {
    message.error("Tên đăng nhập hoặc mật khẩu không chính xác");
  } finally {
    loading.value = false;
  }
};

// Handle Google login
const handleGoogleLogin = async () => {
  try {
    const baseFrontend = window.location.origin.replace(/\/$/, "");
    // Elearning uses callback page, so redirectUri should point to /auth/google/callback
    const redirectUri = `${baseFrontend}/auth/google/callback`;
    const frontendUrl = baseFrontend;

    // Google OAuth luôn dùng /api/u (user endpoint)
    const isAbsolutePath =
      baseFrontend.startsWith("http://localhost") ||
      baseFrontend.includes("localhost");
    const googleApiBase = isAbsolutePath
      ? "http://localhost:3000/api/u"
      : "/api/u";
    const backendBase = googleApiBase.startsWith("http")
      ? googleApiBase
      : `${baseFrontend}${googleApiBase}`;
    const url = `${backendBase}/auth/google?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&frontend_url=${encodeURIComponent(frontendUrl)}`;
    window.location.href = url;
  } catch (error: any) {
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
    background: #317bc4de;
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

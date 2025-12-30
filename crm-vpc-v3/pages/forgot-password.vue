<template>
  <div class="forgot-password-container">
    <!-- Left Side - Forgot Password Form -->
    <div class="forgot-password-form-section">
      <div class="content-wrapper">
        <!-- Logo (mobile absolute positioning) -->
        <div class="logo-section">
          <nuxt-img
            src="/images/logo-vanphuc-new-mobile.png"
            alt="Van Phuc Care"
            class="lg:hidden logo"
            format="webp"
            width="150"
            height="70"
            loading="eager"
            fetchpriority="high"
          />
          <nuxt-img
            src="/images/logo-vanphuc-new.png"
            alt="Van Phuc Care"
            class="hidden lg:block logo"
            format="webp"
            width="150"
            height="70"
            loading="eager"
            fetchpriority="high"
          />
        </div>

        <!-- Title and Subtitle (mobile absolute positioning) -->
        <div class="title-section">
          <h1 class="main-title">Quên mật khẩu</h1>
          <p class="subtitle">Chỉ mất 1 phút để lấy lại mật khẩu!</p>
        </div>
        <!-- Forgot Password Form -->
        <form @submit.prevent="handleSubmit" class="forgot-password-form">
          <!-- Email/Phone Field -->
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-container">
              <input
                v-model="form.emailOrPhone"
                type="text"
                placeholder="Email"
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
        <nuxt-img
          src="/images/dragon_banner.png"
          alt="Dragon Character"
          class="dragon-image"
          format="webp"
          loading="lazy"
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
import { ref, reactive } from "vue";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";
import SuccessModal from "~/components/shared/SuccessModal.vue";

// Use auth layout
definePageMeta({
  layout: "auth",
});

// SEO
useHead({
  title: "Quên mật khẩu - Van Phuc Care E-Learning",
  meta: [
    {
      name: "description",
      content: "Lấy lại mật khẩu tại Van Phuc Care E-Learning",
    },
  ],
});

const authStore = useAuthStore();
const loading = ref(false);
const showSuccessModal = ref(false);

const form = reactive({
  emailOrPhone: "",
});

const handleSubmit = async () => {
  try {
    loading.value = true;

    // Call forgot password API (include source so backend builds per-site link)
    const result = await authStore.forgotPassword(form.emailOrPhone, "crm");

    if (result.success) {
      // Show success modal instead of message
      showSuccessModal.value = true;
    } else {
      message.error(result.error || "Không thể lấy lại mật khẩu");
    }
  } catch (error: any) {
    console.error("Forgot password error:", error);
    message.error("Không thể lấy lại mật khẩu");
  } finally {
    loading.value = false;
  }
};

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  // User needs to check email and click the reset link there
  // Link in email will have both email and OTP parameters
  navigateTo("/login");
};

const handleSuccessClose = () => {
  showSuccessModal.value = false;
};
</script>

<style scoped>
.forgot-password-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  background: #ffffff;
  font-family: "SVN-Gilroy", sans-serif;
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
  font-weight: 700;
}

.submit-btn:hover:not(:disabled) {
  background: #317bc4de;
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
  position: absolute;
  width: 450px;
  height: 450px;
  left: 15%;
  top: 6%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transform: rotate(45deg);
}

.circle-2 {
  position: absolute;
  width: 200px;
  height: 200px;
  right: -40px;
  top: -40px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  transform: rotate(-30deg);
}

.circle-3 {
  position: absolute;
  width: 110px;
  height: 110px;
  left: 5%;
  bottom: 35%;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  transform: rotate(-32.63deg);
}

.dragon-banner {
  position: absolute;
  width: 83.75%;
  aspect-ratio: 1;
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
  .forgot-password-container {
    position: relative;
    width: 375px;
    margin: 0 auto;
    flex-direction: column;
  }

  .marketing-section {
    display: none;
  }

  .forgot-password-form-section {
    position: absolute;
    width: 343px;
    height: 361.04px;
    left: 16px;
    top: calc(50% - 361.04px / 2);
    background: transparent;
    padding: 0;
    display: block;
  }

  .content-wrapper {
    width: 100%;
    gap: 0;
    padding: 0;
  }

  /* Logo */
  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .logo {
    width: 80.1px;
    height: 62.09px;
  }

  /* Title group */
  .title-section {
    height: 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
  }
  .main-title {
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.3px;
    margin: 0;
    text-align: center;
  }
  .subtitle {
    font-size: 14px;
    line-height: 24px;
    margin: 0;
    text-align: center;
  }

  /* Form */
  .forgot-password-form {
    position: absolute;
    width: 343px;
    height: 204px;
    left: calc(50% - 343px / 2);
    top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .form-group {
    width: 343px;
    height: 60px;
    gap: 8px;
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

  .submit-btn {
    width: 343px;
    height: 52px;
  }

  .login-link {
    width: 242px;
    height: 24px;
  }
}
</style>

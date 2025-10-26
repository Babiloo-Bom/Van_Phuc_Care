<template>
  <div class="relative h-screen">
    <!-- Background Image -->
    <div
      class="absolute flex-grow hidden md:block !bg-cover !bg-center w-full h-full"
      style="background: url('/images/background-auth.png')"
    />
    <div
      class="absolute flex-grow hidden md:block !bg-cover !bg-center w-full h-full bg-[#003258] opacity-90"
    />
    
    <!-- Auth Layout -->
    <div class="absolute auth-layout grid grid-cols-1 sm:grid-cols-2 top-1/2 left-1/2 w-screen md:w-[90vw] max-w-[1000px] bg-[#fff] rounded-md h-[100vh] md:h-[600px]" style="transform: translate(-50%, -50%)">
      <!-- Left Section - Branding -->
      <div class="flex flex-col items-center justify-center w-full gap-4">
        <img src="/images/logo-auth.png" alt="Logo" />
        <img class="w-[177px] h-[177px] rounded-full mt-1" src="/images/image-auth.png" alt="Family" />
        <h3 class="text-[20px] mb-0.5 font-bold text-[#0C76BC]">
          My.vanphuccare.vn
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <img src="/images/app-store.png" alt="App Store" />
          <img src="/images/ch-play.png" alt="Google Play" />
        </div>
      </div>
      
      <!-- Right Section - Forms -->
      <div class="p-6 pr-12">
        <a-tabs default-active-key="1" class="custom-tabs" v-model:activeKey="activeTabKey">
          <a-tab-pane key="1" tab="Đăng nhập">
            <LoginForm
              class="!mt-3 min-w-[200px] max-w-md w-full"
            />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Đăng ký" force-render>
            <SignUpForm
              class="!mt-3 min-w-[250px] max-w-lg w-full"
            />
          </a-tab-pane>
        </a-tabs>

        <a-button type="link" class="float-right !p-0 !underline !mt-4" @click="returnMainWebsite">
          Về trang chủ >
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { message } from 'ant-design-vue'
import LoginForm from '~/components/auth/forms/Login.vue'
import SignUpForm from '~/components/auth/forms/SignUp.vue'

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

const route = useRoute()
const authStore = useAuthStore()

// Tab state
const activeTabKey = ref('1')

// Handle query parameters for auto-login
onMounted(() => {
  const { username, pwd, google_success, google_error, token } = route.query
  
  if (username && pwd) {
    handleAutoLogin(username as string, pwd as string)
  }
  
  // Handle Google OAuth callback
  if (google_success && token) {
    handleGoogleSuccess(token as string)
  } else if (google_error) {
    handleGoogleError()
  }
  
  // Initialize ink bar position
  updateInkBarPosition(activeTabKey.value)
})

const returnMainWebsite = () => {
  window.open('https://vanphuccare.vn/')
}

const handleAutoLogin = async (username: string, password: string) => {
  try {
    const result = await authStore.login(username, password, false)
    if (result.success) {
      console.log('✅ Auto login successful')
      await navigateTo('/')
    } else {
      console.error('❌ Auto login failed:', result.error)
    }
  } catch (error) {
    console.error('Auto login failed:', error)
  }
}

const handleGoogleSuccess = async (token: string) => {
  try {
    console.log('🔐 Google OAuth success, token:', token)
    
    // Create user data from Google token (you might need to decode JWT or call API)
    const userData = {
      id: 'google-user-' + Date.now(),
      email: 'user@google.com', // This should come from Google API
      name: 'Google User',
      fullname: 'Google User',
      username: 'google-user',
      role: 'user',
      verified: true
    }
    
    // Use completeGoogleLogin method from auth store
    const result = await authStore.completeGoogleLogin(token, Date.now() + 7 * 24 * 60 * 60 * 1000, userData)
    
    if (result.success) {
      console.log('✅ Google login completed successfully')
      message.success('Đăng nhập Google thành công!')
      await navigateTo('/')
    } else {
      console.error('❌ Google login failed:', result.error)
      message.error('Đăng nhập Google thất bại')
    }
  } catch (error) {
    console.error('Google login success handling failed:', error)
    message.error('Đăng nhập Google thất bại')
  }
}

const handleGoogleError = () => {
  console.error('Google OAuth failed')
  // You can show an error message here
}

// Watch tab changes
watch(activeTabKey, (newKey) => {
  console.log('🔍 Tab changed to:', newKey)
  updateInkBarPosition(newKey)
})

const updateInkBarPosition = (activeKey: string) => {
  setTimeout(() => {
    const tabsContainer = document.querySelector('.custom-tabs') as HTMLElement
    if (tabsContainer) {
      console.log('🔍 Updating ink bar for tab:', activeKey)
      if (activeKey === '1') {
        tabsContainer.style.setProperty('--ink-bar-left', '0%')
      } else if (activeKey === '2') {
        tabsContainer.style.setProperty('--ink-bar-left', '50%')
      }
      console.log('🔍 CSS variable set:', tabsContainer.style.getPropertyValue('--ink-bar-left'))
    } else {
      console.log('❌ Tabs container not found')
    }
  }, 100)
}

</script>

<style scoped>
.auth-layout {
  .ant-tabs-nav {
    width: 100%;
  }

  .ant-tabs-tab {
    text-align: center;
    width: 50% !important;
    margin: 0 !important;
    font-weight: 600;
    flex: 1;
  }

  .ant-tabs-nav > div:nth-of-type(1) {
    width: 100% !important;
  }

  /* Chia đôi dòng kẻ */
  .ant-tabs-ink-bar {
    width: 50% !important;
    transition: left 0.3s ease;
  }

  /* Tab đầu tiên active */
  .ant-tabs-tab:nth-child(1).ant-tabs-tab-active ~ .ant-tabs-ink-bar {
    left: 0 !important;
  }

  /* Tab thứ 2 active */
  .ant-tabs-tab:nth-child(2).ant-tabs-tab-active ~ .ant-tabs-ink-bar {
    left: 50% !important;
  }
}

/* Custom tabs styling cho chia đôi hoàn hảo */
.custom-tabs :deep(.ant-tabs-nav-list) {
  width: 100%;
  display: flex;
}

.custom-tabs :deep(.ant-tabs-tab) {
  flex: 1;
  text-align: center;
  justify-content: center;
  margin: 0;
  padding: 12px 16px;
}

.custom-tabs :deep(.ant-tabs-tab-btn) {
  width: 100%;
  text-align: center;
}

.custom-tabs {
  --ink-bar-left: 0%;
}

.custom-tabs :deep(.ant-tabs-ink-bar) {
  width: 50% !important;
  left: var(--ink-bar-left) !important;
  transition: left 0.3s ease !important;
  position: absolute !important;
}

/* Override Ant Design ink bar positioning */
.custom-tabs :deep(.ant-tabs-nav-wrap) {
  position: relative;
}

.custom-tabs :deep(.ant-tabs-nav) {
  position: relative;
}

/* Ink bar sẽ được điều khiển bằng JavaScript */

.custom-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: #1890ff;
  font-weight: 500;
}

.custom-tabs :deep(.ant-tabs-tab:not(.ant-tabs-tab-active) .ant-tabs-tab-btn) {
  color: #666;
}

.custom-tabs :deep(.ant-tabs-tab:hover .ant-tabs-tab-btn) {
  color: #1890ff;
}
</style>

<template>
  <div>
    <button @click="handleGoogleLogin" class="h-[40px] flex items-center justify-center gap-4 bg-[#fff] border-[1px] border-[#D9D9D9] !px-6 mx-auto cursor-pointer w-full !rounded-[5px] hover:bg-gray-50 transition-colors">
      <img class="w-4 h-4" src="/images/google.png" alt="google">
      <span class="font-[600] text-[12px] text-[#000] opacity-50">Đăng nhập bằng Google</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'

const props = defineProps<{
  title?: string
}>()

const { getGoogleLoginUrl, isGoogleConfigured } = useGoogleAuth()

const handleGoogleLogin = async () => {
  try {
    // Generate Google OAuth URL
    const authUrl = getGoogleLoginUrl()
    
    // Redirect to Google OAuth
    window.location.href = authUrl
    
  } catch (error: any) {
    console.error('Google login error:', error)
    message.error(error.message || 'Lỗi đăng nhập Google')
  }
}
</script>

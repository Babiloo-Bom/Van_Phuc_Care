<template>
  <div></div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "~/stores/auth";
import { message } from "ant-design-vue";

// Use auth layout
definePageMeta({
  layout: "auth",
});

// SEO
useHead({
  title: "Verify Otp - Van Phuc Care E-Learning",
  meta: [
    {
      name: "description",
      content: "Verify Otp tại Van Phuc Care E-Learning",
    },
  ],
});
const route = useRoute();
const authStore = useAuthStore();
const loading = ref<boolean>(false)

const verifyOtp = async () => {
  const otp = route.query.otp;
  const email = route.query.email;
  if (!otp || !email) {
    message.error("Otp không hợp lệ");
    navigateTo('/')
    return;
  }

  try {
    loading.value = true;
    // Call reset password API
    const result = await authStore.verifyEmail(email as string, otp as string);
    console.log(result)
    if (result.success) {
      message.success("Xác minh tài khoản thành công");
      // Redirect to login page
      await navigateTo("/");
    } else {
      message.error(result.error || "Xác minh tài khoản thất bại");
      await navigateTo("/");
    }
  } catch (error: any) {
    message.error('Xác minh tài khoản thất bại')
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await verifyOtp();
});
</script>

<style scoped>

</style>

<template>
  <div class="p-6 max-w-xl mx-auto">
    <div>Đang xử lý thông tin thanh toán...</div>
  </div>
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
  title: "Verify Payment - Van Phuc Care E-Learning",
  meta: [
    {
      name: "description",
      content: "Verify Payment tại Van Phuc Care E-Learning",
    },
  ],
});
const route = useRoute();
const loading = ref<boolean>(false)

const params = ref({});

const verifyPayment = async () => {
  params.value = Object.fromEntries(new URLSearchParams(route.query));

  try {
    loading.value = true;
    const { apiUser } = useApiBase()
    const orderResponse: any = await $fetch(`${apiUser}/orders/payment/vnpay-verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: params.value
    })
    if (orderResponse?.data?.success) {
      message.success("Thanh toán thành công");
      // Redirect to login page
      await navigateTo("/my-learning");
    } else {
      message.success("Đang xác minh. Vui lòng thử lại sau");
      await navigateTo("/my-learning");
    }
  } catch (error: any) {
    message.error('Thanh toán thất bại')
    await navigateTo("/my-learning");
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await verifyPayment();
});
</script>

<style scoped>

</style>

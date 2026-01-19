import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useApiBase } from '~/composables/useApiBase';

/**
 * Composable để bảo vệ video khỏi download
 * Video URL không được trả về từ API - phải request qua video proxy
 * Blob URL không thể bị bắt bởi các extension download như Cốc Cốc, IDM
 */
export function useSecureVideo() {
  const blobUrl = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  let currentBlobUrl: string | null = null;

  /**
   * Lấy video token từ backend
   */
  const getVideoToken = async (lessonId: string, courseId: string): Promise<string | null> => {
    try {
      const { apiUser } = useApiBase();
      const authStore = useAuthStore();
      
      const response = await fetch(`${apiUser}/video/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authStore.token}`,
        },
        body: JSON.stringify({ lessonId, courseId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get video token: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.token || null;
    } catch (err) {
      return null;
    }
  };

  /**
   * Tải video qua proxy và convert thành Blob URL
   * Video URL không được expose - chỉ có thể lấy qua proxy với token
   * Blob URL không thể bị bắt bởi các extension download như Cốc Cốc, IDM
   */
  const loadSecureVideo = async (lessonId: string, courseId: string): Promise<string | null> => {
    // Cleanup previous blob
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
      blobUrl.value = null;
    }

    if (!lessonId || !courseId) {
      return null;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Lấy token và fetch video qua proxy
      const token = await getVideoToken(lessonId, courseId);
      if (!token) {
        throw new Error('Failed to get video token');
      }

      const { apiUser } = useApiBase();
      const proxyUrl = `${apiUser}/video/fetch/${token}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to load video: ${response.status}`);
      }

      const blob = await response.blob();
      currentBlobUrl = URL.createObjectURL(blob);
      blobUrl.value = currentBlobUrl;
      return currentBlobUrl;

    } catch (err: any) {
      error.value = err.message;
      blobUrl.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Cleanup blob URL khi không cần nữa
   */
  const cleanup = () => {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
      blobUrl.value = null;
    }
  };

  // Auto cleanup on unmount
  onUnmounted(() => {
    cleanup();
  });

  return {
    blobUrl,
    isLoading,
    error,
    loadSecureVideo,
    cleanup,
  };
}


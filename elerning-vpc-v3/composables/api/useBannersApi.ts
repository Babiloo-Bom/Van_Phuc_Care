import { useApiBase } from '~/composables/useApiBase';

export function useBannersApi() {
  const { apiUser } = useApiBase();

  /**
   * Lấy banner theo trang (chỉ 1 banner)
   * @param pageType - 'all-courses' hoặc 'my-courses'
   */
  const getBanners = async (pageType: 'all-courses' | 'my-courses') => {
    try {
      const url = `${apiUser}/banners?pageType=${pageType}`
      console.log('🔍 Fetching banner from:', url)
      
      const response = await $fetch<{
        status: boolean;
        data: {
          banner: {
            _id: string;
            page: string;
            title: string;
            image: string;
            url?: string;
            status: string;
          } | null;
        };
      }>(url);

      console.log('🔍 Banner API response:', response)

      // sendSuccess returns: { message: "", data: { banner: ... } }
      // Check for banner in data.banner
      const responseData = response as any
      let banner = null
      
      if (responseData.data?.banner) {
        banner = responseData.data.banner
      } else if (responseData.banner) {
        banner = responseData.banner
      }
      
      if (banner && banner.image) {
        console.log('✅ Found banner:', banner)
        return [banner]
      }
      
      console.warn('⚠️ No banner found in response. Response structure:', JSON.stringify(response, null, 2))
      return []
    } catch (error) {
      console.error('❌ Error fetching banners:', error)
      return []
    }
  };

  return {
    getBanners,
  };
}


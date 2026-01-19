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
      
      const response = await $fetch<any>(url);

      // sendSuccess returns: { message: "", data: { banner: ... } }
      // Handle multiple response formats
      let banner = null
      
      // Format 1: { data: { banner: {...} } }
      if (response?.data?.banner) {
        banner = response.data.banner
      } 
      // Format 2: { banner: {...} } (direct)
      else if (response?.banner) {
        banner = response.banner
      }
      // Format 3: response is the banner itself
      else if (response?._id && response?.image) {
        banner = response
      }
      
      if (banner && banner.image && banner.status === 'active') {
        return [banner]
      }
      
      return []
    } catch (error) {
      return []
    }
  };

  return {
    getBanners,
  };
}


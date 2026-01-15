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
      
      console.log('[BannersApi] Fetching banner from:', url)
      
      const response = await $fetch<any>(url);
      
      console.log('[BannersApi] Raw response:', JSON.stringify(response))

      // sendSuccess returns: { message: "", data: { banner: ... } }
      // Handle multiple response formats
      let banner = null
      
      // Format 1: { data: { banner: {...} } }
      if (response?.data?.banner) {
        banner = response.data.banner
        console.log('[BannersApi] Found banner in response.data.banner')
      } 
      // Format 2: { banner: {...} } (direct)
      else if (response?.banner) {
        banner = response.banner
        console.log('[BannersApi] Found banner in response.banner')
      }
      // Format 3: response is the banner itself
      else if (response?._id && response?.image) {
        banner = response
        console.log('[BannersApi] Response is banner itself')
      }
      
      console.log('[BannersApi] Extracted banner:', banner ? { _id: banner._id, image: banner.image?.substring(0, 50) } : null)
      
      if (banner && banner.image && banner.status === 'active') {
        return [banner]
      }
      
      console.log('[BannersApi] No valid banner found, returning empty array')
      return []
    } catch (error) {
      console.error('[BannersApi] Error fetching banner:', error)
      return []
    }
  };

  return {
    getBanners,
  };
}


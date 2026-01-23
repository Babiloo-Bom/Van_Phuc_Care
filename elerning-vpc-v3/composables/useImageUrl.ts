/**
 * ====================================
 * Image URL Helper Composable
 * ====================================
 * Utility to handle image URLs from different storage sources
 * (Firebase Storage, MinIO, etc.)
 */

/**
 * Normalize image URL - ensures URL is valid and handles different storage sources
 * @param url - Image URL (can be from Firebase, MinIO, or relative path)
 * @param fallback - Fallback URL if provided URL is invalid
 * @returns Valid image URL
 */
export const useImageUrl = () => {
  /**
   * Check if URL is from Firebase Storage
   */
  const isFirebaseUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return url.includes('firebasestorage.googleapis.com') || 
           url.includes('gensi-8df36.appspot.com');
  };

  /**
   * Check if URL is from MinIO
   */
  const isMinIOUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return url.includes('files.vanphuccare.vn') || 
           url.includes('/van-phuc-care/') ||
           url.startsWith('http') && (url.includes('minio') || url.includes('localhost:9000'));
  };

  /**
   * Check if URL is a valid absolute URL
   */
  const isAbsoluteUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  /**
   * Normalize image URL
   * - Returns the URL as-is if it's valid
   * - Returns fallback if URL is invalid/empty
   * - Handles both Firebase and MinIO URLs
   */
  const normalizeImageUrl = (
    url: string | null | undefined,
    fallback: string = '/images/placeholder.jpg'
  ): string => {
    // If no URL provided, return fallback
    if (!url || url.trim() === '') {
      return fallback;
    }

    // If it's already a valid absolute URL (Firebase or MinIO), return as-is
    if (isAbsoluteUrl(url)) {
      return url;
    }

    // If it's a relative path starting with /, return as-is
    if (url.startsWith('/')) {
      return url;
    }

    // Otherwise, return fallback
    return fallback;
  };

  /**
   * Get image URL with fallback
   * Prioritizes MinIO URLs over Firebase URLs
   * Useful for displaying images that might be from different sources
   */
  const getImageUrl = (
    url: string | null | undefined,
    fallback: string = '/images/placeholder.jpg'
  ): string => {
    return normalizeImageUrl(url, fallback);
  };

  /**
   * Get image URL with priority (MinIO > Firebase > fallback)
   * If multiple URLs provided, prioritize MinIO
   */
  const getImageUrlWithPriority = (
    urls: (string | null | undefined) | (string | null | undefined)[],
    fallback: string = '/images/placeholder.jpg'
  ): string => {
    // If single URL, normalize it
    if (!Array.isArray(urls)) {
      return normalizeImageUrl(urls, fallback);
    }

    // If array, prioritize MinIO URLs
    const urlArray = urls.filter(Boolean) as string[];
    
    // First, try to find MinIO URL
    const minioUrl = urlArray.find(url => isMinIOUrl(url));
    if (minioUrl) {
      return minioUrl;
    }

    // Then, try Firebase URL
    const firebaseUrl = urlArray.find(url => isFirebaseUrl(url));
    if (firebaseUrl) {
      return firebaseUrl;
    }

    // Then, try any absolute URL
    const absoluteUrl = urlArray.find(url => isAbsoluteUrl(url));
    if (absoluteUrl) {
      return absoluteUrl;
    }

    // Finally, try any relative URL
    const relativeUrl = urlArray.find(url => url.startsWith('/'));
    if (relativeUrl) {
      return relativeUrl;
    }

    // Fallback
    return fallback;
  };

  /**
   * Check if image URL is valid (not empty and not just a placeholder)
   */
  const isValidImageUrl = (url: string | null | undefined): boolean => {
    if (!url || url.trim() === '') return false;
    if (url === '/images/placeholder.jpg') return false;
    return true;
  };

  return {
    isFirebaseUrl,
    isMinIOUrl,
    isAbsoluteUrl,
    normalizeImageUrl,
    getImageUrl,
    getImageUrlWithPriority,
    isValidImageUrl,
  };
};


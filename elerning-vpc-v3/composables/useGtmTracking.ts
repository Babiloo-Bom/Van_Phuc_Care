/**
 * Composable helper for Google Tag Manager tracking
 * 
 * Usage:
 * ```ts
 * const { trackEvent, trackPageView, trackCourseView, trackPurchase } = useGtmTracking()
 * 
 * // Track custom event
 * trackEvent('course_enrolled', { course_id: '123', course_name: 'Python Basics' })
 * 
 * // Track page view
 * trackPageView('/courses/123', 'Course Details')
 * 
 * // Track course view
 * trackCourseView({ courseId: '123', courseName: 'Python Basics', price: 500000 })
 * 
 * // Track purchase
 * trackPurchase({ orderId: 'ORD123', value: 500000, currency: 'VND', items: [...] })
 * ```
 */

export const useGtmTracking = () => {
  const config = useRuntimeConfig()
  
  /**
   * Check if GTM is enabled
   */
  const isGtmEnabled = computed(() => {
    return !!config.public.gtmId && config.public.gtmId !== ''
  })

  /**
   * Get GTM instance (if available)
   */
  const getGtm = () => {
    if (typeof window === 'undefined' || !isGtmEnabled.value) {
      return null
    }
    
    try {
      // Try to get GTM from nuxt-gtm composable
      // @ts-ignore
      return useGtm?.() || null
    } catch (error) {
      console.warn('GTM not available:', error)
      return null
    }
  }

  /**
   * Track a custom event
   * @param eventName - Event name (e.g., 'course_enrolled', 'button_click')
   * @param eventData - Event data object
   */
  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (!isGtmEnabled.value) {
      console.log('[GTM] Event tracking disabled:', eventName, eventData)
      return
    }

    const gtm = getGtm()
    if (gtm) {
      try {
        // @ts-ignore
        gtm.trackEvent?.({
          event: eventName,
          ...eventData
        })
      } catch (error) {
        console.error('[GTM] Error tracking event:', error)
      }
    } else {
      // Fallback: push to dataLayer directly
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({
          event: eventName,
          ...eventData
        })
      }
    }
  }

  /**
   * Track page view
   * @param pagePath - Page path (e.g., '/courses/123')
   * @param pageTitle - Page title (optional)
   */
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (!isGtmEnabled.value) return

    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: typeof window !== 'undefined' ? window.location.href : pagePath
    })
  }

  /**
   * Track course view
   * @param data - Course data
   */
  const trackCourseView = (data: {
    courseId: string
    courseName: string
    price?: number
    category?: string
    instructor?: string
  }) => {
    trackEvent('view_course', {
      course_id: data.courseId,
      course_name: data.courseName,
      price: data.price,
      category: data.category,
      instructor: data.instructor
    })
  }

  /**
   * Track course enrollment/purchase
   * @param data - Purchase data
   */
  const trackPurchase = (data: {
    orderId: string
    value: number
    currency?: string
    items?: Array<{
      item_id: string
      item_name: string
      price: number
      quantity: number
    }>
  }) => {
    trackEvent('purchase', {
      transaction_id: data.orderId,
      value: data.value,
      currency: data.currency || 'VND',
      items: data.items || []
    })
  }

  /**
   * Track add to cart
   * @param data - Cart data
   */
  const trackAddToCart = (data: {
    courseId: string
    courseName: string
    price: number
    quantity?: number
  }) => {
    trackEvent('add_to_cart', {
      course_id: data.courseId,
      course_name: data.courseName,
      price: data.price,
      quantity: data.quantity || 1
    })
  }

  /**
   * Track remove from cart
   * @param data - Cart data
   */
  const trackRemoveFromCart = (data: {
    courseId: string
    courseName: string
    price: number
  }) => {
    trackEvent('remove_from_cart', {
      course_id: data.courseId,
      course_name: data.courseName,
      price: data.price
    })
  }

  /**
   * Track video play
   * @param data - Video data
   */
  const trackVideoPlay = (data: {
    courseId: string
    lessonId?: string
    videoTitle?: string
  }) => {
    trackEvent('video_play', {
      course_id: data.courseId,
      lesson_id: data.lessonId,
      video_title: data.videoTitle
    })
  }

  /**
   * Track video progress
   * @param data - Video progress data
   */
  const trackVideoProgress = (data: {
    courseId: string
    lessonId?: string
    progress: number // 0-100
    videoTitle?: string
  }) => {
    trackEvent('video_progress', {
      course_id: data.courseId,
      lesson_id: data.lessonId,
      progress: data.progress,
      video_title: data.videoTitle
    })
  }

  /**
   * Track search
   * @param data - Search data
   */
  const trackSearch = (data: {
    searchTerm: string
    resultsCount?: number
  }) => {
    trackEvent('search', {
      search_term: data.searchTerm,
      results_count: data.resultsCount
    })
  }

  /**
   * Track login
   * @param method - Login method (e.g., 'google', 'email')
   */
  const trackLogin = (method: string = 'email') => {
    trackEvent('login', {
      method
    })
  }

  /**
   * Track signup
   * @param method - Signup method (e.g., 'google', 'email')
   */
  const trackSignup = (method: string = 'email') => {
    trackEvent('sign_up', {
      method
    })
  }

  return {
    isGtmEnabled,
    trackEvent,
    trackPageView,
    trackCourseView,
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackVideoPlay,
    trackVideoProgress,
    trackSearch,
    trackLogin,
    trackSignup
  }
}


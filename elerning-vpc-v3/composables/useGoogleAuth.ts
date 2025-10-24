/**
 * Google OAuth Composable
 * Handles Google OAuth login flow
 */

import type { GoogleLoginResponse, GoogleTokenResponse, GoogleUserProfile } from '~/types/google'

export const useGoogleAuth = () => {
  try {
    const config = useRuntimeConfig()
    
    // Google OAuth configuration
    const googleConfig = {
      clientId: config.public.googleClientId as string,
      clientSecret: '', // Never expose client secret on client side
      redirectUri: `${config.public.baseUrl}/auth/google/callback`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ]
    }

    // ===== GENERATE AUTHORIZATION URL =====
    const generateAuthUrl = (): string => {
      try {
        if (!googleConfig.clientId) {
          console.warn('⚠️ Google Client ID not configured')
          return ''
        }

        const params = new URLSearchParams({
          client_id: googleConfig.clientId,
          redirect_uri: googleConfig.redirectUri,
          response_type: 'code',
          scope: googleConfig.scope.join(' '),
          access_type: 'offline',
          prompt: 'consent',
          state: Math.random().toString(36).substring(7)
        })

        return `${config.public.googleAuthUrl}?${params.toString()}`
      } catch (error) {
        console.error('❌ Error generating auth URL:', error)
        return ''
      }
    }

    // ===== EXCHANGE CODE FOR TOKEN (via backend) =====
    const exchangeCodeForToken = async (code: string): Promise<GoogleTokenResponse | null> => {
      try {
        const { data, error } = await useFetch<GoogleTokenResponse>('/api/auth/google/token', {
          method: 'POST',
          body: { code }
        })

        if (error.value) {
          console.error('❌ Token exchange failed:', error.value)
          return null
        }

        return data.value
      } catch (error: any) {
        console.error('❌ Token exchange error:', error)
        return null
      }
    }

    // ===== GET USER PROFILE (via backend) =====
    const getGoogleUserProfile = async (accessToken: string): Promise<GoogleUserProfile | null> => {
      try {
        const { data, error } = await useFetch<GoogleUserProfile>('/api/auth/google/profile', {
          method: 'POST',
          body: { accessToken }
        })

        if (error.value) {
          console.error('❌ Profile fetch failed:', error.value)
          return null
        }

        return data.value
      } catch (error: any) {
        console.error('❌ Profile fetch error:', error)
        return null
      }
    }

    // ===== GOOGLE LOGIN (Complete flow via backend) =====
    const googleLogin = async (code: string): Promise<GoogleLoginResponse> => {
      try {
        const { data, error } = await useFetch<GoogleLoginResponse>('/api/auth/google/login', {
          method: 'POST',
          body: { code }
        })

        if (error.value || !data.value) {
          return {
            success: false,
            error: 'Failed to complete Google login'
          }
        }

        return data.value
      } catch (error: any) {
        console.error('❌ Google login error:', error)
        return {
          success: false,
          error: error.message || 'Google login failed'
        }
      }
    }

    // ===== COMPLETE GOOGLE LOGIN =====
    const completeGoogleLogin = async (code: string): Promise<GoogleLoginResponse> => {
      try {
        // Call backend API to complete the entire flow
        const result = await googleLogin(code)
        
        if (!result.success || !result.data) {
          return {
            success: false,
            error: result.error || 'Failed to complete Google login'
          }
        }

        return result
      } catch (error: any) {
        console.error('❌ Complete Google login failed:', error)
        return {
          success: false,
          error: error.message || 'Google login flow failed'
        }
      }
    }

    // ===== CHECK IF GOOGLE IS CONFIGURED =====
    const isGoogleConfigured = computed(() => {
      return !!googleConfig.clientId && googleConfig.clientId.length > 0
    })

    return {
      googleConfig,
      generateAuthUrl,
      exchangeCodeForToken,
      getGoogleUserProfile,
      googleLogin,
      completeGoogleLogin,
      isGoogleConfigured
    }
  } catch (error) {
    console.error('❌ useGoogleAuth initialization error:', error)
    
    // Return safe fallback
    return {
      googleConfig: { clientId: '', clientSecret: '', redirectUri: '', scope: [] },
      generateAuthUrl: () => '',
      exchangeCodeForToken: async () => null,
      getGoogleUserProfile: async () => null,
      googleLogin: async () => ({ success: false, error: 'Google auth not available' }),
      completeGoogleLogin: async () => ({ success: false, error: 'Google auth not available' }),
      isGoogleConfigured: computed(() => false)
    }
  }
}


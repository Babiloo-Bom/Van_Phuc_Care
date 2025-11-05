/**
 * Google OAuth Composable
 * Handles Google login flow and user management
 */

import { computed } from 'vue';
import type { 
  GoogleOAuthConfig, 
  GoogleUserProfile, 
  GoogleTokenResponse,
  GoogleLoginRequest,
  GoogleLoginResponse, 
} from '~/types/google';

export const useGoogleAuth = () => {
  const config = useRuntimeConfig();
  const { baseUrl } = useBaseUrl();

  // ===== GOOGLE OAUTH CONFIG =====
  const googleConfig: GoogleOAuthConfig = {
    clientId: config.public.googleClientId || '',
    clientSecret: '', // Client secret không được expose ra client-side
    redirectUri: `${baseUrl}/auth/google/callback`,
    scope: ['openid', 'email', 'profile'],
  };

  // ===== GENERATE GOOGLE AUTH URL =====
  const generateAuthUrl = (state?: string): string => {
    const params = new URLSearchParams({
      client_id: googleConfig.clientId,
      redirect_uri: googleConfig.redirectUri,
      response_type: 'code',
      scope: googleConfig.scope.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      ...(state && { state }),
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  // ===== EXCHANGE CODE FOR TOKEN =====
  const exchangeCodeForToken = async (code: string): Promise<GoogleTokenResponse> => {
    try {
      // Gọi API backend để exchange code for token
      const { data } = await useFetch<GoogleTokenResponse>('/api/auth/google/token', {
        method: 'POST',
        body: {
          code,
          redirectUri: googleConfig.redirectUri,
        },
      });

      return data.value!;
    } catch (error: any) {
      console.error('❌ Google token exchange failed:', error);
      throw new Error('Không thể xác thực với Google. Vui lòng thử lại.');
    }
  };

  // ===== GET GOOGLE USER PROFILE =====
  const getGoogleUserProfile = async (accessToken: string): Promise<GoogleUserProfile> => {
    try {
      // Gọi API backend để lấy user profile
      const { data } = await useFetch<GoogleUserProfile>('/api/auth/google/profile', {
        method: 'POST',
        body: {
          accessToken,
        },
      });

      return data.value!;
    } catch (error: any) {
      console.error('❌ Google user profile fetch failed:', error);
      throw new Error('Không thể lấy thông tin người dùng từ Google.');
    }
  };

  // ===== GOOGLE LOGIN API =====
  const googleLogin = async (request: GoogleLoginRequest): Promise<GoogleLoginResponse> => {
    try {
      console.log('🔄 Calling Google login API with request:', request);
      
      const response = await $fetch<GoogleLoginResponse>('/api/auth/google/login-backend', {
        method: 'POST',
        body: request,
      });

      console.log('🔍 Google login API response:', response);

      if (!response) {
        console.error('❌ No data received from server');
        throw new Error('Không nhận được phản hồi từ server');
      }

      console.log('✅ Google login API success:', response);
      return response;
    } catch (error: any) {
      console.error('❌ Google login API failed:', error);
      throw new Error('Đăng nhập Google thất bại. Vui lòng thử lại.');
    }
  };

  // ===== COMPLETE GOOGLE LOGIN FLOW =====
  const completeGoogleLogin = async (code: string, state?: string): Promise<GoogleLoginResponse> => {
    try {
      // Gọi API backend để xử lý toàn bộ Google OAuth flow
      const loginResponse = await googleLogin({
        code,
        state,
        redirectUri: googleConfig.redirectUri,
      });

      return loginResponse;
      
    } catch (error: any) {
      console.error('❌ Google login flow failed:', error);
      throw error;
    }
  };

  // ===== CHECK GOOGLE CONFIG =====
  const isGoogleConfigured = computed((): boolean => {
    return !!(googleConfig.clientId); // Chỉ cần clientId, clientSecret không cần trên client-side
  });

  // ===== GET GOOGLE LOGIN URL =====
  const getGoogleLoginUrl = (): string => {
    if (!isGoogleConfigured.value) {
      throw new Error('Google OAuth chưa được cấu hình');
    }
    
    return generateAuthUrl();
  };

  return {
    // Configuration
    googleConfig,
    isGoogleConfigured,
    
    // Auth flow
    getGoogleLoginUrl,
    completeGoogleLogin,
    
    // Direct API calls
    exchangeCodeForToken,
    getGoogleUserProfile,
    googleLogin,
  };
};
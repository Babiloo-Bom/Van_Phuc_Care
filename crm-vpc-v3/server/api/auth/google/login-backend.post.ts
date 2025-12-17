/**
 * Google Login API - Backend Integration
 * Proxies Google OAuth to backend API
 */

import type { GoogleLoginResponse } from '~/types/google';

export default defineEventHandler(async (event): Promise<GoogleLoginResponse> => {
  try {
    const body = await readBody(event);
    const { code, redirectUri: bodyRedirectUri } = body;

    if (!code) {
      console.error('❌ No authorization code provided');
      return {
        success: false,
        error: 'Authorization code is required',
      };
    }

    const config = useRuntimeConfig(event);
    
    // Build redirectUri for this site (prefer provided in body)
    const host = getHeader(event, 'host');
    const forwardedProto = getHeader(event, 'x-forwarded-proto');
    const isLocal = (host || '').includes('localhost') || (host || '').startsWith('127.0.0.1');
    const protocol = bodyRedirectUri ? undefined : (isLocal ? 'http' : (forwardedProto || 'https'));
    const baseUrl = bodyRedirectUri ? undefined : `${protocol}://${host}`;
    const redirectUri = bodyRedirectUri || `${baseUrl}/auth/google/callback`;

    // Delegate code exchange to main backend
    // CRM should use /api/u (user endpoint), not /api/a (admin endpoint)
    try {
      const apiHost = config.apiHostInternal || config.public.apiHost;
      const backendResponse = await $fetch<any>(`${apiHost}/api/u/auth/google/login`, {
        method: 'POST',
        body: {
          code,
          redirectUri,
        },
      });

      // Check if backend returned success
      if (!backendResponse || !backendResponse.data) {
        console.error('❌ Invalid backend response:', backendResponse);
        throw new Error(backendResponse?.message || 'Backend authentication failed');
      }

      // Extract data from backend response
      const userData = backendResponse.data;
      const userInfo = userData.user || userData;
      
      return {
        success: true,
        data: {
          user: {
            id: userInfo._id || userInfo.id || '',
            email: userInfo.email,
            fullname: userInfo.fullname,
            name: userInfo.fullname || userInfo.name,
            avatar: userInfo.avatar,
            provider: userInfo.provider || 'google',
            // Additional fields for compatibility
            role: userInfo.role || userInfo.type || 'user',
            permissions: userInfo.permissions || [],
            googleId: userInfo.googleId,
          } as any, // Type assertion to allow additional fields
          accessToken: userData.accessToken,
          tokenExpireAt: userData.tokenExpireAt,
        },
      };

    } catch (backendError: any) {
      console.error('❌ Backend API error:', backendError);
      // Extract error message from backend response
      const errorMessage = backendError?.data?.message || 
                          backendError?.data?.error || 
                          backendError?.message || 
                          'Backend authentication failed';
      throw new Error(errorMessage);
    }

  } catch (error: any) {
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return {
      success: false,
      error: error.message || 'Google login failed',
    };
  }
});


/**
 * Google Login API - Backend Integration
 * Proxies Google OAuth to backend API
 */

import type { GoogleLoginResponse } from '~/types/google';

export default defineEventHandler(async (event): Promise<GoogleLoginResponse> => {
  try {
    const body = await readBody(event)
    const { code, redirectUri: bodyRedirectUri } = body

    if (!code) {
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
    try {
      const apiHost = config.apiHostInternal || config.public.apiHost;
      const backendResponse = await $fetch<any>(`${apiHost}/api/a/auth/google/login`, {
        method: 'POST',
        body: {
          code,
          redirectUri,
        },
      });


      // Check if backend returned success
      if (!backendResponse || !backendResponse.data) {
        throw new Error(backendResponse?.message || 'Backend authentication failed')
      }

      // Backend response is valid, continue

      // Extract data from backend response
      const userData = backendResponse.data;
      const userInfo = userData.user || userData;
      
      return {
        success: true,
        data: {
          user: {
            _id: userInfo._id,
            email: userInfo.email,
            fullname: userInfo.fullname,
            avatar: userInfo.avatar,
            role: userInfo.role || 'user',
            permissions: userInfo.permissions || [],
            provider: userInfo.provider || 'google',
            googleId: userInfo.googleId,
          },
          accessToken: userData.accessToken,
          tokenExpireAt: userData.tokenExpireAt,
        },
      };

    } catch (backendError: any) {
      throw new Error(backendError.message || 'Backend authentication failed')
    }

  } catch (error: any) {
   
    return {
      success: false,
      error: error.message || 'Google login failed',
    };
  }
});
/**
 * JWT Service
 * Handles JWT token generation and verification
 */

import jwt from 'jsonwebtoken'

// ===== JWT CONFIG =====
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

// ===== JWT PAYLOAD INTERFACE =====
export interface JWTPayload {
  userId: string
  email: string
  role: string
  provider: string
  iat?: number
  exp?: number
}

// ===== JWT TOKEN RESPONSE =====
export interface JWTTokenResponse {
  accessToken: string
  refreshToken: string
  tokenExpireAt: number
  refreshTokenExpireAt: number
}

export class JWTService {
  // ===== GENERATE ACCESS TOKEN =====
  static generateAccessToken(user: any): string {
    const payload: JWTPayload = {
      userId: user._id?.toString() || user.id,
      email: user.email,
      role: user.role,
      provider: user.provider
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'vanphuccare-elearning',
      audience: 'vanphuccare-users'
    })
  }

  // ===== GENERATE REFRESH TOKEN =====
  static generateRefreshToken(user: any): string {
    const payload: JWTPayload = {
      userId: user._id?.toString() || user.id,
      email: user.email,
      role: user.role,
      provider: user.provider
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'vanphuccare-elearning',
      audience: 'vanphuccare-users'
    })
  }

  // ===== GENERATE TOKEN PAIR =====
  static generateTokenPair(user: any): JWTTokenResponse {
    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)
    
    // Calculate expiration times
    const now = Math.floor(Date.now() / 1000)
    const accessTokenExp = now + this.getExpirationTime(JWT_EXPIRES_IN)
    const refreshTokenExp = now + this.getExpirationTime(JWT_REFRESH_EXPIRES_IN)

    return {
      accessToken,
      refreshToken,
      tokenExpireAt: accessTokenExp * 1000, // Convert to milliseconds
      refreshTokenExpireAt: refreshTokenExp * 1000
    }
  }

  // ===== GET EXPIRATION TIME =====
  private static getExpirationTime(expiresIn: string): number {
    const timeUnits: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400
    }

    const match = expiresIn.match(/^(\d+)([smhd])$/)
    if (!match) {
      return 3600 // Default to 1 hour
    }

    const [, value, unit] = match
    return parseInt(value) * timeUnits[unit]
  }
}


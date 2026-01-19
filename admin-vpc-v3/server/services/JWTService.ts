/**
 * JWT Service
 * Handles JWT token generation and verification
 */

import jwt from 'jsonwebtoken'
import type { IUser } from '../database/models/User'

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
  static generateAccessToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      provider: user.provider
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'vanphuccare-admin',
      audience: 'vanphuccare-users'
    })
  }

  // ===== GENERATE REFRESH TOKEN =====
  static generateRefreshToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      provider: user.provider
    }

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'vanphuccare-admin',
      audience: 'vanphuccare-users'
    })
  }

  // ===== GENERATE TOKEN PAIR =====
  static generateTokenPair(user: IUser): JWTTokenResponse {
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

  // ===== VERIFY TOKEN =====
  static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      return decoded
    } catch (error: any) {
      return null
    }
  }

  // ===== VERIFY ACCESS TOKEN =====
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'vanphuccare-admin',
        audience: 'vanphuccare-users'
      }) as JWTPayload
      return decoded
    } catch (error: any) {
      return null
    }
  }

  // ===== VERIFY REFRESH TOKEN =====
  static verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'vanphuccare-admin',
        audience: 'vanphuccare-users'
      }) as JWTPayload
      return decoded
    } catch (error: any) {
      return null
    }
  }

  // ===== EXTRACT TOKEN FROM HEADER =====
  static extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7) // Remove 'Bearer ' prefix
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

  // ===== CHECK TOKEN EXPIRY =====
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as JWTPayload
      if (!decoded || !decoded.exp) {
        return true
      }
      
      const now = Math.floor(Date.now() / 1000)
      return decoded.exp < now
    } catch (error) {
      return true
    }
  }

  // ===== REFRESH TOKEN =====
  static async refreshToken(refreshToken: string): Promise<JWTTokenResponse | null> {
    try {
      const payload = this.verifyRefreshToken(refreshToken)
      if (!payload) {
        return null
      }

      // TODO: Verify user still exists and is active
      // const user = await UserService.findById(payload.userId)
      // if (!user || !user.isActive) {
      //   return null
      // }

      // Generate new token pair
      // return this.generateTokenPair(user)
      
      // For now, return null (implement when UserService.findById is available)
      return null
    } catch (error: any) {
      return null
    }
  }
}

/**
 * Test Controller
 * Simple test endpoints to verify API functionality
 */

import { Request, Response } from 'express'
import { sendSuccess, sendError } from '@libs/response'

export default class TestController {
  /**
   * Simple test endpoint
   */
  public static async test(req: Request, res: Response) {
    try {
      sendSuccess(res, { message: 'API is working!' })
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error)
    }
  }

  /**
   * Test JWT authentication
   */
  public static async testAuth(req: Request, res: Response) {
    try {
      const user = (req as any).currentUser || (req as any).currentAdmin
      if (!user) {
        return sendError(res, 401, 'No authenticated user found')
      }
      
      sendSuccess(res, { 
        message: 'Authentication working!',
        user: {
          id: user._id,
          email: user.email,
          fullname: user.fullname
        }
      })
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error)
    }
  }
}

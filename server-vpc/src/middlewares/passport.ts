import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import settings from '@configs/settings';
import MongoDbAdmins from '@mongodb/admins';
import MongodbUsers from '@mongodb/users';

const adminOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('accessToken'),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: settings.jwt.adminSecret,
  passReqToCallback: true,
};

const userOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromUrlQueryParameter('accessToken'),
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: settings.jwt.adminSecret,
  passReqToCallback: true,
};

const adminPassport = new Passport();
const userPassport = new Passport();

const adminStrategy = new Strategy(adminOptions, async (req: Request, payload: {id: string}, next: any) => {
  try {
    const admin = await MongoDbAdmins.model.findOne({ _id: payload.id, status: MongoDbAdmins.STATUS_ENUM.ACTIVE });
    if (admin) {
      req.currentAdmin = admin;
      next(null, admin);
    } else {
      next(null, false);
    }
  } catch (error: any) {
    console.log(error);
  }
});
const userStrategy = new Strategy(userOptions, async (req: Request, payload: {id: string}, next: any) => {
  try {
    // Find user in admins collection since Google login creates users there
    const user = await MongodbUsers.model.findOne({ _id: payload.id, status: MongodbUsers.STATUS_ENUM.ACTIVE });
    if (user) {
      req.currentUser = user;
      next(null, user);
    } else {
      next(null, false);
    }
  } catch (error: any) {
    console.log('❌ userStrategy error:', error);
  }
});
adminPassport.use(adminStrategy);
userPassport.use(userStrategy);

/**
 * Optional authentication middleware
 * Checks for JWT token if present, but doesn't fail if token is missing
 * Useful for routes that work both with and without authentication
 */
const optionalAuth = (req: Request, res: any, next: any) => {
  try {
    // Check if Authorization header or accessToken query param exists
    const authHeader = req.headers.authorization;
    const accessToken = req.query.accessToken;
    
    // If no token present, skip authentication and continue
    if (!authHeader && !accessToken) {
      return next();
    }
    
    // Try to authenticate, but don't fail if token is invalid
    adminPassport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
      // If error occurred (e.g., invalid token), just continue without auth
      if (err) {
        return next();
      }
      
      // If user found, attach to request
      if (user) {
        req.currentAdmin = user;
        req.currentUser = user; // Also set as currentUser for consistency
      } else {
      }
      // Continue regardless of auth result
      next();
    })(req, res, next);
  } catch (error: any) {
    // If any error occurs, just continue without auth
    next();
  }
};

export {
  adminPassport,
  userPassport,
  optionalAuth,
};

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
const userStrategy = new Strategy(adminOptions, async (req: Request, payload: {id: string}, next: any) => {
  try {
    const user = await MongodbUsers.model.findOne({ _id: payload.id, status: MongodbUsers.STATUS_ENUM.ACTIVE });
    if (user) {
      req.currentUser = user;
      next(null, user);
    } else {
      next(null, false);
    }
  } catch (error: any) {
    console.log(error);
  }
});
adminPassport.use(adminStrategy);
userPassport.use(userStrategy);
export {
  adminPassport,
  userPassport,
};

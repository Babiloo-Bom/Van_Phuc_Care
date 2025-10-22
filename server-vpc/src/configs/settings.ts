import dotenv from 'dotenv';

dotenv.config();

export default {
  defaultPerPage: '12',
  defaultQuestionPerPage: '12',
  jwt: {
    adminSecret: process.env.JWT_SECRET || 'jUqnH0tFwdgqX1lLa97OGCFOPMscAGN4IIlx4YaX3vt6ff546IRhCB3qeUz9kYP4',
    userSecret: process.env.JWT_SECRET || 'jUqnH0tFwdgqX1lLa97OGCFOPMscAGN4IIlx4YaX3vt6ff546IRhCB3qeUz9kYP4',
    ttl: 60 * 60 * 24 * 1000,
  },
  sessionSecret: process.env.SESSION_SECRET || 'bUfxkJXG5xOtaOqRyTmXqWGl4ZxNSyAPbJGVfc7DKix2lyBMJn6TtmKQER52q2eD',
  prefix: {
    imageMime: 'image',
    videoMime: 'video',
    fileMime: 'application',
  },
  preSignExpiration: 60 * 30,
  userTypes: {
    user: 'user',
    admin: 'admin',
    teacher: 'teacher',
  },
  language: {
    en: 'en',
    tetun: 'tetun',
  },
  validator: {
    email: /^(([A-Za-z0-9]{1,}(\.)?)*[A-Za-z0-9]{1,})@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  forgotPasswordTokenExpiresIn: 1,
  otpTtl: 30,
};

import dotenv from 'dotenv';

dotenv.config();

// Parse JWT_TTL from env - có thể là string ("7d") hoặc number (milliseconds)
const parseJwtTtl = (): string | number => {
  const envTtl = process.env.JWT_TTL;
  if (!envTtl) {
    return 60 * 60 * 24 * 1000; // Default 1 day in ms
  }
  // Nếu là số, parse thành number
  const numTtl = Number(envTtl);
  if (!isNaN(numTtl) && numTtl > 0) {
    return numTtl;
  }
  // Nếu không phải số, giữ nguyên string (như "7d", "24h")
  return envTtl;
};

export default {
  defaultPerPage: '12',
  defaultQuestionPerPage: '12',
  jwt: {
    // Sửa: Ưu tiên JWT_ADMIN_SECRET, fallback về JWT_SECRET
    adminSecret: process.env.JWT_ADMIN_SECRET || process.env.JWT_SECRET || 'jUqnH0tFwdgqX1lLa97OGCFOPMscAGN4IIlx4YaX3vt6ff546IRhCB3qeUz9kYP4',
    // Sửa: Ưu tiên JWT_USER_SECRET, fallback về JWT_SECRET
    userSecret: process.env.JWT_USER_SECRET || process.env.JWT_SECRET || 'jUqnH0tFwdgqX1lLa97OGCFOPMscAGN4IIlx4YaX3vt6ff546IRhCB3qeUz9kYP4',
    ttl: parseJwtTtl(),
  },
  sessionSecret: process.env.SESSION_SECRET || 'bUfxkJXG5xOtaOqRyTmXqWGl4ZxNSyAPbJGVfc7DKix2lyBMJn6TtmKQER52q2eD',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '625263472933-tbu2huc6j45fo65459r4891nfcrbr6hd.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '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',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
  },
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

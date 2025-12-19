import settings from '@configs/settings';

export const getJwtTtlConfig = () => {
  const jwtTtl = settings.jwt.ttl;
  
  // Convert to string for jwt.sign
  let ttlString: string;
  if (typeof jwtTtl === 'string') {
    ttlString = jwtTtl;
  } else if (typeof jwtTtl === 'number') {
    const days = Math.floor(jwtTtl / (1000 * 60 * 60 * 24));
    ttlString = `${days}d`;
  } else {
    ttlString = '7d';
  }
  
  // Convert to milliseconds for Date calculation
  let ttlMs: number;
  if (typeof jwtTtl === 'number') {
    ttlMs = jwtTtl;
  } else if (typeof jwtTtl === 'string') {
    const ttlStr: string = jwtTtl;
    const match = ttlStr.match(/^(\d+)([dhms])$/);
    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];
      const multipliers: Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
      };
      ttlMs = value * (multipliers[unit] || 86400000);
    } else {
      ttlMs = 7 * 24 * 60 * 60 * 1000;
    }
  } else {
    ttlMs = 7 * 24 * 60 * 60 * 1000;
  }
  
  return { ttlString, ttlMs };
};

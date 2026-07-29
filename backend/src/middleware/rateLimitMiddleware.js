import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000', 10);
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);

let redisClient = null;
let redisReady = false;

export async function initRateLimitRedis() {
  try {
    redisClient = createClient({
      socket: { host: REDIS_HOST, port: REDIS_PORT },
      database: REDIS_DB,
    });
    redisClient.on('error', (err) => {
      console.error('Redis rate-limit error:', err.message);
    });
    await redisClient.connect();
    redisReady = true;
    console.log(`Rate limit Redis connected (${REDIS_HOST}:${REDIS_PORT})`);
  } catch (err) {
    console.warn('Rate limit Redis unavailable, using in-memory store:', err.message);
    redisReady = false;
  }
}

function buildStore(prefix) {
  if (!redisReady || !redisClient) {
    return undefined;
  }
  return new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: `rl:${prefix}:`,
  });
}

function userOrIpKey(req) {
  return req.user?.userId ? String(req.user.userId) : req.ip;
}

export function createTierLimiter(maxRequests, windowMs = WINDOW_MS, prefix = 'tier') {
  return rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later' },
    keyGenerator: userOrIpKey,
    store: buildStore(prefix),
  });
}

const FREE_MAX = parseInt(process.env.RATE_LIMIT_FREE || '100', 10);
const PRO_MAX = parseInt(process.env.RATE_LIMIT_PRO || '1000', 10);
const ENTERPRISE_MAX = parseInt(process.env.RATE_LIMIT_ENTERPRISE || '10000', 10);
const IP_MAX = parseInt(process.env.RATE_LIMIT_IP || '1000', 10);

export const freeLimiter = createTierLimiter(FREE_MAX, WINDOW_MS, 'free');
export const proLimiter = createTierLimiter(PRO_MAX, WINDOW_MS, 'pro');
export const enterpriseLimiter = createTierLimiter(ENTERPRISE_MAX, WINDOW_MS, 'enterprise');

export const ipLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: IP_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
  keyGenerator: (req) => req.ip,
  store: buildStore('ip'),
});

import { subscriptionManager } from '../services/subscriptionManager.js';
import {
  freeLimiter,
  proLimiter,
  enterpriseLimiter,
  ipLimiter,
} from './rateLimitMiddleware.js';

const SKIP_PATHS = [
  '/health',
  '/api/health',
  '/api/stripe/webhook',
];

async function resolveTier(req) {
  if (req.user?.tier) {
    return req.user.tier;
  }
  if (req.user?.userId) {
    return subscriptionManager.getUserTier(req.user.userId);
  }
  return 'Free';
}

function runLimiter(limiter, req, res, next) {
  limiter(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next();
  });
}

export async function tierRateLimiter(req, res, next) {
  const path = req.originalUrl.split('?')[0];
  if (SKIP_PATHS.some((p) => path === p || path.startsWith(p))) {
    return next();
  }

  runLimiter(ipLimiter, req, res, async (ipErr) => {
    if (ipErr) {
      return next(ipErr);
    }

    try {
      const tier = await resolveTier(req);
      const tierLimiter = tier === 'Enterprise'
        ? enterpriseLimiter
        : tier === 'Pro'
          ? proLimiter
          : freeLimiter;

      runLimiter(tierLimiter, req, res, next);
    } catch (err) {
      next(err);
    }
  });
}

import { subscriptionManager } from '../services/subscriptionManager.js';

export function requireTier(tierList) {
  return async (req, res, next) => {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userTier = await subscriptionManager.getUserTier(req.user.userId);
    if (!tierList.includes(userTier)) {
      return res.status(403).json({
        success: false,
        error: `This feature requires ${tierList.join(' or ')} tier. Current tier: ${userTier}`,
        currentTier: userTier,
        requiredTiers: tierList,
      });
    }

    req.userTier = userTier;
    next();
  };
}

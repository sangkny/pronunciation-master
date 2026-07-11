import { Router } from 'express';
import { aomdEngine } from '../services/aomdEngine.js';
import { subscriptionManager } from '../services/subscriptionManager.js';
import { dbManager } from '../services/dbManager.js';
import { requireTier } from '../middleware/tierMiddleware.js';

const router = Router();

router.post('/feedback', async (req, res) => {
  try {
    const {
      userPronunciation,
      correctPronunciation,
      word,
      score,
      context,
    } = req.body;

    if (!userPronunciation || !correctPronunciation || !word) {
      return res.status(400).json({
        success: false,
        error: 'userPronunciation, correctPronunciation, and word are required.',
      });
    }

    const userId = req.user?.userId;
    const tier = userId
      ? await subscriptionManager.getUserTier(userId)
      : 'Free';

    try {
      if (userId) await subscriptionManager.recordPractice(userId);
    } catch (limitError) {
      return res.status(403).json({
        success: false,
        error: limitError.message,
        dailyLimitReached: true,
      });
    }

    const result = await aomdEngine.generateComprehensiveFeedback({
      userPronunciation,
      correctPronunciation,
      word,
      score: score ?? 0,
      context: context || 'General',
    });

    const filtered = subscriptionManager.filterAomdByTier(tier, result);

    if (userId) {
      await dbManager.saveUserScore(
        userId,
        word,
        userPronunciation,
        score ?? 0,
        filtered
      );
    }

    res.json({ success: true, tier, ...filtered });
  } catch (error) {
    console.error('AOMD feedback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

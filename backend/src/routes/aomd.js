import { Router } from 'express';
import { aomdEngine } from '../services/aomdEngine.js';

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

    const result = await aomdEngine.generateComprehensiveFeedback({
      userPronunciation,
      correctPronunciation,
      word,
      score: score ?? 0,
      context: context || 'General',
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('AOMD feedback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

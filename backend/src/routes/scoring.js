import { Router } from 'express';
import { scoringEngine } from '../services/scoringEngine.js';

const router = Router();

router.post('/calculate', async (req, res) => {
  try {
    const { userPronunciation, correctPronunciation, userLevel, difficulty } = req.body;

    if (!userPronunciation || !correctPronunciation) {
      return res.status(400).json({
        success: false,
        error: 'userPronunciation and correctPronunciation are required.',
      });
    }

    const result = await scoringEngine.calculateScore({
      userPronunciation,
      correctPronunciation,
      userLevel: userLevel || 'intermediate',
      difficulty: difficulty || 'intermediate',
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Scoring error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

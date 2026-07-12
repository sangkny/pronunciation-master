import { Router } from 'express';
import { dbManager } from '../services/dbManager.js';
import { analyticsEngine } from '../services/analyticsEngine.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  try {
    const data = await analyticsEngine.getDashboard(req.user.userId);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/weekly', async (req, res) => {
  try {
    const data = await analyticsEngine.getWeeklyReport(req.user.userId);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/weakness', async (req, res) => {
  try {
    const data = await analyticsEngine.getWeaknessAnalysis(req.user.userId);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10', 10);
    const leaderboard = await analyticsEngine.getLeaderboard(limit);
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/recommend/:domainId', async (req, res) => {
  try {
    const { userLevel = 'beginner' } = req.query;
    const data = await analyticsEngine.getRecommendedNext(
      req.user.userId,
      req.params.domainId,
      userLevel
    );
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/progress', async (req, res) => {
  try {
    const { domainId, conceptId, status } = req.body;
    if (!domainId || !conceptId || !status) {
      return res.status(400).json({
        success: false,
        error: 'domainId, conceptId, and status are required',
      });
    }
    const progress = await dbManager.saveUserProgress(
      req.user.userId,
      domainId,
      conceptId,
      status
    );
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

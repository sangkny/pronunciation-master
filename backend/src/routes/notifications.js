import { Router } from 'express';
import { notificationManager } from '../services/notificationManager.js';

const router = Router();

router.post('/register-token', async (req, res) => {
  try {
    const { expoPushToken, platform } = req.body;
    const token = await notificationManager.registerPushToken(
      req.user.userId,
      expoPushToken,
      platform || 'unknown'
    );
    res.json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const settings = await notificationManager.getSettings(req.user.userId);
    res.json({ success: true, ...settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/settings', async (req, res) => {
  try {
    const settings = await notificationManager.updateSettings(req.user.userId, req.body);
    res.json({ success: true, ...settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

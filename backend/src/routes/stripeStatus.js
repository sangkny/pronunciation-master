import { Router } from 'express';
import { stripeManager } from '../services/stripeManager.js';

const router = Router();

router.get('/status', async (req, res) => {
  try {
    const status = await stripeManager.getProductionStatus();
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { stripeManager } from '../services/stripeManager.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const result = await stripeManager.handleWebhookRequest(req.body, signature);
    res.json(result);
  } catch (error) {
    console.error('Stripe webhook error:', error.message);
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;

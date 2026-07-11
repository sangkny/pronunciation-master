import { Router } from 'express';
import { subscriptionManager } from '../services/subscriptionManager.js';
import { stripeManager } from '../services/stripeManager.js';

const router = Router();

router.get('/tier', async (req, res) => {
  try {
    const tier = await subscriptionManager.getUserTier(req.user.userId);
    const info = subscriptionManager.getTierInfo(tier);
    res.json({ success: true, ...info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/status', async (req, res) => {
  try {
    const status = await subscriptionManager.getSubscriptionStatus(req.user.userId);
    res.json({ success: true, ...status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/upgrade', async (req, res) => {
  try {
    const { tier } = req.body;
    const validUpgradeTiers = ['Pro', 'Enterprise'];

    if (!validUpgradeTiers.includes(tier)) {
      return res.status(400).json({
        success: false,
        error: 'tier must be Pro or Enterprise',
      });
    }

    const payment = await stripeManager.createPaymentIntent(req.user.userId, tier);

    if (payment.mock) {
      const result = await subscriptionManager.upgradeTier(
        req.user.userId,
        tier,
        payment.paymentIntentId
      );
      return res.json({
        success: true,
        tier: result.user.tier,
        message: `Upgraded to ${tier} (mock payment)`,
        payment,
      });
    }

    res.json({
      success: true,
      message: 'Payment intent created',
      clientSecret: payment.clientSecret,
      paymentIntentId: payment.paymentIntentId,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

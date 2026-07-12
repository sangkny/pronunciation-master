import { Router } from 'express';
import { ssoManager } from '../services/ssoManager.js';

const router = Router();

router.get('/providers', (req, res) => {
  res.json({ success: true, providers: ssoManager.getProviders() });
});

router.get('/status', (req, res) => {
  res.json({ success: true, ...ssoManager.getStatus() });
});

router.post('/login', async (req, res) => {
  try {
    const { provider, email, name, ssoToken, externalId } = req.body;
    const result = await ssoManager.authenticate({
      provider,
      email,
      name,
      ssoToken,
      externalId,
    });
    res.json({ success: true, message: 'SSO login successful', ...result });
  } catch (error) {
    const status = error.message.includes('Invalid') ? 401 : 400;
    res.status(status).json({ success: false, error: error.message });
  }
});

export default router;

import { Router } from 'express';
import { apiKeyManager } from '../services/apiKeyManager.js';
import { requireTier } from '../middleware/tierMiddleware.js';

const router = Router();

router.use(requireTier(['Enterprise']));

router.get('/', async (req, res) => {
  try {
    const keys = await apiKeyManager.listApiKeys(req.user.userId);
    res.json({ success: true, keys });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const result = await apiKeyManager.createApiKey(req.user.userId, name || 'B2B API Key');
    res.status(201).json({
      success: true,
      key: result.key,
      id: result.id,
      prefix: result.key_prefix,
      message: 'Store this key securely. It will not be shown again.',
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:keyId', async (req, res) => {
  try {
    await apiKeyManager.revokeApiKey(req.user.userId, parseInt(req.params.keyId, 10));
    res.json({ success: true, message: 'API key revoked' });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

export default router;

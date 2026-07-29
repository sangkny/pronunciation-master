import { Router } from 'express';
import { dbManager } from '../services/dbManager.js';

const router = Router();

router.post('/sync', async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      clientId,
      word,
      analysis,
      confidence = 0,
      createdAt,
      audioDuration = 0,
    } = req.body;

    if (!clientId || !word || !analysis) {
      return res.status(400).json({
        success: false,
        error: 'clientId, word, and analysis are required',
      });
    }

    const row = await dbManager.syncMobileAnalysis(userId, {
      clientId,
      word,
      analysis,
      confidence,
      createdAt,
      audioDuration,
    });

    res.json({
      success: true,
      id: row.id,
      clientId: row.client_id,
      created_at: row.created_at,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit || '100', 10);
    const analyses = await dbManager.listMobileAnalyses(userId, limit);
    res.json({ success: true, analyses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

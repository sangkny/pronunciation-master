import { Router } from 'express';
import { sttEngine } from '../services/sttEngine.js';

const router = Router();

router.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType, expectedWord, lang } = req.body;

    if (!audioBase64) {
      return res.status(400).json({
        success: false,
        error: 'audioBase64 is required',
      });
    }

    const result = await sttEngine.transcribe({
      audioBase64,
      mimeType: mimeType || 'audio/m4a',
      expectedWord,
      lang: lang || 'en',
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('STT transcribe error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/status', (req, res) => {
  res.json({
    success: true,
    provider: sttEngine.getProvider(),
    whisperConfigured: sttEngine.isWhisperConfigured(),
  });
});

export default router;

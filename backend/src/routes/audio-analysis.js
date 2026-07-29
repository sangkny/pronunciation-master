import { Router } from 'express';
import { gemma4AudioService } from '../services/gemma4AudioService.js';
import { gemma4NativeAudioService } from '../services/gemma4NativeAudioService.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({ success: true, ...gemma4AudioService.getStatus() });
});

router.get('/info', async (req, res) => {
  try {
    const info = await gemma4NativeAudioService.getInfo();
    res.json({ success: true, ...info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/analyze-native', async (req, res) => {
  try {
    const {
      audioBase64,
      audioFormat = 'wav',
      ipaChartUrl,
      word,
      correctPronunciation,
      userLevel,
    } = req.body;

    if (!audioBase64 || !word) {
      return res.status(400).json({
        success: false,
        error: 'audioBase64 and word are required',
      });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const maxBytes = 10 * 1024 * 1024;
    if (audioBuffer.length > maxBytes) {
      return res.status(400).json({
        success: false,
        error: 'Audio payload too large (max 10MB)',
      });
    }

    const result = await gemma4NativeAudioService.handleAudioWithIPA(
      audioBuffer,
      ipaChartUrl,
      {
        word,
        correctPronunciation: correctPronunciation || word,
        userLevel: userLevel || 'beginner',
      },
      { audioFormat }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const {
      audioBase64,
      ipaChartUrl,
      word,
      correctPronunciation,
      userLevel,
    } = req.body;

    if (!audioBase64 || !word) {
      return res.status(400).json({
        success: false,
        error: 'audioBase64 and word are required',
      });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const maxBytes = 10 * 1024 * 1024;
    if (audioBuffer.length > maxBytes) {
      return res.status(400).json({
        success: false,
        error: 'Audio payload too large (max 10MB)',
      });
    }

    const result = await gemma4AudioService.analyzeAudioWithIPA(
      audioBuffer,
      ipaChartUrl,
      {
        word,
        correctPronunciation: correctPronunciation || word,
        userLevel: userLevel || 'beginner',
      }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/transcribe', async (req, res) => {
  try {
    const { audioBase64 } = req.body;

    if (!audioBase64) {
      return res.status(400).json({
        success: false,
        error: 'audioBase64 is required',
      });
    }

    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const text = await gemma4AudioService.transcribeAudio(audioBuffer);

    res.json({
      success: !!text,
      text: text || '',
      provider: 'gemma4-lmstudio',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

/**
 * @file backend/src/routes/mission.js
 * 미션 관련 API 라우트
 * - 상황 기반 미션 생성
 * - TTS (Text-To-Speech)
 */

import express from 'express';

export function missionRoutes(llmManager) {
  const router = express.Router();

  /**
   * 상황 기반 미션 생성
   * POST /api/mission/generate-by-scenario
   */
  router.post('/generate-by-scenario', async (req, res) => {
    try {
      const { scenario, category, count = 5 } = req.body;

      if (!scenario || !scenario.trim()) {
        return res.status(400).json({
          error: '상황(scenario)을 입력해주세요.'
        });
      }

      const result = await llmManager.generateScenarioBasedMissions({
        scenario: scenario.trim(),
        category,
        count
      });

      res.json({
        success: true,
        scenario,
        category,
        missions: result.missions || []
      });
    } catch (error) {
      console.error('미션 생성 오류:', error);
      res.status(500).json({
        error: error.message || '미션 생성 중 오류가 발생했습니다.'
      });
    }
  });

  /**
   * 텍스트 음성 변환 (TTS)
   * POST /api/mission/text-to-speech
   */
  router.post('/text-to-speech', async (req, res) => {
    try {
      const { text, language = 'en-US', speed = 'normal' } = req.body;

      if (!text || !text.trim()) {
        return res.status(400).json({
          error: '텍스트를 입력해주세요.'
        });
      }

      // 실제 TTS 구현은 프론트엔드의 Web Speech API 또는
      // Google Cloud TTS, AWS Polly 등의 서비스 사용
      
      // 여기서는 메타데이터만 반환
      res.json({
        success: true,
        text: text.trim(),
        language,
        speed,
        message: '프론트엔드의 Web Speech API를 사용하거나 별도의 TTS 서비스를 연결하세요.'
      });
    } catch (error) {
      console.error('TTS 오류:', error);
      res.status(500).json({
        error: 'TTS 처리 중 오류가 발생했습니다.'
      });
    }
  });

  /**
   * 특정 단어/구 발음 분석
   * POST /api/mission/word-pronunciation
   */
  router.post('/word-pronunciation', async (req, res) => {
    try {
      const { word, userPronunciation } = req.body;

      if (!word) {
        return res.status(400).json({
          error: '단어를 입력해주세요.'
        });
      }

      const result = await llmManager.analyzePronunciation({
        sentence: word,
        focusPoints: [word],
        userTranscript: userPronunciation || ''
      });

      res.json({
        success: true,
        word,
        feedback: result
      });
    } catch (error) {
      console.error('단어 발음 분석 오류:', error);
      res.status(500).json({
        error: '단어 발음 분석 중 오류가 발생했습니다.'
      });
    }
  });

  return router;
}

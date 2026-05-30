/**
 * @file backend/src/server.js
 * Pronunciation Master 백엔드 서버 (완전 버전)
 * 모든 라우트 통합
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { LLMManager } from './services/llmManager.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// LLM 매니저 초기화
const llmManager = new LLMManager({
  provider: process.env.LLM_PROVIDER || 'ollama',
  apiKeys: {
    claude: process.env.CLAUDE_API_KEY,
    gemini: process.env.GOOGLE_GEMINI_API_KEY,
    cohere: process.env.COHERE_API_KEY,
    huggingface: process.env.HF_API_KEY
  },
  ollamaUrl: process.env.OLLAMA_API_URL || 'http://ollama:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'mistral'
});

// ==================== PRONUNCIATION ROUTES ====================

/**
 * 발음 분석
 */
app.post('/api/pronunciation/analyze', async (req, res) => {
  try {
    const { sentence, focusPoints, userTranscript } = req.body;

    if (!sentence || !focusPoints) {
      return res.status(400).json({
        error: '필수 파라미터 누락: sentence, focusPoints'
      });
    }

    const result = await llmManager.analyzePronunciation({
      sentence,
      focusPoints,
      userTranscript: userTranscript || ''
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('발음 분석 오류:', error);
    res.status(500).json({
      error: error.message || '발음 분석 중 오류 발생'
    });
  }
});

/**
 * 발음 비교
 */
app.post('/api/pronunciation/compare', async (req, res) => {
  try {
    const { targetSentence, userTranscript } = req.body;

    if (!targetSentence || !userTranscript) {
      return res.status(400).json({
        error: '필수 파라미터 누락'
      });
    }

    const result = await llmManager.comparePronunciation(
      targetSentence,
      userTranscript
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('발음 비교 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== TRANSLATION ROUTES ====================

/**
 * 한국어 → 영어 번역
 */
app.post('/api/translation/korean-to-english', async (req, res) => {
  try {
    const { koreanSentence, category, difficulty = 'medium' } = req.body;

    if (!koreanSentence) {
      return res.status(400).json({
        error: '한국어 문장을 입력해주세요'
      });
    }

    const result = await llmManager.translateToEnglish({
      koreanSentence,
      category,
      difficulty
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('번역 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * 영어 표현 검토
 */
app.post('/api/translation/review', async (req, res) => {
  try {
    const { userEnglish, koreanOriginal, suggestedEnglish } = req.body;

    if (!userEnglish || !koreanOriginal) {
      return res.status(400).json({
        error: '필수 파라미터 누락'
      });
    }

    const result = await llmManager.reviewEnglishExpression({
      userEnglish,
      koreanOriginal,
      suggestedEnglish: suggestedEnglish || ''
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('검토 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== MISSION ROUTES ====================

/**
 * 상황 기반 미션 생성 (핵심 기능!)
 */
app.post('/api/mission/generate-by-scenario', async (req, res) => {
  try {
    const { scenario, category, count = 5 } = req.body;

    console.log('📝 상황 기반 미션 생성 요청:', { scenario, category, count });

    if (!scenario || !scenario.trim()) {
      return res.status(400).json({
        error: '상황(scenario)을 입력해주세요'
      });
    }

    // LLM 호출로 미션 생성
    const result = await llmManager.generateScenarioBasedMissions({
      scenario: scenario.trim(),
      category,
      count
    });

    console.log('✅ 미션 생성 완료:', result);

    res.json({
      success: true,
      scenario,
      category,
      missions: result.missions || result.review_missions || []
    });
  } catch (error) {
    console.error('❌ 미션 생성 오류:', error);
    res.status(500).json({
      error: error.message || '미션 생성 중 오류가 발생했습니다',
      details: error.toString()
    });
  }
});

/**
 * 복습 미션 생성
 */
app.post('/api/review/generate-missions', async (req, res) => {
  try {
    const { skippedWords, category, count = 5 } = req.body;

    if (!skippedWords || skippedWords.length === 0) {
      return res.status(400).json({
        error: '스킵한 단어를 입력해주세요'
      });
    }

    const result = await llmManager.generateReviewMissions({
      skippedWords,
      category,
      count
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('복습 미션 생성 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * 복습 일정 조회
 */
app.get('/api/review/schedule', (req, res) => {
  try {
    const { date } = req.query;
    const scheduleDate = date || new Date().toISOString().split('T')[0];

    // 이 엔드포인트는 데이터베이스에서 조회
    // 현재는 샘플 반환
    res.json({
      success: true,
      date: scheduleDate,
      schedule: []
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== MISSION DETAIL ROUTES ====================

/**
 * 상황별 어휘 생성
 */
app.post('/api/mission/contextual-vocabulary', async (req, res) => {
  try {
    const { scenario, category, focusLevel = 'intermediate' } = req.body;

    if (!scenario) {
      return res.status(400).json({
        error: '상황을 입력해주세요'
      });
    }

    const result = await llmManager.generateContextualVocabulary({
      scenario,
      category,
      focusLevel
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('어휘 생성 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * 상황별 대화 생성
 */
app.post('/api/mission/generate-dialogues', async (req, res) => {
  try {
    const { scenario, category, dialogueCount = 3 } = req.body;

    if (!scenario) {
      return res.status(400).json({
        error: '상황을 입력해주세요'
      });
    }

    const result = await llmManager.generateDialogues({
      scenario,
      category,
      dialogueCount
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('대화 생성 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * 상황 분석 및 학습 경로 추천
 */
app.post('/api/mission/analyze-scenario', async (req, res) => {
  try {
    const { scenario, category, userLevel = 'intermediate' } = req.body;

    if (!scenario) {
      return res.status(400).json({
        error: '상황을 입력해주세요'
      });
    }

    const result = await llmManager.analyzeScenarioAndRecommend({
      scenario,
      category,
      userLevel
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('상황 분석 오류:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// ==================== CONFIG ROUTES ====================

/**
 * 헬스 체크
 */
app.get('/health', async (req, res) => {
  try {
    const llmStatus = await llmManager.checkHealth();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      llm: llmStatus
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

/**
 * 설정 조회
 */
app.get('/api/config', (req, res) => {
  res.json({
    llm_provider: process.env.LLM_PROVIDER || 'ollama',
    available_providers: ['ollama', 'claude', 'gemini', 'cohere', 'huggingface'],
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

/**
 * 사용 가능한 프로바이더
 */
app.get('/api/config/providers', (req, res) => {
  const providers = llmManager.getAvailableProviders();
  res.json({
    current: process.env.LLM_PROVIDER || 'ollama',
    available: providers
  });
});

/**
 * 프로바이더 전환
 */
app.post('/api/config/switch-provider', (req, res) => {
  try {
    const { provider } = req.body;

    if (!provider) {
      return res.status(400).json({
        error: '프로바이더를 지정해주세요'
      });
    }

    llmManager.switchProvider(provider);

    res.json({
      success: true,
      message: `프로바이더가 ${provider}로 전환되었습니다`,
      current: provider
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

/**
 * 프로바이더별 모델 조회
 */
app.get('/api/config/models', (req, res) => {
  const { provider } = req.query;

  const models = {
    ollama: ['mistral', 'neural-chat', 'dolphin-mixtral', 'llama2', 'orca-mini'],
    claude: ['claude-sonnet-4-20250514', 'claude-opus-4-6'],
    gemini: ['gemini-pro'],
    cohere: ['command'],
    huggingface: ['mistralai/Mistral-7B-Instruct-v0.1']
  };

  res.json({
    provider: provider || 'all',
    models: provider ? models[provider] : models
  });
});

// ==================== ERROR HANDLING ====================

/**
 * 404 핸들링
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

/**
 * 에러 핸들링
 */
app.use((err, req, res, next) => {
  console.error('서버 에러:', err);
  res.status(err.status || 500).json({
    error: err.message || '내부 서버 에러',
    timestamp: new Date().toISOString()
  });
});

// ==================== 서버 시작 ====================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Pronunciation Master Backend         ║
║   Server running on port ${PORT}         ║
╚════════════════════════════════════════╝

📡 LLM Provider: ${process.env.LLM_PROVIDER || 'ollama'}
🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
📊 Environment: ${process.env.NODE_ENV || 'development'}

Available API Endpoints:
  
  🎤 Pronunciation:
    POST /api/pronunciation/analyze        - 발음 분석
    POST /api/pronunciation/compare        - 발음 비교
  
  🌍 Translation:
    POST /api/translation/korean-to-english - 한국어→영어 번역
    POST /api/translation/review            - 표현 검토
  
  🎬 Missions:
    POST /api/mission/generate-by-scenario     - 상황 기반 미션 생성 ⭐
    POST /api/mission/contextual-vocabulary    - 상황 어휘 생성
    POST /api/mission/generate-dialogues       - 대화 생성
    POST /api/mission/analyze-scenario         - 상황 분석
  
  📋 Review:
    POST /api/review/generate-missions     - 복습 미션 생성
    GET  /api/review/schedule              - 복습 일정 조회
  
  ⚙️  Config:
    GET  /health                           - 헬스 체크
    GET  /api/config                       - 설정 조회
    GET  /api/config/providers             - 프로바이더 목록
    POST /api/config/switch-provider       - 프로바이더 전환
    GET  /api/config/models                - 모델 목록
  `);
});

export default app;

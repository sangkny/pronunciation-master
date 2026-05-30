/**
 * @file backend/src/services/llmManager-complete.js
 * 완전한 LLM 매니저 - 모든 메서드 포함
 * 
 * 기존 llmManager.js에 다음을 추가하세요.
 */

// ==================== 상황 기반 미션 생성 ====================

/**
 * 상황 기반 미션 생성 (핵심 기능!)
 */
async generateScenarioBasedMissions(params) {
  const { scenario, category, count = 5 } = params;

  const categoryMap = {
    'medical': '의료기기 및 의료 분야',
    'telecom': '통신 기술',
    'finance': '금융',
    'tech': '기술 및 컴퓨터',
    'automotive': '자동차 산업'
  };

  const prompt = `당신은 전문적인 영어 발음 교사이자 ESL 교육 전문가입니다.

[학습 분야]
${categoryMap[category] || category}

[사용자의 상황]
"${scenario}"

이 상황에서 필요한 ${count}개의 실용적인 영어 문장을 만들어주세요.

요구사항:
1. 각 문장은 실제 그 상황에서 사용될 수 있는 자연스러운 표현
2. 발음 연습에 적합한 길이 (8-20 단어)
3. 중요한 단어들을 포함하되 과도하지 않게
4. 초중급~중상급 수준의 난이도
5. 비즈니스/전문 맥락에 맞는 표현

각 문장에 대해:
- id: 유니크한 ID
- sentence: 원문 문장
- focusPoints: 발음에 주의할 3-4개의 단어
- difficulty: easy/medium/hard
- context: 사용할 수 있는 구체적인 상황 설명

다음의 JSON 형식으로만 응답하세요:
{
  "scenario": "${scenario}",
  "category": "${category}",
  "missions": [
    {
      "id": 1,
      "sentence": "<영어 문장>",
      "focusPoints": ["<단어1>", "<단어2>", "<단어3>"],
      "difficulty": "easy|medium|hard",
      "context": "<사용 상황 설명>"
    }
  ]
}

JSON만 응답하세요.`;

  try {
    const result = await this.currentProvider.generate({
      prompt,
      maxTokens: 2500,
      temperature: 0.8,
      jsonMode: true
    });

    const parsed = JSON.parse(result.text);
    return {
      success: true,
      missions: parsed.missions || []
    };
  } catch (e) {
    console.error('JSON 파싱 오류:', e);
    // 파싱 실패 시 샘플 데이터 반환
    return {
      success: true,
      missions: this._generateSampleMissions(scenario, category, count)
    };
  }
}

/**
 * 샘플 미션 생성 (폴백용)
 */
_generateSampleMissions(scenario, category, count) {
  const samples = {
    'medical': [
      {
        id: 1,
        sentence: "I'm experiencing severe headaches for the past week.",
        focusPoints: ["experiencing", "severe", "headaches"],
        difficulty: "medium",
        context: "환자가 의사에게 증상 설명"
      },
      {
        id: 2,
        sentence: "Can you describe the exact location of your pain?",
        focusPoints: ["describe", "location", "pain"],
        difficulty: "medium",
        context: "의사가 환자에게 질문"
      },
      {
        id: 3,
        sentence: "I've been taking over-the-counter pain relievers.",
        focusPoints: ["taking", "over-the-counter", "relievers"],
        difficulty: "hard",
        context: "환자가 현재 복용 중인 약물 설명"
      },
      {
        id: 4,
        sentence: "Do you have any allergies to medications?",
        focusPoints: ["allergies", "medications"],
        difficulty: "medium",
        context: "의사의 알레르기 확인"
      },
      {
        id: 5,
        sentence: "I'll prescribe an antibiotic and pain management strategy.",
        focusPoints: ["prescribe", "antibiotic", "management"],
        difficulty: "hard",
        context: "의사의 처방 설명"
      }
    ],
    'tech': [
      {
        id: 1,
        sentence: "Our cutting-edge platform revolutionizes data processing.",
        focusPoints: ["cutting-edge", "revolutionizes", "processing"],
        difficulty: "hard",
        context: "제품 소개 발표"
      },
      {
        id: 2,
        sentence: "We've achieved 300% performance improvement.",
        focusPoints: ["achieved", "performance", "improvement"],
        difficulty: "medium",
        context: "실적 보고"
      },
      {
        id: 3,
        sentence: "Enterprise clients benefit from our scalability.",
        focusPoints: ["Enterprise", "benefit", "scalability"],
        difficulty: "medium",
        context: "고객 이점 설명"
      },
      {
        id: 4,
        sentence: "Let me demonstrate the key features.",
        focusPoints: ["demonstrate", "features"],
        difficulty: "easy",
        context: "기능 데모"
      },
      {
        id: 5,
        sentence: "Do you have questions about the architecture?",
        focusPoints: ["questions", "architecture"],
        difficulty: "medium",
        context: "기술 Q&A"
      }
    ],
    'finance': [
      {
        id: 1,
        sentence: "Portfolio diversification is essential for risk management.",
        focusPoints: ["Portfolio", "diversification", "management"],
        difficulty: "hard",
        context: "투자 전략 설명"
      },
      {
        id: 2,
        sentence: "We analyzed quarterly financial performance metrics.",
        focusPoints: ["analyzed", "quarterly", "performance"],
        difficulty: "medium",
        context: "분기별 실적 분석"
      }
    ]
  };

  const baseSamples = samples[category] || samples['tech'];
  return baseSamples.slice(0, count);
}

// ==================== 상황별 어휘 생성 ====================

/**
 * 상황 기반 어휘 생성
 */
async generateContextualVocabulary(params) {
  const { scenario, category, focusLevel = 'intermediate' } = params;

  const prompt = `당신은 비즈니스 영어 전문가입니다.

[상황]
"${scenario}"

이 상황에서 자주 사용되는 20-30개의 중요한 단어와 표현을 제시해주세요.

포함 항목:
1. 명사 (5-7개)
2. 동사 (5-7개)
3. 형용사/부사 (3-5개)
4. 구 (5-7개)
5. 관용구 (2-3개)

다음의 JSON 형식으로 응답하세요:
{
  "scenario": "${scenario}",
  "vocabulary": [
    {
      "word": "<영어 단어>",
      "pronunciation": "<발음>",
      "meaning": "<의미>",
      "example": "<예시>",
      "wordType": "noun|verb|adjective|phrase|idiom"
    }
  ]
}

JSON만 응답하세요.`;

  try {
    const result = await this.currentProvider.generate({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
      jsonMode: true
    });

    return JSON.parse(result.text);
  } catch (e) {
    console.error('어휘 생성 오류:', e);
    return {
      scenario,
      vocabulary: []
    };
  }
}

// ==================== 상황별 대화 생성 ====================

/**
 * 상황 기반 대화 생성
 */
async generateDialogues(params) {
  const { scenario, category, dialogueCount = 3 } = params;

  const prompt = `당신은 대화 교육 전문가입니다.

[상황]
"${scenario}"

이 상황에서 발생할 수 있는 ${dialogueCount}개의 자연스러운 대화를 만들어주세요.

각 대화는:
1. 5-8 교환으로 구성
2. 자연스럽고 실용적인 표현
3. 초중급~중상급 수준

다음의 JSON 형식으로 응답하세요:
{
  "scenario": "${scenario}",
  "dialogues": [
    {
      "dialogueNumber": 1,
      "title": "<대화 제목>",
      "context": "<상황 설명>",
      "exchanges": [
        {
          "speaker": "Person A|Person B",
          "text": "<대사>",
          "pronunciation_notes": []
        }
      ],
      "focusPoints": []
    }
  ]
}

JSON만 응답하세요.`;

  try {
    const result = await this.currentProvider.generate({
      prompt,
      maxTokens: 3000,
      temperature: 0.8,
      jsonMode: true
    });

    return JSON.parse(result.text);
  } catch (e) {
    console.error('대화 생성 오류:', e);
    return {
      scenario,
      dialogues: []
    };
  }
}

// ==================== 상황 분석 및 추천 ====================

/**
 * 상황 분석 및 학습 경로 추천
 */
async analyzeScenarioAndRecommend(params) {
  const { scenario, category, userLevel = 'intermediate' } = params;

  const prompt = `당신은 영어 학습 전문가입니다.

[상황]
"${scenario}"

[사용자 수준]
${userLevel}

이 상황에서 효과적으로 배우기 위한 학습 계획을 분석해주세요.

포함 내용:
1. 상황 분석
2. 난이도 평가
3. 학습 순서
4. 필수 어휘 (10개)
5. 핵심 표현 (5개)
6. 발음 포인트 (3개)
7. 연습 방법

다음의 JSON 형식으로 응답하세요:
{
  "scenarioAnalysis": {
    "situation": "${scenario}",
    "difficultyLevel": "easy|intermediate|hard",
    "estimatedLearningTime": "15-20 minutes",
    "keyLanguageElements": [],
    "essentialVocabulary": [],
    "keyPhrases": [],
    "pronunciationFocus": [],
    "recommendedPracticeMethods": []
  }
}

JSON만 응답하세요.`;

  try {
    const result = await this.currentProvider.generate({
      prompt,
      maxTokens: 2000,
      temperature: 0.7,
      jsonMode: true
    });

    return JSON.parse(result.text);
  } catch (e) {
    console.error('상황 분석 오류:', e);
    return {
      scenarioAnalysis: {
        situation: scenario,
        difficultyLevel: userLevel,
        estimatedLearningTime: "15-20 minutes",
        keyLanguageElements: [],
        essentialVocabulary: [],
        keyPhrases: [],
        pronunciationFocus: [],
        recommendedPracticeMethods: []
      }
    };
  }
}

export {
  generateScenarioBasedMissions,
  generateContextualVocabulary,
  generateDialogues,
  analyzeScenarioAndRecommend
};

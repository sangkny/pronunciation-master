/**
 * @file backend/src/services/llmManager-extended.js
 * LLM 매니저 확장 - 상황 기반 미션 생성
 * 
 * 기존 llmManager.js에 다음 메서드 추가:
 * - generateScenarioBasedMissions()
 * - generateContextualVocabulary()
 * - generateDialogues()
 */

/**
 * 상황 기반 미션 생성
 * 
 * @param {Object} params - 파라미터
 * @param {string} params.scenario - 사용자가 입력한 상황 (예: "의사와의 상담")
 * @param {string} params.category - 카테고리
 * @param {number} params.count - 생성할 미션 수 (기본 5개)
 * @returns {Promise<Object>} 생성된 미션들
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
- 원문 문장
- 발음에 주의할 3-4개의 단어
- 난이도 (easy/medium/hard)
- 사용할 수 있는 구체적인 상황 설명

다음의 JSON 형식으로만 응답하세요:
{
  "scenario": "${scenario}",
  "category": "${category}",
  "missions": [
    {
      "id": <유니크 ID>,
      "sentence": "<영어 문장>",
      "focusPoints": ["<단어1>", "<단어2>", "<단어3>"],
      "difficulty": "easy|medium|hard",
      "context": "<사용 상황 설명>",
      "scenarioRelevance": <0-100의 관련도 점수>
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

    return JSON.parse(result.text);
  } catch (e) {
    console.error('JSON 파싱 오류:', e);
    return {
      error: 'Failed to parse scenario missions',
      raw_response: result.text
    };
  }
}

/**
 * 상황 기반 어휘 생성
 * 특정 상황에서 필요한 단어들과 표현
 */
async generateContextualVocabulary(params) {
  const { scenario, category, focusLevel = 'intermediate' } = params;

  const prompt = `당신은 비즈니스 영어 전문가입니다.

[상황]
"${scenario}"

[분야]
${category}

이 상황에서 자주 사용되는 20-30개의 중요한 단어와 표현을 제시해주세요.

포함 항목:
1. 명사 (5-7개): 상황과 관련된 주요 개념
2. 동사 (5-7개): 자주 사용되는 행동 동사
3. 형용사/부사 (3-5개): 묘사 표현
4. 구 (5-7개): 자연스러운 표현 방식
5. 관용구 (2-3개): 원어민이 사용하는 표현

각 항목마다:
- 단어/표현
- 발음 (간단한 IPA 또는 설명)
- 의미
- 예시 문장

다음의 JSON 형식으로 응답하세요:
{
  "scenario": "${scenario}",
  "vocabulary": [
    {
      "word": "<영어 단어>",
      "pronunciation": "<발음 가이드>",
      "meaning": "<의미>",
      "example": "<예시 문장>",
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
    throw new Error('Failed to generate contextual vocabulary');
  }
}

/**
 * 상황 기반 대화 생성
 * 사용자와 다른 사람 간의 자연스러운 대화
 */
async generateDialogues(params) {
  const { scenario, category, dialogueCount = 3 } = params;

  const prompt = `당신은 대화 교육 전문가입니다.

[상황]
"${scenario}"

[분야]
${category}

이 상황에서 발생할 수 있는 ${dialogueCount}개의 자연스러운 대화를 만들어주세요.

각 대화는:
1. 5-8 교환 (turn)으로 구성
2. 자연스럽고 실용적인 표현
3. 초중급~중상급 수준
4. 실제 상황을 반영

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
          "text": "<대화 내용>",
          "pronunciation_notes": ["<발음 주의사항>"]
        }
      ],
      "focusPoints": ["<학습 포인트 1>", "<학습 포인트 2>"]
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
    throw new Error('Failed to generate dialogues');
  }
}

/**
 * 상황 분석 및 학습 경로 추천
 */
async analyzeScenarioAndRecommend(params) {
  const { scenario, category, userLevel = 'intermediate' } = params;

  const prompt = `당신은 영어 학습 전문가입니다.

[사용자의 상황]
"${scenario}"

[분야]
${category}

[사용자 수준]
${userLevel}

이 상황에서 효과적으로 배우기 위한 학습 계획을 분석해주세요.

포함 내용:
1. 상황 분석: 이 상황에서 특히 중요한 언어 요소
2. 난이도 평가: 사용자 수준에 맞는 난이도
3. 학습 순서: 단계별 학습 경로
4. 필수 어휘: 반드시 배워야 할 10개 단어
5. 핵심 표현: 자주 사용될 5개 표현
6. 발음 포인트: 주의할 3개 발음 요소
7. 연습 방법: 추천 연습 방법

다음의 JSON 형식으로 응답하세요:
{
  "scenarioAnalysis": {
    "situation": "${scenario}",
    "difficultyLevel": "easy|intermediate|hard",
    "estimatedLearningTime": "<학습 소요 시간>",
    "keyLanguageElements": ["<요소1>", "<요소2>"],
    "essentialVocabulary": [
      {
        "word": "<단어>",
        "importance": "critical|important|useful"
      }
    ],
    "keyPhrases": [
      {
        "phrase": "<표현>",
        "usage": "<사용 상황>"
      }
    ],
    "pronunciationFocus": [
      {
        "area": "<발음 영역>",
        "challenge": "<어려운 점>",
        "tip": "<팁>"
      }
    ],
    "recommendedPracticeMethods": [
      "<방법1>",
      "<방법2>",
      "<방법3>"
    ]
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
    console.error('시나리오 분석 오류:', e);
    throw new Error('Failed to analyze scenario');
  }
}

export {
  generateScenarioBasedMissions,
  generateContextualVocabulary,
  generateDialogues,
  analyzeScenarioAndRecommend
};

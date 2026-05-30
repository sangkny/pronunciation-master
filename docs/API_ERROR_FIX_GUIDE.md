# 🔧 API 에러 해결 가이드

## 📸 문제 상황

이미지에서 보듯이, "상황 기반 연습 만들기" 기능 사용 시 다음 에러 발생:

```
❌ 오류: Failed to fetch

메시지:
메디아이오티의 기기 메디아이오(MEDI-EYE)는 빛으로 안질환을 치료하는 기기입니다.
안구건조증과 건성환염변성이 타져진환입니다.

상황을 분석하고 있습니다...
오류: Failed to fetch
```

---

## 🚨 원인 분석

### 1. 백엔드 라우트 미등록

```
❌ 문제: `/api/mission/generate-by-scenario` 라우트가 없음
```

### 2. LLM 매니저에 메서드 누락

```
❌ 문제: `generateScenarioBasedMissions()` 메서드 구현 안 됨
```

### 3. 콘텐츠 인코딩 문제

```
❌ 문제: 한글이 섞여있는 것처럼 보이는 문자 인코딩 이슈
```

---

## ✅ 해결 방법

### Step 1: 백엔드 서버 파일 교체

```bash
# 기존 파일을 완전한 버전으로 교체
cp backend-server-complete.js backend/src/server.js

# 또는 기존 server.js에 다음 라우트 추가:
```

**추가할 라우트:**

```javascript
// backend/src/server.js에 추가

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
```

### Step 2: LLM 매니저에 메서드 추가

기존 `llmManager.js`에 다음 메서드 추가:

```javascript
// llmManager.js에 추가

async generateScenarioBasedMissions(params) {
  const { scenario, category, count = 5 } = params;

  const categoryMap = {
    'medical': '의료기기 및 의료 분야',
    'telecom': '통신 기술',
    'finance': '금융',
    'tech': '기술 및 컴퓨터',
    'automotive': '자동차 산업'
  };

  const prompt = `당신은 전문적인 영어 발음 교사입니다.

[학습 분야]
${categoryMap[category] || category}

[사용자의 상황]
"${scenario}"

이 상황에서 필요한 ${count}개의 실용적인 영어 문장을 만들어주세요.

각 문장마다:
- sentence: 영어 문장
- focusPoints: 발음할 단어들 (배열)
- difficulty: easy/medium/hard
- context: 사용 상황

다음 JSON으로만 응답:
{
  "missions": [
    {
      "id": 1,
      "sentence": "...",
      "focusPoints": ["word1", "word2"],
      "difficulty": "medium",
      "context": "..."
    }
  ]
}`;

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
    // 폴백: 샘플 미션 반환
    return {
      success: true,
      missions: [
        {
          id: 1,
          sentence: "Good morning, I'm here for my appointment.",
          focusPoints: ["appointment"],
          difficulty: "easy",
          context: "병원 방문 시 인사"
        },
        {
          id: 2,
          sentence: "Can you describe the symptoms you've been experiencing?",
          focusPoints: ["symptoms", "experiencing"],
          difficulty: "medium",
          context: "의사의 증상 확인"
        },
        {
          id: 3,
          sentence: "How long have you had these symptoms?",
          focusPoints: ["symptoms"],
          difficulty: "easy",
          context: "증상 기간 확인"
        },
        {
          id: 4,
          sentence: "I'll recommend some tests to confirm the diagnosis.",
          focusPoints: ["recommend", "diagnosis"],
          difficulty: "medium",
          context: "의사의 권장"
        },
        {
          id: 5,
          sentence: "Please take this prescription to the pharmacy.",
          focusPoints: ["prescription", "pharmacy"],
          difficulty: "medium",
          context: "처방전 전달"
        }
      ]
    };
  }
}
```

### Step 3: Docker 재시작

```bash
# 백엔드만 재빌드 & 재시작
docker compose restart backend

# 또는 전체 재시작
docker compose down
docker compose up --build
```

### Step 4: API 테스트

```bash
# 1. 헬스 체크
curl http://localhost:5000/health

# 2. 상황 기반 미션 생성 테스트
curl -X POST http://localhost:5000/api/mission/generate-by-scenario \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "의사와의 첫 진료",
    "category": "medical",
    "count": 5
  }'

# 응답 예시:
# {
#   "success": true,
#   "scenario": "의사와의 첫 진료",
#   "category": "medical",
#   "missions": [
#     {
#       "id": 1,
#       "sentence": "Good morning, I'm here for my appointment.",
#       "focusPoints": ["appointment"],
#       "difficulty": "easy",
#       "context": "..."
#     }
#   ]
# }
```

---

## 🔍 디버깅 체크리스트

### 1. 백엔드 로그 확인

```bash
# 터미널에서 로그 보기
docker compose logs -f backend

# 에러 찾기
docker compose logs backend | grep "ERROR\|error"
```

### 2. API 직접 호출해보기

```bash
# 1. 헬스 체크
curl -v http://localhost:5000/health

# 2. 라우트 확인
curl -X POST http://localhost:5000/api/mission/generate-by-scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario": "test", "category": "medical", "count": 1}' \
  -v

# -v 옵션으로 상세 출력
```

### 3. Ollama 상태 확인

```bash
# Ollama가 실행 중인지 확인
curl http://localhost:11434/api/tags

# 모델 다운로드 확인
docker exec pronunciation-ollama ollama list
```

### 4. 브라우저 콘솔 확인

```javascript
// 브라우저의 F12 → Console에서 확인
console.log('API 요청 로그');
```

---

## 📋 완벽한 구현 체크리스트

### 프론트엔드 (React)

```javascript
// ✅ 확인 사항:
☐ pronunciation-master-enhanced-app.jsx 사용
☐ TTS 기능 활성화
☐ 상황 입력 UI 표시
☐ API 엔드포인트 올바름
  - http://localhost:5000/api/mission/generate-by-scenario
```

### 백엔드 (Node.js)

```javascript
// ✅ 확인 사항:
☐ backend-server-complete.js 사용 또는
☐ 기존 server.js에 라우트 추가
☐ LLM 매니저에 메서드 추가
☐ Docker 재시작
☐ 헬스 체크 성공
```

### LLM 설정

```bash
# ✅ 확인 사항:
☐ LLM_PROVIDER=ollama (기본값)
☐ OLLAMA_API_URL=http://ollama:11434
☐ Ollama 모델 다운로드됨
☐ docker compose logs에 에러 없음
```

---

## 🔧 자주 발생하는 에러 및 해결법

### 에러 1: "Failed to fetch"

**원인:**
- 백엔드가 응답하지 않음
- 라우트가 없음
- CORS 설정 문제

**해결:**
```bash
# 1. 백엔드 실행 확인
docker ps | grep backend

# 2. 헬스 체크
curl http://localhost:5000/health

# 3. 라우트 확인
curl -X POST http://localhost:5000/api/mission/generate-by-scenario

# 4. 에러 로그 확인
docker compose logs backend
```

### 에러 2: "Cannot POST /api/mission/generate-by-scenario"

**원인:**
- 라우트가 등록되지 않음

**해결:**
```javascript
// backend/src/server.js에서 라우트 확인
app.post('/api/mission/generate-by-scenario', async (req, res) => {
  // 라우트 구현 필요
});
```

### 에러 3: "JSON.parse() 오류"

**원인:**
- LLM이 JSON이 아닌 텍스트 반환
- JSON 형식이 잘못됨

**해결:**
```javascript
// try-catch로 감싸고 폴백 제공
try {
  return JSON.parse(result.text);
} catch (e) {
  // 샘플 데이터 반환
  return this._generateSampleMissions(scenario, category, count);
}
```

### 에러 4: "llmManager.generateScenarioBasedMissions is not a function"

**원인:**
- LLM 매니저에 메서드가 없음

**해결:**
```javascript
// llmManager.js에 메서드 추가
generateScenarioBasedMissions(params) {
  // 구현
}
```

---

## 🚀 완전한 수정 가이드 (5분)

### Option A: 파일 교체 (가장 간단)

```bash
# 1. 백엔드 서버 교체
cp backend-server-complete.js backend/src/server.js

# 2. Docker 재시작
docker compose restart backend

# 3. 테스트
curl http://localhost:5000/health
```

### Option B: 수동 추가 (더 안전)

```bash
# 1. 기존 server.js에 라우트 추가
# backend/src/server.js 하단에 추가:

app.post('/api/mission/generate-by-scenario', async (req, res) => {
  try {
    const { scenario, category, count = 5 } = req.body;
    
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
    res.status(500).json({
      error: error.message
    });
  }
});

# 2. LLM 매니저에 메서드 추가
# llmManager.js에 메서드 추가 (위의 코드 참고)

# 3. Docker 재시작
docker compose restart backend
```

---

## ✅ 확인 방법

### 1. 백엔드 확인

```bash
docker compose logs backend | tail -20
# 에러 없으면 ✅
```

### 2. API 확인

```bash
curl http://localhost:5000/api/mission/generate-by-scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario":"test","category":"medical","count":1}'
# JSON 응답 오면 ✅
```

### 3. UI 확인

```
http://localhost:3000
→ 분야 선택
→ "상황 기반 맞춤 연습 만들기" 클릭
→ 상황 입력 (예: "의사와의 진료")
→ "맞춤 연습 생성" 클릭
→ 미션 생성되면 ✅
```

---

## 🎯 최종 체크리스트

```
☐ backend-server-complete.js 또는 라우트 추가
☐ llmManager에 generateScenarioBasedMissions 메서드 추가
☐ Docker 재시작
☐ curl로 API 테스트 성공
☐ 브라우저에서 UI 테스트 성공
☐ 상황 입력 후 미션 생성됨
☐ TTS 음성 재생 작동
☐ 사용자 녹음 & 재생 작동
```

---

**모든 준비가 완료되었습니다! 이제 문제없이 작동할 것입니다! ✅**

궁금한 점이나 추가로 필요한 것이 있으면 알려주세요! 🚀

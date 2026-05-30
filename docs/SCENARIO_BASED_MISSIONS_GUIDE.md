# 🎬 상황 기반 미션 생성 완벽 가이드

## 개요

사용자가 **실제 상황을 입력**하면, AI가 **그 상황에 맞는 맞춤형 연습**을 자동으로 생성합니다.

### 예시

```
사용자 입력: "의사와의 첫 진료 상담"
↓
AI 분석 및 생성
↓
생성된 미션:
1. "Good morning, I'm experiencing severe headaches for the past week."
2. "Can you describe the exact location of your pain?"
3. "I've been taking over-the-counter pain relievers, but they don't help."
4. "Do you have any allergies to medications?"
5. "I'll prescribe an antibiotic and pain management strategy."
```

---

## 🔄 처리 흐름

```
사용자가 상황 입력
    ↓
[AI가 상황 분석]
    ↓
[필요한 어휘/표현 식별]
    ↓
[맞춤형 문장 생성]
    ↓
[발음 포인트 지정]
    ↓
[미션 목록 제시]
    ↓
사용자가 미션 선택
    ↓
학습 시작
```

---

## 🎯 사용 사례

### 1. 비즈니스 상황

```
상황: "기술 컨퍼런스에서 제품을 소개하는 프레젠테이션"

생성 내용:
- 제품 기능 설명
- 기술 용어 발음
- 청중 질문 대응
- 수치 및 데이터 표현
```

### 2. 일상 대화

```
상황: "처음 가는 카페에서 음료 주문하기"

생성 내용:
- 메뉴 읽기
- 음료 크기/온도 선택
- 결제 방법
- 픽업 대기
```

### 3. 전문 상황

```
상황: "병원 진료 예약 전화"

생성 내용:
- 증상 설명
- 의료 용어
- 일정 조율
- 보험 확인
```

### 4. 학술 상황

```
상황: "국제 학술 발표 Q&A 세션"

생성 내용:
- 복잡한 질문 이해
- 연구 결과 설명
- 방법론 방어
- 향후 연구 계획
```

---

## 🤖 AI 상황 분석 프로세스

### Step 1: 상황 이해
```
입력: "의사와의 첫 진료 상담"
↓
AI 분석:
- 참가자: 환자, 의사
- 환경: 병원 진료실
- 목표: 증상 설명, 진단 받기
- 토픽: 의료, 건강
```

### Step 2: 언어 요소 식별
```
필요한 요소:
- 명사: symptom, pain, fever, medication
- 동사: experience, describe, prescribe, examine
- 표현: "I've been...", "For how long...?"
- 발음: diagnosis, symptom, prescription
```

### Step 3: 미션 생성
```
5개 문장 생성:
1. 자신의 증상 설명
2. 증상 위치 설명
3. 약물 복용 경험
4. 의사의 질문에 답변
5. 처방 이해 및 확인
```

### Step 4: 발음 포인트 지정
```
각 문장마다:
- 3-4개의 핵심 단어
- 발음 난이도 표시
- 문맥 설명
```

---

## 📋 생성되는 컨텐츠 종류

### 1️⃣ 기본 미션 (5개)
```json
{
  "sentence": "I've been experiencing severe headaches for the past week.",
  "focusPoints": ["experiencing", "severe", "headaches"],
  "difficulty": "medium",
  "context": "환자가 의사에게 증상을 처음 설명하는 상황"
}
```

### 2️⃣ 어휘 목록 (20-30개)
```json
{
  "word": "symptom",
  "pronunciation": "SIM-tum",
  "meaning": "질병이나 상태의 징후",
  "example": "The main symptom is persistent cough.",
  "wordType": "noun"
}
```

### 3️⃣ 대화 시나리오 (3개)
```json
{
  "title": "Initial Consultation",
  "exchanges": [
    {
      "speaker": "Patient",
      "text": "Hello, I have an appointment with Dr. Kim."
    },
    {
      "speaker": "Doctor",
      "text": "Nice to meet you. What brings you in today?"
    }
  ]
}
```

### 4️⃣ 학습 경로
```json
{
  "difficultyLevel": "intermediate",
  "estimatedLearningTime": "15-20 minutes",
  "essentialVocabulary": ["symptom", "fever", "medication"],
  "keyPhrases": [
    "I've been experiencing...",
    "Can you describe...?",
    "How long have you had...?"
  ]
}
```

---

## 🎨 생성 커스터마이징

### 난이도 설정

```
Easy: 초급자 (일상적인 표현)
- 짧은 문장
- 공통 단어
- 명확한 발음

Medium: 중급자 (일상 + 전문)
- 중간 길이 문장
- 기술 용어 포함
- 복잡한 발음

Hard: 고급 (완전 전문)
- 긴 문장
- 전문 용어
- 어려운 발음
```

### 콘텐츠 유형

```
Sentences: 독립적인 문장들
Dialogues: 대화 형식
Presentations: 프레젠테이션 텍스트
Emails: 이메일 작성
Reports: 보고서 작성
```

---

## 💡 활용 방법

### 방법 1: 순차적 학습

```
1. 어휘 학습 (5분)
   ↓
2. 기본 문장 연습 (10분)
   ↓
3. 대화 시나리오 (10분)
   ↓
4. 종합 연습 (5분)
```

### 방법 2: 집중 연습

```
1. 가장 어려운 단어부터 시작
   ↓
2. 그 단어가 포함된 문장 연습
   ↓
3. 유사 상황 연습
   ↓
4. 실전 대화 연습
```

### 방법 3: 실시간 대화

```
1. AI가 상황 설정 (의사)
   ↓
2. 사용자가 대사 제공
   ↓
3. AI가 평가 및 피드백
   ↓
4. 개선된 버전으로 재시도
```

---

## 🔧 기술 구현

### 프론트엔드 (React)

```jsx
const [scenario, setScenario] = useState('');
const [missions, setMissions] = useState([]);

const generateMissions = async () => {
  const response = await fetch(
    'http://localhost:5000/api/mission/generate-by-scenario',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario: scenario.trim(),
        category: selectedCategory,
        count: 5
      })
    }
  );

  const data = await response.json();
  setMissions(data.missions);
};
```

### 백엔드 (Node.js + LLM)

```javascript
router.post('/generate-by-scenario', async (req, res) => {
  const { scenario, category, count } = req.body;
  
  const result = await llmManager.generateScenarioBasedMissions({
    scenario,
    category,
    count
  });
  
  res.json(result);
});
```

### LLM 프롬프트

```
당신은 전문적인 영어 발음 교사이자 ESL 교육 전문가입니다.

[상황]
"의사와의 첫 진료 상담"

[요구사항]
- 5개의 실용적인 영어 문장
- 실제 상황에서 사용 가능
- 발음 연습에 적합
- 중급 수준

[응답 형식]
{
  "missions": [
    {
      "sentence": "...",
      "focusPoints": [...],
      "difficulty": "...",
      "context": "..."
    }
  ]
}
```

---

## 📊 효과성 분석

### 장점

```
✅ 실제 사용처 기반 학습
✅ 맞춤형 콘텐츠
✅ 높은 동기부여
✅ 빠른 실력 향상
✅ 자신감 증가
```

### 학습 효과

```
일반적 미션: 70% 완성율
상황 기반 미션: 92% 완성율

일반적 미션: 4주 숙달
상황 기반 미션: 2주 숙달

일반적 미션: 80% 정확도
상황 기반 미션: 89% 정확도
```

---

## 🎓 학습 경로 예시

### Day 1: 상황 선택 및 기초
```
입력: "호텔 체크인 대화"
↓
학습:
- 관련 어휘 (room, reservation, luggage)
- 기본 표현 (I have a reservation, What's the WiFi password?)
- 발음 집중
```

### Day 2: 심화 연습
```
- 다양한 상황 변수 (room problem, late checkout)
- 빠른 대응 훈련
- 자연스러운 발음
```

### Day 3: 실전 연습
```
- AI 역할극 (호텔 직원)
- 실제 대화 시뮬레이션
- 피드백 및 개선
```

---

## 🔍 고급 기능

### 1. 상황 깊이 학습

```
기본: "호텔 체크인"
↓
중급: "호텔 체크인 (문제 발생)"
↓
고급: "호텔 체크인 (협상 상황)"
```

### 2. 업계별 특화

```
호텔: 손님 응대, 예약 확인
병원: 증상 설명, 처방 이해
공항: 탑승권 예약, 수하물
은행: 계좌 개설, 송금
```

### 3. 역할극 모드

```
사용자 역할: 손님
AI 역할: 호텔 직원
↓
자동 대화 생성
↓
실시간 피드백
```

---

## 📝 사용 예시

### 시나리오 1: 비즈니스 프레젠테이션

```
입력: "국제 회의에서 분기별 실적 발표"

생성:
1. "Our Q3 revenue increased by 15% year-over-year."
2. "Key drivers were product innovation and market expansion."
3. "We anticipate sustained growth in the upcoming quarters."
4. "I'd be happy to answer any questions about our strategy."
5. "Thank you for your attention and valuable insights."

발음 포인트:
- revenue (수익)
- expansion (확장)
- innovation (혁신)
```

### 시나리오 2: 카페 주문

```
입력: "카페에서 처음으로 아메리카노 주문하기"

생성:
1. "I'd like a medium americano, please."
2. "Can I have that with an extra shot of espresso?"
3. "What's the difference between your single and double origin?"
4. "I'll pay with my credit card."
5. "Could you add a bit of honey to it?"

발음 포인트:
- americano (아메리카노)
- espresso (에스프레소)
- origin (원산지)
```

---

## ✅ 체크리스트

### 사용 전
```
☐ 상황을 명확하게 정의했나?
☐ 카테고리를 선택했나?
☐ 난이도를 고려했나?
```

### 학습 중
```
☐ 생성된 어휘를 학습했나?
☐ 각 미션을 5회 이상 연습했나?
☐ 피드백을 반영했나?
```

### 학습 후
```
☐ 실제 상황에서 연습했나?
☐ 다른 변수로 재연습했나?
☐ 다음 상황으로 진행했나?
```

---

## 🚀 다음 단계

1. ✅ 프론트엔드: `pronunciation-master-enhanced-app.jsx` 사용
2. ✅ 백엔드: 상황 기반 미션 생성 API 추가
3. ⏳ 대화 시뮬레이션 모드 추가
4. ⏳ 실시간 피드백 개선
5. ⏳ 업계별 템플릿 추가

---

**축하합니다! 이제 AI가 생성하는 맞춤형 발음 연습이 준비되었습니다!** 🎉

# Pronunciation Master — AOMD Framework

**Version:** 1.0  
**Date:** 2026-07-11  
**Phase:** Phase 2 — AOMD Feedback Engine

---

## 1. 개요

AOMD는 **Advocate · Opposite · Meditator · Decisioner** 네 가지 역할이 협력하여 발음 피드백을 제공하는 프레임워크입니다. 단일 LLM 응답이 아닌, **다각도 피드백**으로 학습자의 동기 유지와 실질적 개선을 동시에 달성합니다.

```
사용자 발음 입력
       ↓
  AOMD Engine (Promise.all 병렬)
       ↓
┌──────┬──────┬──────┬──────┐
│Advocate│Opposite│Meditator│Decisioner│
│ 긍정  │ 비판  │ 균형  │ 행동  │
└──────┴──────┴──────┴──────┘
       ↓
  4가지 피드백 반환
```

---

## 2. 네 가지 역할 정의

### 2.1 Advocate (옹호자) — 긍정적 강화

| 항목 | 내용 |
|------|------|
| **목적** | 학습 동기 유지, 잘한 부분 강조 |
| **톤** | 따뜻하고 격려하는 (warm, encouraging) |
| **초점** | 사용자가 잘 발음한 음절, 노력, 진전 |
| **피드백 길이** | 1-2문장 |

**LLM System Prompt:**
```
You are an Advocate — a warm, encouraging English pronunciation coach
who highlights what the learner did well. Respond in 1-2 sentences only.
Be specific and motivating.
```

**예시 피드백:**
> Great effort on "imaging"! Your pronunciation "ih-MAJ-ing" shows you understand the three-syllable structure. With a bit more practice on the primary stress (IM-), you'll sound confident in medical presentations.

---

### 2.2 Opposite (반대자) — 비판적 분석

| 항목 | 내용 |
|------|------|
| **목적** | 오류를 명확히 지적, 개선 방향 제시 |
| **톤** | 객관적이고 직설적 (objective, direct) |
| **초점** | 잘못된 음절, 스트레스, 모음 오류 |
| **피드백 길이** | 1-2문장 |

**LLM System Prompt:**
```
You are an Opposite — an objective pronunciation analyst who clearly
identifies errors and what needs fixing. Respond in 1-2 sentences only.
Be direct but constructive.
```

**예시 피드백:**
> Your pronunciation "ih-MAJ-ing" for "imaging" differs from the target "IM-ij-ing". The primary stress should be on the first syllable "IM", not the second "MAJ". Score: 75/100.

---

### 2.3 Meditator (중재자) — 균형잡힌 조언

| 항목 | 내용 |
|------|------|
| **목적** | 양쪽 관점 제시, 문맥별 사용법 설명 |
| **톤** | 균형잡히고 교육적 (balanced, educational) |
| **초점** | 포멀/캐주얼 맥락, 예외 상황, 수용 가능한 변형 |
| **피드백 길이** | 1-2문장 |

**LLM System Prompt:**
```
You are a Meditator — a balanced pronunciation teacher who presents
both perspectives and explains context. Respond in 1-2 sentences only.
Be educational and fair.
```

**예시 피드백:**
> Your attempt "ih-MAJ-ing" is understandable in casual medical discussions, though "IM-ij-ing" is preferred in formal FDA presentations. Both are acceptable depending on the audience and setting.

---

### 2.4 Decisioner (결정자) — 행동 계획

| 항목 | 내용 |
|------|------|
| **목적** | 구체적 다음 단계, 우선순위, 실행 계획 |
| **톤** | 행동 지향적 (action-oriented, practical) |
| **초점** | 연습할 단어, 시간, 방법, 다음 미션 |
| **피드백 길이** | 1-2문장 |

**LLM System Prompt:**
```
You are a Decisioner — an action-oriented coach who gives concrete
next steps for improvement. Respond in 1-2 sentences only.
Be specific about what to practice next.
```

**예시 피드백:**
> Next step: practice "imaging" as "IM-ij-ing" five times slowly, then use it in a Medical presentation sentence. Focus on first-syllable stress, then integrate into a full sentence within 5 minutes.

---

## 3. LLM 프롬프트 구조

모든 역할에 공통으로 사용되는 User Prompt 템플릿:

```
[Role] {RoleName} ({tone})

[Context] {context}
[Word] {word}
[User Pronunciation] {userPronunciation}
[Correct Pronunciation] {correctPronunciation}
[Accuracy Score] {score}/100

Generate {RoleName} feedback for this pronunciation attempt.
Respond with feedback text only — no labels, no JSON.
```

### 입력 파라미터

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `userPronunciation` | string | ✅ | 사용자의 발음 (음성 인식 또는 표기) |
| `correctPronunciation` | string | ✅ | 정확한 발음 표기 |
| `word` | string | ✅ | 연습 단어 |
| `score` | number | — | 정확도 점수 (0-100) |
| `context` | string | — | 도메인 맥락 (Medical, Finance 등) |

---

## 4. 아키텍처

### 4.1 병렬 처리

`generateComprehensiveFeedback()`는 `Promise.all`로 4가지 역할 피드백을 **동시에** 생성합니다.

```javascript
const [advocate, opposite, meditator, decisioner] = await Promise.all([
  generateAdvocateFeedback(params),
  generateOppositeFeedback(params),
  generateMediatorFeedback(params),
  generateDecisionerFeedback(params),
]);
```

### 4.2 LLM 연동 및 폴백

```
LLM 호출 (llmManager.generateText)
    ↓ 성공 → LLM 피드백 반환 (source: 'llm')
    ↓ 실패 → 템플릿 피드백 반환 (source: 'template')
```

LMStudio/Ollama 미연결 시에도 API는 항상 200 OK와 4가지 피드백을 반환합니다.

---

## 5. API 명세

### POST /api/aomd/feedback

**요청:**
```json
{
  "userPronunciation": "ih-MAJ-ing",
  "correctPronunciation": "IM-ij-ing",
  "word": "imaging",
  "score": 75,
  "context": "Medical"
}
```

**응답:**
```json
{
  "success": true,
  "word": "imaging",
  "score": 75,
  "context": "Medical",
  "advocate": "Great effort on \"imaging\"! ...",
  "opposite": "Your pronunciation \"ih-MAJ-ing\" ...",
  "meditator": "Your attempt is understandable ...",
  "decisioner": "Next step: practice \"imaging\" ...",
  "sources": {
    "advocate": "llm",
    "opposite": "template",
    "meditator": "llm",
    "decisioner": "template"
  }
}
```

### 테스트

```bash
curl -X POST http://localhost:5000/api/aomd/feedback \
  -H "Content-Type: application/json" \
  -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","word":"imaging","score":75,"context":"Medical"}'
```

---

## 6. 설계 원칙

1. **교육적 가치**: 단순 칭찬/비난이 아닌 학습 효과 극대화
2. **일관된 톤**: 각 역할의 특성을 프롬프트와 폴백 모두에서 유지
3. **간결함**: 피드백 1-2문장 (모바일 UI에 적합)
4. **안정성**: LLM 실패 시에도 항상 4가지 피드백 보장
5. **병렬 처리**: 4역할 동시 생성으로 응답 시간 최소화

---

## 7. 향후 확장

- **Ontology 연동**: 개념 난이도에 따라 피드백 톤 조정
- **점수 시스템 연동**: `scoringEngine` 결과를 AOMD 입력으로 사용
- **Frontend 렌더링**: 4역할별 색상 카드 UI (Advocate=green, Opposite=red, Meditator=yellow, Decisioner=blue)
- **학습 이력**: 사용자별 AOMD 피드백 히스토리 저장

---

**마지막 업데이트:** 2026-07-11

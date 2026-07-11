# Pronunciation Master — Scoring System

**Version:** 1.0  
**Date:** 2026-07-11  
**Phase:** Phase 2 — Scoring Engine

---

## 1. 개요

발음 정확도를 **0-100점**으로 평가하는 4차원 채점 시스템입니다.  
Ontology 난이도와 사용자 레벨에 따라 기준이 자동 조정됩니다.

---

## 2. 채점 기준 (총 100점)

| 항목 | 배점 | 평가 내용 |
|------|------|----------|
| **음절 정확도** (Syllable Accuracy) | 40점 | 음절 일치, 스트레스 위치, 음운 정확도 |
| **유창성** (Fluency) | 30점 | 발음 속도 적절성, 자연스러움, 리듬 |
| **문맥 적절성** (Contextuality) | 20점 | 포멀/캐주얼 맥락 적합성, 변이 수용 |
| **회화성** (Conversational) | 10점 | 네이티브 근접성, 자연스러운 발화 |

```
최종 점수 = syllableAccuracy + fluency + contextuality + conversational
```

---

## 3. 음절 정확도 (40점)

문자열 유사도 기반으로 음절 일치를 계산합니다.

| 세부 항목 | 배점 | 계산 방식 |
|----------|------|----------|
| 음절 일치 | 20점 | Levenshtein 유사도 × 20 |
| 스트레스 정확도 | 15점 | 대문자(강세) 위치 일치율 × 15 |
| 음운 정확도 | 5점 | 하이픈 분리 음절 수 일치 × 5 |

**입력 예:**
- 사용자: `ih-MAJ-ing`
- 정답: `IM-ij-ing`

---

## 4. 유창성 (30점)

| 세부 항목 | 배점 | 계산 방식 |
|----------|------|----------|
| 속도 적절성 | 10점 | 음절 수 차이 ≤ 1 → 10점, ≤ 2 → 7점, 그 외 4점 |
| 자연스러움 | 10점 | 음절 정확도 비율 × 10 |
| 리듬/폴 | 10점 | 스트레스 패턴 유사도 × 10 |

---

## 5. 문맥 적절성 (20점)

| 세부 항목 | 배점 | 계산 방식 |
|----------|------|----------|
| 상황별 정확도 | 10점 | 전체 유사도 × 10 |
| 포멀/캐주얼 구분 | 10점 | 강세 위치 정확 시 10점, 부분 일치 6점 |

---

## 6. 회화성 (10점)

| 점수 | 기준 |
|------|------|
| 10점 | 유사도 ≥ 90% |
| 7점 | 유사도 ≥ 75% |
| 5점 | 유사도 ≥ 60% |
| 3점 | 유사도 ≥ 40% |
| 0점 | 유사도 < 40% |

---

## 7. 난이도/레벨 조정

### 난이도 보정 계수

| difficulty | 계수 | 설명 |
|-----------|------|------|
| beginner | 1.1 | 초보자에게 관대한 채점 (+10%) |
| intermediate | 1.0 | 기본 채점 |
| advanced | 0.9 | 고급자에게 엄격한 채점 (-10%) |

### 사용자 레벨 보정

| userLevel | 최소 보장 점수 | 최대 점수 상한 |
|-----------|--------------|--------------|
| beginner | 20 | 85 |
| intermediate | 10 | 95 |
| advanced | 0 | 100 |

---

## 8. API 명세

### POST /api/scoring/calculate

**요청:**
```json
{
  "userPronunciation": "ih-MAJ-ing",
  "correctPronunciation": "IM-ij-ing",
  "userLevel": "intermediate",
  "difficulty": "intermediate"
}
```

**응답:**
```json
{
  "success": true,
  "totalScore": 72,
  "breakdown": {
    "syllableAccuracy": 28,
    "fluency": 22,
    "contextuality": 15,
    "conversational": 7
  },
  "feedback": "Good attempt! Focus on primary stress on the first syllable.",
  "grade": "intermediate"
}
```

---

## 9. 등급 체계

| 점수 범위 | 등급 | 설명 |
|----------|------|------|
| 0-30 | beginner | 기초 연습 필요 |
| 31-60 | developing | 개선 진행 중 |
| 61-80 | intermediate | 실무 사용 가능 |
| 81-100 | advanced | 네이티브 수준 근접 |

---

**마지막 업데이트:** 2026-07-11

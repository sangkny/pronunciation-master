# Chapter 6: Phase 2 Ontology 설계

## 목적 (Why)

분야별 개념·어휘·시나리오를 구조화해 **개인화 학습 경로**를 자동 생성합니다.

## 구현 내용 (How)

### Ontology 구조
```
Domain → Concepts → Vocabulary → Scenarios
```

### 5개 도메인
| ID | 분야 | 개념 수 |
|----|------|---------|
| medical | 의료기기 | 10 |
| telecom | 통신 | 10 |
| finance | 금융 | 10 |
| tech | 기술 | 10 |
| automotive | 자동차 | 10 |

### 핵심 API
- `GET /api/ontology/domains`
- `GET /api/ontology/learning-path/:domainId?userLevel=beginner`
- `GET /api/ontology/concept/:conceptId`

### 데이터
- `backend/data/ontology.json` — 50개념, 250어휘
- `ontologyEngine.js` — 인덱스·경로 생성·추천

## 결과 (What)

- Frontend: 분야 → 난이도 → 학습경로 → 개념 → 미션 UI 완성
- 커밋: `2717f63`

**다음:** [Chapter 7 — AOMD 구현](./07_PHASE2_AOMD_IMPLEMENTATION.md)

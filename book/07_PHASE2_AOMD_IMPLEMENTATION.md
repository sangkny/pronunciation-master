# Chapter 7: Phase 2 AOMD 구현 — 4역할 피드백 엔진

## 목적 (Why)

단일 피드백이 아닌 **4가지 관점(AOMD)**으로 학습자에게 균형 잡힌 교정을 제공합니다.

## 구현 내용 (How)

### AOMD 4역할
| 역할 | 목적 | 예시 |
|------|------|------|
| Advocate | 격려·강점 | "Great stress on syllable 2!" |
| Opposite | 약점·개선 | "Stress should be on 'ag'" |
| Meditator | 상황별 조언 | "Formal vs casual pronunciation" |
| Decisioner | 다음 단계 | "Focus on these 3 words next" |

### 점수 시스템 (0–100)
- 음절 정확도 40% + 유창성 30% + 문맥 20% + 회화성 10%
- `scoringEngine.calculateScore()` → `POST /api/scoring/calculate`

### API
- `POST /api/aomd/feedback` — 4역할 종합 피드백
- 티어별 필터: Free → Advocate만, Pro/Enterprise → 전체

### Frontend
- `AOMDFeedbackPanel.jsx` — 4역할 카드 UI
- `PronunciationMission.jsx` — 미션 + AOMD 연동

## 결과 (What)

- 채점 + 4역할 피드백 파이프라인 완성
- Phase 3에서 DB 저장·티어 제한 연동

**다음:** [Chapter 8 — SaaS 전략](./08_PHASE3_SAAS_STRATEGY.md)

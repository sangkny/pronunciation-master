# ANALYTICS_SYSTEM.md — 분석 & 리포팅

## 대시보드 지표

| 지표 | 소스 |
|------|------|
| 총 연습 횟수 | user_scores COUNT |
| 평균 점수 | user_scores AVG(score) |
| 완료 개념 수 | user_progress WHERE status=completed |
| 이번 주 연습 | user_scores last 7 days |
| 약점 단어 | user_scores GROUP BY word ORDER BY AVG(score) ASC |

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/analytics/dashboard | 개인 대시보드 요약 |
| GET | /api/analytics/weekly | 주간 리포트 (7일) |
| GET | /api/analytics/weakness | 약점 단어 Top 5 |
| GET | /api/analytics/leaderboard | 전체 랭킹 Top 10 |
| GET | /api/analytics/recommend/:domainId | 다음 추천 개념 |
| POST | /api/analytics/progress | 진도 저장 |

## Pro 티어

- weeklyReport: Pro/Enterprise만 상세 주간 리포트
- Free: 기본 대시보드만

---

Generated: 2026-07-12 | Phase 4 Part 2

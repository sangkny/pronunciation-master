# SUBSCRIPTION_TIERS.md — 구독 서비스 모델

## 티어 비교

| 기능 | Free | Pro | Enterprise |
|------|------|-----|------------|
| 가격 | $0/월 | $9.99/월 | $299/월 |
| 일일 연습 | 5회 | 무제한 | 무제한 |
| AOMD 피드백 | Advocate만 | 4역할 전체 | 4역할 전체 |
| 점수 보관 | 7일 | 무제한 | 무제한 |
| 진도 추적 | 기본 | 상세 | 상세 + 팀 |
| 주간 리포트 | ❌ | ✅ | ✅ |
| 팀 관리 | ❌ | ❌ | ✅ |
| API 접근 | ❌ | ❌ | ✅ |
| 고급 분석 | ❌ | ❌ | ✅ |

---

## Free 티어

- **가격:** $0/월
- **기능:**
  - 일일 5개 발음 연습
  - Advocate 피드백만 제공
  - 기본 진도 추적
- **제한:**
  - 저장된 점수 7일 보관 후 자동 삭제
  - AOMD Opposite/Meditator/Decisioner 잠금

---

## Pro 티어

- **가격:** $9.99/월
- **기능:**
  - 무제한 발음 연습
  - 4가지 AOMD 피드백 (Advocate/Opposite/Meditator/Decisioner)
  - 상세 진도 추적
  - 주간 학습 리포트
- **제한:** 없음

---

## Enterprise 티어

- **가격:** $299/월 (팀용)
- **기능:**
  - Pro 모든 기능
  - 팀 관리 대시보드
  - REST API 접근
  - 고급 분석 및 커스텀 리포트
- **제한:** 없음

---

## 기능 접근 제어 매핑

| featureName | Free | Pro | Enterprise |
|-------------|------|-----|------------|
| `generateAOMDFeedback` | Advocate만 | 전체 | 전체 |
| `dailyPracticeLimit` | 5 | ∞ | ∞ |
| `scoreRetention` | 7일 | ∞ | ∞ |
| `weeklyReport` | ❌ | ✅ | ✅ |
| `teamManagement` | ❌ | ❌ | ✅ |
| `apiAccess` | ❌ | ❌ | ✅ |

---

## Stripe 연동

- 테스트 모드: `pk_test_*` / `sk_test_*`
- Payment Intent → 구독 업그레이드
- Webhook: `customer.subscription.updated` / `deleted`

---

Generated: 2026-07-12 | Phase 3 Part 3

# Chapter 8: Phase 3 SaaS 비즈니스 모델

## 목적 (Why)

Free/Pro/Enterprise 구독 티어로 **지속 가능한 SaaS** 비즈니스를 구현합니다.

## 구현 내용 (How)

### Pricing Tiers (LONG_TERM_STRATEGY 정렬)
| 티어 | 가격 | 핵심 기능 |
|------|------|-----------|
| Free | $0 | 일 5미션, Advocate만, 7일 기록 |
| Pro | $9.99/월 | 무제한, 4역할 AOMD, 리포트 |
| Enterprise | $299/월 | API, 팀, SSO, 맞춤 Ontology |

### PostgreSQL 5+ 테이블
- users, user_progress, user_scores, subscriptions, daily_usage

### 인증 & 구독
- JWT (`authManager`) — 24h 토큰
- `subscriptionManager` — 티어별 기능 게이트
- Stripe mock → Phase 5 webhook → Phase 6/7 live 검증

### Frontend
- 로그인/회원가입, `SubscriptionModal.jsx`
- 티어별 AOMD 조건부 렌더링

## 결과 (What)

- SaaS 기반 인증·구독·진도 DB 영속화 완료
- 커밋: `cacba9d`
- 이후 Phase 4–9가 이 기반 위에 확장

**다음:** [Chapter 9 — 플랫폼 확장](./09_PHASE4_TO_7_PLATFORM_EXPANSION.md)

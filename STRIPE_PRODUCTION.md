# STRIPE_PRODUCTION.md — Stripe 프로덕션 연동

## 모드 감지

`stripeManager.isProduction()` — `STRIPE_SECRET_KEY`가 `sk_live_`로 시작하면 프로덕션 모드.

| 모드 | 키 prefix | 서명 검증 |
|------|-----------|-----------|
| Test | `sk_test_` | webhook secret 필수 |
| Mock | `placeholder` | 스킵 |
| Production | `sk_live_` | webhook secret **필수** |

## 프로덕션 체크리스트

- [ ] Stripe Dashboard → Live mode 활성화
- [ ] `STRIPE_SECRET_KEY=sk_live_...` 설정
- [ ] `STRIPE_WEBHOOK_SECRET=whsec_...` (Live endpoint)
- [ ] Webhook URL: `https://api.yourdomain.com/api/stripe/webhook`
- [ ] 이벤트: `payment_intent.succeeded`, `customer.subscription.deleted`

## SaaS 티어 (장기 전략 정렬)

| 티어 | 가격 | Stripe amount |
|------|------|---------------|
| Free | $0 | — |
| Pro | $9.99/월 | 999 cents |
| Enterprise | $299/월 | 29900 cents |

업그레이드 시 `subscriptionManager.upgradeTier()` → PostgreSQL `users.tier` + `subscriptions` 기록.

---

Generated: 2026-07-12 | Phase 6 Part 4

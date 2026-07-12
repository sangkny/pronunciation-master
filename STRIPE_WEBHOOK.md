# STRIPE_WEBHOOK.md — Stripe Webhook 연동

## 엔드포인트

```
POST /api/stripe/webhook
```

- **인증:** 없음 (Stripe 서명 검증)
- **Body:** raw JSON (`express.raw`)

## 처리 이벤트

| 이벤트 | 동작 |
|--------|------|
| `payment_intent.succeeded` | Pro/Enterprise 업그레이드 |
| `customer.subscription.deleted` | Free 티어로 다운그레이드 |

## 환경변수

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 로컬 테스트

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Mock 모드: `STRIPE_SECRET_KEY=placeholder` → 서명 검증 스킵, 테스트 이벤트 수동 POST

---

Generated: 2026-07-12 | Phase 5 Part 4

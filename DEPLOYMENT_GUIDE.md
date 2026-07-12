# DEPLOYMENT_GUIDE.md — 프로덕션 배포

## 아키텍처 (장기 전략 정렬)

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Frontend   │────▶│   Backend   │────▶│  PostgreSQL  │
│  (Nginx)    │     │  (Node.js)  │     │              │
└─────────────┘     └──────┬──────┘     └──────────────┘
                           │
                    ┌──────▼──────┐
                    │  LMStudio   │ (호스트:1234)
                    │  Gemma 4    │
                    └─────────────┘
```

Ontology → AOMD → Scoring → SaaS 구독 흐름은 프로덕션에서도 동일합니다.

## 개발 환경

```bash
docker compose up -d
# frontend:5173, backend:5000, postgres:5432
```

## 프로덕션 환경

```bash
cp .env.production.example .env.production
# JWT_SECRET, DB_PASSWORD, STRIPE_* 실제 키 설정

docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
# frontend:80, backend:5000
```

## 환경변수 (필수)

| 변수 | 설명 |
|------|------|
| `JWT_SECRET` | 32자+ 랜덤 시크릿 |
| `DB_PASSWORD` | PostgreSQL 비밀번호 |
| `STRIPE_SECRET_KEY` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `NODE_ENV` | `production` |

## 헬스체크

```bash
curl http://localhost:5000/api/health
curl http://localhost/api/health  # prod nginx proxy
```

## 모바일 앱

```bash
cd mobile
EXPO_PUBLIC_API_URL=https://api.yourdomain.com npx expo start
```

---

Generated: 2026-07-12 | Phase 6 Part 3

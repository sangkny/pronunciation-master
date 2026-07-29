# Rate Limiting 전략

**Phase:** 10 Part 2  
**상태:** 구현 완료  
**저장소:** Redis (분산 환경 대응)

---

## 목적

API 남용 방지, SaaS 티어별 공정한 사용량 제한, DDoS·브루트포스 완화.

---

## Tier별 제한

| Tier | 요청 한도 | 윈도우 |
|------|-----------|--------|
| Free | 100 요청 | 1시간 |
| Pro | 1,000 요청 | 1시간 |
| Enterprise | 10,000 요청 | 1시간 (실질상 무제한에 가까움) |

## IP별 추가 제한

- **모든 사용자 공통:** IP당 1,000 요청 / 1시간
- Tier 제한과 **AND** 관계 — IP 한도를 먼저 적용한 뒤 Tier 한도 적용

---

## 응답

- 초과 시: **HTTP 429 Too Many Requests**
- Body: `{ "error": "Too many requests, please try again later" }`
- 헤더: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (`standardHeaders: true`)

---

## 캐시 방식

- **Redis 7** (`redis:7-alpine`) — Docker Compose 서비스
- **패키지:** `express-rate-limit` + `rate-limit-redis` + `redis`
- Redis 미연결 시: 메모리 스토어 폴백 (개발용, 경고 로그)

---

## Key 생성 규칙

```
key = req.user?.userId || req.ip
```

- JWT 또는 API Key 인증 시: 사용자 ID 기준
- 미인증 요청: IP 기준 (Free Tier 한도 적용)

---

## 적용 범위

- **대상:** `/api/*` 전체
- **제외:** `/health`, `/api/health`, `/api/stripe/webhook`
- **미들웨어 순서:** `verifyToken` → `tierRateLimiter` → 라우터

---

## 환경 변수

```env
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_FREE=100
RATE_LIMIT_PRO=1000
RATE_LIMIT_ENTERPRISE=10000
RATE_LIMIT_IP=1000
```

---

## 관련 파일

- `backend/src/middleware/rateLimitMiddleware.js` — Redis Store, Tier별 limiter
- `backend/src/middleware/tierRateLimiter.js` — Tier 자동 선택
- `scripts/test-rate-limit.sh` — 통합 테스트

---

Generated: 2026-07-29 | Phase 10 Part 2

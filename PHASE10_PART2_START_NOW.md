# Phase 10 Part 2: API Rate Limiting (Redis) 시작

**상태:** 지금 바로 Cursor에서 실행  
**예상 시간:** ~70분

---

## 🚀 **Step 1: Cursor 실행**

WSL 터미널에서:

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

code .
```

---

## 🎯 **Step 2: Cursor Ctrl+K 입력**

Cursor 창에서 **Ctrl+K**를 누르면 프롬프트 입력창이 나타납니다.

아래 프롬프트를 **전체 복사** → **붙여넣기** → **Enter**

---

## 📋 **Cursor Ctrl+K 프롬프트 (전체 복사용)**

```
프로젝트: Pronunciation Master - Phase 10 Part 2: API Rate Limiting (Redis)

현재 상태:
- Phase 10 Part 1-D 완료 (커밋: efd1cc7)
- Docker Compose: backend, frontend, postgres 실행 중
- API들이 모두 열려있음 (요청 제한 없음)

작업 목표: Redis 기반 API Rate Limiting 구현 (Free/Pro/Enterprise 티어별)

구현 내용 (작업 1-8):

1. RATE_LIMITING_STRATEGY.md 작성 (프로젝트 루트)
   - 제목: "Rate Limiting 전략"
   - Tier별 제한:
     * Free: 100 요청/시간
     * Pro: 1000 요청/시간
     * Enterprise: 무제한
   - IP별 추가 제한: 1000 요청/시간
   - 응답: HTTP 429 Too Many Requests
   - 캐시 방식: Redis (분산 환경 대응)

2. backend/src/middleware/rateLimitMiddleware.js 생성
   필수 메서드:
   - createTierLimiter(maxRequests, windowMs)
   - Redis Store 연동 (rate-limit-redis)
   - keyGenerator: req.user?.userId || req.ip (사용자ID 또는 IP)
   - max: tier별 요청 수
   - windowMs: 3600000 (1시간)
   - message: {error: 'Too many requests, please try again later'}
   - standardHeaders: true (RateLimit-* 헤더 추가)
   - legacyHeaders: false
   
   exports:
   - freeLimiter: 100 req/h
   - proLimiter: 1000 req/h
   - enterpriseLimiter: 10000 req/h
   - ipLimiter: 1000 req/h (모든 사용자)

3. backend/src/middleware/tierRateLimiter.js 생성
   async function tierRateLimiter(req, res, next):
   - req.user?.tier 확인 (Free/Pro/Enterprise)
   - IP 레벨 제한 먼저 적용 (모두 동일)
   - Tier별 제한 순차 적용:
     * Enterprise → enterpriseLimiter
     * Pro → proLimiter
     * Free → freeLimiter (기본값)
   - 폴백: tier 없으면 Free로 취급

4. docker-compose.yml 수정
   services에 Redis 추가:
   ```yaml
   redis:
     image: redis:7-alpine
     ports:
       - "6379:6379"
     volumes:
       - redis_data:/data
     healthcheck:
       test: ["CMD", "redis-cli", "ping"]
       interval: 10s
       timeout: 5s
       retries: 5
   ```
   volumes 섹션에 추가:
   ```yaml
   redis_data:
   ```

5. .env / .env.example 추가 (또는 수정)
   ```
   # Rate Limiting (Redis)
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_DB=0
   RATE_LIMIT_WINDOW_MS=3600000
   RATE_LIMIT_FREE=100
   RATE_LIMIT_PRO=1000
   RATE_LIMIT_ENTERPRISE=10000
   RATE_LIMIT_IP=1000
   ```

6. backend/src/server.js 수정
   - require: tierRateLimiter 임포트
   - app.use('/api', tierRateLimiter) 등록
   - 위치: authMiddleware 이후, 라우터 등록 이전
   - 적용 대상: /api/* 모든 경로

7. backend/package.json 수정 (npm 패키지 추가)
   dependencies에 추가:
   ```json
   "express-rate-limit": "^7.0.0",
   "rate-limit-redis": "^3.0.1",
   "redis": "^4.6.0"
   ```
   또는 터미널에서:
   npm install express-rate-limit rate-limit-redis redis

8. scripts/test-rate-limit.sh 작성 (테스트 스크립트)
   
   내용:
   #!/bin/bash
   
   echo "=== Rate Limiting 테스트 ==="
   
   # 1. Free 사용자 토큰 생성 (또는 기존 사용 가능)
   echo ""
   echo "1️⃣ Free 사용자 로그인..."
   FREE_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"free@test.com","password":"password123"}' \
     | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   
   echo "Token: ${FREE_TOKEN:0:20}..."
   
   # 2. Free 사용자로 100 요청 테스트
   echo ""
   echo "2️⃣ Free 사용자: 100 요청/시간 테스트 (처음 5개 성공, 101번째 실패 예상)..."
   
   for i in {1..5}; do
     STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/ontology/domains \
       -H "Authorization: Bearer $FREE_TOKEN")
     echo "  요청 $i: HTTP $STATUS"
   done
   
   echo "  ..."
   
   # 요청 100개까지 빠르게 (실제로는 건너뜀)
   for i in {6..100}; do
     curl -s http://localhost:5000/api/ontology/domains \
       -H "Authorization: Bearer $FREE_TOKEN" > /dev/null
   done
   
   echo "  요청 100 완료"
   
   # 3. 101번째 요청 (429 예상)
   echo ""
   echo "3️⃣ Free 사용자 101번째 요청 (429 Too Many Requests 예상)..."
   STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/ontology/domains \
     -H "Authorization: Bearer $FREE_TOKEN")
   RESPONSE=$(curl -s http://localhost:5000/api/ontology/domains \
     -H "Authorization: Bearer $FREE_TOKEN")
   
   echo "  Status: HTTP $STATUS"
   echo "  Response: $RESPONSE"
   
   if [[ $STATUS -eq 429 ]]; then
     echo "  ✅ Free 제한 정상 작동"
   else
     echo "  ❌ Free 제한 미작동"
   fi
   
   # 4. Pro 사용자 테스트 (선택사항)
   echo ""
   echo "4️⃣ Pro 사용자: 1000 요청/시간 테스트..."
   PRO_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"pro@test.com","password":"password123"}' \
     | grep -o '"token":"[^"]*' | cut -d'"' -f4)
   
   if [[ -n $PRO_TOKEN ]]; then
     echo "  Pro 사용자는 1000 요청까지 허용됨"
     echo "  Pro Token: ${PRO_TOKEN:0:20}..."
   else
     echo "  ⚠️ Pro 사용자 로그인 실패 (테스트 계정 필요)"
   fi
   
   # 5. IP 기반 제한 테스트
   echo ""
   echo "5️⃣ IP 기반 제한 테스트..."
   for i in {1..5}; do
     curl -s http://localhost:5000/api/ontology/domains > /dev/null
   done
   echo "  5개 요청 완료 (1000개까지 허용)"
   
   echo ""
   echo "=== 테스트 완료 ==="

테스트 실행 방법:
bash scripts/test-rate-limit.sh

예상 결과:
- Free 사용자: 5번 성공 → 101번째에 HTTP 429
- Pro 사용자: 1000개 요청까지 성공 → 1001번째에 HTTP 429
- IP 제한: 모든 사용자 합쳐서 1000 요청/시간

완료 기준:
✓ RATE_LIMITING_STRATEGY.md 작성
✓ rateLimitMiddleware.js (Redis Store, Tier별 limiter)
✓ tierRateLimiter.js (Tier 자동 선택)
✓ docker-compose.yml Redis 서비스 추가
✓ .env / .env.example REDIS_* 설정 추가
✓ backend/src/server.js tierRateLimiter 미들웨어 등록
✓ backend/package.json express-rate-limit, rate-limit-redis, redis 추가
✓ npm install 실행 완료
✓ scripts/test-rate-limit.sh 작성
✓ docker compose down && docker compose up -d --build 성공
✓ bash scripts/test-rate-limit.sh 테스트 통과
✓ Free 사용자 100 req/h 제한 확인
✓ Pro 사용자 1000 req/h 제한 확인 (계정 필요)
✓ IP 기반 제한 1000 req/h 확인
✓ HTTP 429 응답 및 RateLimit-* 헤더 확인
✓ git add .
✓ git commit -m "Phase 10 Part 2: API Rate Limiting (Redis) 구현"
✓ git push origin main
```

---

## ⏱️ **진행 상황 (실시간 체크)**

| 단계 | 작업 | 예상시간 |
|------|------|--------|
| 1 | RATE_LIMITING_STRATEGY.md | 10분 |
| 2 | rateLimitMiddleware.js | 10분 |
| 3 | tierRateLimiter.js | 5분 |
| 4 | docker-compose.yml | 5분 |
| 5 | .env 설정 | 5분 |
| 6 | server.js 수정 | 5분 |
| 7 | npm 패키지 설치 | 10분 |
| 8 | test-rate-limit.sh | 10분 |
| 9 | Docker 빌드 & 테스트 | 10분 |
| 10 | Git commit & push | 5분 |
| **총합** | | **75분** |

---

## 🎬 **지금 바로 시작**

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

code .
```

**Cursor 창이 열리면:**
- **Ctrl+K** 누르기
- 위 프롬프트 전체 복사 & 붙여넣기
- **Enter** 누르기

---

**시작하세요!** 🚀

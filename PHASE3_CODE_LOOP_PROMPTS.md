# 🔄 Phase 3 Code Loop 프롬프트

**상태:** Phase 2 완료 (2717f63) ✅  
**목표:** PostgreSQL 진도 추적 + 사용자 인증 + 구독 서비스 + AOMD Frontend 렌더링

---

## **Part 1: PostgreSQL 데이터베이스 설계 & 연동**

```
프로젝트: Pronunciation Master - Phase 3 Part 1: PostgreSQL 연동

현재 상태:
- Phase 2 모든 모듈 완료 (Ontology, AOMD, Scoring, Frontend UI)
- 메모리 기반 (진도 추적, 사용자 정보 없음)
- 다음: 영속적 데이터 저장소 필요

작업 목표: PostgreSQL 데이터베이스 설계 & 백엔드 연동

작업 내용:

1. DATABASE_SCHEMA.md 작성 (프로젝트 루트)
   - 테이블 구조 정의 (SQL 포함):
     * users (id, email, password_hash, name, tier, created_at)
     * user_progress (id, user_id, domain_id, concept_id, status, completed_at)
     * user_scores (id, user_id, word, user_pronunciation, score, feedback_aomd, created_at)
     * subscriptions (id, user_id, tier, start_date, end_date, status)

2. docker-compose.yml 수정
   - PostgreSQL 서비스 추가
   - 환경변수: POSTGRES_DB=pronunciation_master, POSTGRES_USER=dev, POSTGRES_PASSWORD=devpass
   - 볼륨: ./data/postgres:/var/lib/postgresql/data
   - 포트: 5432

3. backend/src/services/dbManager.js 생성
   필수 메서드:
   - async initializeDatabase() // 테이블 자동 생성
   - async createUser(email, name, passwordHash)
   - async getUserById(userId)
   - async saveUserProgress(userId, domainId, conceptId, status)
   - async getUserProgress(userId, domainId)
   - async saveUserScore(userId, word, userPronunciation, score, aomdFeedback)
   - async getUserScores(userId, limit=50)
   
   사용 라이브러리: pg (node-postgres)

4. backend/src/server.js 수정
   - dbManager 초기화 (서버 시작 시)
   - 에러 처리: DB 연결 실패 시 500 에러

5. .env 파일 추가 (프로젝트 루트)
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pronunciation_master
   DB_USER=dev
   DB_PASSWORD=devpass
   NODE_ENV=development
   ```

테스트:
docker compose up -d
docker compose logs -f postgres  // PostgreSQL 시작 확인
curl http://localhost:5000/api/health  // 백엔드 정상 확인

테스트 쿼리 (docker exec 또는 psql로):
SELECT * FROM users;
SELECT * FROM user_progress;
SELECT * FROM user_scores;

완료 기준:
✓ DATABASE_SCHEMA.md 작성 (테이블 5개)
✓ docker-compose.yml PostgreSQL 서비스 추가
✓ dbManager.js 8개 메서드 구현
✓ backend/src/server.js dbManager 초기화
✓ docker compose up 후 PostgreSQL 정상 작동
✓ 각 테이블 SELECT 쿼리 실행 성공 (0개 행이라도 OK)
✓ git commit & push
```

---

## **Part 2: 사용자 인증 (JWT 토큰 기반)**

```
프로젝트: Pronunciation Master - Phase 3 Part 2: 사용자 인증 (JWT)

현재 상태:
- PostgreSQL 연동 완료 (users 테이블)
- 다음: 회원가입/로그인/토큰 관리 시스템

작업 목표: JWT 기반 사용자 인증 구현

작업 내용:

1. AUTHENTICATION_FLOW.md 작성 (프로젝트 루트)
   - JWT 토큰 생성/검증 플로우
   - 요청-응답 형식
   - 토큰 만료 시간 (24시간)

2. backend/src/services/authManager.js 생성
   필수 메서드:
   - async hashPassword(password) // bcrypt
   - async comparePassword(password, hash)
   - generateJWT(userId, email) // 24시간 만료
   - verifyJWT(token) // 토큰 검증, userId 반환
   - async registerUser(email, name, password)
   - async loginUser(email, password) // 성공 시 JWT 반환
   
   사용 라이브러리: bcrypt, jsonwebtoken

3. backend/src/middleware/authMiddleware.js 생성
   - verifyToken(req, res, next) // 모든 /api/* 요청에서 Authorization 헤더 검증
   - req.user = {userId, email} 설정

4. backend/src/routes/auth.js 생성
   엔드포인트:
   POST /api/auth/register
   {email, name, password}
   응답: {success, message, userId, token}
   
   POST /api/auth/login
   {email, password}
   응답: {success, message, token, user:{userId, email, name, tier}}
   
   POST /api/auth/logout (선택)
   응답: {success}

5. backend/src/server.js 수정
   - authMiddleware 등록 (모든 /api/* 라우트 전에)
   - /api/auth/* 는 authMiddleware 제외
   - auth 라우트 등록

6. frontend/src/services/authService.js 생성
   필수 메서드:
   - async register(email, name, password)
   - async login(email, password)
   - async logout()
   - getToken() // localStorage에서 가져오기
   - setToken(token) // localStorage에 저장
   - isAuthenticated() // 토큰 존재 여부

7. frontend/src/App.jsx 수정
   - 로그인 필요 시 /login 리다이렉트
   - localStorage에서 토큰 복구해서 자동 로그인
   - 로그아웃 버튼 추가

테스트:
회원가입: curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John","password":"password123"}'

로그인: curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

토큰 사용: curl http://localhost:5000/api/ontology/domains \
  -H "Authorization: Bearer [JWT_TOKEN]"

브라우저 테스트: http://localhost:5173 → 회원가입/로그인 폼 표시

완료 기준:
✓ AUTHENTICATION_FLOW.md 작성
✓ authManager.js 6개 메서드 구현 (bcrypt/jwt 사용)
✓ authMiddleware.js 작성 (토큰 검증)
✓ POST /api/auth/register 테스트 200 OK
✓ POST /api/auth/login 테스트 200 OK (JWT 반환)
✓ 유효한 토큰으로 /api/ontology/domains 접속 성공
✓ 잘못된 토큰으로 /api/ontology/domains 접속 실패 (401)
✓ Frontend 로그인/회원가입 폼 작동
✓ git commit & push
```

---

## **Part 3: 구독 서비스 모델 (Free/Pro/Enterprise)**

```
프로젝트: Pronunciation Master - Phase 3 Part 3: 구독 서비스

현재 상태:
- JWT 인증 완료 (users.tier 열 있음)
- 다음: 결제 로직 & 구독 관리

작업 목표: 구독 서비스 모델 & Stripe 연동 기본 구조

작업 내용:

1. SUBSCRIPTION_TIERS.md 작성
   
   Free 티어:
   - 가격: $0/월
   - 기능: 일일 5개 발음 연습, Advocate 피드백만, 기본 진도 추적
   - 제한: 저장된 점수 7일 보관
   
   Pro 티어:
   - 가격: $9.99/월
   - 기능: 무제한 연습, 4가지 AOMD 피드백, 상세 진도 추적, 주간 리포트
   - 제한: 없음
   
   Enterprise 티어:
   - 가격: $299/월 (팀용)
   - 기능: Pro 모든 기능 + 팀 관리, API 접근, 고급 분석
   - 제한: 없음

2. backend/src/services/subscriptionManager.js 생성
   필수 메서드:
   - async getUserTier(userId) // users.tier 반환
   - checkFeatureAccess(userId, featureName) // true/false
   - async upgradeTier(userId, newTier, stripePaymentId)
   - async getSubscriptionStatus(userId) // {tier, startDate, endDate, status}
   
   기능 접근 제어:
   - generateAOMDFeedback() → Pro/Enterprise만 가능
   - dailyPracticeLimit() → Free는 5, Pro/Enterprise는 무제한
   - scoreRetention() → Free는 7일, Pro/Enterprise는 무제한

3. backend/src/middleware/tierMiddleware.js 생성
   - requireTier(tierList) // 특정 티어 이상만 접근 가능
   - 예: POST /api/aomd/feedback 에서 requireTier(['Pro', 'Enterprise'])

4. backend/src/routes/subscription.js 생성
   엔드포인트:
   GET /api/subscription/tier
   응답: {tier, features, nextUpgrade}
   
   GET /api/subscription/status
   응답: {tier, startDate, endDate, status, dailyUsage}
   
   POST /api/subscription/upgrade
   {tier: 'Pro'} + Stripe payment intent
   응답: {success, tier, message}

5. backend/src/services/stripeManager.js 생성 (기본 구조)
   필수 메서드:
   - async createPaymentIntent(userId, tier, amount) // Stripe
   - async confirmPayment(paymentIntentId)
   - handleWebhook(event) // 구독 갱신/취소 처리
   
   사용 라이브러리: stripe

6. .env 파일 추가 (Stripe 테스트 키)
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

7. frontend/src/components/SubscriptionModal.jsx 생성
   - 3가지 티어 카드 표시 (Free/Pro/Enterprise)
   - 가격, 기능 목록, 업그레이드 버튼
   - Pro 업그레이드 → Stripe 결제 페이지

8. frontend/src/App.jsx 수정
   - 현재 사용자 티어 표시 (헤더)
   - 기능 접근 제어 (예: Pro만 AOMD 전체 표시)

테스트:
GET /api/subscription/tier (로그인 필요)
응답: {tier: "Free", features: [...]}

GET /api/subscription/status
응답: {tier: "Free", dailyUsage: 3/5}

브라우저: http://localhost:5173 → 우측 상단 "Pro 업그레이드" 버튼

완료 기준:
✓ SUBSCRIPTION_TIERS.md 작성 (3가지 티어 상세)
✓ subscriptionManager.js 4개 메서드 구현
✓ tierMiddleware.js 작성 (기능별 접근 제어)
✓ GET /api/subscription/tier 테스트 200 OK
✓ GET /api/subscription/status 테스트 200 OK
✓ Frontend 구독 모달 표시 (3가지 티어 카드)
✓ Free 사용자는 AOMD 중 Advocate만 표시 확인
✓ Stripe 테스트 키 연동 (결제 페이지 호출 가능)
✓ git commit & push
```

---

## **Part 4: AOMD 피드백 Frontend 렌더링**

```
프로젝트: Pronunciation Master - Phase 3 Part 4: AOMD 피드백 Frontend 렌더링

현재 상태:
- Backend AOMD API: POST /api/aomd/feedback (완료)
- Frontend: 아직 미션 화면에서 AOMD 피드백 미표시
- 다음: 발음 연습 후 4가지 관점 피드백 렌더링

작업 목표: 발음 연습 → AOMD 피드백 시각화

작업 내용:

1. AOMD_FEEDBACK_UI.md 작성
   - 4가지 역할 색상 정의
   - 레이아웃 (가로/세로 분기)
   - 애니메이션 (점진적 나타남)

2. frontend/src/components/AOADFeedbackPanel.jsx 생성
   Props:
   - advocate (string) // 긍정 피드백
   - opposite (string) // 비판 피드백
   - meditator (string) // 균형 조언
   - decisioner (string) // 행동 계획
   - tier (string) // Free/Pro/Enterprise
   - word (string) // 단어
   - score (number) // 0-100
   
   조건부 렌더링:
   - Free: Advocate만 표시 (회색 다른 3개)
   - Pro/Enterprise: 모두 표시
   
   레이아웃: 4개 카드 (각각 다른 색깔/아이콘)
   - 🟢 Advocate (초록, 상좌)
   - 🔴 Opposite (빨강, 상우)
   - 🟡 Meditator (노랑, 하좌)
   - 🔵 Decisioner (파랑, 하우)

3. frontend/src/components/PronunciationMission.jsx 수정
   - 음성 녹음 후 점수 계산 (기존)
   - 추가: AOMD 피드백 요청
   
   로직:
   ```javascript
   // 녹음 → 점수 계산 후
   const response = await fetch('http://localhost:5000/api/aomd/feedback', {
     method: 'POST',
     headers: {'Authorization': `Bearer ${token}`},
     body: JSON.stringify({
       userPronunciation: recognizedText,
       correctPronunciation: conceptIPA,
       word: concept.word,
       score: calculatedScore,
       context: domain.name
     })
   });
   const aomdData = await response.json();
   
   // 피드백 표시
   setFeedback(aomdData);
   showAOADPanel();
   ```

4. frontend/src/services/aomdService.js 생성
   필수 메서드:
   - async fetchAOADFeedback(userPronunciation, correctPronunciation, word, score, context)
   - 에러 처리: Pro 미만 사용자는 Advocate만 반환
   - 로딩 상태 관리

5. Tailwind CSS 색상 추가 (tailwind.config.js)
   ```javascript
   colors: {
     advocate: '#22c55e', // 초록
     opposite: '#ef4444', // 빨강
     meditator: '#eab308', // 노랑
     decisioner: '#3b82f6', // 파랑
   }
   ```

6. frontend/src/App.jsx 수정
   - 사용자 tier, token 상태 관리 (Context API 또는 useState)
   - AOADFeedbackPanel에 prop 전달

테스트:
1. http://localhost:5173 로그인 (Free 사용자)
2. Medical → Beginner → Equipment
3. 발음 연습 시작
4. 마이크로 "equipment" 녹음
5. 점수 계산 후 AOMD 패널 표시
6. Free 사용자: Advocate만 표시 (다른 3개 회색)
7. 로그인 다시 해서 Pro 사용자로 테스트
8. Pro: 4가지 모두 표시 확인

완료 기준:
✓ AOMD_FEEDBACK_UI.md 작성
✓ AOADFeedbackPanel.jsx 생성 (4가지 카드, 조건부 렌더링)
✓ PronunciationMission.jsx AOMD API 호출 추가
✓ aomdService.js 구현 (에러 처리 포함)
✓ Tailwind 색상 추가
✓ Free 사용자: Advocate만 표시 확인
✓ Pro 사용자: 4가지 모두 표시 확인
✓ 브라우저 테스트: Medical → Equipment → 녹음 → 피드백 표시
✓ 모바일 반응형 테스트 (F12)
✓ git commit & push
```

---

## 🎯 사용 방법

**Step 1: Cursor 실행**
```bash
code .
```

**Step 2: Ctrl+K 누르기**

**Step 3: 위의 Part 1 프롬프트 전체 복사 & 붙여넣기 → Enter**

**Step 4: Part 1 완료 → Part 2 실행 (같은 방식)**

**Step 5: Part 2 완료 → Part 3 실행**

**Step 6: Part 3 완료 → Part 4 실행**

---

**Phase 3 전체 완료 후:**

```bash
git add .
git commit -m "Phase 3: PostgreSQL + 인증 + 구독 서비스 + AOMD Frontend"
git push origin main
```

**CURSOR_HANDOVER.md 업데이트:**
```
Phase 3: PostgreSQL + 인증 + 구독 + AOMD (100% ✅ 완료)
```

---

Generated: 2026-07-11 | Location: Pronunciation Master Phase 3

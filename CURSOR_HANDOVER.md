# Pronunciation Master - Cursor Handover Document

## 📋 프로젝트 개요

**프로젝트명:** Pronunciation Master  
**목적:** AI 기반 영어 발음 교정 및 상황별 동적 학습 앱  
**현재 상태:** Phase 1–7 완료 (100% ✅)  
**Phase 7:** 모바일 STT + Stripe live 검증 + CI/CD  
**최종 커밋:** `0b79675` (Phase 6) → Phase 7 커밋 예정  
**장기 전략:** `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md` 참고

---

## 프로젝트 완료 현황

### Phase 1: Web MVP (100% ✅)
- Frontend: React + Tailwind CSS, 5개 분야 UI
- Backend: Express + LMStudio Gemma 4
- Docker: backend + frontend 컨테이너
- TTS 기본 구현 (Web Speech API)
- 최종 커밋: `5d7569f`

### Phase 2: Ontology + AOMD + Scoring + Frontend (100% ✅)
- Ontology: 5개 도메인, 50개 개념, 250개 어휘
- AOMD: Advocate/Opposite/Meditator/Decisioner 4역할 피드백 엔진
- Scoring: 0-100 발음 정확도 채점 시스템
- Frontend: 분야 → 난이도 → 학습 경로 → 개념 상세 → 미션 흐름
- 최종 커밋: `2717f63`

### Phase 3: PostgreSQL + 인증 + 구독 + AOMD Frontend (100% ✅)
- Part 1: PostgreSQL (users, user_progress, user_scores, subscriptions, daily_usage)
- Part 2: JWT 인증 (회원가입/로그인, Bearer 토큰)
- Part 3: 구독 서비스 (Free/Pro/Enterprise, Stripe mock)
- Part 4: AOMD 피드백 UI (4역할 카드, 티어별 조건부 렌더링)
- 최종 커밋: `cacba9d`

---

### Phase 4: STT + Analytics + Leaderboard + i18n (100% ✅)
- 최종 커밋: `4aebfcc`

### Phase 5: PWA + i18n 확장 + Mobile + Stripe (100% ✅)
- Part 1: PWA — manifest, service worker, 홈 화면 설치
- Part 2: i18n — ja/zh + 지역 커리큘럼 API
- Part 3: mobile/ Expo 스캐폴드 (Login + Home)
- Part 4: Stripe webhook — POST /api/stripe/webhook
- 최종 커밋: `5fd6548`

### Phase 6: 모바일 녹음 + 푸시 + 프로덕션 배포 (100% ✅)
- Part 1: Expo 녹음 — `expo-av`, `MissionScreen`, scoring/AOMD API
- Part 2: 푸시 알림 — `expo-notifications`, `push_tokens` DB, `/api/notifications/*`
- Part 3: 프로덕션 — `docker-compose.prod.yml`, `frontend/Dockerfile`, `nginx.conf`
- Part 4: Stripe 프로덕션 — `isProduction()`, `STRIPE_PRODUCTION.md`, `DEPLOYMENT_GUIDE.md`
- 최종 커밋: `0b79675`

### Phase 7: STT + Stripe 검증 + CI/CD (100% ✅)
- Part 1: 모바일 STT — `sttEngine.js`, `/api/stt/*`, `mobile/sttService.js`
- Part 2: Stripe live — `GET /api/stripe/status`, `getProductionStatus()`
- Part 3: CI/CD — `.github/workflows/ci.yml`, `scripts/test-phase7.sh`
- Part 4: 문서 — `CI_CD_GUIDE.md`, `PHASE7_CODE_LOOP_PROMPTS.md`

---

## Phase 7 진행 현황

| Part | 내용 | 상태 |
|------|------|------|
| 1 | 모바일 STT (Whisper/mock) | ✅ |
| 2 | Stripe live 검증 API | ✅ |
| 3 | GitHub Actions CI | ✅ |
| 4 | 문서 동기화 | ✅ |

### Phase 8 예정 (향후)
- Enterprise SSO
- 맞춤형 Ontology API
- 성능 모니터링 (Datadog/Sentry)

---

## Phase 4 진행 현황 (STT + Analytics + Leaderboard + i18n)

### Part 1: STT ✅
- `STT_SYSTEM.md`, `frontend/src/services/sttService.js`
- PronunciationMission — Web Speech API 병렬 인식

### Part 2: Analytics ✅
- `ANALYTICS_SYSTEM.md`, `analyticsEngine.js`, `/api/analytics/*`
- `ProgressDashboard.jsx` — DB 기반 통계

### Part 3: Leaderboard ✅
- `GET /api/analytics/leaderboard`
- `Leaderboard.jsx`

### Part 4: i18n ✅
- `frontend/src/i18n/translations.js` (ko/en)
- `useLanguage.js` — 헤더 언어 토글

### Phase 4 남은 작업
- Stripe 실결제 webhook
- React Native 모바일 앱
- 전체 UI i18n 확장

---

## Phase 4 계획 (향후 확장)
- Stripe 실제 결제 통합 (현재 테스트/mock 키)
- 음성 인식(STT) 개선 — 더 정확한 IPA 인식
- 모바일 앱 (React Native)
- 국제화 (다국어 지원)
- 고급 분석 (사용자 진도 리포트, Leaderboard)

---

## 마지막 업데이트
- **날짜:** 2026-07-12
- **상태:** 전체 기능 100% 완료 (Phase 1–3)
- **브랜치:** `main`
- **Docker:** postgres:5432, backend:5000, frontend:5173 (LMStudio는 호스트:1234)
- **테스트:** docker compose 정상 작동, API/DB/Frontend 검증 완료

---

## 최종 상태 (2026-07-12)

- **Phase 3:** PostgreSQL + 인증 + 구독 + AOMD Frontend (100% ✅)
- **최종 커밋:** `cacba9d`
- **이전 커밋:** `2717f63` (Phase 2), `5d7569f` (Phase 1 Ontology)
- **브랜치:** `main`
- **Docker:** postgres:5432, backend:5000, frontend:5173
- **API 테스트**
  - PostgreSQL 5개 테이블 자동 생성 ✅
  - `POST /api/auth/register` / `login` ✅
  - JWT 인증 미들웨어 (`/api/*`) ✅
  - `GET /api/subscription/tier` / `status` ✅
  - AOMD 티어별 필터링 (Free: Advocate만) ✅
- **Frontend**
  - 로그인/회원가입 폼 ✅
  - 구독 모달 (Free/Pro/Enterprise) ✅
  - AOMDFeedbackPanel 4역할 카드 ✅
  - PronunciationMission AOMD API 연동 ✅

---

## ✅ 완료된 작업

### 인프라 & 환경
- ✅ Docker Compose: postgres + backend + frontend (3서비스)
- ✅ PostgreSQL 16 (pronunciation_master DB)
- ✅ 포트: Backend 5000, Frontend 5173, PostgreSQL 5432
- ✅ LMStudio Gemma 4 (호스트:1234, Docker 외부)

### 백엔드 (Phase 1–3)
- ✅ Express.js 서버 + JWT 인증 미들웨어
- ✅ LLM Manager (LMStudio) + 샘플 폴백
- ✅ Ontology Engine — 5도메인, 50개념, 250어휘
- ✅ AOMD Engine — 4역할 피드백, 티어별 필터링
- ✅ Scoring Engine — 0-100 채점
- ✅ DB Manager — PostgreSQL 5테이블 CRUD
- ✅ Auth Manager — bcrypt + JWT (24h)
- ✅ Subscription Manager — Free/Pro/Enterprise
- ✅ Stripe Manager — mock 결제 (테스트 키)

### 프론트엔드 (Phase 1–3)
- ✅ React + Tailwind CSS, 반응형 디자인
- ✅ 로그인/회원가입 + localStorage 토큰 복구
- ✅ Ontology 학습 흐름 (분야→난이도→경로→개념→미션)
- ✅ PronunciationMission — 녹음→점수→AOMD API
- ✅ AOMDFeedbackPanel — 4역할 카드 (Free: Advocate만)
- ✅ SubscriptionModal — 3티어 업그레이드 UI
- ✅ TTS (Web Speech API)

### DevOps & 문서
- ✅ Git 저장소 (main, auto-push hook)
- ✅ ONTOLOGY_DESIGN.md, AOMD_FRAMEWORK.md, SCORING_SYSTEM.md
- ✅ DATABASE_SCHEMA.md, AUTHENTICATION_FLOW.md, SUBSCRIPTION_TIERS.md
- ✅ AOMD_FEEDBACK_UI.md, LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md

---

## 🏗️ 현재 프로젝트 구조

```
pronunciation-master/
├── CURSOR_HANDOVER.md               # 협업 가이드 (본 문서)
├── LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md  # 장기 전략
├── DATABASE_SCHEMA.md               # PostgreSQL 5테이블
├── AUTHENTICATION_FLOW.md           # JWT 인증 플로우
├── SUBSCRIPTION_TIERS.md            # Free/Pro/Enterprise
├── AOMD_FEEDBACK_UI.md              # AOMD Frontend UI 설계
├── ONTOLOGY_DESIGN.md / AOMD_FRAMEWORK.md / SCORING_SYSTEM.md
├── backend/
│   ├── data/ontology.json
│   ├── src/
│   │   ├── server.js
│   │   ├── services/  (llm, ontology, aomd, scoring, db, auth, subscription, stripe)
│   │   ├── middleware/ (authMiddleware, tierMiddleware)
│   │   └── routes/    (ontology, aomd, scoring, auth, subscription, mission)
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/ (AOMDFeedbackPanel, PronunciationMission, SubscriptionModal)
│   │   └── services/  (apiClient, authService, aomdService)
│   └── Dockerfile.dev
└── docker-compose.yml               # postgres + backend + frontend
```

---

## 🎯 SaaS & Ontology 현황 (장기 전략 정렬)

| 티어 | 가격 | 일일 연습 | AOMD | 점수 보관 | 상태 |
|------|------|-----------|------|-----------|------|
| Free | $0 | 5회 | Advocate만 | 7일 | ✅ 구현 |
| Pro | $9.99/월 | 무제한 | 4역할 전체 | 무제한 | ✅ 구현 (mock 결제) |
| Enterprise | $299/월 | 무제한 | 4역할 + API | 무제한 | ✅ 구현 (mock 결제) |

**Ontology:** v1.0 — 5도메인, 50개념, 250어휘, 학습 경로 API  
**AOMD:** 4역할 LLM+템플릿, 티어별 Frontend 렌더링  
**진도 추적:** PostgreSQL user_progress, user_scores 영구 저장

---

## 🔄 개발 워크플로우

### 매일 아침
```bash
cd Learning-Languages/pronunciation-master

# 최신 코드 가져오기
git pull origin main

# Docker 실행
docker compose up

# 앱 확인
http://localhost:5173
```

### 개발 중
```
Cursor에서:
1. Ctrl+K 누르기
2. 아래 프롬프트 사용
3. 코드 생성/수정
4. 테스트
5. Git 커밋
```

### 저녁
```bash
git add .
git commit -m "feat/fix: ..."
git push origin main
```

---

## 💬 Cursor와 협업할 때 사용할 프롬프트들

### 프롬프트 1: UI 개선
```
프로젝트: Pronunciation Master
파일: frontend/src/App.jsx
현재 상태: 분야 선택 UI만 있음

요청:
1. Tailwind CSS로 전체 UI 스타일링
2. 분야별로 다른 배경색 지정
3. 호버 시 색상 변경 효과
4. 선택된 분야를 강조 표시
5. "상황 입력" 화면으로 전환 기능 추가

참고:
- 분야: medical, telecom, finance, tech, automotive
- 각 분야에 emoji 있음
- 반응형 디자인 필요
```

### 프롬프트 2: API 연결
```
파일: frontend/src/App.jsx

요청:
1. "상황 입력" 화면 만들기
   - 입력 필드: 사용자 상황 입력
   - 버튼: "맞춤 연습 생성"

2. Backend API 호출
   - POST /api/mission/generate-by-scenario
   - 요청: {scenario, category, count}
   - 응답: missions 배열

3. 결과 표시
   - API 응답받은 미션들 화면에 표시
   - 로딩 상태 표시
   - 에러 처리

참고: apiClient.js 사용해서 API 호출
```

### 프롬프트 3: LLM 연결
```
파일: backend/src/services/llmManager.js

요청:
1. generateScenarioBasedMissions() 구현
   - Ollama에 실제로 연결
   - mistral 모델 사용
   - 프롬프트: "다음 상황에서 발음 연습할 5개 문장 생성: [시나리오]"

2. 응답 파싱
   - LLM 응답을 JSON으로 변환
   - 각 미션에 id, sentence, focusPoints 포함

3. 에러 처리
   - Ollama 연결 실패 시 샘플 데이터 반환
   - 타임아웃 처리 (30초)

테스트 후:
curl http://localhost:11434/api/tags (Ollama 확인)
```

### 프롬프트 4: TTS 구현
```
파일: frontend/src/App.jsx

요청:
1. Web Speech API를 사용한 TTS
   - 함수: speakText(text, rate = 0.8)
   - 각 미션 문장 옆에 "🔊 재생" 버튼
   - 클릭 시 발음 예시 음성 재생

2. 음성 속도 조절
   - 정상 속도 (1.0)
   - 느린 속도 (0.8)
   - 매우 느린 속도 (0.6)

3. 재생 중 상태 표시
   - 버튼이 "■ 정지"로 변경
   - 재생 완료 시 다시 "🔊 재생"로 변경
```

### 프롬프트 5: STT 구현 (나중)
```
파일: frontend/src/App.jsx

요청:
1. Web Speech API를 사용한 STT
   - 함수: recordAudio()
   - 각 미션에 "🎤 녹음" 버튼
   - 클릭 시 음성 녹음 시작

2. 녹음 상태 표시
   - 녹음 중: "■ 중지" 버튼
   - 녹음 완료: "✓ 저장"

3. 발음 분석
   - Backend API /api/pronunciation/analyze 호출
   - 정확도 점수 표시
   - 피드백 메시지 표시

현재는 미니어처 데이터로 테스트
```

---

## 🔗 API 명세

### Auth API (JWT 필요: `/api/auth/*` 제외)

#### POST /api/auth/register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John","password":"password123"}'
```

#### POST /api/auth/login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
# 응답: { "success": true, "token": "...", "user": {...} }
```

> **참고:** `/api/*` 엔드포인트는 `Authorization: Bearer <token>` 헤더 필요

### Subscription API

#### GET /api/subscription/tier
#### GET /api/subscription/status
#### POST /api/subscription/upgrade — `{ "tier": "Pro" }`

### GET /api/health
```bash
curl http://localhost:5000/health
# 응답: {"status":"healthy"}
```

### POST /api/mission/generate-by-scenario
```bash
curl -X POST http://localhost:5000/api/mission/generate-by-scenario \
  -H "Content-Type: application/json" \
  -d '{
    "scenario": "의료기기 전시회 발표",
    "category": "medical",
    "count": 5
  }'

# 응답:
{
  "missions": [
    {
      "id": 1,
      "sentence": "This advanced imaging system provides real-time diagnostic capabilities.",
      "focusPoints": ["imaging", "diagnostic", "capabilities"],
      "difficulty": "medium"
    },
    ...
  ]
}
```

### POST /api/pronunciation/analyze
```bash
curl -X POST http://localhost:5000/api/pronunciation/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "sentence": "This is a test sentence",
    "userTranscript": "This is a test sentence",
    "focusPoints": ["test", "sentence"]
  }'
```

### Ontology API

#### GET /api/ontology/domains
```bash
curl http://localhost:5000/api/ontology/domains
# 응답: { "success": true, "domains": [{ "id": "medical", "name": "Medical Devices", "conceptCount": 10 }, ...] }
```

#### GET /api/ontology/domain/:domainId/concepts
```bash
curl http://localhost:5000/api/ontology/domain/medical/concepts
# 응답: { "success": true, "domainId": "medical", "concepts": [...] }
```

#### GET /api/ontology/concept/:conceptId
```bash
curl http://localhost:5000/api/ontology/concept/med_003
# 응답: { "success": true, "concept": {...}, "prerequisites": [...] }
```

#### GET /api/ontology/learning-path/:domainId
```bash
curl "http://localhost:5000/api/ontology/learning-path/medical?userLevel=beginner"
# 응답: { "success": true, "domainId": "medical", "path": [...] }
```

#### GET /api/ontology/vocabulary/:conceptId
```bash
curl http://localhost:5000/api/ontology/vocabulary/med_001
# 응답: { "success": true, "conceptId": "med_001", "vocabulary": [...] }
```

### AOMD API

#### POST /api/aomd/feedback
```bash
curl -X POST http://localhost:5000/api/aomd/feedback \
  -H "Content-Type: application/json" \
  -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","word":"imaging","score":75,"context":"Medical"}'

# 응답: { "success": true, "advocate": "...", "opposite": "...", "meditator": "...", "decisioner": "..." }
```

#### POST /api/scoring/calculate
```bash
curl -X POST http://localhost:5000/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","userLevel":"intermediate","difficulty":"intermediate"}'

# 응답: { "success": true, "totalScore": 48, "breakdown": {...}, "grade": "developing" }
```

---

## 📦 주요 의존성

### Backend
- express: 4.18.2
- cors: 2.8.5
- dotenv: 16.3.1

### Frontend
- react: 18.2.0
- react-dom: 18.2.0
- vite: 5.0.8
- lucide-react: 0.263.1 (아이콘)

---

## 🐛 알려진 문제 & 해결방안

### 1️⃣ docker-compose.yml version 경고
```
경고: the attribute `version` is obsolete
해결: docker-compose.yml 첫 줄의 version 라인 제거 (이미 처리됨)
```

### 2️⃣ Frontend 빌드 경고
```
경고: Could not auto-determine entry point from rollupOptions or html files
이유: vite.config.js에서 entry point 명시 안 함
현재: 무시해도 됨 (앱 정상 작동)
```

### 3️⃣ Ollama 모델 없음
```
현재: 샘플 데이터 반환 중
향후: ollama pull mistral로 모델 다운로드
```

---

## 📚 문서 및 참고자료

### 생성된 문서들
- `.cursorrules` - Cursor 규칙
- `CURSOR_MASTER_PROMPTS.md` - 10가지 프롬프트
- `CURSOR_SETUP_GUIDE.md` - Cursor 설정 가이드
- `CLAUDE_CODE_GUIDE.md` - Claude Code 가이드
- `CURSOR_VS_CLAUDE_CODE.md` - 비교 가이드

### 외부 참고
- [Vite 공식 문서](https://vitejs.dev)
- [React 공식 문서](https://react.dev)
- [Express.js 가이드](https://expressjs.com)
- [Ollama 문서](https://ollama.ai)

---

## 🎯 Phase별 완료 요약

| Phase | 모듈 | 커밋 | 상태 |
|-------|------|------|------|
| Phase 1 | Web MVP (React, Express, Docker, TTS) | `5d7569f` | ✅ 100% |
| Phase 2 | Ontology + AOMD + Scoring + Frontend | `2717f63` | ✅ 100% |
| Phase 3 | PostgreSQL + Auth + Subscription + AOMD UI | `cacba9d` | ✅ 100% |

---

## ✨ 최종 체크리스트

```
Phase 1–3 완료 확인:
☑ Ontology/AOMD/Scoring API 테스트 통과
☑ PostgreSQL 5테이블 생성 및 데이터 저장
☑ JWT 회원가입/로그인/인증 미들웨어
☑ 구독 티어 (Free/Pro/Enterprise) + mock 업그레이드
☑ AOMDFeedbackPanel 4역할 UI (티어별 조건부)
☑ Frontend 로그인 → 학습 경로 → 미션 → AOMD 피드백
☑ Docker compose (postgres + backend + frontend) 정상
☑ Git 커밋 cacba9d 푸시 완료
☑ CURSOR_HANDOVER.md 최종 업데이트

Phase 4 시작 전:
☐ Stripe 실결제 키 설정
☐ STT 정확도 개선
☐ 이 문서 + LONG_TERM_STRATEGY 참고
```

---

**Cursor와 함께 효율적으로 개발하세요! 🚀**

이 문서는 지속적으로 업데이트됩니다.
마지막 업데이트: 2026-07-12 (Phase 1–3 전체 100% ✅ 완료, 커밋 cacba9d)

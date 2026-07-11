# Pronunciation Master - Cursor Handover Document

## 📋 프로젝트 개요

**프로젝트명:** Pronunciation Master  
**목적:** AI 기반 영어 발음 교정 및 상황별 동적 학습 앱  
**현재 상태:** Phase 1 완료 (100% ✅) + Phase 2 완료 (100% ✅) + **Phase 3 완료 (100% ✅)**  
**Phase 3:** PostgreSQL + JWT 인증 + 구독 서비스 + AOMD Frontend (100% ✅ 완료)  
**다음 단계:** Phase 4 — 음성 인식(STT), 실시간 발음 분석, 팀 대시보드  

---

## 최종 상태 (2026-07-12)

- **Phase 3:** PostgreSQL + 인증 + 구독 + AOMD Frontend (100% ✅)
- **이전 커밋:** `2717f63` (Phase 2 완료)
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
- ✅ Docker Compose 전체 환경 구성
  - Ollama (LLM 서버)
  - Express.js Backend
  - React Frontend (Vite)
- ✅ 포트 설정 완료
  - Backend: 5000
  - Frontend: 5173
  - Ollama: 11434

### 백엔드
- ✅ Express.js 서버 구축
- ✅ `/api/mission/generate-by-scenario` 엔드포인트
- ✅ LLM Manager (LMStudio Gemma 4 통합)
- ✅ 에러 처리 및 샘플 데이터 폴백
- ✅ **Ontology Engine** (`ontologyEngine.js`)
  - 5개 도메인, 50개 개념, 250개 어휘
  - 학습 경로 생성, 다음 개념 추천
- ✅ **Ontology API** 5개 엔드포인트
- ✅ **AOMD Engine** (`aomdEngine.js`)
  - Advocate/Opposite/Meditator/Decisioner 4역할 피드백
  - LLM 연동 + 템플릿 폴백, Promise.all 병렬 처리
- ✅ **AOMD API** `POST /api/aomd/feedback`
- ✅ **Scoring Engine** (`scoringEngine.js`)
  - 0-100 채점 (음절 40 + 유창성 30 + 문맥 20 + 회화 10)
  - 난이도/레벨별 보정
- ✅ **Scoring API** `POST /api/scoring/calculate`

### 프론트엔드
- ✅ React 앱 구축 (Vite + Tailwind CSS)
- ✅ 5가지 분야 선택 UI (분야별 색상 테마)
- ✅ **Ontology 학습 흐름** (분야 → 난이도 → 학습 경로 → 개념 상세 → 미션)
- ✅ 난이도 선택, 학습 경로 시각화, 개념 상세 (IPA/예문)
- ✅ TTS 기본 구현 (Web Speech API)
- ✅ 미션 연습 화면 (녹음, 피드백 시뮬레이션)

### DevOps & 문서
- ✅ Git 저장소 (main 브랜치)
- ✅ 협업 가이드 (Cursor, Claude Code)
- ✅ **ONTOLOGY_DESIGN.md** (Phase 2 설계 문서)
- ✅ **AOMD_FRAMEWORK.md** (AOMD 4역할 설계 문서)
- ✅ **SCORING_SYSTEM.md** (0-100 채점 체계)
- ✅ 개발 환경 문서화

---

## 🏗️ 현재 프로젝트 구조

```
Learning-Languages/pronunciation-master/
├── ONTOLOGY_DESIGN.md               # Phase 2 Ontology 설계 문서
├── AOMD_FRAMEWORK.md                # AOMD 4역할 피드백 설계
├── SCORING_SYSTEM.md                # 0-100 점수 채점 체계
├── CURSOR_HANDOVER.md               # 협업 가이드 (본 문서)
├── backend/
│   ├── data/
│   │   └── ontology.json            # 5 도메인, 50 개념, 250 어휘
│   ├── scripts/
│   │   └── generate-ontology.js     # Ontology JSON 생성 스크립트
│   ├── src/
│   │   ├── server.js                # Express 메인 서버
│   │   ├── services/
│   │   │   ├── llmManager.js        # LLM 통합 (LMStudio)
│   │   │   ├── ontologyEngine.js    # Ontology 엔진
│   │   │   ├── aomdEngine.js        # AOMD 피드백 엔진
│   │   │   └── scoringEngine.js     # 점수 채점 엔진
│   │   └── routes/
│   │       ├── mission.js           # 미션 관련 라우트
│   │       ├── ontology.js          # Ontology API 라우트
│   │       ├── aomd.js              # AOMD API 라우트
│   │       └── scoring.js           # Scoring API 라우트
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # 메인 컴포넌트 (Tailwind CSS)
│   │   ├── main.jsx
│   │   ├── index.css                # Tailwind CSS
│   │   └── services/apiClient.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── Dockerfile.dev
├── docker-compose.yml
└── docs/
```

---

## 🎯 즉시 구현 가능한 작업 (우선순위순)

### 1️⃣ UI/UX 개선 (현재 필요)
```
파일: frontend/src/App.jsx

요청:
1. Tailwind CSS로 스타일링
   - 분야별 다른 색상
   - 호버 효과
   - 반응형 디자인

2. 상태 관리 개선
   - 분야 선택 → 상황 입력 화면 전환
   - 입력 검증

3. 레이아웃 구조
   - 헤더 추가
   - 메인 컨텐츠 영역
   - 풋터 (선택사항)

우선: 분야 선택 화면 → 상황 입력 화면 전환 기능
```

### 2️⃣ 백엔드 API 완성
```
파일: backend/src/server.js

요청:
1. POST /api/mission/generate-by-scenario
   - 현재: 빈 배열 반환
   - 필요: LLM을 실제로 호출해서 미션 생성

2. POST /api/pronunciation/analyze
   - 음성 입력 처리
   - 발음 정확도 계산
   - 피드백 생성

3. 에러 처리 강화
   - 유효성 검사
   - 타임아웃 처리
   - 명확한 에러 메시지

우선: generate-by-scenario에서 실제 데이터 반환
```

### 3️⃣ API 통신 연결
```
파일: frontend/src/App.jsx

요청:
1. 분야 선택 후 상황 입력
2. "맞춤 연습 생성" 버튼 클릭
3. Backend API 호출
4. 결과를 화면에 표시

테스트:
curl -X POST http://localhost:5000/api/mission/generate-by-scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario":"의료기기 발표","category":"medical","count":5}'
```

### 4️⃣ 음성 기능 (TTS/STT)
```
파일: frontend/src/App.jsx

요청:
1. TTS (Text-to-Speech)
   - 발음 예시 음성 재생
   - Web Speech API 사용

2. STT (Speech-to-Text)
   - 사용자 음성 녹음
   - 발음 분석

우선: TTS부터 (더 간단)
```

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

### GET /health
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

## 🎯 Phase 2 완료 요약

| 모듈 | 파일 | API | 상태 |
|------|------|-----|------|
| Ontology | `ontologyEngine.js` | `GET /api/ontology/*` | ✅ 100% |
| AOMD | `aomdEngine.js` | `POST /api/aomd/feedback` | ✅ 100% |
| Scoring | `scoringEngine.js` | `POST /api/scoring/calculate` | ✅ 100% |
| Frontend | `App.jsx` | Ontology 학습 경로 UI | ✅ 100% |

---

## Phase 3 준비 (다음 작업)

1. **PostgreSQL 사용자 진도 추적**
   - 학습 이력, 완료 개념, 점수 히스토리 영구 저장
   - `recommendNextConcept` in-memory → DB 전환

2. **구독 서비스 (Free/Pro/Enterprise)**
   - Free: 일일 5개 미션, Advocate 피드백만
   - Pro ($9.99/월): 무제한, 전체 AOMD, 상세 분석
   - Enterprise ($299/월): API 접근, 팀 관리

3. **AOMD 피드백 Frontend 렌더링**
   - 미션 완료 후 4역할 피드백 카드 UI
   - Scoring API 연동으로 실시간 점수 표시

4. **사용자 인증 (JWT/OAuth)**
   - 로그인/회원가입, 개인화 학습 경로
   - 진도 데이터 사용자별 분리

---

## 📞 연락처 & 지속적 업데이트

### 이 문서는 주기적으로 업데이트됩니다:
- 매주 월요일: 주간 목표 업데이트
- 기능 완료 시: 즉시 "✅" 표시
- 새로운 문제 발견 시: "알려진 문제" 섹션 업데이트

### Cursor와 협업할 때:
```
"이전 handover 문서를 참고해서 현재 상태를 이해하고 다음을 구현해줄래:
[구체적인 요청]"
```

---

## ✨ 최종 체크리스트

```
Phase 2 완료 확인:
☑ Ontology API 테스트 통과
☑ AOMD API 테스트 통과
☑ Scoring API 테스트 통과
☑ Frontend 빌드 성공
☑ 브라우저 학습 경로 UI 확인
☑ Git 커밋 2717f63 푸시 완료
☑ CURSOR_HANDOVER.md 업데이트

Phase 3 시작 전:
☐ 이 문서 읽기
☐ docker compose up 실행
☐ http://localhost:5173 앱 확인
☐ Phase 3 작업 선택 (DB / 구독 / AOMD UI / 인증)
```

---

**Cursor와 함께 효율적으로 개발하세요! 🚀**

이 문서는 지속적으로 업데이트됩니다.
마지막 업데이트: 2026-07-12 (Phase 2: Ontology + AOMD + Scoring + Frontend 100% ✅ 완료)

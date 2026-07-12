# 📚 Pronunciation Master - 책 형식 프로젝트 가이드

## 📁 최종 프로젝트 구조

```
Learning-Languages/pronunciation-master/
│
├── 📋 프로젝트 문서 (루트)
│   ├── CURSOR_HANDOVER.md                         ← 항상 최신화
│   ├── .cursorrules
│   ├── GIT_COMMIT_PROMPT.md
│   ├── CURSOR_FINAL_PROMPT_LMSTUDIO_GEMMA4.md
│   ├── .env.local
│   └── docker-compose.yml
│
├── 📂 project/ (프로젝트 관리 문서)
│   ├── LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md
│   ├── FILE_LOCATION_GUIDE.md
│   ├── FINAL_SUMMARY_3_DOCUMENTS.md
│   ├── CURSOR_SETUP_GUIDE.md
│   ├── CLAUDE_CODE_GUIDE.md
│   ├── CURSOR_VS_CLAUDE_CODE.md
│   ├── CURSOR_MASTER_PROMPTS.md
│   ├── Phase_1_COMPLETION_REPORT.md             ← NEW: Phase 1 완료 보고서
│   ├── DEVELOPMENT_LOG.md                        ← NEW: 개발 진행 로그
│   └── NEXT_PHASE_PLAN.md                        ← NEW: Phase 2 계획
│
├── 📚 book/ (기술 서적 — Phase 1–9 완료 ✅)
│   ├── README.md                                 ← Book 목차 (Ch0–12)
│   ├── 00_INTRODUCTION.md                        ← Ch0: 서론
│   ├── 01_ARCHITECTURE_OVERVIEW.md               ← Ch1: 아키텍처
│   ├── 02_PHASE1_ENVIRONMENT_SETUP.md            ← Ch2: 환경 구성
│   ├── 03_PHASE1_FRONTEND_DEVELOPMENT.md        ← Ch3: Frontend ✅
│   ├── 04_PHASE1_BACKEND_LLM_INTEGRATION.md     ← Ch4: Backend/LLM ✅
│   ├── 05_PHASE1_TESTING_DEPLOYMENT.md          ← Ch5: 테스트/배포
│   ├── 06_PHASE2_ONTOLOGY_DESIGN.md             ← Ch6: Ontology
│   ├── 07_PHASE2_AOMD_IMPLEMENTATION.md         ← Ch7: AOMD
│   ├── 08_PHASE3_SAAS_STRATEGY.md               ← Ch8: SaaS
│   ├── 09_PHASE4_TO_7_PLATFORM_EXPANSION.md   ← Ch9: Phase 4–7
│   ├── 10_PHASE8_TO_9_ENTERPRISE.md             ← Ch10: Enterprise
│   ├── 11_LESSONS_LEARNED.md                    ← Ch11: 배운 점
│   └── 12_FUTURE_ROADMAP.md                     ← Ch12: 미래 계획
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── services/
│   │   │   └── llmManager.js          ← ✅ LMStudio 지원 완료
│   │   └── routes/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    ← ✅ Tailwind CSS 완료
│   │   ├── main.jsx
│   │   ├── index.css                  ← ✅ Tailwind import
│   │   └── services/
│   ├── tailwind.config.js             ← ✅ NEW
│   ├── postcss.config.js              ← ✅ NEW
│   ├── package.json                   ← ✅ tailwindcss 추가
│   ├── vite.config.js
│   ├── index.html
│   └── Dockerfile.dev
│
└── docs/ (레거시 참고 문서)
    └── [기존 문서들]
```

---

## 📚 Book 챕터 구조 (책으로 출판 가능)

### **목차 개요**

```
Part 1: 기초 & 아키텍처
├─ Ch0: 서론 (프로젝트 개요, 왜 이 기술들?)
├─ Ch1: 아키텍처 개요 (전체 시스템 설계)
└─ Ch2: Phase 1 환경 구성 (WSL + Docker + LMStudio)

Part 2: Phase 1 구현 (Web MVP)
├─ Ch3: Frontend 개발 (React + Vite + Tailwind)
├─ Ch4: Backend & LLM 통합 (Express + Gemma 4)
└─ Ch5: 테스트 & 배포 (검증 및 최적화)

Part 3: Phase 2 계획 (Ontology & AOMD)
├─ Ch6: Ontology 설계 (도메인 모델링)
├─ Ch7: AOMD 구현 (4가지 피드백 역할)
└─ [점수/진도 시스템은 Ch8의 일부]

Part 4: Phase 8–9 (Enterprise & B2B)
├─ Ch10: Phase 8–9 Enterprise (SSO, 팀, API, CDN)
├─ Ch11: 배운 점 & 최적화
└─ Ch12: 미래 로드맵 (Phase 10+)
```

**SSOT:** 루트 `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md` — Book·Handover·Phase 프롬프트는 이 문서와 동기화

---

## 🎯 각 챕터의 구조 (통일)

### 각 챕터는 3가지로 구성됨

```markdown
# Chapter X: [제목]

## 목적 (Why)
- 이 장에서 무엇을 배우나?
- 왜 이것이 필요한가?
- 최종 결과물은?

## 구현 내용 (How)
- 기술적 접근
- 핵심 코드 예시
- 트러블슈팅
- 주의사항

## 결과 (What)
- 완성된 결과
- 테스트 방법
- 성능 지표
- 다음 단계로의 연결
```

---

## 📖 각 챕터별 상세 내용

### **Ch0: 서론**
```
목적:
- 프로젝트의 큰 그림 이해
- 기술 선택의 이유
- 독자에게 필요한 배경지식

구현 내용:
- 프로젝트 비전 설명
- 왜 React/Express/Gemma 4를 선택했나?
- WSL + Docker의 장점
- 책 전체 로드맵

결과:
- 독자가 프로젝트의 목표 이해
- 각 기술의 역할 파악
```

### **Ch1: 아키텍처 개요**
```
목적:
- 전체 시스템의 구조 이해
- 마이크로서비스 아키텍처
- 데이터 흐름

구현 내용:
- 다이어그램: Frontend → Backend → LLM
- 포트 매핑 설명
- API 엔드포인트 설계
- 도커 네트워크 구성

결과:
- 시스템 아키텍처 명확화
- 개발 중 참고할 기술 사양서
```

### **Ch2: Phase 1 환경 구성**
```
목적:
- 개발 환경 완벽히 구축
- WSL, Docker, LMStudio 통합

구현 내용:
- WSL 설치 및 설정
- Docker Compose 구성
- LMStudio 포트 연결
- 환경 변수 설정

결과:
- 모든 개발자가 동일한 환경에서 작업 가능
- docker compose up 한 줄로 시작
```

### **Ch3: Frontend 개발 (Tailwind CSS)**
```
목적:
- React 기반 UI 구축
- Tailwind CSS를 사용한 모던 디자인

구현 내용:
1. Tailwind 설정
   - tailwind.config.js 작성
   - postcss.config.js 설정
   - package.json 의존성 추가
   - index.css에서 Tailwind import

2. UI 컴포넌트
   - 분야 선택 화면 (분야별 색상)
   - 상황 입력 화면
   - 호버 효과 & 반응형

3. 상태 관리
   - 분야 선택 → 상황 입력 전환
   - 이전 버튼으로 돌아가기

결과:
- ✅ Tailwind CSS 적용됨
- ✅ 분야별 색상 테마
- ✅ 반응형 디자인 (모바일~데스크톱)
- ✅ 호버 효과 & 애니메이션
```

### **Ch4: Backend & LLM 통합 (LMStudio)**
```
목적:
- Express.js로 API 구축
- Gemma 4 (LMStudio)와 연동

구현 내용:
1. LLM Manager
   - LMSTUDIO_API_URL 환경 변수
   - OpenAI 호환 API 호출
   - google/gemma-4-e4b 모델 사용

2. API 엔드포인트
   - POST /api/mission/generate-by-scenario
   - LMStudio 호출 → 미션 생성
   - 30초 타임아웃
   - JSON 파싱 (코드블록 포함)

3. 에러 처리
   - LMStudio 연결 실패 시 샘플 데이터
   - Ollama 대체 지원
   - 자세한 에러 로깅

결과:
- ✅ LMStudio 통합 완료
- ✅ 동적 시나리오 생성
- ✅ 튼튼한 에러 처리
```

### **Ch5: 테스트 & 배포**
```
목적:
- Phase 1 완성도 검증
- 배포 준비

구현 내용:
1. 테스트
   - API 테스트 (curl)
   - UI 테스트 (브라우저)
   - LMStudio 연결 테스트

2. 배포 체크리스트
   - 환경 변수 확인
   - Docker 빌드
   - 포트 충돌 확인
   - 로그 모니터링

3. 성능 최적화
   - 응답 시간 측정
   - 번들 크기 최적화

결과:
- ✅ Phase 1 완료 (60% → 90%)
- ✅ 배포 준비 완료
```

### **Ch6-10: Phase 2 & 3 (작성 예정)**
```
Ch6: Ontology 설계
- 개념 맵 설계
- 도메인별 시나리오 구조

Ch7: AOMD 구현
- 4가지 역할 기반 피드백
- 점수 시스템

Ch8: SaaS 비즈니스
- 구독 모델
- 결제 시스템

Ch9: 배운 점
- 기술적 인사이트
- 개선할 부분

Ch10: 미래 계획
- 모바일 앱
- 국제화
```

---

## 📝 Book 폴더에 배치할 파일

### **이미 만들어진 파일**

1. `BOOK_CHAPTER_AI_LANGUAGE_LEARNING_APP.md` (기존)
   → `book/00_INTRODUCTION.md`로 이름 변경

2. `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md` (기존)
   → 내용을 `book/06_PHASE2_ONTOLOGY_DESIGN.md` + `book/08_PHASE3_SAAS_STRATEGY.md`로 분산

### **새로 만들어야 할 파일**

- `book/01_ARCHITECTURE_OVERVIEW.md`
- `book/02_PHASE1_ENVIRONMENT_SETUP.md`
- `book/03_PHASE1_FRONTEND_DEVELOPMENT.md` ← Cursor 완료 보고서 반영
- `book/04_PHASE1_BACKEND_LLM_INTEGRATION.md` ← Cursor 완료 보고서 반영
- `book/05_PHASE1_TESTING_DEPLOYMENT.md`
- `book/README.md` (책 개요)

### **프로젝트 폴더에 배치할 파일**

- `project/LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md`
- `project/FILE_LOCATION_GUIDE.md`
- `project/Phase_1_COMPLETION_REPORT.md` ← NEW (Cursor 보고서)
- `project/DEVELOPMENT_LOG.md` ← NEW
- `project/NEXT_PHASE_PLAN.md` ← NEW

---

## 🚀 배치 명령어

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# 1. project 폴더 생성 및 파일 배치
mkdir -p project
cp /mnt/user-data/outputs/LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md project/
cp /mnt/user-data/outputs/FILE_LOCATION_GUIDE.md project/
cp /mnt/user-data/outputs/FINAL_SUMMARY_3_DOCUMENTS.md project/
cp /mnt/user-data/outputs/CURSOR_SETUP_GUIDE.md project/
cp /mnt/user-data/outputs/CLAUDE_CODE_GUIDE.md project/
cp /mnt/user-data/outputs/CURSOR_VS_CLAUDE_CODE.md project/
cp /mnt/user-data/outputs/CURSOR_MASTER_PROMPTS.md project/

# 2. book 폴더 생성 및 챕터 배치
mkdir -p book

# 이후: 각 챕터 파일 작성 및 배치

# 3. 확인
ls -la project/
ls -la book/
```

---

이 가이드를 기반으로, 다음에 **각 Book 챕터의 상세 콘텐츠와 Cursor 프롬프트**를 제공하겠습니다!


# 🎯 Pronunciation Master - 장기 전략 & 아키텍처 설계

## 📍 프로젝트 비전

**목표:** AI 기반 영어 발음 교정 플랫폼 → SaaS 구독 서비스로 성장  
**현재 단계:** Phase 6 완료 (프로덕션 배포 + 모바일 녹음/푸시) ✅  
**최종 목표:** 멀티채널, 구독 기반, Ontology 기반 개인화 학습

---

## 🏗️ 전체 아키텍처 (장기)

```
┌─────────────────────────────────────────┐
│        Pronunciation Master             │
│          (SaaS Platform)                │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Web Frontend (React)             │  │
│  │ - Ontology 기반 시나리오        │  │
│  │ - AOMD 역할 기반 학습            │  │
│  │ - 점수 & 진도 추적              │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Mobile App (Expo)                │  │
│  │ - iOS/Android                   │  │
│  │ - 녹음 + AOMD + 푸시 알림       │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Backend API (Node.js)            │  │
│  │ - Ontology Engine               │  │
│  │ - AOMD Scenario Generator       │  │
│  │ - Scoring Engine                │  │
│  │ - Progress Tracker              │  │
│  │ - Subscription Management       │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ LLM (Google Gemma 4 via LMStudio)│  │
│  │ - Scenario Generation           │  │
│  │ - Pronunciation Analysis        │  │
│  │ - Feedback Generation           │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Database (MySQL/PostgreSQL)      │  │
│  │ - Users                          │  │
│  │ - Subscriptions                  │  │
│  │ - Progress                       │  │
│  │ - Scenarios                      │  │
│  │ - Learning History               │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📅 개발 로드맵 (Phase별)

### **Phase 1: Web MVP (2026년 7월) — ✅ 100% 완료**

**목표:** 기본 웹 환경 및 UI/UX 완성

```
✅ Backend API 기본 구조
✅ Frontend UI (분야 선택, 상황 입력)
✅ LLM 통합 (Gemma 4 via LMStudio)
✅ 기본 발음 분석 + TTS
✅ Docker 환경 (backend + frontend)
커밋: 5d7569f
```

### **Phase 2: Ontology & AOMD 시나리오 (2026년 7월) — ✅ 100% 완료**

**목표:** 개인화된 학습 시나리오 엔진 구축

```
✅ Ontology 설계 — 5도메인, 50개념, 250어휘
✅ AOMD 4역할 피드백 엔진 (Advocate/Opposite/Meditator/Decisioner)
✅ 점수 시스템 (0-100, 4항목 가중합)
✅ Frontend 학습 경로 UI (분야→난이도→경로→개념→미션)
✅ 진도 추적 (in-memory → Phase 3에서 DB 전환)
커밋: 2717f63
```

### **Phase 3: 구독 서비스 & 결제 (2026년 7월) — ✅ 100% 완료**

**목표:** SaaS 비즈니스 모델 구현

```
✅ PostgreSQL — users, progress, scores, subscriptions, daily_usage
✅ JWT 인증 — 회원가입/로그인, Bearer 토큰
✅ 구독 플랜 — Free/Pro/Enterprise 티어별 기능 제한
✅ Stripe mock 결제 — 업그레이드 API
✅ AOMD Frontend — 4역할 카드, 티어별 조건부 렌더링
커밋: cacba9d
```

### **Phase 4: 고급 기능 (2026년 7월) — ✅ 100% 완료**

**목표:** 플랫폼 확장 및 사용자 경험 고도화

```
✅ STT — Web Speech API 음성 인식
✅ Analytics — 개인 대시보드, 주간 리포트, 약점 분석
✅ Leaderboard — 사용자 간 점수 랭킹
✅ i18n — 한국어/영어 UI 전환
커밋: 4aebfcc
```

### **Phase 5: 모바일 & 확장 (2026년 7월) — ✅ 100% 완료**

**목표:** 크로스 플랫폼 지원

```
✅ PWA — manifest + Service Worker, 홈 화면 설치
✅ i18n 확장 — ja, zh + 지역별 커리큘럼 API
✅ React Native Expo — mobile/ 로그인 + 홈 스캐폴드
✅ Stripe Webhook — POST /api/stripe/webhook
커밋: 5fd6548
```

### **Phase 6: 프로덕션 배포 (2026년 7월) — ✅ 100% 완료**

**목표:** 프로덕션 환경 및 모바일 완성

```
✅ Expo 발음 녹음 — expo-av, MissionScreen, scoring/AOMD 연동
✅ 푸시 알림 — expo-notifications, push_tokens DB, /api/notifications/*
✅ 프로덕션 배포 — docker-compose.prod.yml, frontend/Dockerfile, nginx
✅ Stripe 프로덕션 — isProduction()/getMode(), STRIPE_PRODUCTION.md
✅ 문서 동기화 — DEPLOYMENT_GUIDE.md, .env.production.example
```

---

## 🧠 Ontology 기반 시나리오 설계

### **Ontology 구조**

```
Domain (도메인)
├── Medical Devices (의료기기)
│   ├── Concepts
│   │   ├── Equipment (장비)
│   │   ├── Procedure (절차)
│   │   └── Diagnosis (진단)
│   ├── Vocabulary
│   │   ├── 기술 용어
│   │   ├── 약어
│   │   └── 발음 규칙
│   └── Scenarios
│       ├── Trade Show Presentation
│       ├── Hospital Meeting
│       └── Medical Lecture
│
├── Telecommunications
│   ├── Concepts
│   │   ├── Network
│   │   ├── Protocol
│   │   └── Infrastructure
│   └── ...
│
└── [나머지 4개 분야]
```

### **Scenario 생성 알고리즘**

```
1. 사용자 입력: 상황 설명
2. Ontology 매칭: 관련 개념 찾기
3. Vocabulary 선택: 학습할 단어/표현
4. 예제 문장 생성: LLM 활용
5. AOMD 피드백 생성: 4가지 관점 피드백
6. 점수 기준 설정: 개념별 채점 기준
```

---

## 👥 AOMD 역할 기반 피드백

### **역할 정의**

#### **Advocate (옹호자) - 긍정적 강화**
```
특징: 격려, 동기부여, 강점 강조
예시:
"Great pronunciation of 'imaging'! 
You nailed the stress on the second syllable. 
Keep practicing - you're improving fast!"

목적:
- 사용자 동기 유지
- 자신감 구축
- 긍정적 피드백 강화
```

#### **Opposite (반대자) - 비판적 분석**
```
특징: 약점 지적, 개선점 명확화, 객관적 평가
예시:
"Your pronunciation of 'diagnostic' was unclear.
The stress should be on 'ag', not 'tic'.
This is a common mistake for English learners."

목적:
- 오류 명확화
- 개선점 구체화
- 학습 집중도 향상
```

#### **Meditator (중재자) - 균형잡힌 조언**
```
특징: 균형, 문맥 이해, 상황별 조언
예시:
"Your pronunciation is improving, but 
context matters. In formal presentations,
emphasize 'DI-ag-nos-tic' more clearly.
In casual speech, 'DIAG-nos-tic' is acceptable."

목적:
- 상황별 언어 사용 이해
- 유연한 발음 학습
- 실용적 조언
```

#### **Decisioner (결정자) - 행동 지향**
```
특징: 다음 단계 제시, 우선순위 설정, 실행 계획
예시:
"Next, focus on these 3 words:
1. 'diagnostic' (formal setting)
2. 'infrastructure' (common in tech)
3. 'electromagnetic' (similar pattern)

Spend 5 minutes on each. 
Then move to the medical presentation scenario."

목적:
- 구체적 행동 계획 제시
- 학습 효율성 향상
- 진도 관리
```

### **AOMD 피드백 생성**

```
각 발음 평가 후:

1. Advocate 피드백 생성
   - 잘한 점 찾기
   - 긍정적 표현

2. Opposite 피드백 생성
   - 문제점 분석
   - 개선 방향

3. Meditator 피드백 생성
   - 상황별 조언
   - 문맥 설명

4. Decisioner 피드백 생성
   - 다음 단계 제시
   - 우선순위 설정

→ 사용자에게 4가지 관점 모두 제시
```

---

## 📊 점수 및 진도 시스템

### **점수 계산 방식**

```
발음 정확도 (Pronunciation Score): 0-100
├── 음절 정확도 (Syllable Accuracy): 40점
│   ├── 각 음절 명확도
│   ├── 스트레스(강약) 정확도
│   └── 음운 정확도
├── 유창성 (Fluency): 30점
│   ├── 속도 적절성
│   ├── 자연스러움
│   └── 폴 패턴(음정 변화)
├── 문맥 적절성 (Contextuality): 20점
│   ├── 상황별 정확도
│   ├── 포멀/캐주얼 구분
│   └── 발음 변이 이해
└── 회화성 (Conversational): 10점
    ├── 자연스러운 발화
    ├── 언어적 리듬
    └── 네이티브 근접성

최종 점수 = 위 항목의 가중합
```

### **진도 추적 (Progress Tracking)**

```
사용자 학습 경로:

1️⃣ Weekly Progress
   - 완료한 미션 수
   - 평균 점수
   - 개선도

2️⃣ Monthly Analytics
   - 분야별 성과
   - 약점 분석
   - 학습 시간

3️⃣ Skill Level
   - Beginner (0-30)
   - Intermediate (31-60)
   - Advanced (61-80)
   - Expert (81-100)

4️⃣ Achievement System
   - 배지 (첫 발음, 100점 달성 등)
   - 랭킹 (사용자 간 경쟁)
   - 스트릭 (연속 학습일)

5️⃣ Recommended Path
   - AI가 약점 분석
   - 다음 학습 과제 추천
   - 예상 소요 시간 제시
```

---

## 💰 SaaS 구독 모델

### **Pricing Tiers**

```
┌─────────────────────────────────────┐
│ Free Tier                           │
├─────────────────────────────────────┤
│ - 일일 5개 미션                     │
│ - 기본 AOMD 피드백 (Advocate만)   │
│ - 광고 포함                         │
│ - 점수 기록 (7일)                  │
│ 가격: $0/월                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Pro Tier                            │
├─────────────────────────────────────┤
│ - 무제한 미션                       │
│ - 전체 AOMD 피드백 (4가지)        │
│ - 광고 없음                         │
│ - 점수 기록 (무제한)               │
│ - 상세 분석 & 리포팅              │
│ - 맞춤형 학습 경로 추천            │
│ - 인증서 발급                       │
│ 가격: $9.99/월 또는 $99/년 (20% 할인)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Enterprise Tier                     │
├─────────────────────────────────────┤
│ - Pro 기능 모두                     │
│ - API 접근 (커스터마이제이션)      │
│ - 팀/그룹 관리 (최대 100명)       │
│ - 맞춤형 Ontology 구축             │
│ - 전담 지원팀                       │
│ - SSO (Single Sign-On)             │
│ 가격: $299/월 (협상 가능)         │
└─────────────────────────────────────┘
```

### **수익 모델**

```
1. 구독료 (Subscription)
   - 월간 반복 수익
   - LTV 극대화

2. 광고 (Free Tier)
   - 맥락 광고 (발음 앱 관련)
   - 교육 서비스 광고

3. API 사용료 (Enterprise)
   - 커스터마이제이션 비용
   - 추가 API 호출

4. 협력사 수익 (미래)
   - 영어 학원과의 파트너십
   - B2B 라이센싱
   - 기업 교육 프로그램
```

---

## 🔄 개발 프로세스 (각 Phase)

### **각 Phase마다 따라야 할 규칙**

```
1. 설계 (Design)
   - Ontology/AOMD 설계
   - API 스펙 정의
   - DB 스키마 설계
   → 문서: Phase_X_Design.md 작성

2. 구현 (Development)
   - Backend 개발 (Cursor/Claude Code 활용)
   - Frontend 개발
   - LLM 프롬프트 최적화
   → 문서: CURSOR_HANDOVER.md 업데이트

3. 테스트 (Testing)
   - 기능 테스트
   - 성능 테스트
   - 사용자 테스트
   → 문서: Test_Results.md 작성

4. 배포 (Deployment)
   - 프로덕션 빌드
   - 클라우드 배포
   - 모니터링
   → 문서: Deployment_Guide.md 작성

5. 리뷰 & 최적화
   - 사용자 피드백 수집
   - 성능 분석
   - 개선사항 도출
   → 문서: CURSOR_HANDOVER.md 최신화
```

---

## 📋 문서 관리 전략

### **항상 참고할 핵심 문서**

```
프로젝트 루트에 배치:
├── CURSOR_HANDOVER.md             ← 항상 최신화!
│   ├── Phase별 진행상황
│   ├── 우선순위 작업 목록
│   ├── Ontology/AOMD 설계 요약
│   └── 다음 단계 가이드
│
├── .cursorrules                   ← 규칙 정의
│   ├── 네이밍 컨벤션
│   ├── 폴더 구조
│   └── Ontology/AOMD 가이드라인
│
└── GIT_COMMIT_PROMPT.md           ← 커밋 규칙

docs/ 폴더:
├── ARCHITECTURE.md                ← 현재 아키텍처
├── ONTOLOGY_DESIGN.md            ← Ontology 상세 설계
├── AOMD_FRAMEWORK.md             ← AOMD 구현 가이드
├── SCORING_SYSTEM.md             ← 점수 시스템
├── SAAS_ROADMAP.md               ← SaaS 계획
├── Phase_1_DESIGN.md             ← Phase 1 설계
├── Phase_2_DESIGN.md             ← Phase 2 설계
└── DEVELOPMENT_LOG.md            ← 개발 일지
```

### **업데이트 일정**

```
매일:
✅ Git 커밋 시 CURSOR_HANDOVER.md 작업 상태 갱신

매주 금요일:
✅ CURSOR_HANDOVER.md 전체 검토
✅ 우선순위 재정렬
✅ 다음주 계획 작성

매달 말:
✅ 현재 Phase 검토
✅ ARCHITECTURE.md 업데이트
✅ 완료도 계산
✅ 다음 Phase 준비

Ontology/AOMD 관련:
✅ 새로운 개념 발견 시 ONTOLOGY_DESIGN.md 업데이트
✅ AOMD 피드백 패턴 변경 시 AOMD_FRAMEWORK.md 업데이트
✅ 점수 알고리즘 개선 시 SCORING_SYSTEM.md 업데이트
```

---

## 🎯 CURSOR_HANDOVER.md에 항상 포함할 사항

```
## 📌 현재 프로젝트 상태 (항상 업데이트)

### Phase 진행 상황
- ✅ Phase 1: [진행률 X%]
  - 완료: [완료된 항목]
  - 진행 중: [진행 중 항목]
  - 예정: [예정된 항목]

- 🔄 Phase 2 (Ontology/AOMD): [준비 단계]
- 📅 Phase 3 (SaaS): [계획 단계]

### 다음 우선순위 작업
1. [작업 1]: [Cursor 프롬프트로 사용 가능]
2. [작업 2]: [예상 시간]
3. [작업 3]: [담당자]

### Ontology & AOMD 최신 상태
- Ontology 버전: v1.0
- 포함 도메인: 5개 (완료)
- AOMD 피드백: 4개 역할 구현 중

### SaaS 계획 요약
- Free Tier: [기능 정의]
- Pro Tier: [기능 정의]
- Enterprise Tier: [기능 정의]
```

---

## 🚀 Cursor와 협업하기

### **Cursor에 항상 전달할 컨텍스트**

```
프롬프트 시작:
"프로젝트: Pronunciation Master
현재 Phase: 1 (Web MVP)
다음 Phase: 2 (Ontology/AOMD)
개발 환경: WSL + Docker + Gemma 4

참고 문서:
- CURSOR_HANDOVER.md (항상 읽을 것)
- ONTOLOGY_DESIGN.md (설계 참고)
- AOMD_FRAMEWORK.md (구현 기준)

요청:
[구체적인 작업]"
```

### **각 Phase별 Cursor 프롬프트**

**Phase 1 (Web MVP):**
```
파일: [파일명]
현재: [현재 상태]
요청: [UI/API/LLM 관련]
기준: [코드 규칙]
```

**Phase 2 (Ontology/AOMD):**
```
파일: [파일명]
현재: [현재 상태]
요청: [Ontology 구현/AOMD 피드백]
참고: ONTOLOGY_DESIGN.md, AOMD_FRAMEWORK.md
기준: [Ontology 표준]
```

**Phase 3 (SaaS):**
```
파일: [파일명]
현재: [현재 상태]
요청: [구독/결제/권한 관리]
참고: SAAS_ROADMAP.md
기준: [보안 기준]
```

---

## 📊 진도 추적 (공개)

```
Phase 1: Web MVP          📊 100% ✅  (커밋 5d7569f)
Phase 2: Ontology/AOMD    📊 100% ✅  (커밋 2717f63)
Phase 3: SaaS             📊 100% ✅  (커밋 cacba9d)
Phase 4: 고급 기능        📊 100% ✅  (커밋 4aebfcc)
Phase 5: 모바일 & 확장    📊 100% ✅  (커밋 5fd6548)
Phase 6: 프로덕션 배포    📊 100% ✅  (모바일 녹음, 푸시, prod Docker)

다음 업데이트: Phase 7 계획 시
```

---

## ✨ 최종 체크리스트

```
장기 전략 수립:
☑ Phase별 목표 명확화
☑ Ontology 구조 설계
☑ AOMD 역할 정의
☑ 점수 시스템 설계
☑ SaaS 가격 모델

문서화:
☑ CURSOR_HANDOVER.md에 로드맵 추가
☑ Ontology 설계 문서 작성
☑ AOMD 가이드 작성
☑ Phase별 설계 문서 작성
☑ 주기적 업데이트 규칙 정의

개발 준비:
☑ Cursor 프롬프트 템플릿 준비
☑ Phase별 작업 목록 작성
☑ 문서 관리 체계 구축
```

---

**Phase 1–3 완료! Phase 4–6 완료:** CURSOR_HANDOVER.md + PHASE6_CODE_LOOP_PROMPTS.md 참고


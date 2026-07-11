# Pronunciation Master - Cursor 협업 최종 핸드오버 문서

**최종 업데이트:** 2026-07-11  
**프로젝트 경로:** `D:\sangkny\work\doc\external_activity\Learning-Languages\pronunciation-master`  
**개발 환경:** WSL + Docker + LMStudio (Gemma 4)

---

## 🎯 프로젝트 비전 & 로드맵

### **최종 목표**
AI 기반 영어 발음 교정 플랫폼 → **SaaS 구독 서비스**로 성장

### **Long-Term Strategy (항상 기억하세요!)**

```
Phase 1 (현재): Web MVP
  ├─ ✅ Backend API
  ├─ ✅ Frontend UI
  ├─ 🔄 TTS/STT
  └─ LMStudio 통합 (진행 중)

Phase 2 (8월-9월): Ontology & AOMD
  ├─ Ontology 기반 시나리오 생성
  ├─ AOMD 역할 기반 피드백 (Advocate, Opposite, Meditator, Decisioner)
  ├─ 점수 시스템 (0-100)
  └─ 진도 추적 & 분석

Phase 3 (10월): SaaS 구독 서비스
  ├─ Free Tier (제한적)
  ├─ Pro Tier ($9.99/월)
  └─ Enterprise Tier ($299/월)

Phase 4 (11월-12월): 고급 기능
  ├─ Leaderboard & 경쟁
  ├─ 그룹 학습
  └─ 인증서 발급

Phase 5 (2027+): 모바일 & 확장
  ├─ iOS/Android 앱
  └─ 국제화 & 다국어
```

**중요:** 이 로드맵은 변하지 않습니다. 항상 이것을 염두에 두고 개발하세요!

---

## 📍 현재 상태 (Phase 1: Web MVP)

### 완료된 작업
```
✅ Docker 다중 컨테이너 환경 (Backend, Frontend, LMStudio)
✅ Express.js REST API 기본 구조
✅ React/Vite Frontend UI (분야 선택)
✅ 5개 분야 완성 (의료기기, 통신, 금융, 기술, 자동차)
✅ LMStudio Gemma 4 통합 설정
✅ 포트 동적 할당 (충돌 방지)
```

### 진행 중인 작업
```
🔄 TTS (Text-to-Speech) 구현
🔄 Frontend UI 스타일링 (Tailwind CSS)
🔄 상황 입력 → 미션 생성 API 연결
```

### 진행률
```
Phase 1: 🟩🟩🟩🟩🟩🟩🟩⬜⬜⬜ 60%
```

---

## 🤖 LLM 설정 (LMStudio)

### 현재 구성
```
모델: Google Gemma 4 (LMStudio Windows)
  - google/gemma-4-e4b (추천 - 빠름)
  - google/gemma-4-26b-a4b (강력 - 느림)

포트: 1234 (Windows LMStudio)
API: http://host.docker.internal:1234/v1 (Docker에서 접근)

.env.local 설정:
  LMSTUDIO_API_URL=http://host.docker.internal:1234/v1
  LMSTUDIO_MODEL=google/gemma-4-e4b
```

### 사용 방법
```
1. Windows에서 LMStudio 실행
2. Gemma 4 모델 로드
3. Local Server ON (포트 1234)
4. WSL Docker에서 자동으로 접근 가능
```

---

## 📁 폴더 구조

```
pronunciation-master/
├── .cursorrules                                ← Cursor 규칙 (자동 적용)
├── CURSOR_HANDOVER.md                        ← 🔴 이 문서 (항상 최신화)
├── GIT_COMMIT_PROMPT.md                      ← Git 커밋 가이드
├── LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md ← 장기 전략 (참고)
├── .env.local                                ← LMStudio 설정
├── docker-compose.yml                        ← Docker 설정
│
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── services/
│   │   │   ├── llmManager.js    ← LMStudio 지원 추가 필요
│   │   │   └── [다른 서비스들]
│   │   └── routes/
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              ← UI 스타일링 중
│   │   ├── main.jsx
│   │   ├── services/
│   │   │   └── apiClient.js     ← Backend 통신
│   │   └── components/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── Dockerfile.dev
│
└── docs/
    ├── LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md ← 장기 로드맵
    ├── ONTOLOGY_DESIGN.md                      ← (Phase 2 예정)
    ├── AOMD_FRAMEWORK.md                       ← (Phase 2 예정)
    ├── SCORING_SYSTEM.md                       ← (Phase 2 예정)
    ├── SAAS_ROADMAP.md                         ← (Phase 3 예정)
    └── [기타 문서들]
```

---

## 🚀 개발 시작하기

### WSL 터미널 1: Docker 실행

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# LMStudio 설정 확인 (.env.local)
cat .env.local

# Docker 실행
docker compose down
docker compose build
docker compose up

# ✅ 모든 서비스 시작 확인
```

### WSL 터미널 2: Cursor 실행

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
code .

# Cursor 열림
```

### Windows: LMStudio 준비

```
1. LMStudio 앱 실행
2. Gemma 4 모델 로드
3. Local Server ON (포트 1234)
4. ✅ 준비 완료
```

---

## 💻 Cursor에서 해야 할 즉시 작업

### 🔴 우선순위 1: LMStudio 통합 (Backend)

**Ctrl+K에서 입력:**

```
파일: backend/src/services/llmManager.js

현재: Ollama 지원만 있음
요청: LMStudio 지원 추가

1. 환경 변수 읽기
   - LMSTUDIO_API_URL
   - LMSTUDIO_MODEL

2. generateScenarioBasedMissions() 수정
   - LMStudio API 호출 (OpenAI 호환)
   - http://host.docker.internal:1234/v1/chat/completions
   - 모델명: google/gemma-4-e4b

3. 프롬프트
   "Create 5 English learning sentences for scenario: {scenario}
    in category: {category}.
    Return as JSON: [{id, sentence, focusPoints, difficulty}]"

4. 에러 처리
   - 실패 시 샘플 데이터
   - 타임아웃: 30초
```

### 🟡 우선순위 2: Frontend UI 스타일링

**Ctrl+K에서 입력:**

```
파일: frontend/src/App.jsx

요청: Tailwind CSS로 UI 스타일링

1. 분야별 색상
   - Medical (파란색 - bg-blue-500)
   - Telecom (주황색 - bg-orange-500)
   - Finance (초록색 - bg-green-500)
   - Technology (보라색 - bg-purple-500)
   - Automotive (빨간색 - bg-red-500)

2. 호버 효과
   - 색상 짙어짐 (hover:opacity-80)
   - 그림자 추가

3. 반응형 디자인
   - 모바일 (스택형)
   - 데스크톱 (그리드)

4. 화면 전환
   - 분야 선택 → 상황 입력 화면
   - 이전 버튼으로 돌아가기
```

### 🟢 우선순위 3: API 연결

**Ctrl+K에서 입력:**

```
파일: frontend/src/App.jsx

요청: Backend API 연결

1. 상황 입력 화면 추가
   - 입력 필드 (사용자 상황 설명)
   - "맞춤 연습 생성" 버튼

2. API 호출
   - POST /api/mission/generate-by-scenario
   - 요청: {scenario, category, count}
   - 응답: {missions: [...]}

3. 결과 표시
   - 미션 리스트 렌더링
   - 각 미션별 정보 표시

기준:
- apiClient.js 사용
- 로딩 상태 표시
- 에러 처리
```

---

## 🧠 Ontology & AOMD 이해 (Phase 2 준비)

### Ontology란?
```
도메인의 개념을 정렬하고, 시나리오를 체계적으로 생성하는 체계

예: Medical Devices
├── 개념: Equipment, Procedure, Diagnosis
├── 단어: imaging, diagnostic, etc.
└── 시나리오: Trade Show, Hospital Meeting, Lecture
```

### AOMD란?
```
사용자에게 4가지 관점의 피드백을 제공

1. Advocate (옹호자): 긍정적 강화 👍
2. Opposite (반대자): 비판적 분석 ⚠️
3. Meditator (중재자): 균형잡힌 조언 🎯
4. Decisioner (결정자): 행동 계획 🚀

각 발음 평가 후 4가지 피드백을 모두 제시
```

---

## 📊 점수 시스템 (Phase 2)

### 채점 기준
```
총점: 0-100

├─ 음절 정확도 (40점)
│  ├─ 각 음절 명확도
│  ├─ 스트레스(강약)
│  └─ 음운 정확도
│
├─ 유창성 (30점)
│  ├─ 속도 적절성
│  ├─ 자연스러움
│  └─ 폴 패턴
│
├─ 문맥 적절성 (20점)
│  ├─ 상황별 정확도
│  └─ 포멀/캐주얼 구분
│
└─ 회화성 (10점)
   └─ 네이티브 근접성
```

---

## 💰 SaaS 계획 (Phase 3)

### Free Tier
```
- 일일 5개 미션
- 기본 피드백 (Advocate만)
- 광고 포함
- $0/월
```

### Pro Tier
```
- 무제한 미션
- 전체 AOMD 피드백
- 광고 없음
- 상세 분석
- 인증서 발급
- $9.99/월 또는 $99/년 (20% 할인)
```

### Enterprise Tier
```
- Pro 기능 + API 접근
- 팀 관리 (100명까지)
- 맞춤형 Ontology
- 전담 지원팀
- $299/월 (협상 가능)
```

---

## 🔄 문서 관리 규칙 (중요!)

### 매번 커밋할 때
```bash
# 1. 작업 완료
# 2. 테스트 확인
# 3. CURSOR_HANDOVER.md 업데이트
#    - 진행 상황 갱신
#    - 다음 작업 명시
# 4. Git 커밋

git add .
git commit -m "feat: [작업명]

CURSOR_HANDOVER.md 업데이트:
- 진행상황: X% → Y%
- 다음 작업: [명시]"

git push origin main
```

### 매주 금요일
```
1. CURSOR_HANDOVER.md 전체 검토
2. 진행률 계산
3. 우선순위 재정렬
4. 다음주 계획 작성
5. Git 커밋
```

### 각 Phase 완료 시
```
1. Phase 설계 문서 작성 (Phase_X_REVIEW.md)
2. 모든 문서 최신화
3. 릴리즈 노트 작성
4. 다음 Phase 준비 문서 작성
```

---

## 🎯 Cursor 협업 팁

### 프롬프트 작성 시 항상 포함하세요

```
프로젝트: Pronunciation Master
현재 Phase: 1 (Web MVP) - 60%
다음 Phase: 2 (Ontology/AOMD)

개발 환경:
- WSL + Docker
- LMStudio Gemma 4
- 포트: Backend 5000, Frontend 5173

참고 문서:
- CURSOR_HANDOVER.md (이것!)
- LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md

요청:
[구체적인 작업]
```

### 에러 발생 시

```
Cursor에 입력:
"파일: [파일명]
에러: [에러 메시지]
컨텍스트: [상황 설명]

원인 분석과 해결책을 제시해주세요."
```

---

## 📋 체크리스트

### 개발 시작 전
```
☑ WSL 터미널 1: docker compose up 실행 중
☑ Windows: LMStudio 실행 중 (포트 1234)
☑ WSL 터미널 2: Cursor 준비
☑ .env.local 설정 확인
☑ docker-compose.yml 확인
```

### 각 작업 시작 전
```
☑ 이 문서 읽기
☑ 참고 문서 확인
☑ 프롬프트 준비
☑ Git 브랜치 확인
```

### 각 작업 완료 후
```
☑ 로컬에서 테스트
☑ 에러 없음 확인
☑ CURSOR_HANDOVER.md 갱신
☑ Git 커밋
☑ 다음 작업 준비
```

---

## 🚀 다음 단계

### 즉시 (지금)
1. LMStudio 통합 (Backend)
2. UI 스타일링 (Frontend)
3. API 연결 (Frontend-Backend)

### 이번 주
4. TTS/STT 구현
5. 기본 발음 분석 완성
6. Phase 1 완료 (70%)

### 다음 주
7. Phase 2 준비
8. Ontology 설계 시작
9. AOMD 프레임워크 개발 준비

---

## 📞 참고 자료

### 이 프로젝트의 문서들
- `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md` (장기 비전)
- `GIT_COMMIT_PROMPT.md` (Git 관리)
- `FILE_LOCATION_GUIDE.md` (파일 위치)

### 외부 참고
- [Express.js 문서](https://expressjs.com)
- [React 문서](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## ✨ 마지막 말

**이 문서는 항상 최신으로 유지되어야 합니다.**

매번 작업을 할 때마다:
1. 진행상황 업데이트
2. 다음 작업 명시
3. 문제점 기록
4. 배운 점 추가

**이것이 팀 협업과 연속성의 핵심입니다!** 🎯

---

**행운을 빕니다! 이제 Cursor에서 개발을 시작하세요!** 🚀

```
마지막 업데이트: 2026-07-11 18:00 UTC
버전: 2.0
상태: 🟢 Active Development (Phase 1: 60%)
```


# Pronunciation Master - Cursor Handover Document

## 📋 프로젝트 개요

**프로젝트명:** Pronunciation Master  
**목적:** AI 기반 영어 발음 교정 및 상황별 동적 학습 앱  
**현재 상태:** MVP 완성, 기본 UI 렌더링 성공  
**다음 단계:** UI/UX 개선, 기능 확장  

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
- ✅ `/api/pronunciation/analyze` 기본 구조
- ✅ LLM Manager (Ollama 통합)
- ✅ 에러 처리 기본 구조

### 프론트엔드
- ✅ React 앱 구축 (Vite)
- ✅ 5가지 분야 선택 UI
  - 의료기기 (Medical Devices)
  - 통신기술 (Telecommunications)
  - 금융 (Finance)
  - 기술 (Technology)
  - 자동차 (Automotive)
- ✅ 기본 컴포넌트 구조
- ✅ 앱 렌더링 정상 작동

### DevOps & 문서
- ✅ Git 저장소 초기화
- ✅ 협업 가이드 (Cursor, Claude Code)
- ✅ 개발 환경 문서화

---

## 🏗️ 현재 프로젝트 구조

```
Learning-Languages/pronunciation-master/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Express 메인 서버
│   │   ├── services/
│   │   │   ├── llmManager.js        # LLM 통합 (Ollama)
│   │   │   └── providers/
│   │   ├── routes/
│   │   │   └── mission.js           # 미션 관련 라우트
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # 메인 컴포넌트 (분야 선택 UI)
│   │   ├── main.jsx                 # React 진입점
│   │   ├── services/
│   │   │   └── apiClient.js        # API 통신
│   │   ├── components/              # 재사용 컴포넌트
│   │   ├── styles/                  # CSS 파일들
│   │   └── utils/
│   ├── index.html                   # HTML 진입점
│   ├── vite.config.js              # Vite 설정
│   ├── package.json
│   ├── Dockerfile.dev
│   └── public/
├── data/                            # 데이터 폴더 (미사용)
├── docs/                            # 문서들
├── docker-compose.yml               # Docker 구성
├── .env.local                       # 환경 변수
└── README.md
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

# 응답:
{
  "score": 85,
  "feedback": "발음이 매우 좋습니다",
  "wordScores": {
    "This": 90,
    "is": 80,
    "a": 85,
    "test": 80,
    "sentence": 85
  }
}
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

## 🎯 다음 우선순위 (Cursor에게 맡길 작업)

### Week 1
- [ ] UI 개선 (Tailwind CSS)
- [ ] 상황 입력 화면 구현
- [ ] 분야 선택 → 상황 입력 전환

### Week 2
- [ ] Backend API에서 실제 LLM 호출
- [ ] Frontend에서 API 연결
- [ ] 미션 결과 화면 표시

### Week 3
- [ ] TTS (음성 재생) 구현
- [ ] 발음 연습 화면 구현

### Week 4
- [ ] STT (음성 녹음) 구현
- [ ] 발음 분석 기능
- [ ] 결과 피드백

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
개발 시작 전:
☐ 이 문서 읽기
☐ 프로젝트 구조 이해
☐ docker compose up 실행
☐ http://localhost:5173 앱 확인
☐ Cursor 열기

개발 중:
☐ 위의 프롬프트 사용
☐ 자주 테스트 (http://localhost:5173)
☐ 진행상황 이 문서에 반영

개발 완료 후:
☐ Git 커밋
☐ 이 문서 업데이트
☐ 다음 우선순위 확인
```

---

**Cursor와 함께 효율적으로 개발하세요! 🚀**

이 문서는 지속적으로 업데이트됩니다.
마지막 업데이트: 2026-05-31

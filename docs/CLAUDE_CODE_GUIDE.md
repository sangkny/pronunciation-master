# Claude Code (VS Code) 협업 완벽 가이드

## 📌 Claude Code란?

Claude Code는 VS Code에서 직접 Claude AI를 사용할 수 있는 공식 확장입니다.

**Cursor vs Claude Code 비교:**

| 기능 | Cursor | Claude Code (VS Code) |
|------|--------|----------------------|
| IDE | 독립 IDE | VS Code 확장 |
| 설정 | 자체 .cursorrules | VS Code 설정 |
| 터미널 | 내장 | VS Code 터미널 |
| Git 통합 | 자체 제공 | VS Code Git |
| 파일 참조 | @파일경로 | @파일 또는 수동 |
| 가격 | Pro 구독 | Claude API 사용 |
| 추천도 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🚀 설치 및 초기 설정

### Step 1: VS Code 설치

```bash
# Windows/Mac/Linux
https://code.visualstudio.com 에서 다운로드

# 또는 터미널에서 (Mac)
brew install visual-studio-code

# Linux (Ubuntu)
sudo apt install code

# Windows (Chocolatey)
choco install vscode
```

### Step 2: Claude Code 확장 설치

```
VS Code 열기
  → Extensions (Ctrl+Shift+X)
  → "Claude Code" 검색
  → Anthropic의 공식 확장 설치
  
또는 직접 설치:
https://marketplace.visualstudio.com/items?itemName=Anthropic.claude-code
```

### Step 3: API 키 설정

```
1. Anthropic 계정 생성
   https://console.anthropic.com

2. API 키 생성
   Settings → API Keys → Create Key

3. VS Code에서 설정
   - VS Code: Settings (Ctrl+,)
   - "Claude Code" 검색
   - API Key 입력
```

### Step 4: 프로젝트 폴더 열기

```bash
cd Learning-Languages/pronunciation-master
code .
```

---

## 📋 Claude Code 사용 방법

### 기본 인터페이스

```
VS Code 왼쪽 사이드바
  ├── Explorer (파일)
  ├── Search (검색)
  ├── Source Control (Git)
  ├── Run and Debug
  └── Claude Code ← 여기!
```

### Claude Code 패널 구성

```
┌─────────────────────────┐
│   Claude Code Panel     │
├─────────────────────────┤
│                         │
│  [채팅 영역]            │
│  AI와 대화하는 곳       │
│                         │
│  ─────────────────────  │
│                         │
│  [입력 필드]            │
│  메시지 또는 선택된     │
│  코드에 대한 명령       │
│                         │
└─────────────────────────┘
```

### 주요 단축키

```
Ctrl+K         현재 선택 코드에 대해 AI 물어보기
Ctrl+Shift+K   선택된 코드 설명 요청
Cmd+K (Mac)    위와 동일
Cmd+Shift+K    위와 동일

Ctrl+/         Claude Code 패널 열기/닫기
Ctrl+J         터미널 열기/닫기
```

---

## 💬 Claude Code 프롬프트 패턴

### 패턴 1: 코드 선택 후 질문

```
1. 코드 선택 (마우스 드래그)
2. Ctrl+K
3. 질문 입력:

"이 함수를 리팩토링해줄래? 
성능과 가독성을 개선해"

또는 

"이 코드의 버그를 찾아줄래?"
```

### 패턴 2: 새 파일 생성

```
1. 터미널 또는 파일 탐색기에서 위치 확인
2. Claude Code 패널 열기 (Ctrl+/)
3. 메시지 입력:

"backend/src/services/newService.js 파일을 만들어줄래?

기능:
1. 사용자 데이터 검증
2. LLM에 요청 전송
3. 응답 처리

참고:
- llmManager.js의 패턴 따르기
- 에러 처리 포함
- 주석 추가"

4. AI가 파일 생성
5. 파일 확인 및 저장
```

### 패턴 3: 파일 참조

```
방법 1: 드래그 & 드롭
파일을 Claude Code 패널에 드래그

방법 2: 수동 입력
"파일을 보고 있어: backend/src/server.js

이 파일에 새 라우트를 추가해줄래?
POST /api/new-endpoint
..."

방법 3: 현재 파일 참조
현재 열려있는 파일에서:
Ctrl+K → 질문
→ AI가 자동으로 현재 파일 참고
```

### 패턴 4: 멀티 파일 작업

```
1. 관련 파일들 모두 열기
   - backend/src/server.js
   - frontend/src/App.jsx
   - backend/src/services/llmManager.js

2. Claude Code 패널:

"이 세 파일을 함께 봐:
- server.js: 새 API 엔드포인트 추가 필요
- App.jsx: 이 엔드포인트 호출하는 UI 필요
- llmManager.js: 참고할 LLM 호출 패턴

일관성 있게 구현해줄래?"

3. AI가 필요한 파일들 동시에 수정
4. 각 파일 검토 후 저장
```

---

## 🎯 일일 개발 워크플로우

### 아침 (프로젝트 시작)

```bash
# 1. VS Code 열기
code Learning-Languages/pronunciation-master

# 2. 최신 코드 가져오기
# VS Code 터미널 (Ctrl+J)
git pull origin main

# 3. Docker 실행
docker compose up

# 4. Claude Code 패널 열기
# Ctrl+/ 또는 왼쪽 사이드바에서 Claude Code 클릭
```

### 개발 중 (기능 구현)

```
1️⃣ 파일 열기
   - backend/src/server.js
   - 또는 frontend/src/App.jsx

2️⃣ Claude Code 사용
   - Ctrl+K로 코드 생성
   - Ctrl+Shift+K로 설명 요청
   - 채팅 패널로 대화

3️⃣ 실시간 테스트
   - 파일 수정됨 (자동 저장 또는 Ctrl+S)
   - 터미널에서 docker logs 확인
   - 브라우저에서 http://localhost:3000 테스트

4️⃣ 필요시 수정 요청
   - "이 부분을 수정해줄래?"
   - "에러가 나는데..."
   - "다시 생각해보니..."
```

### 저녁 (코드 저장)

```bash
# 1. 모든 파일 저장
Ctrl+Shift+S (모든 파일 저장)

# 2. 터미널에서 Git 작업
git status
git add .
git commit -m "feat: 기능 설명"
git push origin main

# 3. Docker 상태 확인
docker compose ps
```

---

## 📚 Claude Code와 협업하는 프롬프트 모음

### 프롬프트 1️⃣ : 새 기능 완전 구현

```
파일 위치: backend/src/services/

기능명: PronunciationScorer

요청:
다음 기능을 구현해줄래:

1. 함수: scorePronunciation(userAudio, targetText)
   - 입력: 사용자 음성 (Blob), 목표 텍스트 (string)
   - 출력: { score: number, feedback: string, details: object }
   
2. 사용할 LLM:
   - llmManager.js의 generateText() 메서드 참고
   - Ollama mistral 모델 사용
   
3. 점수 계산:
   - 0-100 범위
   - 발음 정확도 기반
   
4. 피드백 생성:
   - 구체적이고 실행 가능한 조언
   - 잘한 점과 개선점 포함

5. 기준:
   - 기존 코드 스타일 유지
   - 에러 처리 완벽하게
   - JSDoc 주석 추가
   - 로깅 포함

참고:
- backend/src/services/llmManager.js (LLM 호출 방식)
- backend/src/server.js (API 응답 형식)
```

### 프롬프트 2️⃣ : 버그 수정

```
파일: frontend/src/App.jsx

문제:
POST /api/mission/generate-by-scenario 호출 시
CORS 에러 발생

현재 코드:
fetch('/api/mission/generate-by-scenario', {
  method: 'POST',
  body: JSON.stringify(data)
})

에러 메시지:
Access to XMLHttpRequest at 'http://localhost:5000/...'
from origin 'http://localhost:3000' has been blocked by CORS policy

예상 동작:
데이터를 받아서 state 업데이트

분석:
1. CORS 설정 확인
2. Content-Type 헤더 확인
3. 백엔드 미들웨어 확인

해결책 제시해줄래?
```

### 프롬프트 3️⃣ : 코드 리팩토링

```
파일: backend/src/server.js

현재 상태:
모든 라우트가 한 파일에 있음

개선 목표:
1. 라우트를 별도 파일로 분리
   - pronunciation.js
   - translation.js
   - mission.js
   - config.js

2. 미들웨어를 utils로 분리
   - errorHandler.js
   - logger.js

3. 성능 최적화
   - 불필요한 라우트 정리
   - 캐싱 추가

현재 코드를 분석하고
최적화된 구조를 만들어줄래?

참고 구조:
backend/src/
  ├── server.js (메인)
  ├── routes/
  │   ├── pronunciation.js
  │   ├── translation.js
  │   └── mission.js
  ├── middleware/
  │   ├── errorHandler.js
  │   └── logger.js
  └── utils/
```

### 프롬프트 4️⃣ : 테스트 코드 작성

```
파일: backend/src/services/llmManager.js

테스트할 함수:
generateScenarioBasedMissions(scenario, category, count)

요청:
Jest 테스트 코드를 작성해줄래?

포함할 것:
1. 정상 케이스
   - 올바른 입력으로 정상 응답 확인

2. 엣지 케이스
   - 빈 문자열 입력
   - null/undefined 입력
   - 크기 초과 입력
   - LLM 연결 실패

3. Mock 데이터
   - llmManager 모킹
   - 실제 LLM 호출 없음

4. 실행 방법
   - jest --testPathPattern=llmManager.test.js

저장 위치: backend/src/services/__tests__/llmManager.test.js
```

### 프롬프트 5️⃣ : API 구현

```
파일: backend/src/server.js

새 API 엔드포인트:
POST /api/pronunciation/detailed-analysis

요청 데이터:
{
  userAudio: Blob,
  targetText: string,
  focusPoints: string[],
  nativeLanguage: string
}

응답 데이터:
{
  overallScore: number,
  wordAccuracy: { [word]: score },
  stressPattern: string,
  intonation: string,
  recommendations: string[],
  examples: { [word]: string }
}

구현:
1. 요청 검증
2. llmManager 호출
3. 상세 분석 로직
4. 응답 포맷팅
5. 에러 처리

참고:
- 기존 /api/pronunciation/analyze (간단한 버전)
- llmManager.js 의 사용 방식

구현해줄래?
```

### 프롬프트 6️⃣ : 문서 작성

```
문서: docs/API_SPECIFICATION.md

현재 API 엔드포인트:
- POST /api/pronunciation/analyze
- POST /api/mission/generate-by-scenario
- POST /api/translation/korean-to-english
- GET /health

요청:
API 스펙 문서를 작성해줄래?

포함할 것:
1. 각 엔드포인트별:
   - 설명
   - 요청 형식 (JSON 예시)
   - 응답 형식 (JSON 예시)
   - 상태 코드
   - 에러 케이스
   - 사용 예시 (cURL)

2. 인증 (필요시)

3. 레이트 리미팅

4. 베이스 URL

5. 버전 정보

현재 server.js를 참고해서 만들어줄래?
```

### 프롬프트 7️⃣ : Docker 최적화

```
파일: backend/Dockerfile, frontend/Dockerfile.dev, docker-compose.yml

목표:
개발 환경 최적화

요청:
1. Dockerfile 멀티스테이지 빌드로 개선
   - 빌드 이미지와 런타임 이미지 분리
   - node_modules 캐싱 활용
   - 최종 이미지 크기 줄이기

2. docker-compose.yml
   - 헬스체크 추가
   - 의존성 순서 정리
   - 네트워크 최적화
   - 볼륨 설정 개선

3. .dockerignore
   - 불필요한 파일 제외

4. 빌드 시간 단축
   - 캐싱 활용

현재 파일들을 분석하고 최적화해줄래?
```

### 프롬프트 8️⃣ : 성능 분석 및 최적화

```
파일: frontend/src/App.jsx

현재 문제:
- 초기 로딩 느림 (3초 이상)
- 미션 생성 API 응답 느림 (5초)
- 메모리 사용 많음

요청:
성능 분석 및 최적화 방안 제시

분석할 항목:
1. 컴포넌트 렌더링 최적화
   - 불필요한 리렌더링 제거
   - memo() 사용
   - 상태 관리 개선

2. API 호출 최적화
   - 캐싱 추가
   - 요청 병합
   - 타임아웃 설정

3. 번들 크기 감소
   - 불필요한 import 제거
   - 코드 스플리팅

4. 메모리 누수 방지
   - cleanup 함수 추가
   - 이벤트 리스너 정리

개선된 코드를 보여줄래?
```

### 프롬프트 9️⃣ : 프론트엔드 UI 개선

```
파일: frontend/src/App.jsx

현재 UI:
기본 HTML만 있음

개선 요청:
1. 스타일 추가
   - Tailwind CSS (권장)
   또는 CSS-in-JS (Styled Components)

2. 레이아웃 구조
   - 헤더: 제목 + 네비게이션
   - 메인: 분야 선택 + 상황 입력 + 결과
   - 풋터: 정보 및 링크

3. 반응형 디자인
   - 모바일 (320px)
   - 태블릿 (768px)
   - 데스크톱 (1024px)

4. 인터랙션
   - 호버 효과
   - 로딩 상태 표시
   - 에러 메시지
   - 토스트 알림

5. 접근성
   - ARIA 레이블
   - 키보드 네비게이션
   - 색상 대비

현재 기능을 유지하면서 UI를 개선해줄래?
```

### 프롬프트 🔟 : 전체 기능 통합

```
현재 상태:
- 백엔드: API 구현됨
- 프론트엔드: 기본 UI
- Docker: 실행 중

최종 통합 요청:
1. 전체 사용자 플로우 확인
   - 분야 선택 → 상황 입력 → 미션 생성 → 발음 연습 → 결과 확인

2. 각 단계별 에러 처리
   - 입력 검증
   - API 실패 처리
   - 타임아웃 처리

3. 상태 관리 정리
   - 일관성 있는 상태 구조
   - 불필요한 상태 제거

4. 성능 최적화
   - 불필요한 API 호출 제거
   - 캐싱 추가

5. UX 개선
   - 진행 상황 표시
   - 로딩 상태
   - 성공/실패 피드백

전체를 통합 최적화해줄래?
```

---

## 🔄 Claude Code의 강점

### 1️⃣ VS Code 기반
```
✅ 이미 VS Code 사용중이면 추가 설치 불필요
✅ 기존 확장과 완벽히 호환
✅ 터미널과 통합
✅ Git 통합
```

### 2️⃣ 대화형 개발
```
✅ 채팅 인터페이스로 대화하듯 개발
✅ 실시간 피드백
✅ 코드 수정 전후 비교
✅ 여러 번 수정 가능
```

### 3️⃣ 파일 참조 쉬움
```
✅ 파일을 드래그 & 드롭
✅ 현재 파일 자동 참고
✅ 여러 파일 동시 작업
✅ 컨텍스트 자동 유지
```

### 4️⃣ 설정 간편
```
✅ API 키만 입력
✅ .cursorrules 불필요 (VS Code 설정으로 관리)
✅ 기존 VS Code 설정 활용
```

### 5️⃣ 터미널 통합
```
✅ Ctrl+J로 즉시 터미널 전환
✅ 코드 수정 후 바로 테스트
✅ docker logs 실시간 확인
✅ git 명령어 실행
```

---

## ⚙️ VS Code 설정

### .vscode/settings.json

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "Fira Code, 'Courier New'",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  
  "python.defaultInterpreterPath": "/usr/bin/python3",
  "python.linting.enabled": true,
  
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  "files.exclude": {
    "**/.DS_Store": true,
    "**/.git": true,
    "**/.vscode": false,
    "**/node_modules": true,
    "**/__pycache__": true
  },
  
  "claude.apiKey": "YOUR_API_KEY_HERE"
}
```

### .vscode/extensions.json

```json
{
  "recommendations": [
    "Anthropic.claude-code",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "eamodio.gitlens",
    "ms-vscode.makefile-tools",
    "ritwickdey.LiveServer",
    "Thunder Client.thunder-client"
  ]
}
```

---

## 🎯 Cursor vs Claude Code 선택 가이드

### Cursor를 추천할 때
```
✅ IDE 전환하고 싶을 때
✅ .cursorrules로 자동화하고 싶을 때
✅ 통합된 IDE 경험 원할 때
✅ AI만 사용하는 경우
```

### Claude Code를 추천할 때
```
✅ 이미 VS Code 사용 중 (강추)
✅ 기존 확장들과 조화 원할 때
✅ 터미널/Git과 통합하고 싶을 때
✅ 저비용 (API 기반)
✅ 높은 유연성 원할 때
```

---

## 🚀 Claude Code 빠른 시작 (5분)

### 1️⃣ 설치 (2분)

```bash
# 1. VS Code 설치
https://code.visualstudio.com

# 2. Claude Code 확장 설치
VS Code → Extensions → "Claude Code" → Install

# 3. API 키 설정
https://console.anthropic.com → API Keys → Create
VS Code → Settings → Claude → API Key 입력
```

### 2️⃣ 프로젝트 열기 (1분)

```bash
code Learning-Languages/pronunciation-master
```

### 3️⃣ 첫 기능 개발 (2분)

```
1. backend/src/services/ 폴더에서 우클릭
2. "New File" → "newFeature.js"
3. Claude Code 패널 열기 (왼쪽 사이드바)
4. 메시지:

"새 파일 newFeature.js를 만들어줄래?

기능:
1. 사용자 입력 검증
2. Ollama에 요청 전송
3. 응답 처리

참고: llmManager.js의 패턴"

5. AI가 코드 생성
6. Ctrl+S로 저장
7. Docker 테스트
```

---

## 📊 실제 사용 예시

### 예시 1: 새 API 엔드포인트 추가

```
상황: 새로운 /api/pronunciation/score 엔드포인트 추가 필요

1. backend/src/server.js 열기

2. Claude Code 패널에서:
"backend/src/server.js에 새 API 엔드포인트를 추가해줄래?

엔드포인트: POST /api/pronunciation/score
요청: { audio: Blob, text: string }
응답: { score: 0-100, feedback: string }

사용: llmManager의 generateText() 함수

기존 /api/pronunciation/analyze 와 일관성 있게"

3. AI가 코드 추가
4. 파일 검토
5. 저장 (Ctrl+S)
6. 터미널 (Ctrl+J) → docker compose restart backend
7. 테스트 (curl 또는 Postman)
```

### 예시 2: 프론트엔드 UI 개선

```
상황: 버튼 스타일 개선 필요

1. frontend/src/App.jsx 열기

2. 버튼 코드 선택

3. Ctrl+K 누르기

4. "이 버튼을 Tailwind CSS로 스타일링해줄래?
   - 파란색 배경
   - 호버 시 어두워지기
   - 로딩 중에는 회색

   참고: 기존 코드 스타일 유지"

5. AI가 코드 수정
6. 파일 자동 저장 (또는 Ctrl+S)
7. 브라우저 새로고침 (F5)
8. 확인
```

### 예시 3: 버그 수정

```
상황: CORS 에러 발생

1. 에러 메시지 복사

2. Claude Code 패널:
"이 CORS 에러를 고쳐줄래?

에러:
Access to XMLHttpRequest at 'http://localhost:5000/...'
from origin 'http://localhost:3000' has been blocked by CORS policy

파일: frontend/src/App.jsx (줄 45-50)

원인 분석 후 수정해줄래?"

3. AI가 분석 및 해결책 제시

4. 추천 사항 적용

5. 재테스트
```

---

## 💡 생산성 팁

### Tip 1: 다중 파일 작업
```
1. 관련 파일 모두 열기
   - Ctrl+P → 파일명 검색 → Enter
   - 여러 파일 동시 열기

2. Claude Code에서:
"이 세 파일을 함께 봐:
- 1️⃣ backend/src/server.js
- 2️⃣ frontend/src/App.jsx  
- 3️⃣ backend/src/services/llmManager.js

이 세 파일을 수정해서 새 기능을 구현해줄래?"

3. AI가 파일들을 함께 수정
```

### Tip 2: 코드 선택 후 질문
```
1. 질문할 코드 선택 (마우스 드래그)
2. Ctrl+K
3. 질문 입력

→ AI가 선택된 코드를 자동으로 참고!
```

### Tip 3: 실시간 테스트
```
┌─────────────────┐
│ Claude Code 패널│
│ (코드 생성)     │
└────────┬────────┘
         │ 수정 요청
         ▼
┌─────────────────┐
│ 파일 (자동 저장)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 터미널 (Ctrl+J) │
│ docker logs     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 브라우저 (F5)   │
│ http://3000     │
└─────────────────┘

모두 VS Code 안에서!
```

### Tip 4: Git과 통합
```
1. 코드 수정 (Claude Code)
2. Source Control (Ctrl+Shift+G)
3. 변경사항 확인
4. Commit & Push
5. 완료!

모두 VS Code 안에서!
```

---

## 🎯 권장 워크플로우 (Claude Code)

```
┌──────────────┐
│ VS Code 열기 │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ 필요한 파일 열기     │
│ (Ctrl+P로 빠르게)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Claude Code 패널     │
│ 요청 입력 (Ctrl+/)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ AI 코드 생성         │
│ (자동 수정)          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 코드 검토            │
│ 필요시 재 요청       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 파일 저장 (Ctrl+S)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 터미널 (Ctrl+J)      │
│ 테스트/빌드          │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Git 커밋/푸시        │
│ (Ctrl+Shift+G)       │
└──────────────────────┘
```

---

## ✅ Claude Code 설정 체크리스트

```
□ VS Code 설치됨
□ Claude Code 확장 설치됨
□ API 키 설정됨
□ 프로젝트 폴더 열림
□ 패널 열기 (Ctrl+/)
□ 첫 번째 프롬프트 테스트
□ 파일 자동 저장 확인 (Ctrl+Shift+P → Toggle Auto Save)
□ Git 확장 설치됨
□ 터미널에서 docker compose up 실행됨
□ http://localhost:3000 접속 확인
```

---

## 🎉 Claude Code 시작하기

이제 **VS Code + Claude Code**로 효율적으로 개발할 준비가 됐습니다!

```bash
# 1. VS Code 열기
code Learning-Languages/pronunciation-master

# 2. Claude Code 패널 열기 (Ctrl+/ 또는 사이드바)

# 3. 첫 기능 개발
"새로운 기능을 구현해줄래?
[구체적인 요청]"

# ✅ 시작!
```

---

## 💪 Claude Code vs Cursor 최종 비교

**Claude Code (VS Code) 추천 사유:**

| 항목 | Claude Code | 설명 |
|------|-----------|------|
| IDE | VS Code | 이미 사용중이면 추가 설치 불필요 |
| 통합도 | 높음 | Git, 터미널, 확장과 완벽 호환 |
| 비용 | 낮음 | API 기반 (사용량에 따라) |
| 유연성 | 높음 | VS Code의 모든 기능 활용 가능 |
| 설정 | 간단함 | API 키만 입력 |
| 성능 | 우수 | Claude 3.5 Sonnet 사용 |

**결론: VS Code 사용자라면 Claude Code가 정답! 🎯**

---

**Happy coding with Claude Code! 🚀**

이제 최고의 개발 환경이 준비되었습니다! 💻

# Cursor IDE 설정 및 협업 가이드

## 1. Cursor 설치 및 초기 설정

### 1.1 설치
- [cursor.sh](https://cursor.sh) 에서 다운로드
- 설치 후 실행

### 1.2 .cursorrules 파일 설정

프로젝트 루트(`Learning-Languages/pronunciation-master/`)에 `.cursorrules` 파일 배치:

```bash
# 프로젝트 루트에서
cp /경로/.cursorrules .
```

또는 Cursor에서:
1. `Ctrl+Shift+P` (또는 `Cmd+Shift+P`)
2. "Create .cursorrules"
3. 아래 내용 입력:

```
# Cursor Rules for Pronunciation Master

## Project Structure
- Backend: backend/src/ (Express.js, Node.js)
- Frontend: frontend/src/ (React)
- LLM Integration: via llmManager.js (Ollama)
- Docker: docker-compose.yml

## Key Files
- backend/src/server.js - Express 서버
- frontend/src/App.jsx - React 메인 컴포넌트
- backend/src/services/llmManager.js - LLM 통합

## Development Rules
1. 백엔드 파일은 backend/src/ 에서 생성
2. 프론트엔드 파일은 frontend/src/ 에서 생성
3. API는 /api/ 경로로 시작
4. 에러 처리는 필수
5. Git commit 메시지: feat/fix/chore:

## API Endpoints
- POST /api/pronunciation/analyze - 발음 분석
- POST /api/mission/generate-by-scenario - 상황 기반 미션 생성
- POST /api/translation/korean-to-english - 번역
- GET /health - 헬스 체크

## Environment
- LLM_PROVIDER=ollama (기본값)
- OLLAMA_API_URL=http://ollama:11434
- PORT=5000
- REACT_APP_API_URL=http://localhost:5000
```

---

## 2. Cursor 기본 단축키

### 2.1 코드 작성
| 단축키 | 기능 |
|--------|------|
| `Ctrl+K` | AI 코드 생성/수정 |
| `Ctrl+Shift+K` | AI가 코드 설명 |
| `Cmd+K` (Mac) | AI 코드 생성/수정 |
| `Tab` | AI 제안 수용 |
| `Esc` | AI 제안 취소 |

### 2.2 파일 및 검색
| 단축키 | 기능 |
|--------|------|
| `Ctrl+P` | 파일 빠른 열기 |
| `Ctrl+Shift+F` | 전체 검색 |
| `Ctrl+H` | 찾기/바꾸기 |
| `Ctrl+G` | 라인 이동 |

### 2.3 터미널
| 단축키 | 기능 |
|--------|------|
| `Ctrl+J` | 터미널 열기/닫기 |
| `Ctrl+Shift+J` | 새 터미널 |

---

## 3. Cursor와의 일반적인 협업 방식

### 3.1 새 기능 개발

```
1. Ctrl+K 누르기
2. 다음 형식으로 요청:

"프로젝트: Pronunciation Master
위치: backend/src/services/
파일: newFeature.js
요청: [기능 설명]
기준: 기존 코드 스타일 유지, 에러 처리 포함"

3. AI가 코드 생성
4. 수정 필요시 다시 Ctrl+K
5. 완료 후 터미널에서 git commit
```

### 3.2 버그 수정

```
1. 버그가 있는 파일 열기
2. Ctrl+K
3. 다음 형식으로 입력:

"파일: [파일명]
문제: [오류 설명]
현재 동작: [실제 동작]
예상 동작: [원하는 동작]
원인 분석 후 수정해줘"

4. AI가 분석 및 수정
5. 코드 검토 후 적용
```

### 3.3 코드 리뷰

```
1. 검토할 코드 선택
2. Ctrl+Shift+K
3. "이 코드를 리뷰해줘. 문제점과 개선 방안을 제시해"

또는

1. 특정 함수에서 우클릭
2. "Explain" 선택
3. AI가 코드 설명
```

---

## 4. Cursor Composer (고급 기능)

### 4.1 여러 파일 동시 수정

```
1. Ctrl+K 또는 메뉴에서 Composer 열기
2. 수정할 파일들 추가:
   - @파일경로/backend/src/server.js
   - @파일경로/frontend/src/App.jsx
3. 통합 요청:
   "이 두 파일을 수정해줘:
    - 백엔드에 새 엔드포인트 추가
    - 프론트엔드에서 이 엔드포인트 호출"

4. AI가 여러 파일 동시 수정
```

### 4.2 파일 참조

```
요청에서 파일 참조:
"@파일경로/backend/src/llmManager.js 의 generateScenarioBasedMissions() 함수를 보고,
같은 패턴으로 새로운 함수를 만들어줘"

또는

"@파일경로/frontend/src/App.jsx 의 상태 관리 방식을 보고,
새 컴포넌트에서도 같은 방식 적용해줘"
```

---

## 5. 프롬프트 템플릿 (복사해서 사용)

### 5.1 새 기능 추가

```
프로젝트: Pronunciation Master
위치: [backend/src/ 또는 frontend/src/]
파일: [파일 이름]

기능 설명:
[상세한 설명]

참고할 파일:
@파일경로/[참고 파일]

요청:
1. [기능 1]
2. [기능 2]
3. [기능 3]

기준:
- 기존 코드 스타일 유지
- 에러 처리 필수
- 주석 추가
- 타입 체크 (필요시)
```

### 5.2 버그 수정

```
파일: [파일 경로]

문제:
[오류 메시지 또는 설명]

현재 코드:
[문제 있는 코드 스니펫]

현재 동작:
[실제로 일어나는 일]

예상 동작:
[어떻게 되어야 하는가]

원인 분석 후 수정해줄래?
```

### 5.3 코드 리팩토링

```
파일: [파일 경로]

현재 코드:
[코드 전체]

개선 목표:
1. [성능/가독성/etc]
2. [유지보수성]
3. [etc]

다음을 고려해줘:
- 기존 기능 유지
- 호환성 보장
- 성능 개선

개선된 코드를 보여줄래?
```

---

## 6. 터미널과 함께 사용

### 6.1 Git 워크플로우

```bash
# 1. 파일 수정 (Cursor에서)
# (Ctrl+K로 AI 지원)

# 2. 변경사항 확인 (터미널)
git status

# 3. 파일 추가
git add .

# 4. 커밋
git commit -m "feat: 기능 설명"

# 5. 푸시
git push origin main
```

### 6.2 Docker와 함께

```bash
# 1. 파일 수정 (Cursor에서)

# 2. Docker 빌드 (터미널)
docker compose build

# 3. Docker 실행
docker compose up

# 4. 테스트 (브라우저)
# http://localhost:3000

# 5. 로그 확인 (터미널)
docker compose logs -f backend
```

### 6.3 실시간 개발

```
┌─────────────────────┐
│   Cursor (편집)     │
│  Ctrl+K로 AI 지원   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ 터미널 (실행)      │
│ docker compose up   │
│ 또는 npm run dev    │
└─────────────────────┘
```

---

## 7. AI 코드 생성 팁

### 7.1 명확한 요청

```
❌ 나쁜 요청:
"발음 분석 함수 만들어줘"

✅ 좋은 요청:
"backend/src/services/ 에 pronunciationAnalyzer.js 를 만들어줘.
기능:
1. 사용자 음성 입력 받기
2. Ollama의 mistral 모델 사용해서 발음 평가
3. 0-100 점수 반환
4. 구체적인 피드백 메시지 포함

참고: llmManager.js 의 generateScenarioBasedMissions() 패턴 따라서"
```

### 7.2 컨텍스트 제공

```
❌ 부족한 요청:
"에러 처리 추가해줘"

✅ 좋은 요청:
"backend/src/routes/mission.js 에서 POST /api/mission/generate-by-scenario 핸들러에
다음 에러 처리를 추가해줘:
1. 빈 데이터 체크
2. LLM 연결 실패 처리
3. 타임아웃 처리 (30초)
4. 500 에러 응답

참고 파일: @파일경로/backend/src/server.js 의 다른 라우트들"
```

### 7.3 단계적 요청

```
1단계 요청:
"backend/src/ 에 userProgress.js 파일을 만들어줘.
기본 구조만: 클래스 정의, 초기화"

2단계 요청 (결과 보고):
"위에서 만든 userProgress.js에 다음 메서드를 추가해줘:
- saveProgress()
- getProgress()
- updateStats()"

3단계 요청:
"이제 이걸 backend/src/server.js 에서 사용하게 해줘"
```

---

## 8. Cursor의 AI 모드 설정

### 8.1 AI 모델 선택

```
Cursor 메뉴:
1. Settings (⚙️)
2. Model Selection
3. 원하는 모델 선택:
   - GPT-4 (가장 강력)
   - Claude 3 Opus (균형잡힘)
   - GPT-3.5 (빠름)
```

### 8.2 코드 완성 설정

```
Settings:
1. Features
2. Autocomplete
3. 원하는 옵션 활성화:
   - AI-powered completions
   - Tab complete
   - Inline suggestions
```

---

## 9. 자주 사용할 요청 패턴

### 패턴 1: 파일 생성
```
파일: [경로]/[이름].js
기능: [간단한 설명]
```

### 패턴 2: 기능 추가
```
파일: [경로]/[이름].js
추가 기능: [설명]
참고: [참고할 파일]
```

### 패턴 3: 버그 수정
```
파일: [경로]/[이름].js
문제: [설명]
예상: [원하는 결과]
```

### 패턴 4: 코드 설명
```
파일: [경로]/[이름].js
함수: [함수명]
설명해줄래?
```

---

## 10. 효율성 팁

### 10.1 여러 파일 한번에
```
Composer 사용:
@파일1
@파일2
@파일3
"이 세 파일을 함께 수정해서 [기능] 구현해줘"
```

### 10.2 기존 코드 학습
```
"@파일1 을 읽고 같은 패턴으로
@파일2 에서 [함수명] 함수를 만들어줘"
```

### 10.3 반복 작업 자동화
```
"다음 파일들에 모두 [수정사항] 을 적용해줘:
@파일1
@파일2
@파일3
...
@파일N"
```

---

## 11. 디버깅 팁

### 11.1 에러 스택 추적
```
터미널 에러를 복사해서:
"이 에러를 분석해줄래?
[스택 트레이스]

파일: @파일경로/[파일]
원인이 뭘까?"
```

### 11.2 성능 분석
```
"이 함수의 성능을 분석해줄래?
@파일경로/[파일]

현재 시간 복잡도: ?
최적화 방안: ?"
```

---

## 12. 안내 메모리 (Context Window)

Cursor에 제공할 수 있는 추가 파일들:

```bash
# Cursor에서 항상 참고하도록 지정
@파일경로/.cursorrules
@파일경로/CURSOR_MASTER_PROMPTS.md
@파일경로/README.md
```

---

## 🎯 추천 워크플로우

```
┌─────────────────┐
│  기능 요청      │
│  Cursor에 입력  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI가 코드 생성  │
│ Ctrl+K         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 코드 검토       │
│ 필요시 수정 요청│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Git 커밋        │
│ 터미널에서      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docker 테스트   │
│ 로컬 검증       │
└─────────────────┘
```

---

## ✅ 체크리스트

Cursor 설정 완료:
- [ ] .cursorrules 파일 생성
- [ ] 단축키 학습
- [ ] CURSOR_MASTER_PROMPTS.md 참고
- [ ] 첫 번째 AI 코드 생성 테스트
- [ ] Git 워크플로우 확인
- [ ] Docker 통합 테스트

---

**Happy coding with Cursor! 🚀**

이제 효율적으로 프로젝트를 개발할 준비가 됐습니다!

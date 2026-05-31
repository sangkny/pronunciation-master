# Cursor 협업 최종 체크리스트

## 🚀 즉시 시작하기

### Step 1: Cursor 설정 (5분)

```bash
# 1. Cursor 설치
# https://cursor.sh 에서 다운로드

# 2. 프로젝트 폴더 열기
# Cursor → File → Open Folder
# Learning-Languages/pronunciation-master 선택

# 3. .cursorrules 파일 생성
# Ctrl+Shift+P → Create .cursorrules
# 또는 프로젝트 루트에 .cursorrules 파일 생성
```

### Step 2: 첫 번째 AI 코드 생성 (2분)

```
1. Cursor 열기
2. Ctrl+K (또는 Cmd+K)
3. 다음 입력:

"프로젝트: Pronunciation Master
위치: frontend/src/
파일: components/ScenarioInput.jsx
기능: 
사용자가 학습 상황을 입력하는 컴포넌트
- 입력 필드 (placeholder: '예: 의료기기 전시회에서 발표')
- 학습 분야 선택 (Medical, Telecom, Finance, Technology, Automotive)
- 미션 개수 선택 (1-10)
- '맞춤 연습 생성' 버튼

참고: frontend/src/App.jsx 의 상태 관리 방식

기준:
- React 함수형 컴포넌트
- useState, useCallback 사용
- 입력 유효성 검사 포함
"

4. AI가 코드 생성
5. 검토 후 저장
```

---

## 📋 필수 문서 체크리스트

프로젝트 폴더에 다음 파일들이 있는지 확인:

### .cursorrules 파일
```bash
# 프로젝트 루트에 있어야 함
Learning-Languages/pronunciation-master/.cursorrules
```

**내용:**
```
# Cursor Rules for Pronunciation Master

## Project Structure
- Backend: backend/src/ (Express.js)
- Frontend: frontend/src/ (React)
- LLM: Ollama (via llmManager.js)

## Key Files
- backend/src/server.js
- frontend/src/App.jsx
- backend/src/services/llmManager.js

## Rules
1. 파일은 해당 폴더(backend/src/ 또는 frontend/src/)에 생성
2. API는 /api/ 경로로 시작
3. 에러 처리 필수
4. Git commit: feat/fix/chore: 형식
```

### 참고 문서
- `CURSOR_MASTER_PROMPTS.md` - 10가지 프롬프트 템플릿
- `CURSOR_SETUP_GUIDE.md` - 상세 설정 가이드
- `.cursorrules` - 프로젝트 규칙

---

## 🎯 일일 개발 루틴

### 아침 (프로젝트 시작)

```bash
# 1. 최신 코드 가져오기
cd Learning-Languages/pronunciation-master
git pull origin main

# 2. Docker 실행
docker compose up

# 3. Cursor 열기
# Cursor → File → Open Folder → 이 폴더 선택
```

### 개발 중 (새 기능 추가)

```
1. Cursor에서 Ctrl+K
2. 템플릿 선택:

📝 새 기능 추가
"프로젝트: Pronunciation Master
위치: [backend/src/ 또는 frontend/src/]
파일: [파일명]
기능: [상세 설명]
참고: @파일경로/[참고할 파일]"

🐛 버그 수정
"파일: [경로]
문제: [설명]
현재 동작: [실제]
예상 동작: [원하는]"

📚 문서 작성
"파일: docs/[문서명].md
내용: [설명]"

3. AI가 코드 생성
4. 코드 검토 및 수정
5. Ctrl+J (터미널) → 테스트
```

### 저녁 (코드 저장)

```bash
# 1. 변경사항 확인
git status

# 2. 파일 추가
git add .

# 3. 커밋
git commit -m "feat/fix/chore: 설명"

# 4. 푸시
git push origin main

# 5. Docker 중지 (필요시)
docker compose down
```

---

## 💬 자주 사용할 프롬프트

### 프롬프트 1️⃣ : 새 기능 개발
```
프로젝트: Pronunciation Master
위치: [backend/src/ 또는 frontend/src/]
파일: [파일명]

기능:
[상세 설명]

참고:
@파일경로/[참고 파일]

요청:
1. [기능 1]
2. [기능 2]

기준:
- 기존 코드 스타일 유지
- 에러 처리 필수
- 주석 추가
```

### 프롬프트 2️⃣ : 버그 수정
```
파일: [파일 경로]

문제:
[오류 설명]

현재 코드:
[코드 스니펫]

현재 동작:
[실제 동작]

예상 동작:
[원하는 동작]

분석 후 수정해줄래?
```

### 프롬프트 3️⃣ : 코드 리팩토링
```
파일: [파일 경로]

개선 목표:
1. [성능]
2. [가독성]
3. [유지보수성]

현재 코드:
[코드]

개선 제안해줄래?
```

### 프롬프트 4️⃣ : 파일 참조
```
파일 @파일경로/backend/src/llmManager.js 의 
generateScenarioBasedMissions() 함수를 보고,

같은 패턴으로 새로운 함수를 만들어줄래?
[원하는 함수 설명]
```

### 프롬프트 5️⃣ : 여러 파일 동시 수정
```
이 두 파일을 함께 수정해줄래?

@파일경로/backend/src/server.js - 새 엔드포인트 추가
@파일경로/frontend/src/App.jsx - 엔드포인트 호출

[구체적인 요청]
```

---

## 🔍 코드 리뷰 요청

```
이 코드를 리뷰해줄래?
@파일경로/[파일]

검토 항목:
1. 코드 스타일
2. 성능 이슈
3. 보안 취약점
4. 에러 처리
5. 개선 방안

문제점과 개선 코드를 제시해줄래?
```

---

## 📊 개발 진행 상황 추적

### 기능별 체크리스트

```
기능: [기능명]

□ 백엔드 로직 구현
  - 파일: [파일]
  - API: [엔드포인트]

□ 프론트엔드 UI 구현
  - 파일: [파일]
  - 컴포넌트: [컴포넌트]

□ 테스트 코드 작성
  - 파일: [테스트 파일]

□ 문서 작성
  - 파일: docs/[문서]

□ Docker 테스트
  - 빌드: docker compose build
  - 실행: docker compose up

□ Git 커밋
  - 메시지: [커밋 메시지]
```

---

## 🚨 문제 해결

### 문제 1: AI 코드가 원하는 것과 다를 때

```
Ctrl+K 다시 눌러서:

"위 코드를 수정해줄래?

변경사항:
1. [변경 1]
2. [변경 2]

참고: @파일경로/[참고 파일]"
```

### 문제 2: Docker 빌드 실패

```bash
# 1. 이전 빌드 정리
docker compose down
docker system prune -a

# 2. 다시 빌드
docker compose build --no-cache

# 3. 로그 확인
docker compose logs

# 4. Cursor에 요청
"docker-compose.yml 또는 Dockerfile을 수정해줄래?
에러:
[에러 메시지]"
```

### 문제 3: API 호출 실패

```
파일: [파일]

API 호출:
fetch('[엔드포인트]')

에러:
[에러 메시지]

Cursor:
"이 API 호출 에러를 수정해줄래?

백엔드 엔드포인트: @파일경로/backend/src/server.js
프론트엔드 호출: @파일경로/frontend/src/[파일]"
```

---

## ✅ 일일 체크리스트

### 아침
- [ ] `git pull origin main`
- [ ] `docker compose up` 실행
- [ ] Cursor 열기
- [ ] 어제 코드 검토

### 개발 중
- [ ] Ctrl+K로 기능 요청
- [ ] AI 코드 생성
- [ ] 코드 검토 (논리, 에러 처리, 스타일)
- [ ] 로컬 테스트 (브라우저 또는 API)
- [ ] 필요시 수정 요청

### 저녁
- [ ] 변경사항 확인: `git status`
- [ ] 파일 추가: `git add .`
- [ ] 커밋: `git commit -m "..."`
- [ ] 푸시: `git push origin main`
- [ ] Docker 상태 확인
- [ ] 내일 계획 정리

---

## 🎓 학습 자료

### Cursor 공식 문서
- [Cursor 사용 설명서](https://cursor.sh)
- AI 코드 생성 기능
- IDE 단축키

### 프로젝트 문서
- `.cursorrules` - 프로젝트 규칙
- `CURSOR_MASTER_PROMPTS.md` - 프롬프트 템플릿
- `CURSOR_SETUP_GUIDE.md` - 설정 가이드

### 코드 참고
- `backend/src/server.js` - Express 패턴
- `frontend/src/App.jsx` - React 패턴
- `backend/src/services/llmManager.js` - LLM 통합

---

## 🚀 빠른 시작 (10분)

```bash
# 1. Cursor 설치 (2분)
# https://cursor.sh 에서 다운로드 및 설치

# 2. 프로젝트 열기 (1분)
# Cursor → File → Open Folder
# Learning-Languages/pronunciation-master

# 3. 첫 코드 생성 (5분)
# Ctrl+K
# "프로젝트: Pronunciation Master
#  위치: frontend/src/components/
#  파일: HelloWorld.jsx
#  간단한 React 컴포넌트 만들어줘"

# 4. 테스트 (2분)
# docker compose up
# http://localhost:3000 확인

# ✅ 완료!
```

---

## 📞 주요 연락처/참고

### 파일 경로
- 프로젝트: `Learning-Languages/pronunciation-master/`
- 백엔드: `backend/src/`
- 프론트엔드: `frontend/src/`
- 문서: `docs/`

### 포트
- 프론트엔드: 3000
- 백엔드: 5000
- Ollama: 11434

### 환경 변수 (.env.local)
```
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://ollama:11434
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

---

## 🎯 다음 목표

### 이번 주
- [ ] Cursor 기본 사용법 숙달
- [ ] 첫 번째 기능 구현
- [ ] Git 워크플로우 확립

### 다음 주
- [ ] 2-3개 기능 추가 구현
- [ ] 테스트 코드 작성
- [ ] 문서 정비

### 이번 달
- [ ] 주요 기능 완성
- [ ] 성능 최적화
- [ ] 배포 준비

---

## ✨ 최종 팁

1. **명확한 요청**: 구체적으로 무엇을 원하는지 명시
2. **파일 참조**: @경로를 사용해 AI에 파일 컨텍스트 제공
3. **단계적 작업**: 큰 작업은 여러 단계로 나누기
4. **코드 검토**: AI가 생성한 코드를 항상 검토
5. **문서화**: 완료 후 반드시 문서 업데이트
6. **Git 관리**: 자주 커밋해서 히스토리 보존

---

**이제 Cursor와 함께 효율적으로 개발할 준비가 됐습니다! 🚀**

Happy coding! 💻

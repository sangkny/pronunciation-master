# Git Update Prompt - Pronunciation Master

## 🎯 지금 바로 실행할 Git 커밋 명령어

### Step 1: 현재 상태 확인

```bash
cd Learning-Languages/pronunciation-master

# 변경 사항 확인
git status

# 변경된 파일 목록
git diff --name-only
```

### Step 2: 모든 파일 추가

```bash
git add .
```

### Step 3: 메인 커밋 (전체 작업 정리)

```bash
git commit -m "feat: Pronunciation Master MVP 완성 - Docker 환경, Backend/Frontend 통합, UI 렌더링"
```

또는 더 상세하게:

```bash
git commit -m "feat: 영어 발음 학습 앱 MVP 완성

기능:
- 5가지 분야 선택 UI (의료기기, 통신기술, 금융, 기술, 자동차)
- Express.js 백엔드 API 구축
- React/Vite 프론트엔드 구현
- Ollama LLM 통합
- Docker Compose 다중 컨테이너 설정

개선사항:
- Docker 환경 통일로 개발 생산성 향상
- LLM Manager 패턴으로 AI 프로바이더 추상화
- 명확한 API 구조 설계
- 에러 처리 기본 구조 구현

다음 단계:
- UI/UX 개선 (Tailwind CSS)
- 실제 LLM 응답 처리
- TTS/STT 구현"
```

### Step 4: 푸시

```bash
git push origin main
```

---

## 📝 상황별 커밋 메시지

### 상황 1: 완전히 새로운 기능 추가

```bash
git commit -m "feat: [기능명] 구현

기능 설명:
- [세부 사항 1]
- [세부 사항 2]
- [세부 사항 3]

영향받는 파일:
- [파일 경로 1]
- [파일 경로 2]"
```

**예시:**
```bash
git commit -m "feat: TTS (Text-to-Speech) 기능 구현

기능 설명:
- Web Speech API를 사용한 음성 재생
- 발음 속도 조절 (0.6, 0.8, 1.0)
- 재생 중 UI 상태 표시

영향받는 파일:
- frontend/src/App.jsx
- frontend/src/services/audioService.js"
```

### 상황 2: 버그 수정

```bash
git commit -m "fix: [버그 설명] 수정

문제:
- [어떤 버그가 있었는가]

원인:
- [왜 이런 버그가 발생했는가]

해결:
- [어떻게 수정했는가]

테스트:
- [어떻게 확인했는가]"
```

**예시:**
```bash
git commit -m "fix: Frontend 포트 매핑 오류 수정

문제:
- Vite가 5173에서 실행되지만 3000으로 매핑됨

원인:
- docker-compose.yml의 포트 설정 오류

해결:
- docker-compose.yml에서 5173:5173으로 수정

테스트:
- http://localhost:5173 접속 확인"
```

### 상황 3: 코드 리팩토링

```bash
git commit -m "refactor: [부분] 코드 개선

개선 사항:
- [개선 1]: [설명]
- [개선 2]: [설명]

성능 영향:
- [성능 개선 지표]

호환성:
- [기존 기능은 영향 없음 / 주의사항]"
```

**예시:**
```bash
git commit -m "refactor: llmManager 구조 개선

개선 사항:
- 에러 처리 강화: 타임아웃 추가
- 프롬프트 관리: 별도 파일로 분리
- 응답 파싱: JSON 유효성 검사 추가

성능 영향:
- 에러 처리로 인해 응답 시간 최대 2배 증가 (타임아웃 30초)

호환성:
- API 응답 형식 동일 (기존 기능 영향 없음)"
```

### 상황 4: 문서 업데이트

```bash
git commit -m "docs: [문서명] 업데이트

변경사항:
- [변경 1]
- [변경 2]

이유:
- [왜 업데이트했는가]"
```

**예시:**
```bash
git commit -m "docs: Cursor Handover 문서 작성

변경사항:
- 프로젝트 개요 작성
- 현재 상태 정리
- 우선순위 작업 목록 추가
- API 명세 작성

이유:
- Cursor와의 효율적인 협업을 위한 문서화
- 팀원 온보딩 시간 단축"
```

### 상황 5: 의존성 업데이트

```bash
git commit -m "chore: [의존성] 업데이트

업데이트된 패키지:
- [패키지 1]: [구 버전] → [신 버전]
- [패키지 2]: [구 버전] → [신 버전]

이유:
- [보안 패치 / 성능 개선 / 새 기능]

테스트:
- [어떻게 테스트했는가]"
```

**예시:**
```bash
git commit -m "chore: npm 의존성 업데이트

업데이트된 패키지:
- react: 18.2.0 → 18.3.0
- vite: 5.0.8 → 5.1.0

이유:
- 보안 패치: React에서 XSS 취약점 수정
- 성능 개선: Vite 빌드 속도 향상

테스트:
- npm audit: 취약점 0개
- docker compose up: 정상 작동 확인"
```

---

## 🔄 주간 Git 워크플로우

### 월요일: 주간 목표 설정

```bash
git commit -m "chore: 주간 목표 설정 (2026-05-31 ~ 06-06)

목표:
- [ ] UI/UX 개선 (Tailwind CSS)
- [ ] API 실제 동작 (LLM 연결)
- [ ] TTS 구현

담당자: [이름]
예상 완료일: 2026-06-06"
```

### 수요일: 중간 점검

```bash
git commit -m "chore: 주간 진행상황 중간 점검

완료:
- ✅ [작업 1]
- ✅ [작업 2]

진행 중:
- 🔄 [작업 3] (80% 완료)

블로킹:
- ❌ [문제]

다음 액션:
- [무엇을 할 것인가]"
```

### 금요일: 주간 정리

```bash
git commit -m "chore: 주간 정리 및 다음주 계획

이번 주 완료:
- ✅ [작업 1]
- ✅ [작업 2]
- ✅ [작업 3]

남은 작업:
- [ ] [작업 4]: 다음주 우선순위

배운 점:
- [기술적 인사이트]
- [개선할 부분]

다음주 계획:
- [ ] [계획 1]
- [ ] [계획 2]"
```

---

## 📊 커밋 규약 정의

### Commit Type

```
feat:     새로운 기능
fix:      버그 수정
refactor: 코드 리팩토링
perf:     성능 개선
docs:     문서 업데이트
chore:    기타 (의존성, 설정, 도구)
test:     테스트 코드
ci:       CI/CD 설정
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**예시:**
```
feat(frontend): TTS 기능 구현

Web Speech API를 사용하여 발음 예시 음성 재생 기능 추가
- 발음 속도 조절 가능 (0.6x, 0.8x, 1.0x)
- 재생 중 UI 상태 변경
- 에러 처리 추가

Closes #123
```

### Scope (선택사항)

```
frontend: 프론트엔드 코드
backend:  백엔드 코드
docker:   Docker 설정
docs:     문서
ci:       CI/CD 설정
```

---

## ✅ 커밋 전 체크리스트

```bash
# 1. 코드 품질 확인
npm run lint        # 린트 검사
npm run test        # 테스트 실행

# 2. 변경사항 확인
git status          # 변경된 파일 확인
git diff            # 변경 내용 확인

# 3. 불필요한 파일 제거
# .env, node_modules, .DS_Store 등이 포함되면 안 됨
git check-ignore -v *

# 4. 마지막 확인
git diff --staged   # 커밋될 파일 확인

# 5. 커밋 메시지 작성
git commit -m "type(scope): subject"

# 6. 푸시
git push origin main
```

---

## 🚀 GitHub PR (Pull Request) 템플릿

PR을 보낼 때 사용:

```markdown
## 📝 설명 (Description)

[이 PR이 무엇을 하는지 설명하세요]

## 🎯 타입 (Type)

- [ ] 🐛 버그 수정
- [ ] ✨ 새로운 기능
- [ ] 🎨 UI/스타일 개선
- [ ] 📚 문서 업데이트
- [ ] ♻️ 리팩토링
- [ ] ⚡ 성능 개선

## ✅ 체크리스트

- [ ] 코드가 로컬에서 테스트됨
- [ ] 커밋 메시지가 명확함
- [ ] 새로운 의존성이 없거나 필요한 이유가 있음
- [ ] 기존 기능에 영향 없음

## 📸 스크린샷 (해당시)

[UI 변경 시 스크린샷 첨부]

## 🔗 관련 Issue

Closes #[이슈 번호]

## 💭 추가 설명

[필요하면 추가 설명]
```

---

## 📅 정기적 Git 관리

### 매주 금요일

```bash
# 주간 정리
git log --oneline -10  # 최근 커밋 10개 확인

# 다음주 준비
git branch -a          # 브랜치 확인

# 병합 대기 중인 PR 확인
# GitHub 페이지에서 확인
```

### 매달 말

```bash
# 월간 리뷰
git log --oneline --since="1 month ago"

# 기여도 통계
git shortlog -sn

# 파일 변경 통계
git log --stat --since="1 month ago"
```

---

## 🎯 지금 바로 커밋하기

### 빠른 커밋 (지금 당장)

```bash
cd Learning-Languages/pronunciation-master

git add .

git commit -m "feat: Pronunciation Master MVP 완성

완료:
- Docker 다중 컨테이너 환경 구축 (Backend, Frontend, Ollama)
- Express.js REST API 기본 구조
- React/Vite UI 구현 및 렌더링 성공
- LLM Manager를 통한 Ollama 통합
- 5가지 분야 선택 UI 완성

파일:
- backend/src/server.js: Express 메인 서버
- backend/src/services/llmManager.js: LLM 통합
- frontend/src/App.jsx: React 메인 컴포넌트
- docker-compose.yml: 컨테이너 오케스트레이션

상태:
- 앱 정상 작동 (http://localhost:5173)
- 모든 분야 선택 버튼 렌더링
- API 헬스 체크 통과

다음:
- UI/UX 개선 (Tailwind CSS)
- 실제 LLM 응답 처리
- TTS/STT 구현"

git push origin main
```

### 상세한 커밋 (권장)

```bash
git add .

git commit << 'EOF'
feat: Pronunciation Master MVP 완성 - 기본 인프라 및 UI 구축

## 📋 개요
AI 기반 영어 발음 교정 학습 앱의 MVP 단계 완성.
Docker 환경에서 Backend, Frontend, LLM 완전히 통합.

## ✨ 완료된 기능
1. Backend (Express.js)
   - REST API 기본 구조
   - /api/mission/generate-by-scenario 엔드포인트
   - /api/pronunciation/analyze 기본 구현
   - LLM Manager를 통한 모듈화

2. Frontend (React + Vite)
   - 5가지 분야 선택 UI
   - 기본 상태 관리
   - API 클라이언트 통합
   - 정상 렌더링

3. Infrastructure
   - Docker Compose 3개 서비스
   - Ollama LLM 통합
   - 네트워크 및 볼륨 설정
   - 포트 매핑 완료

## 📁 수정된 파일
- backend/src/server.js: 완전 작성
- backend/src/services/llmManager.js: 완전 작성
- backend/Dockerfile: 최적화
- frontend/src/App.jsx: 완전 작성
- frontend/src/main.jsx: 작성
- frontend/index.html: 작성
- frontend/Dockerfile.dev: 최적화
- docker-compose.yml: 최적화

## ✅ 테스트 결과
- docker compose build: 성공
- docker compose up: 모든 서비스 정상 시작
- http://localhost:5000/health: 응답 확인
- http://localhost:5173: UI 렌더링 확인

## 🎯 다음 우선순위
1. UI/UX 개선 (Tailwind CSS)
2. API 실제 동작 (LLM 연결)
3. TTS 구현
4. STT 구현
5. 발음 분석 기능

## 📝 관련 문서
- CURSOR_HANDOVER.md: Cursor 협업 가이드
- BOOK_CHAPTER_AI_LANGUAGE_LEARNING_APP.md: 기술 문서
- CURSOR_SETUP_GUIDE.md: 개발 환경 설정
EOF

git push origin main
```

---

## 💡 팁

### Commit 메시지를 에디터로 작성하려면

```bash
# VS Code를 에디터로 사용
git config --global core.editor "code --wait"

# 이후 git commit (메시지 없이)만 입력하면 에디터 열림
git commit
```

### 마지막 커밋 수정

```bash
# 방금 커밋 메시지 수정
git commit --amend -m "새로운 메시지"

# 파일 추가 후 같은 커밋에 포함
git add .
git commit --amend --no-edit
```

### 커밋 히스토리 보기

```bash
# 이쁘게 보기
git log --oneline --graph --all

# 상세 정보
git log --stat

# 특정 파일의 변경 히스토리
git log --follow -p frontend/src/App.jsx
```

---

**지금 바로 커밋하고 푸시하세요!** 🚀

모든 작업이 완료되었습니다. Git에 기록하면 히스토리가 남고, 향후 참고할 수 있습니다.


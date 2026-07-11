# 🚀 Cursor 최종 프로젝트 시작 프롬프트

## 📍 프로젝트 정보

**프로젝트명:** Pronunciation Master  
**프로젝트 경로:** `D:\sangkny\work\doc\external_activity\Learning-Languages\pronunciation-master`  
**현재 상태:** MVP 완성 (UI 렌더링 성공)  
**개발 환경:** WSL (Windows Subsystem for Linux) + Docker + Local LLM (Gemma 4)  
**마지막 업데이트:** 2026-05-31

---

## 🔧 개발 환경 설정 (필수 확인)

### WSL + Docker 환경에서 실행 (중요!)

이 프로젝트는 **WSL + Docker 환경에서만 작동**합니다:

```bash
# 1️⃣ WSL 터미널 열기
# Windows에서 "WSL" 또는 "Ubuntu" 검색해서 터미널 열기

# 2️⃣ 프로젝트 폴더로 이동 (WSL 경로)
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# 3️⃣ Docker 확인
docker --version
docker compose --version

# 4️⃣ Docker 실행 중인지 확인
docker ps

# 위 명령어들이 모두 성공하면 환경 준비 완료!
```

**만약 Docker가 설치되지 않았다면:**
1. Docker Desktop 설치 (Windows)
2. WSL2 활성화 (Docker Desktop 설정에서)
3. 재부팅 후 확인

---

## 🤖 로컬 LLM 설정: Gemma 4

### 현재 설정

```
LLM: Gemma 4 (로컬)
프로바이더: Ollama
포트: 11434
API: http://ollama:11434
```

### Gemma 4 모델 사용

Gemma 4는 Google의 가볍고 빠른 모델입니다.

```bash
# WSL 터미널에서 (Docker 실행 중일 때)
docker exec pronunciation-ollama ollama pull gemma:4b

# 또는 더 강력한 버전
docker exec pronunciation-ollama ollama pull gemma2:9b

# 확인
curl http://localhost:11434/api/tags
```

### LLM 프로바이더 설정

```bash
# backend/.env.local 또는 .env 설정
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://ollama:11434
OLLAMA_MODEL=gemma:4b   # ← Gemma 4 명시
```

---

## 📁 파일 위치 확인 (필수)

### 프로젝트 루트에 있어야 할 파일

```bash
D:\sangkny\work\doc\external_activity\Learning-Languages\pronunciation-master\
├── .cursorrules                    ← Cursor 규칙 (필수!)
├── CURSOR_HANDOVER.md             ← 협업 가이드
├── GIT_COMMIT_PROMPT.md           ← Git 관리
└── docker-compose.yml              ← Docker 설정
```

**확인 명령어:**
```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# 파일 확인
ls -la | grep -E ".cursorrules|CURSOR_HANDOVER|GIT_COMMIT|docker-compose"

# 모두 있으면 ✅, 없으면 아래 복사 명령어 실행
```

### 파일 없으면 복사 (WSL 터미널에서)

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# .cursorrules 확인/복사
if [ ! -f .cursorrules ]; then
  cp /mnt/user-data/outputs/.cursorrules ./
fi

# CURSOR_HANDOVER.md 확인/복사
if [ ! -f CURSOR_HANDOVER.md ]; then
  cp /mnt/user-data/outputs/CURSOR_HANDOVER.md ./
fi

# GIT_COMMIT_PROMPT.md 확인/복사
if [ ! -f GIT_COMMIT_PROMPT.md ]; then
  cp /mnt/user-data/outputs/GIT_COMMIT_PROMPT.md ./
fi

# docs/ 폴더 파일들 복사
mkdir -p docs
for file in BOOK_CHAPTER_AI_LANGUAGE_LEARNING_APP FINAL_SUMMARY_3_DOCUMENTS CURSOR_SETUP_GUIDE CLAUDE_CODE_GUIDE CURSOR_VS_CLAUDE_CODE CURSOR_MASTER_PROMPTS; do
  if [ ! -f docs/${file}.md ]; then
    cp /mnt/user-data/outputs/${file}.md docs/ 2>/dev/null
  fi
done

# 확인
ls -lh .cursorrules CURSOR_HANDOVER.md GIT_COMMIT_PROMPT.md
ls -lh docs/ | grep -E "BOOK_CHAPTER|FINAL_SUMMARY|CURSOR|CLAUDE"
```

---

## 🌐 포트 설정 및 충돌 방지

### 현재 포트 설정 (기본값)

```yaml
Backend: 5000
Frontend: 5173
Ollama: 11434
```

### 포트 동적 할당 (.env.local)

```bash
# WSL 터미널에서
cat > .env.local << 'EOF'
# Backend Port
BACKEND_PORT=5000
BACKEND_CONTAINER_PORT=5000

# Frontend Port
FRONTEND_PORT=5173
FRONTEND_CONTAINER_PORT=3000

# Ollama Port
OLLAMA_PORT=11434
OLLAMA_CONTAINER_PORT=11434

# LLM Configuration
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://ollama:11434
OLLAMA_MODEL=gemma:4b
EOF

cat .env.local
```

### 포트 충돌 확인

```bash
# 사용 중인 포트 확인
lsof -i :5000
lsof -i :5173
lsof -i :11434

# 충돌 시 .env.local에서 다른 포트로 변경
# BACKEND_PORT=5001
# FRONTEND_PORT=5174
# OLLAMA_PORT=11435
```

---

## 🐳 Docker Compose 실행 (WSL 터미널)

### 터미널 1: Docker 실행 (계속 실행)

```bash
# WSL 터미널 1 열기
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# Docker 실행
docker compose down   # 이전 컨테이너 정리
docker compose build  # 이미지 빌드 (처음만 시간 걸림)
docker compose up     # 실행 (이 창은 계속 열어두기)

# 예상 출력:
# ✅ Ollama service started on port 11434
# ✅ Backend running on port 5000
# ✅ Frontend running on port 5173

# Ctrl+C를 누르면 중지됨 (이 창은 닫지 말 것!)
```

### 실시간 로그 확인

```bash
# 다른 WSL 터미널에서 (터미널 1은 유지)
docker logs -f pronunciation-backend
docker logs -f pronunciation-frontend
docker logs -f pronunciation-ollama
```

---

## 💻 Cursor 열기 (WSL 터미널 2)

```bash
# WSL 터미널 2 열기 (터미널 1은 docker compose up 계속 실행)
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# Cursor/VS Code 열기
code .

# 또는 Cursor 직접 실행
cursor .
```

### Cursor가 열렸을 때

1. ✅ `.cursorrules` 자동으로 적용됨 (확인: 설정에서 규칙이 적용되었는지 보기)
2. ✅ `CURSOR_HANDOVER.md` 가장 먼저 읽기
3. ✅ 프로젝트 구조 이해
4. ✅ 다음 작업 진행

---

## ✅ 현재 상태 점검

### 확인해야 할 것들

```bash
# ✅ 1. 프로젝트 경로 확인
pwd  # /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master 이어야 함

# ✅ 2. Docker 상태 확인
docker ps  # 3개 컨테이너 보여야 함 (backend, frontend, ollama)

# ✅ 3. API 헬스 체크
curl http://localhost:5000/health  # {"status":"healthy"}

# ✅ 4. Frontend 접속
# 브라우저에서 http://localhost:5173 또는 http://localhost:3000
# → "Pronunciation Master" 제목과 5개 분야 버튼 보여야 함

# ✅ 5. Ollama 모델 확인
curl http://localhost:11434/api/tags
# gemma 또는 mistral 모델이 보여야 함

# ✅ 6. 파일 위치 확인
ls -lh .cursorrules CURSOR_HANDOVER.md GIT_COMMIT_PROMPT.md
```

---

## 🎯 Cursor에서 해야 할 첫 번째 작업

### 즉시 시작할 작업 (프롬프트)

다음을 Cursor의 Ctrl+K에 입력:

```
프로젝트: Pronunciation Master
현재 상태: MVP 완성, UI 렌더링 성공
개발 환경: WSL + Docker + Gemma 4

파일: frontend/src/App.jsx

요청:
1. 현재 UI를 Tailwind CSS로 스타일링해줄래?
   - 분야별로 다른 배경색 지정
   - 호버 효과 추가
   - 반응형 디자인

2. "분야 선택" → "상황 입력" 화면 전환 기능
   - 분야 선택 후 상황 입력 페이지로 이동
   - 이전 버튼으로 분야 선택 화면으로 돌아가기

3. 색상 추천:
   - Medical: 파란색 (🏥)
   - Telecom: 주황색 (📡)
   - Finance: 초록색 (💰)
   - Technology: 보라색 (💻)
   - Automotive: 빨간색 (🚗)

기준:
- 기존 코드 스타일 유지
- lucide-react 아이콘 유지
- API는 아직 건드리지 말 것 (나중에 연결)
- 모바일 반응형 필수
```

---

## 🔄 WSL + Docker 워크플로우

### 매일 개발 시작

```bash
# 1️⃣ WSL 터미널 1 열기
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
docker compose up

# 2️⃣ WSL 터미널 2 열기
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
code .  # Cursor 실행

# 3️⃣ Cursor에서 작업
# Ctrl+K로 프롬프트 입력
# 코드 생성/수정

# 4️⃣ 테스트
# 브라우저: http://localhost:5173
# 또는 API: curl http://localhost:5000/health
```

### 개발 중 문제 발생 시

```bash
# 에러 로그 확인
docker logs pronunciation-backend | tail -50

# 포트 재설정 필요 시
# .env.local 수정 → docker compose restart

# 전체 재시작
docker compose down
docker compose build --no-cache
docker compose up
```

---

## 🤖 Gemma 4 LLM 활용

### Backend에서 사용

```bash
# llmManager.js에서 자동으로 사용됨
OLLAMA_MODEL=gemma:4b  # .env.local에서 설정
```

### 프롬프트 테스트

```bash
# WSL 터미널에서 Gemma 4 테스트
curl http://localhost:11434/api/generate -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma:4b",
    "prompt": "Create 3 English sentences for medical field",
    "stream": false
  }'
```

### 더 강력한 모델 필요 시

```bash
# Gemma2 (9B) 사용 가능 (시간 더 걸림)
docker exec pronunciation-ollama ollama pull gemma2:9b

# .env.local 수정
OLLAMA_MODEL=gemma2:9b

# Docker 재시작
docker compose restart pronunciation-backend
```

---

## 📋 체크리스트 (Cursor 시작 전)

```
환경 설정:
☑ WSL 터미널 1: docker compose up 실행 중
☑ WSL 터미널 2: 새로 열고 Cursor 준비
☑ Docker 컨테이너 3개 모두 실행 중 (docker ps 확인)

파일 위치:
☑ .cursorrules (프로젝트 루트)
☑ CURSOR_HANDOVER.md (프로젝트 루트)
☑ GIT_COMMIT_PROMPT.md (프로젝트 루트)
☑ docs/ 폴더에 기술 문서들

포트 설정:
☑ .env.local 작성됨
☑ Backend: 5000
☑ Frontend: 5173
☑ Ollama: 11434

LLM 설정:
☑ Gemma 4 모델 설치됨 (docker exec pronunciation-ollama ollama list)
☑ OLLAMA_MODEL=gemma:4b (.env.local)

앱 작동:
☑ http://localhost:5173 에서 UI 렌더링 확인
☑ curl http://localhost:5000/health 200 응답
☑ curl http://localhost:11434/api/tags Gemma 모델 확인

Cursor:
☑ Cursor/VS Code 열림
☑ .cursorrules 적용됨
☑ 첫 작업 프롬프트 준비됨
```

---

## 🚀 지금 바로 시작하기

### WSL 터미널 1: Docker 실행

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
docker compose up
# 이 터미널은 계속 열어두기!
```

### WSL 터미널 2: Cursor 실행

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
code .
# Cursor가 열림

# Cursor에서:
# 1. CURSOR_HANDOVER.md 읽기
# 2. Ctrl+K 로 위의 프롬프트 입력
# 3. 개발 시작!
```

### 브라우저: 앱 확인

```
http://localhost:5173
```

---

## 📞 문제 발생 시

### Docker 컨테이너가 안 올라옴

```bash
# 로그 확인
docker compose logs

# 재시작
docker compose down
docker compose build --no-cache
docker compose up
```

### 포트 충돌

```bash
# 사용 중인 포트 확인
lsof -i :5000
lsof -i :5173
lsof -i :11434

# .env.local에서 포트 변경
BACKEND_PORT=5001
FRONTEND_PORT=5174
OLLAMA_PORT=11435
```

### Gemma 4 모델 없음

```bash
docker exec pronunciation-ollama ollama list

# 없으면 설치
docker exec pronunciation-ollama ollama pull gemma:4b
```

---

## 📚 참고 자료

- **CURSOR_HANDOVER.md**: Cursor 협업 상세 가이드
- **GIT_COMMIT_PROMPT.md**: Git 커밋 관리
- **BOOK_CHAPTER_AI_LANGUAGE_LEARNING_APP.md**: 기술 서적 (docs/)
- **CURSOR_SETUP_GUIDE.md**: Cursor 설정 (docs/)

---

## ✨ 최종 확인

```
✅ WSL + Docker 환경 준비
✅ Gemma 4 LLM 설정
✅ 포트 충돌 방지 (환경 변수)
✅ 모든 문서 배치 완료
✅ Cursor 실행 준비 완료

→ 이제 Cursor에서 개발을 시작하세요! 🚀
```

---

**마지막 정리:**

```
터미널 1: WSL에서 docker compose up (유지)
    ↓
터미널 2: WSL에서 code . (Cursor 실행)
    ↓
Cursor가 열림 (.cursorrules 자동 적용)
    ↓
CURSOR_HANDOVER.md 읽기
    ↓
Ctrl+K로 작업 요청
    ↓
AI가 코드 생성/수정
    ↓
Git 커밋 (GIT_COMMIT_PROMPT 참고)
    ↓
다음 작업 진행
```

**행운을 빕니다! 🚀**


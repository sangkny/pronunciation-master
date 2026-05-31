# 🎤 Pronunciation Master

AI 기반 영어 발음 교정 및 상황별 동적 학습 앱

## 🚀 빠른 시작

### 전제조건
- Docker & Docker Compose
- Git
- WSL 2 (Windows 사용자)

### 설치

```bash
# 저장소 클론
git clone https://github.com/sangkny/pronunciation-master.git
cd pronunciation-master

# 환경 변수 설정
cp .env.example .env.local

# Docker 실행
docker compose up
```

### 접속
- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:5000
- Ollama: http://localhost:11434

## 📁 프로젝트 구조

```
pronunciation-master/
├── backend/               # Node.js 백엔드
├── frontend/              # React 프론트엔드
├── data/                  # 학습 데이터
├── docs/                  # 문서
├── docker-compose.yml     # Docker 구성
└── .env.example          # 환경 변수 템플릿
```

## 🤖 지원하는 LLM

- Ollama (로컬, 기본값)
- Claude API
- Google Gemini
- Cohere
- Hugging Face

## 📖 문서

- [빠른 시작](docs/QUICK_START.md)
- [WSL/Docker 가이드](docs/WSL_DOCKER_GUIDE.md)
- [LLM 프로바이더](docs/LLM_PROVIDERS_GUIDE.md)

## 🛠️ 개발

```bash
# 백엔드 개발
cd backend
npm install
npm run dev

# 프론트엔드 개발
cd frontend
npm install
npm run dev
```

## 📝 Git 워크플로우

```bash
# 변경사항 확인
git status

# 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: 기능 설명"

# 푸시
git push origin main
```

## 📄 라이선스

MIT

## 👤 작성자

Your Name

---

**행운을 빕니다! 🎉**

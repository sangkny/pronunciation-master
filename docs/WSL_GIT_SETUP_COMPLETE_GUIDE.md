# 🚀 WSL/커맨드라인 기반 개발 환경 완벽 설정 가이드

## 📋 목차
- [전체 절차 요약](#전체-절차-요약)
- [Step 1: WSL 준비](#step-1-wsl-준비)
- [Step 2: 프로젝트 폴더 구조 생성](#step-2-프로젝트-폴더-구조-생성)
- [Step 3: Git 초기화](#step-3-git-초기화)
- [Step 4: 파일 배치](#step-4-파일-배치)
- [Step 5: Docker 설정](#step-5-docker-설정)
- [Step 6: 개발 시작](#step-6-개발-시작)
- [Step 7: 일일 Git 워크플로우](#step-7-일일-git-워크플로우)
- [VSCode와 함께 사용](#vscode와-함께-사용)

---

## 전체 절차 요약

```
1️⃣  WSL 터미널 열기
     ↓
2️⃣  프로젝트 폴더 생성 및 폴더 구조 설정
     ↓
3️⃣  Git 초기화 & GitHub 연결
     ↓
4️⃣  제공된 파일들을 올바른 위치에 배치
     ↓
5️⃣  Docker 실행
     ↓
6️⃣  코드 수정 & 테스트
     ↓
7️⃣  Git으로 변경사항 저장
     ↓
8️⃣  반복 (6-7단계)
```

---

## ✅ 커서(VSCode) 사용 여부

### 👍 **VSCode 강력 추천** (하지만 필수는 아님)

```
✅ VSCode 사용하면:
  - 파일 관리 시각화
  - Git 통합 (코드 편집 패널에서 Git 제어)
  - 터미널 내장
  - 파일 미리보기
  - 빠른 검색 & 수정
  - 디버깅 도구

❌ 순수 커맨드라인만 사용하면:
  - 모든 것을 터미널에서 타이핑
  - 파일 구조 파악 어려움
  - 느린 작업
```

### 🎯 **추천 방식: VSCode + 터미널 병행**

```
VSCode에서:
  - 파일 생성/수정
  - 코드 작성
  - 파일 구조 확인

터미널에서:
  - Git 커밋/푸시
  - Docker 제어
  - 테스트 실행
```

---

## Step 1: WSL 준비

### 1.1 WSL 터미널 열기

```bash
# 방법 1: Windows 검색
# "Ubuntu" 또는 "WSL" 검색 후 실행

# 방법 2: PowerShell 또는 cmd에서
wsl

# 방법 3: Windows Terminal에서 Ubuntu 탭 클릭
```

### 1.2 기본 설정

```bash
# 터미널에서 실행

# 시스템 업데이트
sudo apt update
sudo apt upgrade -y

# 필수 도구 설치
sudo apt install -y \
    git \
    curl \
    wget \
    build-essential \
    python3

# Node.js 설치 (권장)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 설치 확인
git --version
node --version
npm --version
```

---

## Step 2: 프로젝트 폴더 구조 생성

### 2.1 폴더 위치 선택

```bash
# 권장: WSL 홈 디렉토리 또는 Windows의 프로젝트 폴더
# (Windows의 C:\Users\YourName\Projects\pronunciation-master 권장)

# 방법 A: WSL 홈에서 (권장)
cd ~
# 또는
cd /home/yourusername

# 방법 B: Windows 폴더에서 (WSL로 접근)
cd /mnt/c/Users/YourName/Projects
```

### 2.2 완벽한 폴더 구조 생성

```bash
# 프로젝트 디렉토리 생성
mkdir pronunciation-master
cd pronunciation-master

# 전체 폴더 구조 생성 (한 번에)
mkdir -p backend/src/{services/providers,routes,utils}
mkdir -p frontend/src/{components,services,utils}
mkdir -p frontend/public
mkdir -p data/{missions/completed,missions/skipped,user-progress,statistics}
mkdir -p docs
mkdir -p .github/workflows

# 확인
tree
# 또는
find . -type d | sort
```

### 2.3 전체 구조 시각화

```
pronunciation-master/
├── .git/                          (Git 저장소)
├── .github/
│   └── workflows/                 (CI/CD)
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   │   ├── server.js              ⭐ 백엔드 서버
│   │   ├── services/
│   │   │   ├── llmManager.js
│   │   │   └── providers/         (LLM 프로바이더들)
│   │   ├── routes/
│   │   │   ├── pronunciation.js
│   │   │   ├── translation.js
│   │   │   └── mission.js
│   │   └── utils/
│   └── init-db.sql
├── frontend/
│   ├── Dockerfile.dev
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.jsx                ⭐ 메인 컴포넌트
│       ├── components/
│       │   └── PronunciationApp.jsx
│       ├── services/
│       │   └── apiClient.js
│       └── utils/
├── data/
│   ├── missions/
│   │   ├── completed/             (완료한 미션)
│   │   └── skipped/               (스킵한 미션)
│   ├── user-progress/
│   └── statistics/
├── docs/
│   ├── QUICK_START.md
│   ├── WSL_DOCKER_GUIDE.md
│   ├── LLM_PROVIDERS_GUIDE.md
│   └── ...
├── docker-compose.yml             ⭐ Docker 구성
├── .env.example                   ⭐ 환경 변수
├── .env.local                     (실제 환경변수, git 무시)
├── .gitignore                     ⭐ Git 무시 파일
└── README.md                      ⭐ 프로젝트 설명
```

---

## Step 3: Git 초기화

### 3.1 Git 설정

```bash
# 프로젝트 폴더 안에서

# Git 사용자 설정 (처음 한 번만)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 설정 확인
git config --global user.name
git config --global user.email
```

### 3.2 Git 초기화

```bash
# 프로젝트 디렉토리에서
cd pronunciation-master

# Git 저장소 초기화
git init

# 확인
ls -la | grep .git
```

### 3.3 .gitignore 생성

```bash
# .gitignore 파일 생성
cat > .gitignore << 'EOF'
# 환경 변수
.env
.env.local
.env.*.local

# 의존성
node_modules/
dist/
build/
package-lock.json
yarn.lock

# 로그
*.log
logs/
npm-debug.log*

# OS
.DS_Store
Thumbs.db
.vscode/
.idea/

# 오디오 파일 (크기가 크므로 제외)
recordings/
*.wav
*.mp3
*.m4a

# 임시 파일
*.tmp
*.temp
.cache/

# IDE
.vscode/
.idea/
*.swp
*.swo

# 민감한 정보
.env.production
config/secrets.json

# 데이터베이스
*.db
*.sqlite
EOF

cat .gitignore
```

---

## Step 4: 파일 배치

### 4.1 제공된 파일 다운로드

```bash
# 다운로드 방법 (본인 방식에 맞게 선택)

# 방법 1: 직접 다운로드 (파일을 USB/이메일로 받은 경우)
# 파일들을 해당 폴더에 복사

# 방법 2: GitHub에서 클론 (추천, 아래에서 설명)
# 방법 3: 직접 타이핑 (권장하지 않음)
```

### 4.2 파일 복사 (구조 기반)

```bash
# Windows 파일 탐색기 또는 터미널에서
# 다음과 같이 파일을 올바른 위치에 복사

# 백엔드 파일들
# backend-server-complete.js → backend/src/server.js
# llmManager.js → backend/src/services/llmManager.js
# llm-providers.js → backend/src/services/providers/index.js
# backend-package.json → backend/package.json

# 프론트엔드 파일들
# pronunciation-master-enhanced-app.jsx → frontend/src/App.jsx
# frontend-apiClient.js → frontend/src/services/apiClient.js

# Docker 파일들
# docker-compose.yml → pronunciation-master/docker-compose.yml
# backend-Dockerfile → backend/Dockerfile
# frontend-Dockerfile.dev → frontend/Dockerfile

# 문서
# *.md → docs/

# 방법: VSCode에서 드래그 & 드롭 (권장)
# 또는 터미널에서 복사:

cp /경로/backend-server-complete.js backend/src/server.js
cp /경로/docker-compose.yml .
```

### 4.3 package.json 생성

```bash
# 백엔드 package.json
cat > backend/package.json << 'EOF'
{
  "name": "pronunciation-master-backend",
  "version": "1.0.0",
  "description": "Pronunciation Master Backend",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
EOF

# 프론트엔드 package.json
cat > frontend/package.json << 'EOF'
{
  "name": "pronunciation-master-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  }
}
EOF

cat backend/package.json
```

### 4.4 .env.example 생성

```bash
cat > .env.example << 'EOF'
# LLM 설정
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://ollama:11434
OLLAMA_MODEL=mistral

# API 키 (선택사항)
CLAUDE_API_KEY=
GOOGLE_GEMINI_API_KEY=
COHERE_API_KEY=
HF_API_KEY=

# 서버 설정
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# 데이터베이스 (선택사항)
DATABASE_URL=postgresql://user:password@localhost/db

# 로깅
LOG_LEVEL=debug
EOF

cat .env.example
```

### 4.5 .env.local 생성

```bash
# .env.local 생성 (실제 환경 변수)
cp .env.example .env.local

# 편집 (VSCode 또는 nano 사용)
nano .env.local

# 또는 echo로 생성
cat > .env.local << 'EOF'
LLM_PROVIDER=ollama
OLLAMA_API_URL=http://ollama:11434
OLLAMA_MODEL=mistral
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EOF

# 확인
cat .env.local
```

---

## Step 5: Docker 설정

### 5.1 docker-compose.yml 확인

```bash
# 파일이 올바른 위치에 있는지 확인
ls -la docker-compose.yml

# 내용 확인
cat docker-compose.yml | head -20
```

### 5.2 Dockerfile 확인

```bash
# 백엔드 Dockerfile
ls -la backend/Dockerfile

# 프론트엔드 Dockerfile
ls -la frontend/Dockerfile

# 내용 확인
cat backend/Dockerfile
```

### 5.3 Docker 이미지 빌드

```bash
# 프로젝트 루트에서

# 모든 서비스 빌드
docker compose build

# 특정 서비스만 빌드
docker compose build backend
docker compose build frontend

# 진행상황 확인
docker image ls
```

---

## Step 6: 개발 시작

### 6.1 Docker 시작

```bash
# 모든 서비스 시작
docker compose up

# 백그라운드 실행
docker compose up -d

# 로그 보기
docker compose logs -f

# 특정 서비스 로그
docker compose logs -f backend
docker compose logs -f frontend
```

### 6.2 앱 접속

```
http://localhost:3000        프론트엔드
http://localhost:5000        백엔드 API
http://localhost:11434       Ollama
http://localhost:3001        Open WebUI
```

### 6.3 코드 수정

```bash
# VSCode에서 파일 수정하면 hot reload 자동 적용

# 또는 터미널에서 수정
nano frontend/src/App.jsx

# 또는 vim 사용
vim backend/src/server.js
```

---

## Step 7: 일일 Git 워크플로우

### 7.1 변경사항 확인

```bash
# 현재 상태 확인
git status

# 변경사항 상세 보기
git diff

# 특정 파일만 확인
git diff frontend/src/App.jsx
```

### 7.2 변경사항 스테이징

```bash
# 모든 파일 추가
git add .

# 특정 파일만 추가
git add frontend/src/App.jsx backend/src/server.js

# 제외할 파일이 있으면 제거
git reset .env.local  # .env.local 제거
git reset node_modules/  # node_modules 제거
```

### 7.3 커밋

```bash
# 기본 커밋
git commit -m "feat: 기능 설명"

# 상세 커밋 메시지 (editor 열림)
git commit

# 빠른 커밋 (-a: 수정 파일만, -m: 메시지)
git commit -am "fix: 버그 수정"
```

### 7.4 원격 저장소 연결

```bash
# GitHub에서 저장소 생성 후

# 원격 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/pronunciation-master.git

# 또는
git remote add origin git@github.com:YOUR_USERNAME/pronunciation-master.git

# 확인
git remote -v
```

### 7.5 푸시

```bash
# 첫 번째 푸시
git push -u origin main

# 이후 푸시
git push

# 다른 브랜치 푸시
git push origin develop
```

### 7.6 일일 체크리스트

```bash
# 아침: 최신 코드 가져오기
git pull origin main

# 업무: 코드 수정
# VSCode에서 파일 수정

# 저녁: 변경사항 저장
git add .
git commit -m "feat: 오늘의 기능"
git push origin main
```

---

## VSCode와 함께 사용

### VSCode 설치 및 설정

```bash
# Windows에서 설치
# https://code.visualstudio.com/download

# WSL 확장 설치
# VSCode → Extensions → "Remote - WSL" 검색 → 설치
```

### VSCode에서 폴더 열기

```bash
# 방법 1: WSL 터미널에서
cd /path/to/pronunciation-master
code .

# 방법 2: VSCode 직접 열기
# File → Open Folder → 폴더 선택

# 방법 3: PowerShell에서
code \\wsl$\Ubuntu\home\yourusername\pronunciation-master
```

### VSCode 내장 터미널 사용

```
VSCode 메뉴:
View → Terminal (또는 Ctrl + `)

이제 VSCode 내에서:
- 파일 편집
- 터미널에서 Git 명령 실행
- 파일 구조 확인
- 디버깅

모두 한 곳에서!
```

### VSCode 확장 추천

```bash
# 이 확장들을 설치하면 개발이 편함:

1. Remote - WSL
2. ES7+ React/Redux/React-Native snippets
3. Prettier - Code formatter
4. ESLint
5. GitLens
6. Git Graph (Git 시각화)
7. Docker
```

### VSCode Git 통합

```
VSCode 좌측 사이드바:
Source Control (Ctrl + Shift + G) 클릭

이곳에서:
- 변경사항 확인
- 파일 선택 (스테이징)
- 커밋 메시지 입력
- 커밋 실행

터미널보다 훨씬 직관적!
```

---

## 전체 예제: 첫 번째 개발 사이클

### 시나리오: 백엔드 API 수정

```bash
# 1️⃣  작업 시작
cd pronunciation-master
git pull origin main

# 2️⃣  VSCode 열기
code .

# 3️⃣  VSCode에서 파일 수정
# backend/src/server.js 파일 열기 → 수정 → 저장

# 4️⃣  변경사항 확인
git status

# 결과:
# modified: backend/src/server.js

# 5️⃣  변경사항 테스트
docker compose restart backend
docker compose logs -f backend

# 6️⃣  모든 파일 추가
git add .

# 7️⃣  커밋
git commit -m "fix: 발음 분석 API 오류 수정

- 발음 정확도 계산 로직 개선
- JSON 파싱 에러 처리 추가
- 테스트 완료"

# 8️⃣  푸시
git push origin main

# 완료! 🎉
```

---

## 📊 Git 브랜치 전략 (권장)

### 브랜치 구조

```bash
# main: 안정적인 버전 (배포 준비된 코드)
# develop: 개발 중인 코드
# feature/xxx: 새 기능 개발

# 생성
git checkout -b feature/voice-playback

# develop에서 분기
git checkout develop
git checkout -b feature/scenario-missions

# 작업 후 develop으로 병합
git checkout develop
git merge feature/voice-playback

# main으로 병합 (배포 시)
git checkout main
git merge develop

# 삭제
git branch -d feature/voice-playback
```

---

## 🆘 자주하는 실수 & 해결

### 실수 1: .env.local을 git에 커밋

```bash
# 확인
git status | grep .env

# 제거 (이미 커밋한 경우)
git rm --cached .env.local
git commit -m "chore: remove .env.local from git"

# .gitignore에 추가 확인
grep .env.local .gitignore
```

### 실수 2: node_modules를 커밋

```bash
# .gitignore 확인
grep node_modules .gitignore

# 이미 커밋한 경우
git rm -r --cached node_modules
git commit -m "chore: remove node_modules from git"
```

### 실수 3: 잘못된 파일 커밋

```bash
# 이전 커밋 취소 (안전함)
git reset --soft HEAD~1

# 원하지 않는 파일 제거
git reset HEAD unwanted_file.js

# 다시 커밋
git add .
git commit -m "fix: 올바른 파일만 커밋"
```

### 실수 4: Push 전에 Pull 안 함

```bash
# push 전에는 항상
git pull origin main

# 그 다음
git push origin main
```

---

## ✅ 완벽한 체크리스트

### 초기 설정 (한 번만)

```
☐ WSL 터미널 열기
☐ Git 사용자 설정
☐ 프로젝트 폴더 생성
☐ 폴더 구조 생성
☐ Git 초기화
☐ .gitignore 생성
☐ GitHub 저장소 생성
☐ 원격 저장소 연결
☐ 파일들 배치
☐ package.json 생성
☐ .env.local 생성
☐ docker-compose.yml 확인
☐ 첫 번째 커밋
☐ VSCode 설정
```

### 일일 작업 (매일)

```
☐ git pull (최신 코드 가져오기)
☐ VSCode 열기
☐ 코드 수정 & 테스트
☐ git add . (변경사항 스테이징)
☐ git commit -m "설명" (커밋)
☐ git push (푸시)
```

---

## 🎓 학습 자료

### 터미널 명령어 빠른 참고

```bash
# 경로 이동
cd 경로
cd ..          # 부모 디렉토리
cd ~           # 홈 디렉토리
pwd            # 현재 경로 출력

# 파일/폴더 관리
ls             # 파일 목록
ls -la         # 상세 목록 (숨김파일 포함)
mkdir 폴더명   # 폴더 생성
touch 파일명   # 파일 생성
rm 파일명      # 파일 삭제
cp 원본 대상   # 파일 복사
mv 원본 대상   # 파일 이동

# 파일 확인
cat 파일명     # 파일 내용 출력
nano 파일명    # 파일 편집
vim 파일명     # vim으로 편집

# Git 명령어 빠른 참고
git init                          # 저장소 초기화
git add .                         # 모든 변경사항 스테이징
git commit -m "메시지"           # 커밋
git push origin 브랜치명         # 푸시
git pull origin 브랜치명         # 풀
git status                        # 상태 확인
git log                           # 커밋 히스토리
git branch                        # 브랜치 목록
git checkout -b 브랜치명         # 브랜치 생성 & 전환

# Docker 명령어 빠른 참고
docker compose up                 # 시작
docker compose up -d              # 백그라운드 시작
docker compose down               # 중지
docker compose logs -f            # 로그 보기
docker ps                         # 실행 중인 컨테이너
```

---

## 🚀 다음 단계

```
1. 이 가이드 따라하기 (30분)
2. Docker 실행해서 앱 테스트 (10분)
3. 작은 수정 후 Git 커밋 해보기 (10분)
4. GitHub에 푸시 (5분)
5. 반복! (매일)
```

---

**축하합니다! 이제 완벽한 개발 환경을 갖추셨습니다! 🎉**

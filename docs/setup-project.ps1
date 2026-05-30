# 🚀 Pronunciation Master - Windows PowerShell 자동 설정 스크립트
# 
# 사용법:
#   1. PowerShell을 관리자 권한으로 열기
#   2. 다음 명령어 실행:
#      Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
#   3. 스크립트 실행:
#      .\setup-project.ps1

# ==================== 함수 ====================

function Write-Header {
    param([string]$Message)
    Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║ $Message" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error2 {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# ==================== 시작 ====================

Write-Header "Pronunciation Master - Windows 자동 프로젝트 설정"

# ==================== Step 1: 프로젝트 위치 ====================

Write-Host "프로젝트 폴더 위치를 선택해주세요:" -ForegroundColor Green
Write-Host "1. 현재 디렉토리에 생성 (권장)"
Write-Host "2. 사용자 정의 경로"

$locationChoice = Read-Host "선택 (1 또는 2)"

if ($locationChoice -eq "2") {
    $projectPath = Read-Host "프로젝트 경로를 입력하세요"
    New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
    Set-Location $projectPath
} else {
    $projectPath = "pronunciation-master"
    New-Item -ItemType Directory -Path $projectPath -Force | Out-Null
    Set-Location $projectPath
}

Write-Success "프로젝트 폴더: $(Get-Location)"

# ==================== Step 2: 폴더 구조 생성 ====================

Write-Header "Step 1: 폴더 구조 생성"

Write-Host "폴더 생성 중..." -ForegroundColor Cyan

# 백엔드
New-Item -ItemType Directory -Path "backend/src/services/providers" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/src/routes" -Force | Out-Null
New-Item -ItemType Directory -Path "backend/src/utils" -Force | Out-Null
Write-Success "백엔드 폴더"

# 프론트엔드
New-Item -ItemType Directory -Path "frontend/src/components" -Force | Out-Null
New-Item -ItemType Directory -Path "frontend/src/services" -Force | Out-Null
New-Item -ItemType Directory -Path "frontend/src/utils" -Force | Out-Null
New-Item -ItemType Directory -Path "frontend/src/styles" -Force | Out-Null
New-Item -ItemType Directory -Path "frontend/public" -Force | Out-Null
Write-Success "프론트엔드 폴더"

# 데이터
New-Item -ItemType Directory -Path "data/missions/completed" -Force | Out-Null
New-Item -ItemType Directory -Path "data/missions/skipped" -Force | Out-Null
New-Item -ItemType Directory -Path "data/user-progress" -Force | Out-Null
New-Item -ItemType Directory -Path "data/statistics" -Force | Out-Null
Write-Success "데이터 폴더"

# 문서
New-Item -ItemType Directory -Path "docs" -Force | Out-Null
Write-Success "문서 폴더"

# CI/CD
New-Item -ItemType Directory -Path ".github/workflows" -Force | Out-Null
Write-Success "GitHub 폴더"

Write-Host "`n📁 폴더 구조 생성 완료!" -ForegroundColor Green
Get-ChildItem -Recurse -Directory | Select-Object -First 20 | ForEach-Object { Write-Host $_.FullName }

# ==================== Step 3: Git 설정 ====================

Write-Header "Step 2: Git 초기화"

# Git 설치 확인
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error2 "Git이 설치되지 않았습니다!"
    Write-Host "https://git-scm.com/download/win 에서 설치해주세요."
    exit 1
}

# Git 전역 설정 확인
$gitUser = git config --global user.name 2>$null
$gitEmail = git config --global user.email 2>$null

if (!$gitUser -or !$gitEmail) {
    Write-Warning2 "Git 사용자 설정이 없습니다."
    $gitUser = Read-Host "GitHub 사용자명"
    $gitEmail = Read-Host "GitHub 이메일"
    
    git config --global user.name $gitUser
    git config --global user.email $gitEmail
    Write-Success "Git 설정 완료"
} else {
    Write-Info "Git 사용자: $gitUser"
}

# Git 초기화
git init
Write-Success "Git 저장소 초기화"

# ==================== Step 4: .gitignore 생성 ====================

Write-Header "Step 3: .gitignore 생성"

$gitignore = @"
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
lerna-debug.log*

# OS
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo
*~

# 오디오 파일
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
*.iml

# 민감한 정보
.env.production
config/secrets.json

# 데이터베이스
*.db
*.sqlite
"@

$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Success ".gitignore 생성"

# ==================== Step 5: 환경 변수 파일 ====================

Write-Header "Step 4: 환경 변수 파일 생성"

$envExample = @"
# LLM 프로바이더
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
"@

$envExample | Out-File -FilePath ".env.example" -Encoding UTF8
Write-Success ".env.example 생성"

# .env.local 생성
Copy-Item ".env.example" ".env.local"
Write-Success ".env.local 생성 (자동으로 .gitignore에 포함됨)"

# ==================== Step 6: package.json 생성 ====================

Write-Header "Step 5: package.json 생성"

$backendPackage = @"
{
  "name": "pronunciation-master-backend",
  "version": "1.0.0",
  "description": "Pronunciation Master Backend Server",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["pronunciation", "ai", "llm"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "morgan": "^1.10.0",
    "node-fetch": "^3.3.2",
    "compression": "^1.7.4",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "eslint": "^8.53.0"
  }
}
"@

$backendPackage | Out-File -FilePath "backend/package.json" -Encoding UTF8
Write-Success "backend/package.json 생성"

$frontendPackage = @"
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
    "start": "vite",
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
"@

$frontendPackage | Out-File -FilePath "frontend/package.json" -Encoding UTF8
Write-Success "frontend/package.json 생성"

# ==================== Step 7: README 생성 ====================

Write-Header "Step 6: README 생성"

$readme = @"
# 🎤 Pronunciation Master

AI 기반 영어 발음 교정 및 상황별 동적 학습 앱

## 🚀 빠른 시작

### 전제조건
- Docker & Docker Compose
- Git
- WSL 2 (Windows 사용자)

### 설치

\`\`\`bash
# 저장소 클론
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git
cd pronunciation-master

# 환경 변수 설정
cp .env.example .env.local

# Docker 실행
docker compose up
\`\`\`

### 접속
- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:5000
- Ollama: http://localhost:11434

## 📁 프로젝트 구조

\`\`\`
pronunciation-master/
├── backend/               # Node.js 백엔드
├── frontend/              # React 프론트엔드
├── data/                  # 학습 데이터
├── docs/                  # 문서
├── docker-compose.yml     # Docker 구성
└── .env.example          # 환경 변수 템플릿
\`\`\`

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

\`\`\`bash
# 백엔드 개발
cd backend
npm install
npm run dev

# 프론트엔드 개발
cd frontend
npm install
npm run dev
\`\`\`

## 📝 Git 워크플로우

\`\`\`bash
# 변경사항 확인
git status

# 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: 기능 설명"

# 푸시
git push origin main
\`\`\`

## 📄 라이선스

MIT

---

**행운을 빕니다! 🎉**
"@

$readme | Out-File -FilePath "README.md" -Encoding UTF8
Write-Success "README.md 생성"

# ==================== Step 8: 안내 파일 ====================

Write-Header "Step 7: 설정 안내"

$instructions = @"
🚀 다음 단계를 수행하세요:

1️⃣  제공된 파일들을 복사합니다:
   - docker-compose.yml → 프로젝트 루트
   - backend-server-complete.js → backend/src/server.js
   - pronunciation-master-enhanced-app.jsx → frontend/src/App.jsx
   - 기타 파일들을 해당 위치에 배치

2️⃣  문서 파일들을 복사합니다:
   - *.md 파일들 → docs/ 폴더

3️⃣ Docker 빌드:
   docker compose build

4️⃣ Docker 실행:
   docker compose up

5️⃣ 브라우저 접속:
   http://localhost:3000
"@

$instructions | Out-File -FilePath "SETUP_INSTRUCTIONS.txt" -Encoding UTF8
Write-Warning2 "제공된 파일들을 다음 위치에 복사해야 합니다:"
Write-Host $instructions -ForegroundColor Yellow

# ==================== Step 9: 첫 번째 커밋 ====================

Write-Header "Step 8: Git 커밋"

git add .

git commit -m "chore: 프로젝트 초기 설정

- 폴더 구조 생성
- package.json 설정
- 환경 변수 템플릿 생성
- README 작성"

Write-Success "첫 번째 커밋 완료"

# ==================== Step 10: GitHub 연결 ====================

Write-Header "Step 9: GitHub 연결 (선택사항)"

Write-Host "다음 단계를 수행하여 GitHub에 연결할 수 있습니다:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣ GitHub에서 새 저장소 생성:"
Write-Host "   https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2️⃣ 저장소 이름: pronunciation-master"
Write-Host ""
Write-Host "3️⃣ 아래 명령어 실행:"
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/pronunciation-master.git" -ForegroundColor Cyan
Write-Host "   git branch -M main"
Write-Host "   git push -u origin main"
Write-Host ""

$githubChoice = Read-Host "지금 GitHub에 연결하시겠습니까? (y/n)"

if ($githubChoice -eq "y" -or $githubChoice -eq "Y") {
    $githubUsername = Read-Host "GitHub 사용자명"
    
    git remote add origin "https://github.com/${githubUsername}/pronunciation-master.git"
    git branch -M main
    
    Write-Info "다음 명령어를 실행하여 푸시합니다:"
    Write-Host "git push -u origin main" -ForegroundColor Cyan
    
    $pushChoice = Read-Host "푸시하시겠습니까? (y/n)"
    if ($pushChoice -eq "y" -or $pushChoice -eq "Y") {
        git push -u origin main
        Write-Success "GitHub에 푸시 완료!"
    }
}

# ==================== 최종 정보 ====================

Write-Header "✅ 설정 완료!"

Write-Host "프로젝트 설정이 완료되었습니다!" -ForegroundColor Green
Write-Host ""
Write-Host "현재 위치: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣ 제공된 파일들을 복사:"
Write-Host "   - docker-compose.yml"
Write-Host "   - backend-server-complete.js → backend/src/server.js"
Write-Host "   - pronunciation-master-enhanced-app.jsx → frontend/src/App.jsx"
Write-Host "   - 기타 파일들"
Write-Host ""
Write-Host "2️⃣ Docker 빌드 및 실행:"
Write-Host "   docker compose build"
Write-Host "   docker compose up"
Write-Host ""
Write-Host "3️⃣ 브라우저에서 접속:"
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "4️⃣ 코드 수정 후 커밋:"
Write-Host "   git add ."
Write-Host "   git commit -m \"feat: 기능 설명\""
Write-Host "   git push"
Write-Host ""

Write-Success "행운을 빕니다! 🎉"

# Git 상태
Write-Header "Git 상태"
git log --oneline -1
Write-Host ""
git status

Write-Host "설정 스크립트를 완료했습니다!" -ForegroundColor Green

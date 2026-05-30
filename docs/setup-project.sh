#!/bin/bash

# 🚀 Pronunciation Master - 자동 프로젝트 설정 스크립트
# 이 스크립트는 전체 폴더 구조, Git, Docker를 자동으로 설정합니다.
# 
# 사용법:
#   bash setup-project.sh
# 또는
#   chmod +x setup-project.sh
#   ./setup-project.sh

set -e  # 에러 발생 시 중지

# ==================== 색상 정의 ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==================== 함수 ====================

print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} $1"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ==================== 시작 ====================

print_header "Pronunciation Master - 자동 프로젝트 설정"

# ==================== Step 1: 프로젝트 위치 확인 ====================

print_info "프로젝트 폴더 위치를 선택해주세요:"
echo "1. 현재 디렉토리에 생성 (권장)"
echo "2. 사용자 정의 경로"
read -p "선택 (1 또는 2): " location_choice

if [ "$location_choice" = "2" ]; then
    read -p "프로젝트 경로를 입력하세요: " project_path
    mkdir -p "$project_path"
    cd "$project_path"
else
    project_path="pronunciation-master"
    mkdir -p "$project_path"
    cd "$project_path"
fi

print_success "프로젝트 폴더: $(pwd)"

# ==================== Step 2: 폴더 구조 생성 ====================

print_header "Step 1: 폴더 구조 생성"

echo "폴더 생성 중..."

# 백엔드
mkdir -p backend/src/{services/providers,routes,utils}
print_success "백엔드 폴더"

# 프론트엔드
mkdir -p frontend/src/{components,services,utils,styles}
mkdir -p frontend/public
print_success "프론트엔드 폴더"

# 데이터
mkdir -p data/{missions/{completed,skipped},user-progress,statistics}
print_success "데이터 폴더"

# 문서
mkdir -p docs
print_success "문서 폴더"

# CI/CD
mkdir -p .github/workflows
print_success "GitHub 폴더"

echo -e "\n📁 폴더 구조:"
tree -L 2 2>/dev/null || find . -type d -not -path '*/.*' | head -20

# ==================== Step 3: Git 설정 ====================

print_header "Step 2: Git 초기화"

# Git 전역 설정 확인
if ! git config --global user.name > /dev/null 2>&1; then
    print_warning "Git 사용자 설정이 없습니다."
    read -p "GitHub 사용자명: " git_user
    read -p "GitHub 이메일: " git_email
    
    git config --global user.name "$git_user"
    git config --global user.email "$git_email"
    print_success "Git 설정 완료"
else
    git_user=$(git config --global user.name)
    print_info "Git 사용자: $git_user"
fi

# Git 초기화
git init
print_success "Git 저장소 초기화"

# ==================== Step 4: .gitignore 생성 ====================

print_header "Step 3: .gitignore 생성"

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

# 기타
.DS_Store
.AppleDouble
.LSOverride
EOF

print_success ".gitignore 생성"
cat .gitignore

# ==================== Step 5: 환경 변수 파일 생성 ====================

print_header "Step 4: 환경 변수 파일 생성"

cat > .env.example << 'EOF'
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
EOF

print_success ".env.example 생성"

# .env.local 생성
cp .env.example .env.local
print_success ".env.local 생성 (자동으로 .gitignore에 포함됨)"

# ==================== Step 6: 기본 파일들 생성 ====================

print_header "Step 5: 기본 파일 생성"

# backend/package.json
cat > backend/package.json << 'EOF'
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
EOF

print_success "backend/package.json 생성"

# frontend/package.json
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
    "start": "vite",
    "build": "vite build",
    "dev": "vite",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version"]
  }
}
EOF

print_success "frontend/package.json 생성"

# ==================== Step 7: README 생성 ====================

print_header "Step 6: README 생성"

cat > README.md << 'EOF'
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
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git
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
EOF

print_success "README.md 생성"

# ==================== Step 8: docker-compose.yml 배치 ====================

print_header "Step 7: Docker 설정 안내"

cat > SETUP_INSTRUCTIONS.txt << 'EOF'
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
EOF

print_warning "제공된 파일들을 아래 위치에 복사해야 합니다:"
cat SETUP_INSTRUCTIONS.txt

# ==================== Step 9: 첫 번째 커밋 ====================

print_header "Step 8: Git 커밋"

# 모든 파일 추가
git add .

# 첫 번째 커밋
git commit -m "chore: 프로젝트 초기 설정

- 폴더 구조 생성
- package.json 설정
- 환경 변수 템플릿 생성
- README 작성"

print_success "첫 번째 커밋 완료"

# ==================== Step 10: GitHub 연결 가이드 ====================

print_header "Step 9: GitHub 연결 (선택사항)"

echo "다음 단계를 수행하여 GitHub에 연결할 수 있습니다:"
echo ""
echo "1️⃣ GitHub에서 새 저장소 생성:"
echo "   https://github.com/new"
echo ""
echo "2️⃣ 저장소 이름: pronunciation-master"
echo ""
echo "3️⃣ 아래 명령어 실행:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/pronunciation-master.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

read -p "지금 GitHub에 연결하시겠습니까? (y/n): " github_choice

if [ "$github_choice" = "y" ] || [ "$github_choice" = "Y" ]; then
    read -p "GitHub 사용자명: " github_username
    
    git remote add origin "https://github.com/${github_username}/pronunciation-master.git"
    git branch -M main
    
    print_info "다음 명령어를 실행하여 푸시합니다:"
    echo "git push -u origin main"
    
    read -p "푸시하시겠습니까? (y/n): " push_choice
    if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
        git push -u origin main
        print_success "GitHub에 푸시 완료!"
    fi
fi

# ==================== 최종 정보 ====================

print_header "✅ 설정 완료!"

echo -e "${GREEN}프로젝트 설정이 완료되었습니다!${NC}\n"

echo "현재 위치: $(pwd)"
echo ""
echo "다음 단계:"
echo ""
echo "1️⃣ 제공된 파일들을 복사:"
echo "   - docker-compose.yml"
echo "   - backend-server-complete.js → backend/src/server.js"
echo "   - pronunciation-master-enhanced-app.jsx → frontend/src/App.jsx"
echo "   - 기타 파일들"
echo ""
echo "2️⃣ Docker 빌드 및 실행:"
echo "   docker compose build"
echo "   docker compose up"
echo ""
echo "3️⃣ 브라우저에서 접속:"
echo "   http://localhost:3000"
echo ""
echo "4️⃣ 코드 수정 후 커밋:"
echo "   git add ."
echo "   git commit -m \"feat: 기능 설명\""
echo "   git push"
echo ""

print_success "행운을 빕니다! 🎉"

# ==================== Git 상태 ====================

print_header "Git 상태"
git log --oneline -1
echo ""
git status

exit 0

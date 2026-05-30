# 🚀 자동 설정 스크립트 사용 가이드

## 📋 빠른 요약

**3가지 방법이 있습니다:**

| 방법 | 소요시간 | 난이도 | 권장 |
|------|---------|--------|------|
| **자동 스크립트** | 2분 | ⭐ 초급 | ✅ **추천** |
| **WSL 터미널** (수동) | 15분 | ⭐⭐ 중급 | 세부 제어 원할 때 |
| **VSCode GUI** | 20분 | ⭐⭐⭐ 고급 | 학습용 |

---

## ✅ 준비 사항

### Windows 사용자
```
☐ Docker Desktop 설치됨
☐ Git 설치됨 (https://git-scm.com/download/win)
☐ WSL 2 활성화됨 (Windows 11은 자동)
```

### Mac/Linux 사용자
```
☐ Docker & Docker Compose 설치됨
☐ Git 설치됨
☐ 터미널 준비됨
```

---

## 🚀 방법 1: 자동 스크립트 (가장 간단 - 2분)

### Windows (PowerShell)

```powershell
# 1️⃣ PowerShell을 관리자 권한으로 열기

# 2️⃣ 다음 명령어 실행 (처음 1회만):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3️⃣ 다운로드한 setup-project.ps1이 있는 폴더로 이동:
cd C:\Users\YourName\Downloads

# 4️⃣ 스크립트 실행:
.\setup-project.ps1

# 스크립트가 자동으로:
# ✅ 폴더 구조 생성
# ✅ Git 초기화
# ✅ .gitignore 생성
# ✅ package.json 생성
# ✅ 첫 번째 커밋
# ✅ GitHub 연결 (선택사항)
```

### WSL / Mac / Linux (Bash)

```bash
# 1️⃣ WSL 또는 터미널 열기

# 2️⃣ 다운로드한 setup-project.sh이 있는 폴더로 이동:
cd ~/Downloads

# 3️⃣ 실행 권한 추가:
chmod +x setup-project.sh

# 4️⃣ 스크립트 실행:
./setup-project.sh

# 또는 한 줄에:
bash setup-project.sh
```

---

## 📁 스크립트 실행 후 결과

### 자동으로 생성되는 것

```
pronunciation-master/
├── backend/
│   ├── src/
│   │   ├── services/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json              ✅ 자동 생성
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json              ✅ 자동 생성
├── data/
│   ├── missions/
│   ├── user-progress/
│   └── statistics/
├── docs/
├── .github/
├── .gitignore                    ✅ 자동 생성
├── .env.example                  ✅ 자동 생성
├── .env.local                    ✅ 자동 생성
├── README.md                     ✅ 자동 생성
└── .git/                         ✅ Git 초기화됨
```

### 스크립트가 하는 일

```
1️⃣  폴더 구조 생성 (모든 필요한 디렉토리)
2️⃣  Git 저장소 초기화
3️⃣  .gitignore 생성 (node_modules, .env 등 제외)
4️⃣  .env.example 생성 (환경 변수 템플릿)
5️⃣  .env.local 생성 (실제 환경 변수, git 무시됨)
6️⃣  backend/package.json 생성
7️⃣  frontend/package.json 생성
8️⃣  README.md 생성
9️⃣  첫 번째 Git 커밋 실행
🔟 GitHub 연결 옵션 (선택사항)
```

---

## 📝 스크립트 실행 시 선택 항목

### 1️⃣ 프로젝트 폴더 위치

```
프로젝트 폴더 위치를 선택해주세요:
1. 현재 디렉토리에 생성 (권장)
2. 사용자 정의 경로

선택 (1 또는 2): 1
```

**권장:** 1번 선택 (현재 디렉토리에 `pronunciation-master` 폴더 생성)

### 2️⃣ GitHub 연결 (선택사항)

```
GitHub 저장소를 연결하시겠습니까? (y/n): y
GitHub 사용자명: your_username
푸시하시겠습니까? (y/n): y
```

**처음 사용자:** n으로 선택, 나중에 수동으로 연결 가능

---

## 🔄 스크립트 실행 후 다음 단계

### Step 1: 제공된 파일 복사 (수동)

```bash
# 다음 파일들을 올바른 위치에 복사:

# 백엔드 파일
cp backend-server-complete.js pronunciation-master/backend/src/server.js
cp llmManager.js pronunciation-master/backend/src/services/
cp llm-providers.js pronunciation-master/backend/src/services/providers/

# 프론트엔드 파일
cp pronunciation-master-enhanced-app.jsx pronunciation-master/frontend/src/App.jsx
cp frontend-apiClient.js pronunciation-master/frontend/src/services/

# Docker 파일
cp docker-compose.yml pronunciation-master/
cp backend-Dockerfile pronunciation-master/backend/Dockerfile
cp frontend-Dockerfile.dev pronunciation-master/frontend/Dockerfile

# 문서
cp *.md pronunciation-master/docs/
```

또는 **Windows 파일 탐색기**에서 드래그 & 드롭 (쉬움!)

### Step 2: Docker 빌드

```bash
cd pronunciation-master

# 이미지 빌드
docker compose build

# 또는 구체적으로
docker compose build backend
docker compose build frontend
```

### Step 3: Docker 실행

```bash
# 포그라운드에서 실행 (로그 보임)
docker compose up

# 또는 백그라운드에서 실행
docker compose up -d

# 로그 확인
docker compose logs -f
```

### Step 4: 브라우저에서 접속

```
http://localhost:3000        프론트엔드 (발음 앱)
http://localhost:5000        백엔드 API
http://localhost:11434       Ollama
http://localhost:3001        Open WebUI (선택사항)
```

---

## 🔧 이 후 일일 워크플로우

### 매일 아침: 최신 코드 가져오기

```bash
cd pronunciation-master
git pull origin main
```

### 업무 중: 코드 수정

```bash
# VSCode에서 파일 수정
code .

# 또는 터미널 에디터
nano backend/src/server.js
```

### 저녁: 변경사항 저장

```bash
# 변경사항 확인
git status

# 모든 파일 추가
git add .

# 커밋
git commit -m "feat: 오늘의 기능"

# 푸시
git push origin main
```

---

## ❌ 스크립트 재실행하려면?

스크립트는 **처음 설정 시에만** 사용합니다.

```bash
# ❌ 절대 하지 마세요 (기존 폴더 초기화됨):
# ./setup-project.sh

# 대신 다음을 사용하세요:
git status          # 현재 상태 확인
git add .           # 변경사항 추가
git commit -m "..."  # 커밋
git push            # 푸시
```

---

## 🆘 문제 해결

### 스크립트가 실행 안 될 때 (Windows)

```powershell
# 1️⃣ 관리자 권한으로 PowerShell 다시 열기

# 2️⃣ 정책 설정 (처음 1회만):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 3️⃣ 다시 실행:
.\setup-project.ps1
```

### 스크립트가 실행 안 될 때 (WSL/Mac)

```bash
# 1️⃣ 권한 확인:
ls -la setup-project.sh

# 2️⃣ 권한 추가:
chmod +x setup-project.sh

# 3️⃣ 다시 실행:
./setup-project.sh
```

### Git 설정 안 되었을 때

```bash
# 1️⃣ 설정 확인:
git config --global user.name
git config --global user.email

# 2️⃣ 설정:
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📊 전체 프로세스 시각화

```
┌─────────────────────────────────────────┐
│ 1. 스크립트 다운로드 & 실행             │
│    (setup-project.sh 또는 .ps1)         │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 2. 자동으로 생성되는 것:               │
│    ✅ 폴더 구조                        │
│    ✅ .gitignore                       │
│    ✅ package.json                     │
│    ✅ .env 파일                        │
│    ✅ 첫 번째 커밋                      │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 3. 수동으로 해야 할 것:                │
│    📋 제공된 파일들 복사 (드래그 & 드롭) │
│    📋 GitHub 저장소 생성 (선택사항)    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 4. Docker 빌드 & 실행                  │
│    docker compose build                 │
│    docker compose up                    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 5. 앱 사용 & 개발                       │
│    http://localhost:3000                │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│ 6. 매일: Git 워크플로우                │
│    git add .                            │
│    git commit -m "..."                  │
│    git push                             │
└─────────────────────────────────────────┘
```

---

## ✅ 최종 체크리스트

### 스크립트 실행 전
```
☐ Docker 설치됨
☐ Git 설치됨
☐ setup-project.sh 또는 .ps1 다운로드됨
☐ 작업 디렉토리 준비됨
```

### 스크립트 실행
```
☐ 스크립트 실행 완료
☐ 폴더 구조 생성됨
☐ Git 초기화됨
☐ 첫 번째 커밋 완료
```

### 파일 복사 후
```
☐ 제공된 파일들 복사됨
☐ docker-compose.yml 확인됨
☐ README.md 업데이트됨
```

### Docker 실행
```
☐ docker compose build 완료
☐ docker compose up 성공
☐ 포트 접속 가능 (3000, 5000, 11434)
```

### 첫 번째 Git 커밋
```
☐ 변경사항 확인
☐ git add . 실행
☐ git commit -m "..." 실행
☐ git push 성공
```

---

## 🎯 이제 준비 완료!

```
✅ 폴더 구조: 완성
✅ Git: 초기화 & 첫 커밋 완료
✅ Docker: 준비됨
✅ 문서: 준비됨

🚀 개발 시작할 준비가 되었습니다!
```

---

## 💡 팁

1. **VSCode 추천**: `code .`로 VSCode를 폴더에서 열기
2. **내장 터미널**: VSCode 내에서 Ctrl + `로 터미널 열기
3. **Git Graph**: VSCode에서 "Git Graph" 확장으로 커밋 시각화
4. **Hot Reload**: Docker에서 자동으로 파일 변경 감지

---

**축하합니다! 이제 전문가처럼 개발할 준비가 되었습니다! 🎉**

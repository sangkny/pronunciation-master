# 📁 폴더 구조 변경 가이드

## 현재 상황

```
C:\Users\YourName\Projects\
└── pronunciation-master/           ← 변경하고 싶은 부분
    └── pronunciation-master/       ← 현재 프로젝트
        ├── backend/
        ├── frontend/
        ├── docker-compose.yml
        └── ...
```

## 목표 구조

```
C:\Users\YourName\Projects\
└── Learning-Languages/             ← 새로운 폴더
    └── pronunciation-master/       ← 프로젝트 폴더
        ├── backend/
        ├── frontend/
        ├── docker-compose.yml
        └── ...
```

---

## 🚀 해결 방법

### 방법 1: 간단한 폴더 이동 (가장 쉬움 - 5분)

#### Windows (PowerShell/cmd)

```powershell
# 1️⃣ 프로젝트 폴더 위치 확인
cd C:\Users\YourName\Projects
dir

# 결과:
# pronunciation-master/
#   └── pronunciation-master/

# 2️⃣ Learning-Languages 폴더 생성
mkdir Learning-Languages

# 3️⃣ pronunciation-master 폴더를 Learning-Languages로 이동
# (안의 pronunciation-master를 인식하고 그 내용을 이동)

# 방법 A: 복사 후 삭제 (안전)
Copy-Item -Path "pronunciation-master\pronunciation-master\*" `
          -Destination "Learning-Languages\pronunciation-master" -Recurse -Force

Remove-Item -Path "pronunciation-master" -Recurse -Force

# 방법 B: 직접 이동 (빠름)
Move-Item -Path "pronunciation-master\pronunciation-master" `
          -Destination "Learning-Languages\pronunciation-master"
```

#### WSL / Mac / Linux

```bash
# 1️⃣ 위치 확인
cd ~/Projects
ls -la

# 2️⃣ Learning-Languages 폴더 생성
mkdir -p Learning-Languages

# 3️⃣ 폴더 이동
mv pronunciation-master/pronunciation-master \
   Learning-Languages/pronunciation-master

# 또는
cp -r pronunciation-master/pronunciation-master \
      Learning-Languages/pronunciation-master
rm -rf pronunciation-master
```

#### 확인

```bash
# 이동 확인
cd Learning-Languages/pronunciation-master
ls -la

# Git 저장소 확인
git log --oneline -1
git status
```

---

### 방법 2: Git을 고려한 안전한 이동 (권장 - 10분)

**현재 Git 상태를 유지하면서 이동합니다.**

#### Step 1: 현재 상태 백업

```bash
# 1️⃣ 현재 폴더로 이동
cd C:\Users\YourName\Projects\pronunciation-master\pronunciation-master

# 또는 WSL
cd ~/Projects/pronunciation-master/pronunciation-master

# 2️⃣ 변경사항 커밋 (있으면)
git status

# 변경사항이 있으면 커밋
git add .
git commit -m "backup: 폴더 구조 변경 전 백업"

# 3️⃣ Git 저장소 상태 확인
git log --oneline -3
```

#### Step 2: 부모 폴더 이동

```bash
# 1️⃣ 상위 폴더로 이동
cd ..
cd ..  # 또는 한 번에: cd ~/Projects

# 확인
pwd
ls -la

# 보이는 것:
# pronunciation-master/
#   └── pronunciation-master/

# 2️⃣ 새 구조 생성
mkdir Learning-Languages

# 3️⃣ pronunciation-master의 자식 폴더(실제 프로젝트)를 이동
mv pronunciation-master/pronunciation-master Learning-Languages/

# 4️⃣ 빈 pronunciation-master 폴더 삭제
rmdir pronunciation-master

# 또는 Windows:
Remove-Item -Path pronunciation-master -Force
```

#### Step 3: 검증

```bash
# 1️⃣ 새 위치로 이동
cd Learning-Languages/pronunciation-master

# 2️⃣ Git 확인
git log --oneline -3

# 결과: 모든 커밋 히스토리가 유지됨 ✅

git status

# 3️⃣ 파일 확인
ls -la
# backend/, frontend/, docker-compose.yml 등이 있어야 함
```

---

### 방법 3: GitHub 사용 (완벽 안전 - 15분)

**GitHub을 통해 완벽하게 백업하면서 이동합니다.**

#### Step 1: GitHub에 푸시 (아직 안 했으면)

```bash
cd pronunciation-master/pronunciation-master

# 1️⃣ GitHub 저장소 생성
# https://github.com/new 에서 "pronunciation-master" 저장소 생성

# 2️⃣ 원격 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/pronunciation-master.git

# 3️⃣ 모든 변경사항 푸시
git add .
git commit -m "chore: GitHub에 현재 상태 백업"
git push -u origin main
```

#### Step 2: 로컬 폴더 정리

```bash
# 1️⃣ 부모 폴더로 이동
cd ../..

# 2️⃣ Learning-Languages 폴더 생성
mkdir Learning-Languages

# 3️⃣ pronunciation-master 폴더 이동
mv pronunciation-master/pronunciation-master Learning-Languages/

# 4️⃣ 빈 폴더 삭제
rmdir pronunciation-master
```

#### Step 3: GitHub에서 다시 클론 (검증)

```bash
# 1️⃣ 새로운 위치로 이동
cd Learning-Languages

# 2️⃣ 기존 폴더를 다른 이름으로 변경
mv pronunciation-master pronunciation-master.bak

# 3️⃣ GitHub에서 클론
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git pronunciation-master

# 4️⃣ 확인
cd pronunciation-master
git log --oneline -3

# 5️⃣ 백업 폴더 삭제 (문제 없으면)
cd ..
rm -rf pronunciation-master.bak
```

---

## ✅ 완료 후 검증

### 체크리스트

```bash
# 1️⃣ 폴더 구조 확인
ls -la Learning-Languages/

# 결과:
# pronunciation-master/

# 2️⃣ 프로젝트 폴더 확인
cd Learning-Languages/pronunciation-master
ls -la

# 결과:
# backend/
# frontend/
# data/
# docs/
# docker-compose.yml
# .git/
# .gitignore
# README.md
# 등...

# 3️⃣ Git 상태 확인
git status
# "On branch main" 등의 메시지

# 4️⃣ Git 히스토리 확인
git log --oneline -5
# 모든 커밋이 보여야 함 ✅

# 5️⃣ 모든 파일이 있는지 확인
find . -type f | wc -l
# 파일 개수가 표시되어야 함

# 6️⃣ Docker 설정 확인
cat docker-compose.yml | head -5
# docker-compose.yml 내용이 보여야 함
```

---

## 🐛 문제 발생 시

### 문제 1: Git 히스토리 손실

**증상:** `git log`가 비어있음

**해결:**
```bash
# GitHub에서 복구 (저장했으면)
cd Learning-Languages
rm -rf pronunciation-master
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git pronunciation-master
```

### 문제 2: 파일이 없어짐

**증상:** `ls`에서 파일이 안 보임

**해결:**
```bash
# 1️⃣ 잘못 이동했을 수 있음 - 위치 확인
pwd

# 2️⃣ 올바른 위치가 아니면 수정
# 백업에서 복구 (복사본이 있으면)

# 3️⃣ 없으면 GitHub에서 다시 클론
cd Learning-Languages
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git pronunciation-master
```

### 문제 3: Git이 손상됨

**증상:** Git 명령어가 에러 발생

**해결:**
```bash
# 1️⃣ .git 폴더 확인
ls -la | grep .git

# 2️⃣ 손상되었으면 GitHub에서 다시 클론
cd ..
rm -rf pronunciation-master
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git pronunciation-master
```

---

## 📝 추천 절차 (가장 안전)

### 단계별 진행

```
1️⃣  현재 상태 백업
    └─ git add . && git commit -m "backup"

2️⃣  GitHub에 푸시
    └─ git push origin main

3️⃣  폴더 구조 변경
    └─ mkdir Learning-Languages
    └─ mv pronunciation-master/pronunciation-master Learning-Languages/
    └─ rmdir pronunciation-master

4️⃣  검증
    └─ cd Learning-Languages/pronunciation-master
    └─ git log --oneline -1
    └─ ls -la

5️⃣  Docker 테스트
    └─ docker compose up
    └─ 앱이 정상 작동하는지 확인

6️⃣  최종 커밋
    └─ git add . (변경사항이 있으면)
    └─ git commit -m "chore: 폴더 구조 변경"
    └─ git push origin main
```

---

## 🎯 한 줄 명령어 (빠른 이동)

### Windows PowerShell

```powershell
# 전체 프로세스 한 번에
cd C:\Users\YourName\Projects; mkdir Learning-Languages; Move-Item -Path "pronunciation-master\pronunciation-master" -Destination "Learning-Languages\pronunciation-master"; Remove-Item -Path "pronunciation-master" -Force; cd Learning-Languages\pronunciation-master; git status
```

### WSL / Mac / Linux

```bash
# 전체 프로세스 한 번에
cd ~/Projects && mkdir -p Learning-Languages && mv pronunciation-master/pronunciation-master Learning-Languages/ && rmdir pronunciation-master && cd Learning-Languages/pronunciation-master && git log --oneline -1
```

---

## 🔄 VSCode에서 변경하기

### 간단한 방법

```
1️⃣ VSCode에서 현재 폴더 열기
2️⃣ 왼쪽 Explorer 에서 폴더 구조 확인
3️⃣ 터미널 (Ctrl + `) 열기
4️⃣ 위의 명령어 실행
5️⃣ VSCode 다시 열기 (또는 F5로 새로고침)
```

### 수동 방법

```
1️⃣ File → Open Folder
2️⃣ Learning-Languages/pronunciation-master 선택
3️⃣ 열기
4️⃣ 기존 폴더 닫기
```

---

## ✨ 완료 후

### 기존 폴더 정리

```bash
# 1️⃣ 이동 확인
cd Learning-Languages/pronunciation-master
git status

# 2️⃣ 완벽하면 기존 폴더 완전히 삭제
cd ~/Projects
rm -rf pronunciation-master  # 완전히 삭제

# 3️⃣ 새 위치로 이동하여 작업
cd Learning-Languages/pronunciation-master
code .
```

### Docker 다시 실행

```bash
# 새 위치에서 Docker 실행
cd ~/Projects/Learning-Languages/pronunciation-master

docker compose build
docker compose up
```

---

## 📊 비교: 3가지 방법

| 방법 | 시간 | 안전성 | 권장 |
|------|------|--------|------|
| **간단한 이동** | 5분 | ⭐⭐ | 빠른 처리 |
| **Git 고려** | 10분 | ⭐⭐⭐ | **최고 추천** |
| **GitHub 백업** | 15분 | ⭐⭐⭐⭐⭐ | 완벽 안전 |

---

## 🎉 축하합니다!

이제 폴더 구조가:

```
Learning-Languages/
└── pronunciation-master/
    ├── backend/
    ├── frontend/
    ├── docker-compose.yml
    ├── .git/
    └── ...
```

완벽하게 변경되었습니다! ✅

---

## 💡 팁

```
1. 변경 전에 항상 백업하세요
2. GitHub이 있으면 푸시하고 진행하세요
3. 변경 후 반드시 git status 확인하세요
4. docker compose가 정상 작동하는지 테스트하세요
5. 문제 생기면 GitHub에서 다시 클론하세요
```

**성공을 빕니다! 🚀**

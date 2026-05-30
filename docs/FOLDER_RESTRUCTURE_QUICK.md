# 🎯 폴더 구조 변경 최종 가이드

## 현재 문제

```
C:\Users\YourName\Projects\
└── pronunciation-master/           ← ❌ 이 폴더를 제거하고 싶음
    └── pronunciation-master/       ← 실제 프로젝트 폴더
        ├── backend/
        ├── frontend/
        └── ...
```

## 목표

```
C:\Users\YourName\Projects\
└── Learning-Languages/             ← ✅ 새로운 최상위 폴더
    └── pronunciation-master/       ← 프로젝트 폴더
        ├── backend/
        ├── frontend/
        └── ...
```

---

## ⚡ 가장 빠른 방법 (3분)

### Windows PowerShell

```powershell
# 1️⃣ 현재 프로젝트 폴더 위치로 이동
cd C:\Users\YourName\Projects

# 2️⃣ 스크립트 다운로드했으면 실행
.\restructure-folder.ps1

# ✅ 완료! 모든 것이 자동으로 처리됨
```

### WSL / Mac / Linux

```bash
# 1️⃣ 현재 프로젝트 폴더 위치로 이동
cd ~/Projects

# 2️⃣ 스크립트 실행
bash restructure-folder.sh

# ✅ 완료! 모든 것이 자동으로 처리됨
```

---

## 📋 스크립트가 자동으로 하는 것

```
✅ 현재 Git 상태 확인
✅ 변경사항이 있으면 커밋
✅ GitHub에 푸시 (선택사항)
✅ 폴더 이동
✅ 빈 폴더 삭제
✅ Git 히스토리 검증
✅ 최종 구조 확인
```

**모두 자동으로 처리됨!** ⏱️ 3분

---

## 🔄 수동으로 하는 방법 (5분)

스크립트를 사용할 수 없거나 더 세밀한 제어를 원하면:

### Step 1: 현재 상태 확인

```bash
cd pronunciation-master/pronunciation-master
git status
```

### Step 2: 변경사항 커밋

```bash
git add .
git commit -m "backup: 폴더 구조 변경 전 백업"
```

### Step 3: GitHub에 푸시 (선택사항이지만 권장)

```bash
git push origin main
```

### Step 4: 상위 폴더로 이동

```bash
cd ../..
# 또는
cd ~\Projects  # Windows
```

### Step 5: Learning-Languages 폴더 생성

```bash
mkdir Learning-Languages
```

### Step 6: 폴더 이동

```bash
# Linux/Mac
mv pronunciation-master/pronunciation-master Learning-Languages/
rmdir pronunciation-master

# Windows PowerShell
Move-Item -Path "pronunciation-master\pronunciation-master" `
          -Destination "Learning-Languages\pronunciation-master"
Remove-Item -Path "pronunciation-master"

# Windows CMD
move pronunciation-master\pronunciation-master Learning-Languages\pronunciation-master
rmdir pronunciation-master
```

### Step 7: 검증

```bash
cd Learning-Languages/pronunciation-master
git log --oneline -1
ls -la
```

---

## ✅ 완료 후 확인

### 필수 확인 사항

```bash
# 1️⃣ 위치 확인
pwd
# 또는
cd Learning-Languages\pronunciation-master

# 2️⃣ Git 확인
git status
# "On branch main" 또는 "On branch develop" 보여야 함

# 3️⃣ Git 히스토리 확인
git log --oneline -3
# 모든 커밋이 보여야 함 ✅

# 4️⃣ 파일 확인
ls -la
# backend/, frontend/, docker-compose.yml 등이 있어야 함

# 5️⃣ Docker 설정 확인
cat docker-compose.yml | head -10
```

---

## 🐛 문제가 생기면?

### 문제 1: "폴더가 없습니다" 오류

**해결:**
```bash
# 현재 위치 확인
pwd

# 올바른 위치에서 실행하는지 확인
ls -la

# pronunciation-master 폴더가 보이는지 확인
```

### 문제 2: Git 히스토리가 없음

**해결:**
```bash
# GitHub에서 복구
cd Learning-Languages
rm -rf pronunciation-master
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git pronunciation-master

# 또는 Windows:
Remove-Item -Path "pronunciation-master" -Recurse -Force
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git pronunciation-master
```

### 문제 3: 파일이 없어짐

**해결:**
```bash
# 1️⃣ 폴더 위치 다시 확인
cd Learning-Languages/pronunciation-master
ls -la

# 2️⃣ 없으면 GitHub에서 다시 클론 (백업이 있으면)
git clone https://github.com/YOUR_USERNAME/pronunciation-master.git

# 3️⃣ 또는 백업 폴더에서 파일 복구
# (변경 전에 백업했으면)
```

---

## 📊 3가지 방법 비교

| 방법 | 시간 | 난이도 | 추천 | 자동화 |
|------|------|--------|------|--------|
| **자동 스크립트** ⭐ | 3분 | 초급 | **최고** | ✅ |
| 수동 명령어 | 5분 | 중급 | 학습용 | ❌ |
| GitHub 복구 | 10분 | 고급 | 안전용 | ❌ |

---

## 🎯 권장 절차

```
1️⃣  프로젝트 폴더로 이동
    cd ~/Projects (또는 C:\Users\YourName\Projects)

2️⃣  스크립트 실행
    bash restructure-folder.sh (또는 .\restructure-folder.ps1)

3️⃣  스크립트가 자동으로 처리:
    ✅ Git 상태 확인
    ✅ 폴더 이동
    ✅ 검증

4️⃣  완료 후 Docker 테스트
    docker compose build
    docker compose up

5️⃣  정상 작동 확인 후
    git push origin main (필요시)
```

---

## 💡 팁

### 1. 스크립트 실행 전 확인

```bash
# 올바른 위치인지 확인
ls -la

# 이렇게 보여야 함:
# drwxr-xr-x  pronunciation-master/
# ...
```

### 2. 백업이 중요합니다

```bash
# 스크립트 실행 전
# 또는 GitHub에 푸시하기 전
# 반드시 변경사항을 커밋하세요!

git add .
git commit -m "backup before restructure"
git push origin main
```

### 3. 검증이 중요합니다

```bash
# 이동 후 반드시 확인하세요:
cd Learning-Languages/pronunciation-master
git log --oneline -1  # Git 히스토리
ls -la                # 파일들
docker compose config  # Docker 설정
```

---

## 🚀 다음 단계

### 이동 후

```bash
cd Learning-Languages/pronunciation-master

# 1️⃣ Docker 테스트
docker compose build
docker compose up

# 2️⃣ 브라우저 확인
# http://localhost:3000

# 3️⃣ VSCode 열기
code .

# 4️⃣ 작업 시작!
```

### 기존 폴더 정리

```bash
# 이동 확인 후
# 기존 폴더는 완전히 삭제 가능
cd ~/Projects
rm -rf pronunciation-master  # 또는 Remove-Item

# 또는 Windows:
Remove-Item -Path "pronunciation-master" -Recurse -Force
```

---

## 📝 체크리스트

### 스크립트 실행 전
```
☐ 올바른 위치에 있음 (~/Projects 또는 C:\Users\YourName\Projects)
☐ pronunciation-master 폴더가 보임
☐ Git 설치됨
☐ 인터넷 연결 (푸시할 경우)
```

### 스크립트 실행
```
☐ 스크립트 실행 시작
☐ Git 상태 확인
☐ 변경사항 커밋 (필요시)
☐ GitHub 푸시 (선택사항)
☐ 폴더 이동
☐ 검증 완료
```

### 이동 후
```
☐ Learning-Languages/pronunciation-master 존재
☐ Git 히스토리 보임
☐ 모든 파일이 있음
☐ Docker 테스트 성공
☐ 앱이 정상 작동
```

---

## 🎉 완료!

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

## 💬 자주 하는 질문

### Q1: 스크립트 없이 할 수 있나요?
**A:** 네! FOLDER_RESTRUCTURE_GUIDE.md의 수동 방법을 참고하세요.

### Q2: Git 히스토리를 잃을까요?
**A:** 아니요! .git 폴더를 함께 이동하므로 모든 히스토리가 보존됩니다.

### Q3: 되돌릴 수 있나요?
**A:** 네! GitHub에 푸시했으면 언제든지 다시 클론할 수 있습니다.

### Q4: Docker가 작동할까요?
**A:** 네! docker-compose.yml도 함께 이동하므로 정상 작동합니다.

### Q5: 다른 컴퓨터에 이 변경을 반영하려면?
**A:** GitHub에서 pull하면 자동으로 반영됩니다.
```bash
git pull origin main
```

---

**축하합니다! 폴더 구조 변경을 성공적으로 완료했습니다! 🎉**

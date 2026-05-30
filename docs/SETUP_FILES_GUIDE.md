# 🚀 파일 배치 - 즉시 실행 가이드

## 현재 상황

```
/mnt/d/sangkny/work/doc/external_activity/
├── Learning-Languages/
│   └── pronunciation-master/          (폴더 구조만 있음)
│       ├── backend/
│       ├── frontend/
│       ├── .env.example
│       ├── .env.local
│       ├── README.md
│       └── .git/
└── 여기에 모든 파일들이 있음 (backend-server-complete.js, etc...)
```

## 목표

```
/mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master/
├── backend/
│   ├── src/
│   │   ├── server.js                  ← 배치됨
│   │   ├── services/
│   │   │   ├── llmManager.js          ← 배치됨
│   │   │   └── providers/
│   │   └── routes/
│   ├── package.json                   ← 생성됨
│   └── Dockerfile                     ← 배치됨
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    ← 배치됨
│   │   └── services/
│   │       └── apiClient.js           ← 배치됨
│   └── package.json
├── docker-compose.yml                 ← 배치됨
├── docs/                              ← 모든 .md 파일들
└── ...
```

---

## ⚡ 가장 빠른 해결 (1분)

### 방법 1: 스크립트 사용 (권장)

```bash
# 1️⃣ 상위 폴더로 이동
cd /mnt/d/sangkny/work/doc/external_activity

# 2️⃣ 스크립트 다운로드 (이미 있으면 스킵)
# setup-files-final.sh 파일이 현재 폴더에 있는지 확인

# 3️⃣ 실행 권한 추가
chmod +x setup-files-final.sh

# 4️⃣ 스크립트 실행
bash setup-files-final.sh

# ✅ 완료!
```

### 방법 2: 한 줄 명령어

```bash
cd /mnt/d/sangkny/work/doc/external_activity && bash setup-files-final.sh
```

---

## 📋 스크립트가 자동으로 하는 것

```
✅ 필요한 폴더 구조 생성
✅ 상위 폴더의 모든 파일 검색
✅ 올바른 위치에 파일 복사
   - backend-server-complete.js → backend/src/server.js
   - llmManager*.js → backend/src/services/llmManager.js
   - llm-providers.js → backend/src/services/providers/index.js
   - pronunciation-master-enhanced-app.jsx → frontend/src/App.jsx
   - frontend-apiClient.js → frontend/src/services/apiClient.js
   - docker-compose.yml → 루트 폴더
   - *.md 파일들 → docs/ 폴더
✅ package.json 생성
✅ Git 커밋 (선택)
✅ 최종 검증
```

---

## 🔍 실행 전 확인

```bash
# 현재 위치 확인
pwd
# /mnt/d/sangkny/work/doc/external_activity 이어야 함

# 폴더 구조 확인
ls -la | grep "Learning-Languages"
# Learning-Languages/ 폴더가 보이면 OK

# 파일들 확인
ls *.js *.jsx *.md docker-compose.yml 2>/dev/null | head -10
# 여러 파일이 보이면 OK
```

---

## ✅ 실행 후 확인

```bash
# 1️⃣ 대상 폴더로 이동
cd Learning-Languages/pronunciation-master

# 2️⃣ 파일 확인
ls -la backend/src/
# server.js 가 보이면 OK

ls -la frontend/src/
# App.jsx 가 보이면 OK

# 3️⃣ Docker 설정 확인
cat docker-compose.yml | head -5
# 내용이 보이면 OK

# 4️⃣ Git 확인
git log --oneline -1
# 커밋이 보이면 OK
```

---

## 🚀 다음 단계

```bash
# 현재 폴더: /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# 1️⃣ Docker 빌드
docker compose build

# 2️⃣ Docker 실행
docker compose up

# 3️⃣ 다른 터미널에서 앱 확인
# http://localhost:3000

# 4️⃣ API 테스트
curl http://localhost:5000/health
```

---

## 📁 스크립트 실행 결과 예시

```
✅ 파일 자동 배치 스크립트

╔════════════════════════════════════════╗
║ Step 1: 위치 확인
╚════════════════════════════════════════╝

현재 위치: /mnt/d/sangkny/work/doc/external_activity
✅ 대상 폴더: /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

╔════════════════════════════════════════╗
║ Step 2: 폴더 구조 생성
╚════════════════════════════════════════╝

✅ 폴더 구조 생성 완료

╔════════════════════════════════════════╗
║ Step 3: 파일 검색 및 배치
╚════════════════════════════════════════╝

ℹ️  백엔드 파일 검색 중...
📄 배치: server.js
📄 배치: llmManager.js
📄 배치: mission.js

ℹ️  프론트엔드 파일 검색 중...
📄 배치: App.jsx
📄 배치: apiClient.js

ℹ️  Docker 파일 검색 중...
📄 배치: docker-compose.yml
📄 배치: backend/Dockerfile

ℹ️  문서 파일 검색 중...
📄 배치: QUICK_START.md
📄 배치: TTS_AND_AUDIO_GUIDE.md
...

✅ 모든 필수 파일이 배치되었습니다!

╔════════════════════════════════════════╗
║ Step 7: Git 설정
╚════════════════════════════════════════╝

✅ Git 저장소 확인됨
ℹ️  변경된 파일: 15개

변경사항을 커밋하시겠습니까? (y/n)
y
✅ Git 커밋 완료

╔════════════════════════════════════════╗
║ ✅ 파일 배치 완료!
╚════════════════════════════════════════╝

다음 단계:

1️⃣  폴더로 이동:
   cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

2️⃣  Docker 빌드:
   docker compose build

3️⃣  Docker 실행:
   docker compose up

4️⃣  브라우저에서 접속:
   http://localhost:3000

✅ 모든 준비가 완료되었습니다! 🚀
```

---

## 🎯 스크립트를 찾을 수 없다면?

스크립트를 직접 생성하세요:

```bash
# 1️⃣ 스크립트 생성
cat > setup-files.sh << 'SCRIPT_EOF'
#!/bin/bash
cd /mnt/d/sangkny/work/doc/external_activity
TARGET_DIR="Learning-Languages/pronunciation-master"

# 폴더 생성
mkdir -p "$TARGET_DIR/backend/src/services"
mkdir -p "$TARGET_DIR/frontend/src/services"
mkdir -p "$TARGET_DIR/docs"

# 백엔드 파일
cp backend-server-complete.js "$TARGET_DIR/backend/src/server.js" 2>/dev/null || \
cp backend-server.js "$TARGET_DIR/backend/src/server.js" 2>/dev/null || true

cp llmManager-complete.js "$TARGET_DIR/backend/src/services/llmManager.js" 2>/dev/null || \
cp llmManager.js "$TARGET_DIR/backend/src/services/llmManager.js" 2>/dev/null || true

cp llm-providers.js "$TARGET_DIR/backend/src/services/" 2>/dev/null || true

# 프론트엔드 파일
cp pronunciation-master-enhanced-app.jsx "$TARGET_DIR/frontend/src/App.jsx" 2>/dev/null || \
cp pronunciation-master-app.jsx "$TARGET_DIR/frontend/src/App.jsx" 2>/dev/null || true

cp frontend-apiClient.js "$TARGET_DIR/frontend/src/services/" 2>/dev/null || true

# Docker
cp docker-compose.yml "$TARGET_DIR/" 2>/dev/null || true
cp backend-Dockerfile "$TARGET_DIR/backend/Dockerfile" 2>/dev/null || true

# 문서
cp *.md "$TARGET_DIR/docs/" 2>/dev/null || true

echo "✅ 파일 배치 완료!"
ls -la "$TARGET_DIR/" | head -20
SCRIPT_EOF

# 2️⃣ 실행 권한 추가
chmod +x setup-files.sh

# 3️⃣ 실행
bash setup-files.sh
```

---

## 🐳 Docker 실행까지 한 번에

```bash
# 전체 과정을 한 줄로
cd /mnt/d/sangkny/work/doc/external_activity && \
bash setup-files-final.sh && \
cd Learning-Languages/pronunciation-master && \
docker compose build && \
echo "✅ 빌드 완료! 이제 'docker compose up'을 실행하세요"
```

---

## 💡 문제 해결

### 스크립트 실행 권한 없음

```bash
chmod +x setup-files-final.sh
bash setup-files-final.sh
```

### 파일이 없다고 나옴

```bash
# 파일 목록 확인
ls -la | grep -E "\.js|\.jsx|yml|\.md"

# 전부 있으면 스크립트 실행
bash setup-files-final.sh
```

### Git 커밋 실패

```bash
cd Learning-Languages/pronunciation-master
git add .
git commit -m "chore: 파일 배치 완료"
```

---

## ✨ 최종 체크리스트

실행 후:

```
☐ server.js 배치됨: ls Learning-Languages/pronunciation-master/backend/src/server.js
☐ App.jsx 배치됨: ls Learning-Languages/pronunciation-master/frontend/src/App.jsx
☐ docker-compose.yml 있음: ls Learning-Languages/pronunciation-master/docker-compose.yml
☐ 문서 배치됨: ls Learning-Languages/pronunciation-master/docs/*.md
☐ Git 커밋됨: cd Learning-Languages/pronunciation-master && git log -1
☐ Docker 빌드 가능: docker compose build
```

---

**이제 준비 완료! 🚀**

```bash
cd /mnt/d/sangkny/work/doc/external_activity && bash setup-files-final.sh
```

이 명령어 하나로 모든 것이 완료됩니다!

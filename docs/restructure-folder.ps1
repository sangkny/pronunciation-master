# 🚀 폴더 구조 변경 자동화 스크립트 (Windows PowerShell)
# pronunciation-master/pronunciation-master → Learning-Languages/pronunciation-master
#
# 사용법:
#   .\restructure-folder.ps1

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

Write-Header "폴더 구조 변경 스크립트"

# ==================== Step 1: 현재 위치 확인 ====================

Write-Info "현재 위치: $(Get-Location)"

# pronunciation-master 폴더 확인
if (!(Test-Path "pronunciation-master")) {
    Write-Error2 "현재 디렉토리에서 pronunciation-master 폴더를 찾을 수 없습니다!"
    Write-Host "올바른 위치에서 실행해주세요."
    Write-Host "예: cd C:\Users\YourName\Projects"
    exit 1
}

Write-Success "pronunciation-master 폴더 발견"

# ==================== Step 2: 구조 확인 ====================

Write-Header "Step 1: 현재 폴더 구조 확인"

Write-Host "현재 구조:"
Write-Host "$(Get-Location)\" -ForegroundColor Yellow
Write-Host "└── pronunciation-master\" -ForegroundColor Yellow

if (Test-Path "pronunciation-master\pronunciation-master") {
    Write-Host "    └── pronunciation-master\  (이것을 이동합니다)" -ForegroundColor Yellow
    Write-Host "        ├── backend\"
    Write-Host "        ├── frontend\"
    Write-Host "        └── ..."
    Write-Success "중복 폴더 구조 확인됨"
} else {
    Write-Warning2 "pronunciation-master\pronunciation-master 이 없습니다."
    Write-Info "이미 올바른 구조일 수 있습니다. 확인해주세요."
    exit 1
}

# ==================== Step 3: Git 상태 확인 ====================

Write-Header "Step 2: Git 상태 확인"

Set-Location "pronunciation-master\pronunciation-master"

if (!(Test-Path ".git")) {
    Write-Error2 "Git 저장소가 없습니다!"
    exit 1
}

Write-Success "Git 저장소 확인됨"

# 변경사항 확인
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Warning2 "변경사항이 있습니다:"
    Write-Host $gitStatus -ForegroundColor Yellow
    
    $commitChoice = Read-Host "변경사항을 커밋하시겠습니까? (y/n)"
    
    if ($commitChoice -eq "y" -or $commitChoice -eq "Y") {
        git add .
        git commit -m "chore: 폴더 구조 변경 전 변경사항 커밋"
        Write-Success "변경사항 커밋됨"
    }
} else {
    Write-Success "변경사항 없음"
}

# Git 히스토리 확인
Write-Host ""
Write-Info "최근 커밋:"
git log --oneline -3

# ==================== Step 4: 백업 옵션 ====================

Write-Header "Step 3: 백업 옵션"

$pushChoice = Read-Host "GitHub에 푸시하시겠습니까? (권장: y/n)"

if ($pushChoice -eq "y" -or $pushChoice -eq "Y") {
    $remotes = git remote -v
    if ($remotes | Select-String "origin") {
        Write-Info "GitHub으로 푸시 중..."
        git push origin main
        Write-Success "GitHub에 푸시됨"
    } else {
        Write-Warning2 "원격 저장소가 설정되지 않았습니다."
        Write-Info "나중에 'git push origin main'을 실행해주세요."
    }
}

# ==================== Step 5: 폴더 구조 변경 ====================

Write-Header "Step 4: 폴더 구조 변경"

# 상위 2단계 폴더로 이동
Set-Location ..\..

Write-Info "현재 위치: $(Get-Location)"

# Learning-Languages 폴더 생성
if (!(Test-Path "Learning-Languages")) {
    New-Item -ItemType Directory -Path "Learning-Languages" -Force | Out-Null
    Write-Success "Learning-Languages 폴더 생성"
} else {
    Write-Info "Learning-Languages 폴더가 이미 존재합니다"
}

# pronunciation-master\pronunciation-master를 Learning-Languages로 이동
Write-Info "폴더 이동 중..."

if (Test-Path "pronunciation-master\pronunciation-master") {
    Move-Item -Path "pronunciation-master\pronunciation-master" `
              -Destination "Learning-Languages\pronunciation-master" -Force
    Write-Success "폴더 이동 완료"
} else {
    Write-Error2 "이동할 폴더를 찾을 수 없습니다!"
    exit 1
}

# 빈 pronunciation-master 폴더 삭제
if (Test-Path "pronunciation-master") {
    $isEmpty = @(Get-ChildItem -Path "pronunciation-master" -Force).Count -eq 0
    if ($isEmpty) {
        Remove-Item -Path "pronunciation-master" -Force
        Write-Success "빈 pronunciation-master 폴더 삭제"
    } else {
        Write-Warning2 "pronunciation-master 폴더에 파일이 있습니다. 수동으로 삭제해주세요."
    }
}

# ==================== Step 6: 검증 ====================

Write-Header "Step 5: 검증"

# 새 위치로 이동
Set-Location "Learning-Languages\pronunciation-master"

if (!(Test-Path ".git")) {
    Write-Error2 "Git 저장소가 없습니다! 이동이 실패했을 수 있습니다."
    exit 1
}

Write-Success "Git 저장소 확인됨"

# Git 상태 확인
Write-Host ""
Write-Info "Git 상태:"
$status = git status | Select-Object -First 5
Write-Host $status

Write-Host ""
Write-Info "최근 커밋:"
git log --oneline -1

# 폴더 구조 확인
Write-Host ""
Write-Info "폴더 구조:"
Get-ChildItem -Force | Select-Object -First 10 | ForEach-Object {
    Write-Host $_.Name
}

# ==================== Step 7: 최종 정보 ====================

Write-Header "✅ 폴더 구조 변경 완료!"

Write-Host "새로운 위치: $(Get-Location)" -ForegroundColor Green
Write-Host ""
Write-Host "폴더 구조:"
Write-Host "Learning-Languages\" -ForegroundColor Green
Write-Host "└── pronunciation-master\" -ForegroundColor Green
Write-Host "    ├── backend\"
Write-Host "    ├── frontend\"
Write-Host "    ├── docker-compose.yml"
Write-Host "    └── ..."
Write-Host ""

# ==================== Step 8: 다음 단계 ====================

Write-Header "다음 단계"

Write-Host "1️⃣  위치 확인:" -ForegroundColor Green
Write-Host "   cd $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

Write-Host "2️⃣  Docker 실행:" -ForegroundColor Green
Write-Host "   docker compose build" -ForegroundColor Cyan
Write-Host "   docker compose up" -ForegroundColor Cyan
Write-Host ""

Write-Host "3️⃣  VSCode 열기 (선택사항):" -ForegroundColor Green
Write-Host "   code ." -ForegroundColor Cyan
Write-Host ""

Write-Host "4️⃣  최종 커밋 (선택사항):" -ForegroundColor Green
Write-Host "   git add . (변경사항이 있으면)" -ForegroundColor Cyan
Write-Host "   git commit -m \"chore: 폴더 구조 변경\"" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor Cyan
Write-Host ""

Write-Success "완료되었습니다! 행운을 빕니다! 🎉"

exit 0

#!/bin/bash

# 🚀 폴더 구조 변경 자동화 스크립트
# pronunciation-master/pronunciation-master → Learning-Languages/pronunciation-master
#
# 사용법:
#   bash restructure-folder.sh
# 또는
#   chmod +x restructure-folder.sh
#   ./restructure-folder.sh

set -e

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

print_header "폴더 구조 변경 스크립트"

# ==================== Step 1: 현재 위치 확인 ====================

print_info "현재 위치: $(pwd)"

# pronunciation-master 폴더 확인
if [ ! -d "pronunciation-master" ]; then
    print_error "현재 디렉토리에서 pronunciation-master 폴더를 찾을 수 없습니다!"
    echo "올바른 위치에서 실행해주세요."
    echo "예: cd ~/Projects 또는 cd C:\\Users\\YourName\\Projects"
    exit 1
fi

print_success "pronunciation-master 폴더 발견"

# ==================== Step 2: 구조 확인 ====================

print_header "Step 1: 현재 폴더 구조 확인"

echo "현재 구조:"
echo "$(pwd)/"
echo "└── pronunciation-master/"

if [ -d "pronunciation-master/pronunciation-master" ]; then
    echo "    └── pronunciation-master/  (이것을 이동합니다)"
    echo "        ├── backend/"
    echo "        ├── frontend/"
    echo "        └── ..."
    print_success "중복 폴더 구조 확인됨"
else
    print_warning "pronunciation-master/pronunciation-master 이 없습니다."
    print_info "이미 올바른 구조일 수 있습니다. 확인해주세요."
    exit 1
fi

# ==================== Step 3: Git 상태 확인 ====================

print_header "Step 2: Git 상태 확인"

cd pronunciation-master/pronunciation-master

if [ ! -d ".git" ]; then
    print_error "Git 저장소가 없습니다!"
    exit 1
fi

print_success "Git 저장소 확인됨"

# 변경사항 확인
if [ -n "$(git status --porcelain)" ]; then
    print_warning "변경사항이 있습니다:"
    git status --porcelain
    
    read -p "변경사항을 커밋하시겠습니까? (y/n): " commit_choice
    
    if [ "$commit_choice" = "y" ] || [ "$commit_choice" = "Y" ]; then
        git add .
        git commit -m "chore: 폴더 구조 변경 전 변경사항 커밋"
        print_success "변경사항 커밋됨"
    fi
else
    print_success "변경사항 없음"
fi

# Git 히스토리 확인
echo ""
print_info "최근 커밋:"
git log --oneline -3

# ==================== Step 4: 백업 옵션 ====================

print_header "Step 3: 백업 옵션"

read -p "GitHub에 푸시하시겠습니까? (권장: y/n): " push_choice

if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
    if git remote -v | grep -q "origin"; then
        print_info "GitHub으로 푸시 중..."
        git push origin main
        print_success "GitHub에 푸시됨"
    else
        print_warning "원격 저장소가 설정되지 않았습니다."
        print_info "나중에 'git push origin main'을 실행해주세요."
    fi
fi

# ==================== Step 5: 폴더 구조 변경 ====================

print_header "Step 4: 폴더 구조 변경"

# 상위 2단계 폴더로 이동
cd ../..

print_info "현재 위치: $(pwd)"

# Learning-Languages 폴더 생성
if [ ! -d "Learning-Languages" ]; then
    mkdir -p Learning-Languages
    print_success "Learning-Languages 폴더 생성"
else
    print_info "Learning-Languages 폴더가 이미 존재합니다"
fi

# pronunciation-master/pronunciation-master를 Learning-Languages로 이동
print_info "폴더 이동 중..."

if [ -d "pronunciation-master/pronunciation-master" ]; then
    mv pronunciation-master/pronunciation-master Learning-Languages/
    print_success "폴더 이동 완료"
else
    print_error "이동할 폴더를 찾을 수 없습니다!"
    exit 1
fi

# 빈 pronunciation-master 폴더 삭제
if [ -d "pronunciation-master" ]; then
    # pronunciation-master 폴더가 정말 비어있는지 확인
    if [ -z "$(ls -A pronunciation-master)" ]; then
        rmdir pronunciation-master
        print_success "빈 pronunciation-master 폴더 삭제"
    else
        print_warning "pronunciation-master 폴더에 파일이 있습니다. 수동으로 삭제해주세요."
    fi
fi

# ==================== Step 6: 검증 ====================

print_header "Step 5: 검증"

# 새 위치로 이동
cd Learning-Languages/pronunciation-master

if [ ! -d ".git" ]; then
    print_error "Git 저장소가 없습니다! 이동이 실패했을 수 있습니다."
    exit 1
fi

print_success "Git 저장소 확인됨"

# Git 상태 확인
echo ""
print_info "Git 상태:"
git status | head -5

echo ""
print_info "최근 커밋:"
git log --oneline -1

# 폴더 구조 확인
echo ""
print_info "폴더 구조:"
ls -la | grep -E "^d|^-" | head -10

# ==================== Step 7: 최종 정보 ====================

print_header "✅ 폴더 구조 변경 완료!"

echo "새로운 위치: $(pwd)"
echo ""
echo "폴더 구조:"
pwd | sed 's|^|                        |'
echo "├── backend/"
echo "├── frontend/"
echo "├── docker-compose.yml"
echo "└── ..."
echo ""

# ==================== Step 8: 다음 단계 ====================

print_header "다음 단계"

echo "1️⃣  위치 확인:"
echo "   cd $(pwd)"
echo ""

echo "2️⃣  Docker 실행:"
echo "   docker compose build"
echo "   docker compose up"
echo ""

echo "3️⃣  VSCode 열기 (선택사항):"
echo "   code ."
echo ""

echo "4️⃣  최종 커밋 (선택사항):"
echo "   git add . (변경사항이 있으면)"
echo "   git commit -m \"chore: 폴더 구조 변경\""
echo "   git push origin main"
echo ""

print_success "완료되었습니다! 행운을 빕니다! 🎉"

exit 0

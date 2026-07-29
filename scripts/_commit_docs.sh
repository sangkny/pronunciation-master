#!/bin/bash
set -e
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
git add .
git commit -m "$(cat <<'EOF'
docs: Phase 10 완료 정리 및 Phase 11-15 로드맵 (Book Ch12-13)

EOF
)"
git push origin main
git log -1 --oneline

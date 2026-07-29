#!/bin/bash
set -e
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
git add .
git commit -m "$(cat <<'EOF'
Phase 10 Part 2: API Rate Limiting (Redis) 구현

EOF
)"
git push origin main
git status

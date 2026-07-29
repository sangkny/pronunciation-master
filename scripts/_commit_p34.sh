#!/bin/bash
set -e
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master
git add .
git status --short
git commit -m 'Phase 10 Part 3-4: Kubernetes + Prometheus Grafana Monitoring'
git push origin main
git log -1 --oneline

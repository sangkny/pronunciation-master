# 🎤 Pronunciation Master

AI 기반 영어 발음 교정 SaaS — Ontology · AOMD · 구독 · Enterprise B2B · 프로덕션 인프라

**현재:** Phase 1–10 Part 2–4 완료 ✅ | Part 1-D Gemma 4 ⚠️ | **다음:** Phase 11  
**전략 SSOT:** [LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md](./LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md)  
**Book:** [book/README.md](./book/README.md) (Ch0–13)

## 🚀 빠른 시작

```bash
git clone https://github.com/sangkny/pronunciation-master.git
cd pronunciation-master
cp .env.example .env.local
docker compose up -d --build
```

| 서비스 | URL |
|--------|-----|
| Frontend (dev) | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 (admin/admin) |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |
| LMStudio | http://localhost:1234 (호스트) |

## 📁 구조

```
pronunciation-master/
├── backend/          # Express API + /metrics (Prometheus)
├── frontend/         # React + Tailwind + PWA
├── mobile/           # Expo (Phase 11 확장 예정)
├── k8s/              # Kubernetes Manifest
├── helm/             # Helm Chart
├── monitoring/       # Prometheus + Grafana config
├── book/             # 기술 서적 Ch0–13
└── scripts/          # test-rate-limit, test-monitoring, deploy-k8s
```

## 📅 Phase 진행 현황

| Phase | 주요 기능 | 상태 | 커밋 |
|-------|---------|------|------|
| 1 | Web MVP (React + Express + LMStudio) | ✅ | 5d7569f |
| 2 | Ontology + AOMD + Scoring | ✅ | 2717f63 |
| 3 | PostgreSQL + JWT + 구독 | ✅ | cacba9d |
| 4–7 | STT + Analytics + PWA + CI/CD | ✅ | fc62750 |
| 8–9 | Enterprise SSO + B2B API + CDN | ✅ | 4a4e4ba |
| 10-1-D | Gemma 4 오디오 (골격) | ⚠️ | 97d7c81 |
| 10-2 | Rate Limiting (Redis) | ✅ | 49503db |
| 10-3 | Kubernetes 배포 | ✅ | 251681d |
| 10-4 | Prometheus 모니터링 | ✅ | 251681d |
| 11+ | 모바일 · 분석 · i18n · STT | 🔲 | — |

## 프로덕션 배포

### 로컬 (Docker Compose)

```bash
docker compose up -d --build
bash scripts/test-rate-limit.sh
bash scripts/test-monitoring.sh
```

### Kubernetes (minikube)

```bash
bash scripts/deploy-k8s.sh
kubectl port-forward svc/backend 5000:5000 -n pronunciation-master
kubectl port-forward svc/grafana 3000:3000 -n pronunciation-master
```

### Helm 배포

```bash
helm install pronunciation-master ./helm \
  --namespace pronunciation-master \
  --create-namespace
```

## 📖 문서

| 문서 | 설명 |
|------|------|
| [CURSOR_HANDOVER.md](./CURSOR_HANDOVER.md) | Handover (항상 최신) |
| [PHASE10_FINAL_SUMMARY.md](./PHASE10_FINAL_SUMMARY.md) | Phase 10 완료 보고 |
| [PHASE11_ROADMAP.md](./PHASE11_ROADMAP.md) | Phase 11–15 로드맵 |
| [book/README.md](./book/README.md) | Book Ch0–13 |
| [KUBERNETES_DEPLOYMENT.md](./KUBERNETES_DEPLOYMENT.md) | K8s 배포 |
| [PROMETHEUS_GRAFANA_MONITORING.md](./PROMETHEUS_GRAFANA_MONITORING.md) | 모니터링 |

## 🧪 테스트

```bash
bash scripts/test-phase9.sh
bash scripts/test-rate-limit.sh
bash scripts/test-monitoring.sh
```

## 🛠️ 프로덕션

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

MIT License

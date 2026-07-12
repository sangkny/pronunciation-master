# 🎤 Pronunciation Master

AI 기반 영어 발음 교정 SaaS — Ontology · AOMD · 구독 · Enterprise B2B

**현재:** Phase 1–9 완료 ✅ | **전략 SSOT:** [LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md](./LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md) | **Book:** [book/README.md](./book/README.md)

## 🚀 빠른 시작

```bash
git clone https://github.com/sangkny/pronunciation-master.git
cd pronunciation-master
cp .env.example .env.local   # 또는 .env.production.example
docker compose up -d --build
```

| 서비스 | URL |
|--------|-----|
| Frontend (dev) | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| PostgreSQL | localhost:5432 |
| LMStudio | http://localhost:1234 (호스트) |

## 📁 구조

```
pronunciation-master/
├── backend/          # Express API (Ontology, AOMD, SaaS, SSO, B2B)
├── frontend/         # React + Tailwind + PWA
├── mobile/           # Expo (녹음, STT, 푸시)
├── book/             # 기술 서적 Ch0–12 (Phase 1–9)
├── scripts/          # test-phase6~9.sh
└── docker-compose.yml
```

## 📅 Phase 완료 현황

| Phase | 내용 | 커밋 |
|-------|------|------|
| 1 | Web MVP | 5d7569f |
| 2 | Ontology + AOMD | 2717f63 |
| 3 | PostgreSQL + SaaS | cacba9d |
| 4 | STT + Analytics + i18n | 4aebfcc |
| 5 | PWA + Mobile + Stripe | 5fd6548 |
| 6 | 프로덕션 배포 | 0b79675 |
| 7 | STT + CI/CD | fc62750 |
| 8 | SSO + 모니터링 | 69380cd |
| 9 | 팀 + B2B API + CDN | 4a4e4ba |

## 📖 문서

| 문서 | 설명 |
|------|------|
| [CURSOR_HANDOVER.md](./CURSOR_HANDOVER.md) | 항상 최신 Handover |
| [book/README.md](./book/README.md) | Book 목차 Ch0–12 |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | 프로덕션 배포 |
| [SSO_GUIDE.md](./SSO_GUIDE.md) | Enterprise SSO |
| [CDN_DEPLOYMENT_GUIDE.md](./CDN_DEPLOYMENT_GUIDE.md) | CDN 설정 |
| [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) | GitHub Actions |

## 🧪 테스트

```bash
bash scripts/test-phase9.sh
```

## 🛠️ 프로덕션

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

MIT License

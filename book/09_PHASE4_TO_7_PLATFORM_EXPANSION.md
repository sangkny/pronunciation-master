# Chapter 9: Phase 4–7 플랫폼 확장 & 프로덕션

## 목적 (Why)

Web MVP를 **멀티채널·운영 가능** 플랫폼으로 확장합니다.

## 구현 내용 (How)

### Phase 4 — 고급 기능 (`4aebfcc`)
- **STT:** Web Speech API (`sttService.js`)
- **Analytics:** `/api/analytics/*`, `ProgressDashboard.jsx`
- **Leaderboard:** 사용자 간 랭킹
- **i18n:** ko/en UI 전환

### Phase 5 — 모바일 & PWA (`5fd6548`)
- PWA: manifest + Service Worker
- i18n 확장: ja/zh + `/api/i18n/curriculum/:locale`
- Expo `mobile/`: Login + Home + Mission
- Stripe Webhook: `POST /api/stripe/webhook`

### Phase 6 — 프로덕션 배포 (`0b79675`)
- `docker-compose.prod.yml`, frontend nginx Dockerfile
- Expo 녹음 (`expo-av`), 푸시 (`expo-notifications`)
- `DEPLOYMENT_GUIDE.md`, `STRIPE_PRODUCTION.md`

### Phase 7 — 운영 완성 (`fc62750`)
- 모바일 STT: `/api/stt/transcribe` (Whisper/mock)
- Stripe live: `GET /api/stripe/status`
- CI/CD: `.github/workflows/ci.yml`

## 결과 (What)

| Phase | 핵심 산출물 |
|-------|-------------|
| 4 | STT, Analytics, Leaderboard, i18n |
| 5 | PWA, Mobile, Stripe webhook |
| 6 | Prod Docker, Mobile 녹음/푸시 |
| 7 | STT API, CI pipeline |

**다음:** [Chapter 10 — Enterprise](./10_PHASE8_TO_9_ENTERPRISE.md)

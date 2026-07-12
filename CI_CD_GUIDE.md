# CI/CD Guide — Pronunciation Master

## 파이프라인

GitHub Actions: `.github/workflows/ci.yml`

| 단계 | 내용 |
|------|------|
| Trigger | `main` push / PR |
| Services | PostgreSQL 16 |
| Build | `frontend` npm build |
| Test | `scripts/test-phase7.sh` smoke test |

## 로컬 테스트

```bash
# Docker dev 환경 실행 후
bash scripts/test-phase7.sh

# 또는 API URL 지정
API_URL=http://localhost:5000 bash scripts/test-phase7.sh
```

## 검증 항목

- `GET /api/health`
- `GET /api/stt/status` (JWT)
- `POST /api/stt/transcribe` (mock)
- `GET /api/stripe/status`
- `GET /api/ontology/domains` (JWT)
- `POST /api/stripe/webhook` (mock)

## STT 프로덕션

`OPENAI_API_KEY` 설정 시 Whisper API 사용. 미설정 시 mock(개발용).

## Stripe 프로덕션

`GET /api/stripe/status` → `productionReady`, `liveVerification` 확인.

---

Generated: 2026-07-12 | Phase 7

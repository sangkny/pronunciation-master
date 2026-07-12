# Chapter 1: 아키텍처 개요

## 목적 (Why)

전체 시스템 구조를 이해하고, 개발·배포·확장 시 참조할 기술 사양서를 확립합니다.

## 구현 내용 (How)

### 시스템 다이어그램

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│ Web (React) │────▶│ Express API │────▶│ PostgreSQL   │
│ PWA :5173   │     │ :5000       │     │ :5432        │
└─────────────┘     └──────┬──────┘     └──────────────┘
┌─────────────┐            │
│ Mobile Expo │────────────┤
└─────────────┘            ▼
                    ┌──────────────┐
                    │ LMStudio     │
                    │ Gemma 4 :1234│
                    └──────────────┘
```

### 핵심 엔진
| 엔진 | 역할 |
|------|------|
| ontologyEngine | 5도메인, 50개념, 학습 경로 |
| aomdEngine | Advocate/Opposite/Meditator/Decisioner |
| scoringEngine | 0–100 발음 점수 |
| subscriptionManager | Free/Pro/Enterprise |
| sttEngine | Whisper/mock STT |
| ssoManager | Enterprise SSO |
| teamManager / apiKeyManager | Phase 9 B2B |

### 포트 (개발)
- Frontend: **5173** (dev), **80** (prod nginx)
- Backend: **5000**
- PostgreSQL: **5432**
- LMStudio: **1234** (호스트)

### 인증 흐름
1. `POST /api/auth/login` → JWT
2. `POST /api/sso/login` → Enterprise JWT
3. `X-API-Key: pm_live_...` → B2B API (Phase 9)

## 결과 (What)

- 마이크로서비스형 단일 백엔드 + 멀티 클라이언트
- JWT + API Key 이중 인증
- Docker Compose로 3서비스(postgres, backend, frontend) 기동

**다음:** [Chapter 2 — 환경 구성](./02_PHASE1_ENVIRONMENT_SETUP.md)

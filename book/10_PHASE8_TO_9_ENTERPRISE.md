# Chapter 10: Phase 8–9 Enterprise & B2B

## 목적 (Why)

Enterprise 티어 약속(**SSO, 맞춤 Ontology, 팀, API, CDN**)을 코드와 문서로 완성합니다.

## 구현 내용 (How)

### Phase 8 — Enterprise 확장 (`69380cd`)

| 기능 | API/파일 |
|------|----------|
| SSO | `POST /api/sso/login`, `sso_identities` |
| 맞춤 Ontology | `/api/custom-ontology/*` (Enterprise) |
| 모니터링 | `monitoringMiddleware`, Sentry/Datadog 훅 |

### Phase 9 — B2B & CDN

| 기능 | API/파일 |
|------|----------|
| 팀 관리 | `POST /api/teams`, `team_members` DB |
| B2B API 키 | `POST /api/api-keys`, `X-API-Key` 인증 |
| CDN | `frontend/nginx.conf` immutable 캐시 |
| Enterprise UI | `EnterprisePanel.jsx` |

### B2B API 키 사용 예
```bash
# 키 발급 (Enterprise JWT)
curl -X POST http://localhost:5000/api/api-keys \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Partner Integration"}'

# API 호출
curl http://localhost:5000/api/ontology/domains \
  -H "X-API-Key: pm_live_..."
```

### SSO → Enterprise 자동 승격
`POST /api/sso/login` 성공 시 `users.tier = Enterprise`

## 결과 (What)

- LONG_TERM_STRATEGY Enterprise Tier 기능 대부분 구현
- B2B 파트너 Ontology API 연동 가능
- CDN 가이드: `CDN_DEPLOYMENT_GUIDE.md`

**다음:** [Chapter 11 — 배운 점](./11_LESSONS_LEARNED.md)

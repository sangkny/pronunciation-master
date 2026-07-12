# CDN Deployment Guide — Global Static Asset Delivery

## nginx CDN 설정 (Phase 9)

`frontend/nginx.conf` 프로덕션 캐시 정책:

| 자산 | Cache-Control | 만료 |
|------|---------------|------|
| HTML (SPA) | no-cache | 항상 최신 |
| JS/CSS | public, immutable | 30일 |
| 이미지/폰트 | public, immutable | 365일 |
| API `/api/*` | no-store | 캐시 없음 |

## CDN 연동 (Cloudflare / AWS CloudFront)

1. Origin: `docker compose -f docker-compose.prod.yml up` (포트 80)
2. CDN에서 Origin 도메인 설정
3. 환경변수:

```env
CDN_URL=https://cdn.yourdomain.com
VITE_API_URL=https://api.yourdomain.com
```

4. 정적 자산 URL을 `CDN_URL`로 서빙 (빌드 시 `base` 설정 가능)

## B2B API 키 사용

```bash
curl https://api.yourdomain.com/api/ontology/domains \
  -H "X-API-Key: pm_live_..."
```

Enterprise 티어에서 `POST /api/api-keys`로 발급.

## 팀 관리

Enterprise Console (웹 UI) 또는 API:
- `POST /api/teams` — 팀 생성
- `POST /api/teams/:id/members` — 멤버 추가

---

Generated: 2026-07-13 | Phase 9

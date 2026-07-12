# SSO Guide — Enterprise Single Sign-On

## 지원 프로바이더

| ID | 타입 | 설명 |
|----|------|------|
| `enterprise-mock` | mock | 개발/테스트용 (기본 활성) |
| `oidc` | oidc | `SSO_OIDC_ISSUER` 설정 시 활성 |

## Mock SSO (개발)

```bash
curl -X POST http://localhost:5000/api/sso/login \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "enterprise-mock",
    "email": "user@corp.com",
    "name": "Corp User",
    "ssoToken": "enterprise-sso-mock",
    "externalId": "emp-001"
  }'
```

환경변수:
- `SSO_MOCK_SECRET` — 기본값 `enterprise-sso-mock`

## OIDC (프로덕션)

```env
SSO_OIDC_ISSUER=https://login.microsoftonline.com/{tenant}/v2.0
SSO_CLIENT_ID=your-client-id
SSO_CLIENT_SECRET=your-client-secret
```

## 동작

1. SSO 인증 성공 → `sso_identities` 테이블 연결
2. 신규 사용자 → Enterprise 티어 자동 생성
3. 기존 사용자 → Enterprise 티어로 승격
4. JWT 토큰 반환 → 이후 API Bearer 인증

## Enterprise 전용 기능

SSO 로그인 후 사용 가능:
- `POST /api/custom-ontology` — 맞춤 Ontology
- 팀 관리 (향후 확장)

---

Generated: 2026-07-12 | Phase 8

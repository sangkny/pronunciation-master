# JWT 기반 사용자 인증 플로우

## 개요

| 항목 | 값 |
|------|-----|
| 방식 | JWT Bearer Token |
| 만료 | 24시간 |
| 해시 | bcrypt (salt rounds: 10) |
| 저장 | 클라이언트 localStorage (`pm_token`) |

---

## 회원가입 플로우

```
Client                          Server                         DB
  │ POST /api/auth/register       │                              │
  │ {email, name, password}       │                              │
  │──────────────────────────────>│ hashPassword(password)       │
  │                               │ createUser(email, name, hash)│
  │                               │─────────────────────────────>│
  │                               │<─────────────────────────────│
  │                               │ generateJWT(userId, email)   │
  │<──────────────────────────────│                              │
  │ {success, userId, token}      │                              │
```

### 요청

```json
POST /api/auth/register
{
  "email": "user@example.com",
  "name": "John",
  "password": "password123"
}
```

### 응답 (200)

```json
{
  "success": true,
  "message": "Registration successful",
  "userId": 1,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 로그인 플로우

```
Client                          Server                         DB
  │ POST /api/auth/login          │                              │
  │ {email, password}             │                              │
  │──────────────────────────────>│ getUserByEmail(email)        │
  │                               │─────────────────────────────>│
  │                               │ comparePassword(pw, hash)  │
  │                               │ generateJWT(userId, email)   │
  │<──────────────────────────────│                              │
  │ {success, token, user}        │                              │
```

### 응답 (200)

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": 1,
    "email": "user@example.com",
    "name": "John",
    "tier": "Free"
  }
}
```

---

## 인증된 API 요청

모든 `/api/*` 엔드포인트(`/api/auth/*` 제외)는 Authorization 헤더 필요.

```
Authorization: Bearer <JWT_TOKEN>
```

### 미들웨어 처리

1. `Authorization` 헤더에서 Bearer 토큰 추출
2. `verifyJWT(token)` → `{ userId, email }`
3. `req.user = { userId, email }` 설정
4. 다음 핸들러로 전달

### 실패 응답 (401)

```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

---

## 토큰 구조

```json
{
  "userId": 1,
  "email": "user@example.com",
  "iat": 1710000000,
  "exp": 1710086400
}
```

- `exp`: 발급 후 24시간
- Secret: `JWT_SECRET` 환경변수

---

## 공개 엔드포인트 (인증 불필요)

- `GET /health`
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

---

Generated: 2026-07-12 | Phase 3 Part 2

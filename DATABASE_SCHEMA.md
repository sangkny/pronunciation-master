# DATABASE_SCHEMA.md — Pronunciation Master

PostgreSQL 영속 저장소 설계 문서 (Phase 3 Part 1)

---

## 개요

| 항목 | 값 |
|------|-----|
| DBMS | PostgreSQL 16 |
| Database | `pronunciation_master` |
| User | `dev` |
| Port | `5432` |

---

## ER 다이어그램

```
users (1) ──< user_progress
users (1) ──< user_scores
users (1) ──< subscriptions
users (1) ──< daily_usage
```

---

## 테이블 정의

### 1. users

사용자 계정 및 구독 티어 정보.

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(20) DEFAULT 'Free' CHECK (tier IN ('Free', 'Pro', 'Enterprise')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | PK |
| email | VARCHAR(255) | 로그인 이메일 (UNIQUE) |
| password_hash | VARCHAR(255) | bcrypt 해시 |
| name | VARCHAR(100) | 표시 이름 |
| tier | VARCHAR(20) | Free / Pro / Enterprise |
| created_at | TIMESTAMP | 가입일 |

---

### 2. user_progress

도메인별 개념 학습 진도.

```sql
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  domain_id VARCHAR(50) NOT NULL,
  concept_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'skipped')),
  completed_at TIMESTAMP,
  UNIQUE(user_id, domain_id, concept_id)
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | PK |
| user_id | INTEGER | FK → users |
| domain_id | VARCHAR(50) | 도메인 ID (medical, telecom 등) |
| concept_id | VARCHAR(100) | 온톨로지 개념 ID |
| status | VARCHAR(20) | in_progress / completed / skipped |
| completed_at | TIMESTAMP | 완료 시각 |

---

### 3. user_scores

발음 연습 점수 및 AOMD 피드백 기록.

```sql
CREATE TABLE IF NOT EXISTS user_scores (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  word VARCHAR(100) NOT NULL,
  user_pronunciation TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback_aomd JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | PK |
| user_id | INTEGER | FK → users |
| word | VARCHAR(100) | 연습 단어 |
| user_pronunciation | TEXT | 사용자 발음 (STT 결과) |
| score | INTEGER | 0–100 점수 |
| feedback_aomd | JSONB | AOMD 4역할 피드백 JSON |
| created_at | TIMESTAMP | 기록 시각 |

---

### 4. subscriptions

구독 결제 및 갱신 이력.

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('Free', 'Pro', 'Enterprise')),
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_payment_id VARCHAR(255)
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | PK |
| user_id | INTEGER | FK → users |
| tier | VARCHAR(20) | 구독 티어 |
| start_date | TIMESTAMP | 구독 시작 |
| end_date | TIMESTAMP | 구독 만료 |
| status | VARCHAR(20) | active / cancelled / expired |
| stripe_payment_id | VARCHAR(255) | Stripe Payment Intent ID |

---

### 5. daily_usage

Free 티어 일일 연습 횟수 추적.

```sql
CREATE TABLE IF NOT EXISTS daily_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  usage_date DATE DEFAULT CURRENT_DATE,
  practice_count INTEGER DEFAULT 0,
  UNIQUE(user_id, usage_date)
);
```

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL | PK |
| user_id | INTEGER | FK → users |
| usage_date | DATE | 사용 날짜 |
| practice_count | INTEGER | 당일 연습 횟수 |

---

## 인덱스

```sql
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_user ON user_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_created ON user_scores(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, usage_date);
```

---

## 연결 설정

```env
DB_HOST=postgres        # Docker 내부
DB_PORT=5432
DB_NAME=pronunciation_master
DB_USER=dev
DB_PASSWORD=devpass
```

---

Generated: 2026-07-12 | Phase 3 Part 1

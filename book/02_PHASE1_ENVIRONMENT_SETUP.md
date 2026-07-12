# Chapter 2: Phase 1 환경 구성 — WSL + Docker + LMStudio

## 목적 (Why)

모든 개발자가 `docker compose up` 한 줄로 동일 환경에서 작업할 수 있게 합니다.

## 구현 내용 (How)

### 전제조건
- Windows 11 + WSL 2
- Docker Desktop (WSL 통합)
- LMStudio (호스트에서 Gemma 4 로드)

### docker-compose.yml (3서비스)
```yaml
services:
  postgres:   # :5432
  backend:    # :5000, LMSTUDIO_API_URL=http://host.docker.internal:1234/v1
  frontend:   # :5173 (dev)
```

### 환경 변수 (.env.local)
```env
DB_HOST=postgres
JWT_SECRET=your-secret
LMSTUDIO_API_URL=http://host.docker.internal:1234/v1
LMSTUDIO_MODEL=google/gemma-4-e4b
```

### LMStudio 연결
- Docker 컨테이너 → `host.docker.internal:1234`로 호스트 LMStudio 접근
- 연결 실패 시 llmManager가 샘플 데이터 폴백

## 결과 (What)

```bash
docker compose up -d --build
curl http://localhost:5000/api/health
# → {"status":"healthy","database":true}
```

- Phase 1 커밋: `5d7569f`
- Frontend: http://localhost:5173

**다음:** [Chapter 3 — Frontend](./03_PHASE1_FRONTEND_DEVELOPMENT.md)

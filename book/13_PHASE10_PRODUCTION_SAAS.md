# Chapter 13: Phase 10 — 프로덕션 SaaS 인프라

## 목적 (Why)

Phase 9까지 완성된 기능(Ontology, AOMD, B2B)을 **Rate Limiting · Kubernetes · Prometheus/Grafana**로 프로덕션 수준으로 끌어올립니다.

## 구현 내용 (How)

### Part 2: Rate Limiting (Redis) — `49503db`

| Tier | 한도 |
|------|------|
| Free | 100 req/h |
| Pro | 1,000 req/h |
| Enterprise | 10,000 req/h |
| IP (공통) | 1,000 req/h |

- `express-rate-limit` + `rate-limit-redis` + Redis 7
- `backend/src/middleware/rateLimitMiddleware.js`, `tierRateLimiter.js`
- 테스트: `scripts/test-rate-limit.sh`

### Part 3: Kubernetes — `251681d`

| 리소스 | Kind | replicas/용량 |
|--------|------|---------------|
| backend | Deployment | 3 (HPA 2–5) |
| frontend | Deployment | 2 (HPA 1–3) |
| postgres | StatefulSet | 10Gi |
| redis | StatefulSet | 2Gi |

- `k8s/` Manifest, `helm/` Chart, `scripts/deploy-k8s.sh`
- Ingress: `pronunciation-master.local`, Grafana: `grafana.pronunciation-master.local`

### Part 4: Prometheus + Grafana — `251681d`

- Backend `GET /metrics` (`prom-client`)
- Docker Compose: `:9090` Prometheus, `:3000` Grafana
- K8s: `k8s/prometheus-deployment.yaml`, `k8s/grafana-deployment.yaml`
- 테스트: `scripts/test-monitoring.sh`

### Part 1-D: Gemma 4 오디오 — `97d7c81` ⚠️

| 항목 | 상태 |
|------|------|
| UI/API/폴백 골격 | ✅ |
| WebGPU 스펙트로그램 우회 | ✅ |
| Whisper STT 폴백 | ✅ |
| Gemma 4 native 오디오 | ❌ (후속) |

→ `GEMMA4_AUDIO_IMPLEMENTATION.md`, Phase 14와 연계 예정

## 결과 (What)

### Phase 10 완료 체크리스트

```
✅ Rate Limiting (Tier + IP, Redis)
✅ K8s Manifest + Helm + minikube 테스트
✅ Prometheus /metrics + Grafana 대시보드
✅ Docker Compose 멀티 서비스 (postgres, redis, prometheus, grafana)
⚠️ Part 1-D Gemma 4 오디오 — 골격만 (별도 후속)
```

### 아키텍처 (요약)

```
Ingress → Frontend → Backend → PostgreSQL / Redis
                              ↓
                    Prometheus → Grafana
```

### 관련 문서

- `PHASE10_FINAL_SUMMARY.md`
- `RATE_LIMITING_STRATEGY.md`
- `KUBERNETES_DEPLOYMENT.md`
- `PROMETHEUS_GRAFANA_MONITORING.md`

---

*다음: [12_FUTURE_ROADMAP.md](./12_FUTURE_ROADMAP.md) — Phase 11–15 계획*

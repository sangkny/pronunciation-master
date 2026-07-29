# Prometheus + Grafana 모니터링

**Phase:** 10 Part 4  
**상태:** 구현 완료

---

## 아키텍처

```
Backend (/metrics) ──scrape──► Prometheus :9090 ──datasource──► Grafana :3000
     │                              │
     └─ prom-client metrics         └─ alerting (확장 가능)
```

| 컴포넌트 | 역할 |
|----------|------|
| **prom-client** | Backend `/metrics` Prometheus exposition |
| **Prometheus** | 시계열 수집·저장 (15s scrape) |
| **Grafana** | 대시보드·시각화 |

---

## Backend 메트릭 (`GET /metrics`)

| 메트릭 | 타입 | 설명 |
|--------|------|------|
| `pronunciation_http_requests_total` | Counter | method, route, status_code |
| `pronunciation_http_request_duration_seconds` | Histogram | 요청 지연 |
| `pronunciation_http_errors_total` | Counter | 5xx 에러 |
| `pronunciation_db_connected` | Gauge | DB 연결 (1/0) |
| `pronunciation_active_requests` | Gauge | 처리 중 요청 |
| `pronunciation_*` (default) | — | Node.js CPU/메모리 등 |

기존 `/api/monitoring/status` (Phase 8)와 병행 — Sentry/Datadog 연동 유지.

---

## 로컬 (Docker Compose)

```bash
docker compose up -d
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3000  (admin / admin)
# Backend:    http://localhost:5000/metrics
```

---

## Kubernetes

```bash
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml

# 또는 전체 배포
bash scripts/deploy-k8s.sh
bash scripts/test-monitoring.sh
```

| 서비스 | 포트 | 접근 |
|--------|------|------|
| prometheus | 9090 | `kubectl port-forward svc/prometheus 9090:9090 -n pronunciation-master` |
| grafana | 3000 | `kubectl port-forward svc/grafana 3000:3000 -n pronunciation-master` |

Ingress (선택): `grafana.pronunciation-master.local`

---

## Grafana 대시보드

프로비저닝: `monitoring/grafana/provisioning/`

- **Pronunciation Master Overview** — RPS, 지연 p95, 5xx, DB 상태

---

## 환경 변수

```env
# Grafana (K8s Secret)
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin

# 기존 (Phase 8)
SENTRY_DSN=
DATADOG_API_KEY=
```

---

## 관련 파일

- `backend/src/services/prometheusMetrics.js`
- `monitoring/prometheus.yml`
- `monitoring/grafana/`
- `k8s/prometheus-deployment.yaml`, `k8s/grafana-deployment.yaml`
- `helm/templates/prometheus-*.yaml`, `helm/templates/grafana-*.yaml`
- `scripts/test-monitoring.sh`

---

Generated: 2026-07-29 | Phase 10 Part 4

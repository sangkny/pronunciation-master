# Kubernetes 배포 가이드

**Phase:** 10 Part 3  
**상태:** 구현 완료  
**대상:** minikube (로컬) → EKS/GKE/AKS (프로덕션)

---

## 아키텍처

```
                    ┌─────────────────────────────────────┐
                    │  Ingress (pronunciation-master.local)│
                    │  /api → backend  |  / → frontend    │
                    └──────────────┬──────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
   ┌─────▼─────┐            ┌──────▼──────┐           ┌──────▼──────┐
   │ Frontend  │            │   Backend   │           │     HPA     │
   │ Deployment│            │ Deployment  │           │ CPU 기반    │
   │ replicas:2│            │ replicas: 3 │           │ auto-scale  │
   └───────────┘            └──────┬──────┘           └─────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
              ┌─────▼─────┐               ┌───────▼───────┐
              │ PostgreSQL│               │     Redis     │
              │StatefulSet│               │  StatefulSet  │
              │   10Gi    │               │     2Gi       │
              └───────────┘               └───────────────┘
```

| 리소스 | Kind | 역할 |
|--------|------|------|
| `namespace.yaml` | Namespace | `pronunciation-master` 격리 |
| `configmap.yaml` | ConfigMap | 비민감 환경 변수 |
| `secret.yaml` | Secret | DB/JWT/AWS 키 (프로덕션: Sealed Secrets) |
| `backend-deployment.yaml` | Deployment | API 서버 ×3 |
| `frontend-deployment.yaml` | Deployment | Nginx SPA ×2 |
| `postgres-statefulset.yaml` | StatefulSet | PostgreSQL 영속 저장 |
| `redis-statefulset.yaml` | StatefulSet | Rate Limiting Redis |
| `service.yaml` | Service | ClusterIP 내부 DNS |
| `ingress.yaml` | Ingress | TLS + 라우팅 |
| `hpa.yaml` | HorizontalPodAutoscaler | CPU 기반 자동 스케일 |

---

## 리소스 요청/제한 (16GB RAM 노드 기준)

| Pod | Replicas | CPU req/limit | Memory req/limit |
|-----|----------|---------------|------------------|
| Backend | 3 | 250m / 500m | 256Mi / 512Mi |
| Frontend | 2 | 100m / 200m | 128Mi / 256Mi |
| PostgreSQL | 1 | 250m / 500m | 512Mi / 1Gi |
| Redis | 1 | 100m / 200m | 128Mi / 256Mi |

**합계 (최대):** ~4.5Gi RAM, ~3.4 CPU — minikube `--memory=8192` 권장

> **저메모리 호스트:** `scripts/deploy-k8s.sh`가 RAM 4GB 미만이면 backend=2, frontend=1로 자동 스케일합니다. manifest 기본값은 backend=3, frontend=2입니다.

---

## 헬스체크

### Backend
- **Liveness:** `GET /health` — 30s initial, 10s period
- **Readiness:** `GET /health` — 10s initial, 5s period

### Frontend (Nginx)
- **Liveness/Readiness:** `GET /` — port 80

### PostgreSQL
- **Liveness/Readiness:** `pg_isready -U dev -d pronunciation_master`

### Redis
- **Liveness/Readiness:** `redis-cli ping`

---

## 스케일링 전략

| HPA | Min | Max | Metric |
|-----|-----|-----|--------|
| Backend | 2 | 5 | CPU 70% |
| Frontend | 1 | 3 | CPU 80% |

프로덕션: `metrics-server` + Cluster Autoscaler 연동

---

## 배포 방법

### 1. kubectl (raw manifests)

```bash
bash scripts/deploy-k8s.sh
# 또는
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

### 2. Helm

```bash
helm install pronunciation-master ./helm -n pronunciation-master --create-namespace
helm upgrade pronunciation-master ./helm -n pronunciation-master
```

---

## minikube 로컬 테스트

```bash
# 사전 요구: minikube, kubectl, docker
bash scripts/deploy-k8s.sh

# Ingress hosts (Windows: C:\Windows\System32\drivers\etc\hosts)
# <minikube-ip> pronunciation-master.local

minikube ip
kubectl get pods -n pronunciation-master
kubectl port-forward svc/backend 5000:5000 -n pronunciation-master
kubectl port-forward svc/frontend 8080:80 -n pronunciation-master
```

### HPA 테스트

```bash
minikube addons enable metrics-server
kubectl get hpa -n pronunciation-master
kubectl run -it loadgen --image=busybox --restart=Never -- /bin/sh -c "while true; do wget -q -O- http://backend:5000/health; done"
```

### 롤링 업데이트

```bash
kubectl set image deployment/backend backend=pronunciation-master-backend:v2 -n pronunciation-master
kubectl rollout status deployment/backend -n pronunciation-master
kubectl rollout undo deployment/backend -n pronunciation-master  # 롤백
```

---

## TLS (프로덕션)

- minikube: 자체 서명 또는 TLS 생략 (`ingress.yaml` annotation 참고)
- 프로덕션: **cert-manager** + Let's Encrypt

```yaml
cert-manager.io/cluster-issuer: letsencrypt-prod
```

---

## 관련 파일

- `k8s/` — kubectl manifest
- `helm/` — Helm Chart
- `scripts/deploy-k8s.sh` — minikube 원클릭 배포

---

Generated: 2026-07-29 | Phase 10 Part 3

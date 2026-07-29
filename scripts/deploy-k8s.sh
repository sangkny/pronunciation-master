#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NAMESPACE="pronunciation-master"
USE_HELM="${USE_HELM:-false}"
SKIP_MINIKUBE="${SKIP_MINIKUBE:-false}"
TOTAL_MEM_MB=$(free -m 2>/dev/null | awk '/^Mem:/{print $2}' || echo "4096")
MEM_MB="${MINIKUBE_MEMORY_MB:-$(( TOTAL_MEM_MB * 70 / 100 ))}"
if [[ "$MEM_MB" -gt 8192 ]]; then MEM_MB=8192; fi
if [[ "$MEM_MB" -lt 2048 ]]; then MEM_MB=2048; fi
MINIKUBE_FORCE="${MINIKUBE_FORCE:---force}"

echo "=== Pronunciation Master — Kubernetes Deploy ==="
echo "Project: $ROOT"
echo "Namespace: $NAMESPACE"
echo "Use Helm: $USE_HELM"

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "❌ Required command not found: $1"
    exit 1
  fi
}

need_cmd kubectl
need_cmd docker

if [[ "$SKIP_MINIKUBE" != "true" ]]; then
  need_cmd minikube
  echo ""
  echo "1️⃣ Starting minikube..."
  CPU_COUNT="${MINIKUBE_CPUS:-2}"
  echo "  memory=${MEM_MB}MB cpus=${CPU_COUNT} (host RAM: ${TOTAL_MEM_MB}MB)"
  if ! minikube status >/dev/null 2>&1; then
    minikube start --memory="${MEM_MB}MB" --cpus="$CPU_COUNT" --driver=docker $MINIKUBE_FORCE
  else
    echo "  minikube already running"
  fi

  echo ""
  echo "2️⃣ Enabling addons (ingress, metrics-server)..."
  minikube addons enable ingress
  minikube addons enable metrics-server

  echo ""
  echo "3️⃣ Building Docker images in minikube context..."
  eval "$(minikube docker-env)"
fi

echo ""
echo "4️⃣ Building backend image..."
docker build -t pronunciation-master-backend:latest "$ROOT/backend"

echo ""
echo "5️⃣ Building frontend image (production nginx)..."
docker build \
  --build-arg VITE_API_URL=http://pronunciation-master.local \
  -t pronunciation-master-frontend:latest \
  -f "$ROOT/frontend/Dockerfile" \
  "$ROOT/frontend"

if [[ "$USE_HELM" == "true" ]]; then
  need_cmd helm
  echo ""
  echo "6️⃣ Deploying with Helm..."
  helm upgrade --install pronunciation-master "$ROOT/helm" \
    -n "$NAMESPACE" \
    --create-namespace \
    --wait --timeout 10m
else
  echo ""
  echo "6️⃣ Applying kubectl manifests..."
  kubectl apply -f "$ROOT/k8s/namespace.yaml"
  kubectl apply -f "$ROOT/k8s/configmap.yaml"
  kubectl apply -f "$ROOT/k8s/secret.yaml"
  kubectl apply -f "$ROOT/k8s/postgres-statefulset.yaml"
  kubectl apply -f "$ROOT/k8s/redis-statefulset.yaml"
  kubectl apply -f "$ROOT/k8s/service.yaml"
  kubectl apply -f "$ROOT/k8s/backend-deployment.yaml"
  kubectl apply -f "$ROOT/k8s/frontend-deployment.yaml"
  kubectl apply -f "$ROOT/k8s/ingress.yaml"
  kubectl apply -f "$ROOT/k8s/hpa.yaml"

  if [[ "$MEM_MB" -lt 4096 ]]; then
    echo "  Low-memory host: scaling to backend=2, frontend=1"
    kubectl scale deployment backend --replicas=2 -n "$NAMESPACE"
    kubectl scale deployment frontend --replicas=1 -n "$NAMESPACE"
  fi
fi

echo ""
echo "7️⃣ Waiting for pods..."
kubectl wait --for=condition=ready pod -l app=postgres -n "$NAMESPACE" --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=redis -n "$NAMESPACE" --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=backend -n "$NAMESPACE" --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=frontend -n "$NAMESPACE" --timeout=300s || true

echo ""
echo "8️⃣ Cluster status"
kubectl get pods -n "$NAMESPACE" -o wide
kubectl get svc -n "$NAMESPACE"
kubectl get ingress -n "$NAMESPACE"
kubectl get hpa -n "$NAMESPACE" 2>/dev/null || echo "(HPA pending metrics-server)"

MINIKUBE_IP=""
if command -v minikube >/dev/null 2>&1 && minikube status >/dev/null 2>&1; then
  MINIKUBE_IP=$(minikube ip)
fi

echo ""
echo "9️⃣ Connectivity test (port-forward)"
kubectl port-forward svc/backend 5000:5000 -n "$NAMESPACE" >/dev/null 2>&1 &
PF_PID=$!
sleep 3
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health || echo "000")
kill "$PF_PID" 2>/dev/null || true
wait "$PF_PID" 2>/dev/null || true

if [[ "$HEALTH" == "200" ]]; then
  echo "  ✅ Backend /health → HTTP 200"
else
  echo "  ⚠️ Backend /health → HTTP $HEALTH (pods may still be starting)"
fi

echo ""
echo "🔟 Rolling update test (redeploy same image)"
kubectl rollout restart deployment/backend -n "$NAMESPACE"
kubectl rollout status deployment/backend -n "$NAMESPACE" --timeout=180s
echo "  ✅ Backend rolling restart complete"

echo ""
echo "=== Deploy Complete ==="
if [[ -n "$MINIKUBE_IP" ]]; then
  echo "Add to hosts file: $MINIKUBE_IP pronunciation-master.local"
  echo "  Linux/macOS: echo '$MINIKUBE_IP pronunciation-master.local' | sudo tee -a /etc/hosts"
  echo "  Windows: C:\\Windows\\System32\\drivers\\etc\\hosts"
fi
echo ""
echo "Useful commands:"
echo "  kubectl port-forward svc/backend 5000:5000 -n $NAMESPACE"
echo "  kubectl port-forward svc/frontend 8080:80 -n $NAMESPACE"
echo "  kubectl get hpa -n $NAMESPACE -w"
echo "  USE_HELM=true bash scripts/deploy-k8s.sh  # Helm deploy"

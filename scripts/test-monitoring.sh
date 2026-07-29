#!/bin/bash
set -e

API="${API_URL:-http://localhost:5000}"
PROM="${PROMETHEUS_URL:-http://localhost:9090}"
GRAFANA="${GRAFANA_URL:-http://localhost:3000}"
NAMESPACE="${K8S_NAMESPACE:-pronunciation-master}"

echo "=== Monitoring Test (Phase 10 Part 4) ==="

echo ""
echo "1️⃣ Backend /metrics"
METRICS=$(curl -s "$API/metrics" | head -20)
if echo "$METRICS" | grep -q "pronunciation_http_requests_total"; then
  echo "  ✅ Prometheus metrics exposed"
else
  echo "  ❌ /metrics missing pronunciation_* metrics"
  echo "$METRICS"
  exit 1
fi

echo ""
echo "2️⃣ Backend /health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/health")
echo "  HTTP $STATUS"
if [[ "$STATUS" != "200" ]]; then exit 1; fi

echo ""
echo "3️⃣ /api/monitoring/status (Phase 8)"
curl -s "$API/api/monitoring/status" | python3 -c "import sys,json; d=json.load(sys.stdin); print('  requestCount:', d.get('requestCount', d.get('success')))" 2>/dev/null || echo "  (skipped)"

echo ""
echo "4️⃣ Prometheus targets"
if curl -sf "$PROM/-/ready" >/dev/null 2>&1; then
  curl -s "$PROM/api/v1/targets" | python3 -c "
import sys, json
d = json.load(sys.stdin)
active = d.get('data', {}).get('activeTargets', [])
for t in active:
    print('  ', t.get('labels', {}).get('job'), t.get('health'), t.get('scrapeUrl'))
" 2>/dev/null || echo "  Prometheus reachable"
  echo "  ✅ Prometheus OK"
else
  echo "  ⚠️ Prometheus not reachable at $PROM (docker compose or port-forward needed)"
fi

echo ""
echo "5️⃣ Grafana health"
if curl -sf "$GRAFANA/api/health" >/dev/null 2>&1; then
  curl -s "$GRAFANA/api/health"
  echo ""
  echo "  ✅ Grafana OK (login: admin / admin)"
else
  echo "  ⚠️ Grafana not reachable at $GRAFANA"
fi

echo ""
echo "6️⃣ Generate sample traffic"
for i in {1..5}; do
  curl -s "$API/health" >/dev/null
  curl -s "$API/api/monitoring/status" >/dev/null
done
echo "  5 health + monitoring requests sent"

if curl -sf "$PROM/-/ready" >/dev/null 2>&1; then
  echo ""
  echo "7️⃣ Prometheus query (RPS)"
  curl -s "$PROM/api/v1/query?query=sum(rate(pronunciation_http_requests_total[1m]))" | python3 -c "
import sys, json
d = json.load(sys.stdin)
r = d.get('data', {}).get('result', [])
print('  result:', r[0]['value'][1] if r else 'no data yet (wait 15s scrape)')
" 2>/dev/null || true
fi

echo ""
echo "=== Monitoring Test Complete ==="
echo ""
echo "K8s:"
echo "  kubectl port-forward svc/prometheus 9090:9090 -n $NAMESPACE"
echo "  kubectl port-forward svc/grafana 3000:3000 -n $NAMESPACE"

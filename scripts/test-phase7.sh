#!/bin/bash
set -e
API="${API_URL:-http://localhost:5000}"

REGISTER=$(curl -s -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"phase7user@test.com","password":"test1234","name":"Phase7 User"}')

TOKEN=$(echo "$REGISTER" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')" 2>/dev/null || true)

if [ -z "$TOKEN" ]; then
  LOGIN=$(curl -s -X POST "$API/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"phase7user@test.com","password":"test1234"}')
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
fi

if [ -z "$TOKEN" ]; then
  echo "AUTH FAILED"
  exit 1
fi

echo "TOKEN OK (${#TOKEN} chars)"

echo "=== Health ==="
curl -s "$API/api/health"
echo ""

echo "=== STT Status ==="
curl -s "$API/api/stt/status" -H "Authorization: Bearer $TOKEN"
echo ""

echo "=== STT Transcribe (mock) ==="
curl -s -X POST "$API/api/stt/transcribe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"audioBase64":"dGVzdA==","expectedWord":"equipment"}'
echo ""

echo "=== Stripe Status ==="
curl -s "$API/api/stripe/status"
echo ""

echo "=== Ontology Domains ==="
curl -s "$API/api/ontology/domains" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin); print('domains:', len(d.get('domains',[])))"
echo ""

echo "=== Stripe Webhook Mock ==="
curl -s -X POST "$API/api/stripe/webhook" \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded","data":{"object":{"metadata":{"userId":"1","tier":"Pro"}}}}'
echo ""

echo "ALL PHASE 7 TESTS DONE"

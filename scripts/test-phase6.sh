#!/bin/bash
set -e
API="http://localhost:5000"

REGISTER=$(curl -s -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"phase6user@test.com","password":"test1234","name":"Phase6 User"}')

TOKEN=$(echo "$REGISTER" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')" 2>/dev/null || true)

if [ -z "$TOKEN" ]; then
  LOGIN=$(curl -s -X POST "$API/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"phase6user@test.com","password":"test1234"}')
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
fi

if [ -z "$TOKEN" ]; then
  echo "AUTH FAILED: $REGISTER $LOGIN"
  exit 1
fi

echo "TOKEN OK (${#TOKEN} chars)"

echo "=== Health ==="
curl -s "$API/api/health"
echo ""

echo "=== Register Push Token ==="
curl -s -X POST "$API/api/notifications/register-token" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"expoPushToken":"ExponentPushToken[test-phase6]","platform":"android"}'
echo ""

echo "=== Notification Settings ==="
curl -s "$API/api/notifications/settings" -H "Authorization: Bearer $TOKEN"
echo ""

echo "=== Ontology Domains ==="
curl -s "$API/api/ontology/domains" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin); print('domains:', len(d.get('domains',[])))"
echo ""

echo "=== Stripe Webhook Mock ==="
curl -s -X POST "$API/api/stripe/webhook" \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded","data":{"object":{"metadata":{"userId":"1","tier":"Pro"}}}}'
echo ""

echo "ALL TESTS DONE"

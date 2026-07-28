#!/bin/bash
set -e
API="${API_URL:-http://localhost:5000}"

REGISTER=$(curl -s -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"gemma4test@test.com","password":"test1234","name":"Gemma4 Test"}')

TOKEN=$(echo "$REGISTER" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')" 2>/dev/null || true)

if [ -z "$TOKEN" ]; then
  LOGIN=$(curl -s -X POST "$API/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"gemma4test@test.com","password":"test1234"}')
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
fi

if [ -z "$TOKEN" ]; then
  echo "AUTH FAILED"
  exit 1
fi

echo "TOKEN OK"

echo "=== Audio Status ==="
curl -s "$API/api/audio/status" -H "Authorization: Bearer $TOKEN"
echo ""

echo "=== Audio Analyze (mock/minimal) ==="
curl -s -X POST "$API/api/audio/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"audioBase64":"dGVzdA==","word":"equipment","correctPronunciation":"ih-KWIP-muhnt","userLevel":"beginner"}'
echo ""

echo "=== Audio Transcribe ==="
curl -s -X POST "$API/api/audio/transcribe" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"audioBase64":"dGVzdA=="}'
echo ""

echo "ALL GEMMA4 AUDIO TESTS DONE"

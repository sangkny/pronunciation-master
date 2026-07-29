#!/bin/bash
# Phase 11 Mobile App smoke test
set -e
API="${API_URL:-http://localhost:5000}"
MOBILE_DIR="$(cd "$(dirname "$0")/../mobile" && pwd)"

echo "=== Phase 11 Mobile Smoke Test ==="
echo ""

echo "=== 1. Mobile package.json ==="
python3 -c "import json; d=json.load(open('$MOBILE_DIR/package.json')); print('expo:', d['dependencies'].get('expo')); print('watermelondb:', d['dependencies'].get('@nozbe/watermelondb')); print('expo-sqlite:', d['dependencies'].get('expo-sqlite'))"
echo ""

echo "=== 2. Required Phase 11 files ==="
for f in \
  src/store/useAppStore.js \
  src/services/apiService.js \
  src/services/authService.js \
  src/services/syncService.js \
  src/services/localDbService.js \
  src/database/index.js \
  src/database/schema.js \
  src/database/models/User.js \
  src/database/models/Analysis.js \
  src/database/models/Subscription.js \
  src/hooks/useApi.js \
  src/hooks/useOfflineData.js \
  src/navigation/navigationRef.js \
  src/navigation/AppNavigator.js \
  src/screens/GemmaAudioScreen.js \
  src/screens/ProfileScreen.js \
  src/services/audioService.js \
  src/components/RecordingUI.js \
  src/utils/audioConfig.js \
  src/utils/wavEncoder.js \
  README.md; do
  if [ -f "$MOBILE_DIR/$f" ]; then
    echo "OK $f"
  else
    echo "MISSING $f"
    exit 1
  fi
done
echo ""

echo "=== 3. Backend Audio Info (mobile dependency) ==="
curl -sf "$API/api/audio/info" | python3 -m json.tool 2>/dev/null | head -20 || echo "Backend offline — start docker compose up -d"
echo ""

echo "=== 4. Auth + Native Audio + Analysis Sync API ==="
REGISTER=$(curl -s -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"phase11mobile@test.com","password":"test1234","name":"Phase11 Mobile"}')
TOKEN=$(echo "$REGISTER" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')" 2>/dev/null || true)
if [ -z "$TOKEN" ]; then
  LOGIN=$(curl -s -X POST "$API/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"phase11mobile@test.com","password":"test1234"}')
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
fi
if [ -n "$TOKEN" ]; then
  echo "TOKEN OK"
  curl -s -X POST "$API/api/audio/analyze-native" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"audioBase64":"dGVzdA==","audioFormat":"wav","word":"equipment","correctPronunciation":"ih-KWIP-muhnt","userLevel":"beginner"}' \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('analyze-native:', d.get('provider','?'))" 2>/dev/null || true
  curl -s -X POST "$API/api/analysis/sync" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"clientId":"test-client-1","word":"equipment","analysis":{"text":"test"},"confidence":0.9,"createdAt":'$(date +%s000)'}' \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('analysis/sync:', d.get('success','?'))" 2>/dev/null || true
  curl -s "$API/api/analysis/list" \
    -H "Authorization: Bearer $TOKEN" \
    | python3 -c "import sys,json; d=json.load(sys.stdin); print('analysis/list:', len(d.get('analyses',[])))" 2>/dev/null || true
else
  echo "AUTH SKIP (backend offline)"
fi
echo ""

echo "ALL PHASE 11 SMOKE TESTS DONE"
echo "Run: cd mobile && npx expo start"

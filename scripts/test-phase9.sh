#!/bin/bash
set -e
API="${API_URL:-http://localhost:5000}"

echo "=== SSO Login (Enterprise) ==="
SSO_RESULT=$(curl -s -X POST "$API/api/sso/login" \
  -H "Content-Type: application/json" \
  -d '{"provider":"enterprise-mock","email":"phase9admin@corp.com","name":"Phase9 Admin","ssoToken":"enterprise-sso-mock","externalId":"p9-admin"}')

TOKEN=$(echo "$SSO_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
if [ -z "$TOKEN" ]; then echo "SSO FAILED: $SSO_RESULT"; exit 1; fi
echo "TOKEN OK (${#TOKEN} chars)"

echo "=== Create Team ==="
TEAM_RESULT=$(curl -s -X POST "$API/api/teams" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Engineering Team"}')
TEAM_ID=$(echo "$TEAM_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('team',{}).get('id',''))")
echo "Team ID: $TEAM_ID"

echo "=== List Teams ==="
curl -s "$API/api/teams" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin); print('teams:', len(d.get('teams',[])))"

echo "=== Create API Key ==="
KEY_RESULT=$(curl -s -X POST "$API/api/api-keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Phase9 Test Key"}')
API_KEY=$(echo "$KEY_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('key') or '')")
if [ -z "$API_KEY" ]; then echo "API KEY FAILED: $KEY_RESULT"; exit 1; fi
echo "API KEY OK (${#API_KEY} chars)"

echo "=== API Key Auth Test ==="
curl -s "$API/api/ontology/domains" -H "X-API-Key: $API_KEY" | python3 -c "import sys,json; d=json.load(sys.stdin); print('domains:', len(d.get('domains',[])))"

echo "=== Monitoring Status ==="
curl -s "$API/api/monitoring/status"
echo ""

echo "ALL PHASE 9 TESTS DONE"

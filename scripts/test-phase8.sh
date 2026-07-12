#!/bin/bash
set -e
API="${API_URL:-http://localhost:5000}"

echo "=== SSO Status ==="
curl -s "$API/api/sso/status"
echo ""

echo "=== SSO Login (mock) ==="
SSO_RESULT=$(curl -s -X POST "$API/api/sso/login" \
  -H "Content-Type: application/json" \
  -d '{"provider":"enterprise-mock","email":"enterprise@corp.com","name":"Enterprise User","ssoToken":"enterprise-sso-mock","externalId":"ent-001"}')

TOKEN=$(echo "$SSO_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
TIER=$(echo "$SSO_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('tier',''))")

if [ -z "$TOKEN" ]; then
  echo "SSO LOGIN FAILED: $SSO_RESULT"
  exit 1
fi

echo "SSO OK — tier: $TIER (${#TOKEN} chars)"
echo ""

echo "=== Custom Ontology Create ==="
curl -s -X POST "$API/api/custom-ontology" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"domainId":"medical","name":"Hospital Custom Terms","concepts":[{"id":"custom-vent","name":"Ventilator Protocol","difficulty":"advanced"}]}'
echo ""

echo "=== Custom Ontology List ==="
curl -s "$API/api/custom-ontology" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin); print('ontologies:', len(d.get('ontologies',[])))"
echo ""

echo "=== Custom Ontology Merge ==="
curl -s "$API/api/custom-ontology/medical/merge" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; d=json.load(sys.stdin); print('totalConcepts:', d.get('totalConcepts',0))"
echo ""

echo "=== Monitoring Status ==="
curl -s "$API/api/monitoring/status"
echo ""

echo "=== Monitoring Report ==="
curl -s -X POST "$API/api/monitoring/report" \
  -H "Content-Type: application/json" \
  -d '{"message":"test client error","url":"/test"}'
echo ""

echo "=== Health ==="
curl -s "$API/api/health"
echo ""

echo "ALL PHASE 8 TESTS DONE"

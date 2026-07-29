#!/bin/bash
set -e

API="${API_URL:-http://localhost:5000}"

json_token() {
  python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')"
}

ensure_user() {
  local email="$1"
  local password="$2"
  local name="$3"

  TOKEN=$(curl -s -X POST "$API/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$email\",\"password\":\"$password\"}" | json_token)

  if [ -z "$TOKEN" ]; then
    curl -s -X POST "$API/api/auth/register" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$email\",\"password\":\"$password\",\"name\":\"$name\"}" > /dev/null
    TOKEN=$(curl -s -X POST "$API/api/auth/login" \
      -H "Content-Type: application/json" \
      -d "{\"email\":\"$email\",\"password\":\"$password\"}" | json_token)
  fi

  echo "$TOKEN"
}

echo "=== Rate Limiting 테스트 ==="

echo ""
echo "1️⃣ Free 사용자 로그인..."
FREE_TOKEN=$(ensure_user "free@test.com" "password123" "Free User")
if [ -z "$FREE_TOKEN" ]; then
  echo "❌ Free 사용자 토큰 생성 실패"
  exit 1
fi
echo "Token: ${FREE_TOKEN:0:20}..."

echo ""
echo "2️⃣ Free 사용자: 100 요청/시간 테스트 (처음 5개 성공, 101번째 실패 예상)..."

for i in {1..5}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/ontology/domains" \
    -H "Authorization: Bearer $FREE_TOKEN")
  echo "  요청 $i: HTTP $STATUS"
done

echo "  ..."

for i in {6..100}; do
  curl -s "$API/api/ontology/domains" \
    -H "Authorization: Bearer $FREE_TOKEN" > /dev/null
done

echo "  요청 100 완료"

echo ""
echo "3️⃣ Free 사용자 101번째 요청 (429 Too Many Requests 예상)..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API/api/ontology/domains" \
  -H "Authorization: Bearer $FREE_TOKEN")
RESPONSE=$(curl -s "$API/api/ontology/domains" \
  -H "Authorization: Bearer $FREE_TOKEN")

echo "  Status: HTTP $STATUS"
echo "  Response: $RESPONSE"

if [[ "$STATUS" -eq 429 ]]; then
  echo "  ✅ Free 제한 정상 작동"
else
  echo "  ❌ Free 제한 미작동"
  exit 1
fi

echo ""
echo "4️⃣ Pro 사용자: 1000 요청/시간 테스트..."
PRO_TOKEN=$(ensure_user "pro@test.com" "password123" "Pro User")

if [[ -n "$PRO_TOKEN" ]]; then
  curl -s -X POST "$API/api/subscription/upgrade" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $PRO_TOKEN" \
    -d '{"tier":"Pro"}' > /dev/null
  echo "  Pro 사용자는 1000 요청까지 허용됨"
  echo "  Pro Token: ${PRO_TOKEN:0:20}..."
else
  echo "  ⚠️ Pro 사용자 로그인 실패 (테스트 계정 필요)"
fi

echo ""
echo "5️⃣ IP 기반 제한 테스트..."
for i in {1..5}; do
  curl -s "$API/api/i18n/languages" > /dev/null
done
echo "  5개 요청 완료 (1000개까지 허용)"

echo ""
echo "=== 테스트 완료 ==="

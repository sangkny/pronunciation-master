#!/bin/bash
# Gemma 4 Native Audio E2E Test — Phase 10 Part 1-D Complete
set -e

API="${API_URL:-http://localhost:5000}"
VLLM_URL="${VLLM_API_URL:-http://localhost:8000/v1}"

echo "=== Gemma 4 Native Audio E2E Test ==="
echo "API: $API"
echo "vLLM: $VLLM_URL"
echo ""

# Minimal valid WAV (16-bit mono, 16kHz, ~0.1s silence)
# Generated: 44-byte header + 3200 samples of silence
python3 << 'PYEOF' > /tmp/test-native.wav.b64
import base64, struct
sample_rate = 16000
duration = 0.2
n_samples = int(sample_rate * duration)
data = b''.join(struct.pack('<h', 0) for _ in range(n_samples))
header = struct.pack(
    '<4sI4s4sIHHIIHH4sI',
    b'RIFF', 36 + len(data), b'WAVE', b'fmt ', 16,
    1, 1, sample_rate, sample_rate * 2, 2, 16, b'data', len(data)
)
print(base64.b64encode(header + data).decode())
PYEOF

WAV_B64=$(cat /tmp/test-native.wav.b64)

echo "=== 1. vLLM Status (direct) ==="
curl -sf "$VLLM_URL/models" > /dev/null 2>&1 && echo "vLLM: AVAILABLE" || echo "vLLM: UNAVAILABLE (Whisper/mock fallback expected)"
echo ""

echo "=== 2. Backend Audio Info (public) ==="
INFO=$(curl -sf "$API/api/audio/info")
echo "$INFO" | python3 -m json.tool 2>/dev/null || echo "$INFO"
echo ""

VLLM_OK=$(echo "$INFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print('yes' if d.get('vllm',{}).get('available') else 'no')" 2>/dev/null || echo "no")
WHISPER_OK=$(echo "$INFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print('yes' if d.get('whisper',{}).get('configured') else 'no')" 2>/dev/null || echo "no")
echo "vLLM via backend: $VLLM_OK | Whisper: $WHISPER_OK"
echo ""

echo "=== 3. Auth Token ==="
REGISTER=$(curl -s -X POST "$API/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"native-audio-test@test.com","password":"test1234","name":"Native Audio Test"}')

TOKEN=$(echo "$REGISTER" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')" 2>/dev/null || true)

if [ -z "$TOKEN" ]; then
  LOGIN=$(curl -s -X POST "$API/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"native-audio-test@test.com","password":"test1234"}')
  TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('token') or '')")
fi

if [ -z "$TOKEN" ]; then
  echo "AUTH FAILED"
  exit 1
fi
echo "TOKEN OK"
echo ""

echo "=== 4. Backend Native Audio Analyze ==="
START=$(date +%s%3N 2>/dev/null || python3 -c "import time; print(int(time.time()*1000))")
NATIVE=$(curl -s -X POST "$API/api/audio/analyze-native" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"audioBase64\":\"$WAV_B64\",\"audioFormat\":\"wav\",\"word\":\"equipment\",\"correctPronunciation\":\"ih-KWIP-muhnt\",\"userLevel\":\"beginner\"}")
END=$(date +%s%3N 2>/dev/null || python3 -c "import time; print(int(time.time()*1000))")
echo "$NATIVE" | python3 -m json.tool 2>/dev/null || echo "$NATIVE"

PROVIDER=$(echo "$NATIVE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('provider','unknown'))" 2>/dev/null || echo "unknown")
LATENCY=$(echo "$NATIVE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('latencyMs',0))" 2>/dev/null || echo "0")
BACKEND_MS=$((END - START))
echo "Provider: $PROVIDER | Server latency: ${LATENCY}ms | Round-trip: ${BACKEND_MS}ms"
echo ""

echo "=== 5. Legacy Analyze (comparison) ==="
curl -s -X POST "$API/api/audio/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"audioBase64\":\"$WAV_B64\",\"word\":\"equipment\",\"correctPronunciation\":\"ih-KWIP-muhnt\",\"userLevel\":\"beginner\"}" \
  | python3 -m json.tool 2>/dev/null || true
echo ""

echo "=== 6. Fallback Test (vLLM unavailable → Whisper/mock) ==="
if [ "$VLLM_OK" = "yes" ]; then
  echo "vLLM is running — fallback path uses Whisper when vLLM fails at runtime."
  echo "To test full fallback: stop vLLM and re-run this script."
else
  FALLBACK=$(curl -s -X POST "$API/api/audio/analyze-native" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"audioBase64\":\"$WAV_B64\",\"audioFormat\":\"wav\",\"word\":\"equipment\",\"correctPronunciation\":\"ih-KWIP-muhnt\",\"userLevel\":\"beginner\"}")
  FB=$(echo "$FALLBACK" | python3 -c "import sys,json; d=json.load(sys.stdin); print('PASS' if d.get('fallback') or 'whisper' in d.get('provider','') else 'CHECK')" 2>/dev/null || echo "CHECK")
  echo "Fallback result: $FB (provider=$PROVIDER)"
fi
echo ""

echo "=== 7. WebGPU Conformer (browser — manual) ==="
echo "Open frontend at http://localhost:5173, record pronunciation."
echo "Expected: WebGPU Native Audio (Conformer ASR) ~2-3s latency."
echo ""

echo "=== 8. Performance Summary ==="
echo "| Path              | Status        | Latency       |"
echo "|-------------------|---------------|---------------|"
echo "| Backend Native    | $PROVIDER | ${LATENCY}ms (server) |"
echo "| Backend Round-trip| $PROVIDER | ${BACKEND_MS}ms (total)  |"
echo "| WebGPU Conformer  | manual test   | ~2000-3000ms  |"
echo "| vLLM direct       | $VLLM_OK           | n/a           |"
echo ""

echo "ALL NATIVE AUDIO TESTS DONE"

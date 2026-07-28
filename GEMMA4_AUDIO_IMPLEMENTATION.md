# Gemma 4 오디오 + WebGPU 브라우저 추론

**Phase:** 10 Part 1-D  
**모델:** `google/gemma-4-e4b` (128K, 오디오·이미지 멀티모달)  
**상태:** 구현 완료

---

## 핵심 전략

| 계층 | 역할 | 프라이버시 |
|------|------|-----------|
| **WebGPU (1순위)** | Transformers.js + 스펙트로그램 → 브라우저 로컬 분석 | ✅ 음성이 서버로 전송되지 않음 |
| **Backend Gemma 4 (2순위)** | LMStudio `/chat/completions` 멀티모달 | ⚠️ base64 업로드 (폴백만) |
| **STT API (3순위)** | 기존 `/api/stt/transcribe` (Whisper/mock) | 선택적 |

---

## 아키텍처

```
[마이크] → MediaRecorder → audioBlob
              │
              ├─► WebGPU: spectrogram → Transformers.js (로컬)
              │         └─ 실패 시 ↓
              └─► Backend: POST /api/audio/analyze → LMStudio Gemma 4
                            └─ 실패 시 ↓
                        POST /api/stt/transcribe (기존)
```

---

## API 엔드포인트

### `POST /api/audio/analyze` (JWT)
```json
{
  "audioBase64": "...",
  "ipaChartUrl": "https://...",
  "word": "equipment",
  "correctPronunciation": "ih-KWIP-muhnt",
  "userLevel": "beginner"
}
```

### `POST /api/audio/transcribe` (JWT)
```json
{ "audioBase64": "..." }
```

---

## 환경 변수

```env
GEMMA4_MODEL=google/gemma-4-e4b
LMSTUDIO_API_URL=http://host.docker.internal:1234/v1
AUDIO_SAMPLE_RATE=16000
AUDIO_MAX_DURATION=30000
WEBGPU_ENABLED=true
VITE_WEBGPU_ENABLED=true
```

---

## 프론트엔드

- `frontend/src/services/audioService.js` — 녹음·WebGPU·백엔드 폴백
- `frontend/src/components/PronunciationMissionWithGemma.jsx` — Gemma 4 UI
- `@huggingface/transformers` — 브라우저 추론

---

## Docker

- **LMStudio:** 호스트에서 실행 (권장) — `host.docker.internal:1234`
- **Optional:** `docker compose --profile lmstudio up` (로컬 LLM 컨테이ner placeholder)

---

## 테스트

```bash
docker compose up -d --build
# Frontend: http://localhost:5173 → 미션 → Gemma 4 분석
bash scripts/test-gemma4-audio.sh
```

---

Generated: 2026-07-28 | Phase 10 Part 1-D

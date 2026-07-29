# Gemma 4 Native Audio — End-to-End Implementation

**Phase:** 10 Part 1-D (Complete)  
**Model:** `google/gemma-4-e4b` (128-bin mel @ 16 kHz native audio encoder)  
**Status:** Native `input_audio` path + WebGPU Conformer + Whisper fallback

---

## Current vs Complete Integration

| Aspect | Skeleton (97d7c81) | Complete (Part 1-D) |
|--------|-------------------|---------------------|
| Backend audio | Text metadata only (`[Audio data provided: XKB]`) | vLLM `input_audio` (base64 WAV) |
| LMStudio | No `input_audio` support | Bypassed when `AUDIO_PROVIDER=vllm` |
| Frontend | Spectrogram PNG → image-to-text | Mel-spec + Conformer ASR (WebGPU) |
| Fallback | Text-only LMStudio | Whisper STT → analysis |
| Health | `/api/audio/status` only | `/api/audio/info` (vLLM + Whisper + mel spec) |

---

## Architecture

```
[Microphone] → MediaRecorder → audio/webm
                    │
                    ├─► WebGPU (1st): blob → WAV 16kHz → Conformer/ASR pipeline (local, ~2-3s)
                    │         └─ fail ↓
                    ├─► Backend Native (2nd): POST /api/audio/analyze-native
                    │         └─ vLLM input_audio + optional IPA image
                    │         └─ fail ↓
                    ├─► Backend Legacy (3rd): POST /api/audio/analyze (LMStudio text+image)
                    │         └─ fail ↓
                    └─► Whisper STT (4th): transcript → heuristic analysis
```

---

## Provider Comparison

| Provider | `input_audio` | GPU | Best For |
|----------|---------------|-----|----------|
| **vLLM** | ✅ Yes | Required | Production native audio |
| **LMStudio** | ❌ No | Optional | Text + IPA image only |
| **HuggingFace TGI** | ⚠️ Limited | Required | Alternative if vLLM unavailable |
| **WebGPU (Transformers.js)** | ✅ Local mel/ASR | Browser GPU | Privacy-first, 2-3s latency |

**Recommendation:** `AUDIO_PROVIDER=vllm` in Docker; LMStudio for text-only dev.

---

## Mel-Spectrogram Standard (Gemma 4)

| Parameter | Value |
|-----------|-------|
| Sample rate | 16,000 Hz |
| Mel bins | 128 |
| FFT size | 400 |
| Hop length | 160 (10 ms) |
| Window | Hann |
| Format | float32 `[time, 128]` or WAV PCM16 mono for `input_audio` |

Backend `convertToMelSpectrogram()` computes 128-bin mel frames for logging/metadata.  
Frontend converts webm → WAV 16 kHz mono before native inference.

---

## vLLM Message Format

```json
{
  "model": "google/gemma-4-e4b",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Analyze pronunciation for word: equipment..." },
        {
          "type": "input_audio",
          "input_audio": { "data": "<base64 WAV>", "format": "wav" }
        },
        { "type": "image_url", "image_url": { "url": "https://..." } }
      ]
    }
  ]
}
```

---

## WebGPU Conformer (Transformers.js)

- **Target:** `@huggingface/transformers` v4.1+ with official Gemma 4 Conformer ONNX
- **Current:** `Xenova/whisper-tiny.en` ASR on WebGPU as Conformer-path proxy
- **Latency:** ~2-3 s on mid-range GPU
- **Privacy:** Audio never leaves device when WebGPU path succeeds

---

## API Endpoints

### `GET /api/audio/info` (public)

Returns vLLM availability, Whisper config, mel-spec params, legacy LMStudio status.

### `POST /api/audio/analyze-native` (JWT)

```json
{
  "audioBase64": "<base64 WAV preferred>",
  "audioFormat": "wav",
  "ipaChartUrl": "https://...",
  "word": "equipment",
  "correctPronunciation": "ih-KWIP-muhnt",
  "userLevel": "beginner"
}
```

Response includes `provider`, `melFrames`, `nativeAudio: true`, and analysis text.

---

## Environment Variables

```env
ENABLE_AUDIO=true
AUDIO_PROVIDER=vllm
VLLM_API_URL=http://vllm:8000/v1
VLLM_MODEL=google/gemma-4-e4b
GEMMA4_MODEL=google/gemma-4-e4b
AUDIO_SAMPLE_RATE=16000
AUDIO_MAX_DURATION=30000
OPENAI_API_KEY=          # Whisper fallback
VITE_WEBGPU_ENABLED=true
```

---

## Docker

```bash
# Default stack (no vLLM — Whisper/mock fallback)
docker compose up -d

# With vLLM native audio (requires NVIDIA GPU)
docker compose --profile vllm up -d
```

---

## Test Strategy

Run `scripts/test-gemma4-native-audio.sh`:

1. **vLLM status** — `GET /api/audio/info`
2. **Native analyze** — `POST /api/audio/analyze-native`
3. **WebGPU** — browser Conformer path (manual or headless note)
4. **Fallback** — stop vLLM, verify Whisper/mock path
5. **Performance** — compare local vs backend latency fields

---

## Files

| File | Role |
|------|------|
| `backend/src/services/gemma4NativeAudioService.js` | vLLM input_audio, mel-spec, Whisper fallback |
| `backend/src/routes/audio-analysis.js` | `/info`, `/analyze-native` |
| `frontend/src/services/audioService.js` | WebGPU Conformer, native backend |
| `frontend/src/components/PronunciationMissionWithGemma.jsx` | Status badges, native flow |
| `docker-compose.yml` | vLLM profile |
| `scripts/test-gemma4-native-audio.sh` | E2E test script |

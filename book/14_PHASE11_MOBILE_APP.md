# Chapter 14: Phase 11 — 모바일 앱 (Expo)

## 목적 (Why)

Phase 10 프로덕션 SaaS 완료 후, **B2C 사용자 접근성**을 위해 iOS/Android 네이티브 앱을 출시합니다.

## Phase 11-1 (How) — 시작

### 구현
- React Navigation Native Stack
- `GemmaAudioScreen` — Backend `/api/audio/analyze-native`
- `ProfileScreen` — 구독 티어 + vLLM/Whisper 상태
- 공통 테마 (`theme.js`)

### 아키텍처

```
[Expo App]
  Login → Home → Mission (STT) / GemmaAudio (Native) / Profile
                      ↓
              Backend :5000 (JWT)
                      ↓
              /api/audio/analyze-native (vLLM → Whisper)
```

## 결과 (What)

| Part | 내용 | 상태 |
|------|------|------|
| 11-1 | Expo + Navigation + Native Audio | ✅ |
| 11-2 | 녹음 UX + WAV 16kHz | ✅ |
| 11-3 | 상태관리 | 🔲 |
| 11-4 | 오프라인 | 🔲 |
| 11-5 | FCM | 🔲 |
| 11-6 | 스토어 배포 | 🔲 |

상세: `PHASE11_ROADMAP.md`, `mobile/README.md`

---

*Phase 11 완료 시 Ch12·Handover·Strategy 동기화*

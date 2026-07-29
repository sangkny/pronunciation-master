# Pronunciation Master — Mobile (Expo)

**Phase:** 11 Part 11-3  
**Stack:** React Native 0.74 + Expo SDK 51 + Zustand + Axios

## Features

- **Zustand** global state (`useAppStore`) — user, token, tier, analysis history
- **Axios interceptors** — Bearer token auto-attach, 401/429/500/network errors
- Domain selection → STT Mission (expo-av + `/api/stt/transcribe`)
- **Gemma 4 Native Audio** — 녹음 UX (타이머, 재생, WAV 16kHz) → `/api/audio/analyze-native`
- Profile — subscription tier + server audio status
- Push notifications (expo-notifications, Phase 6)

## Quick Start

```bash
# Backend must be running
cd ../
docker compose up -d

cd mobile
npm install
cp .env.example .env
# Edit EXPO_PUBLIC_API_URL for your device/emulator

npx expo start
# Press a (Android) or i (iOS) or scan QR with Expo Go
```

## API URL by Environment

| Environment | EXPO_PUBLIC_API_URL |
|-------------|---------------------|
| iOS Simulator | `http://localhost:5000` |
| Android Emulator | `http://10.0.2.2:5000` |
| Physical device | `http://<LAN-IP>:5000` |

## Project Structure

```
mobile/
├── App.js                      # Auth bootstrap
├── src/
│   ├── navigation/AppNavigator.js
│   ├── screens/
│   │   LoginScreen.js
│   │   HomeScreen.js
│   │   MissionScreen.js        # STT + Scoring + AOMD
│   │   GemmaAudioScreen.js     # Native audio + RecordingUI
│   │   ProfileScreen.js
│   ├── components/
│   │   RecordingUI.js          # 타이머, 녹음/재생/분석 버튼
│   ├── utils/
│   │   audioConfig.js          # SAMPLE_RATE, MAX_RECORDING_SEC
│   │   wavEncoder.js           # WAV 헤더 검증
│   ├── store/
│   │   useAppStore.js          # Zustand global state
│   ├── hooks/
│   │   useApi.js               # API request hook
│   ├── services/
│   │   apiService.js           # Axios + interceptors
│   │   authService.js          # login/register/logout
│   │   api.js                  # Legacy API wrappers (uses axios)
│   │   audioService.js         # 16kHz 녹음
│   │   sttService.js
│   │   notificationService.js
│   └── constants/theme.js
└── app.json
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | `http://localhost:5000` | Backend API |
| `EXPO_PUBLIC_AUDIO_SAMPLE_RATE` | `16000` | Recording sample rate (Hz) |
| `EXPO_PUBLIC_AUDIO_MAX_DURATION` | `10000` | Max duration (ms) |
| `EXPO_PUBLIC_AUDIO_FORMAT` | `WAV` | Output format |
| `EXPO_PUBLIC_AUDIO_QUALITY` | `HIGH` | iOS recording quality |

## Emulator Test (GemmaAudioScreen)

```bash
npx expo start
# a = Android emulator | i = iOS simulator
```

1. Login → Home → **Native Audio Analysis**
2. **녹음 시작** → 타이머 `00:00 / 00:10` 증가 확인
3. **녹음 중지** → `⏸️ Stopped` + 검수 카드 표시
4. **▶️ 재생** → 녹음 검수
5. **✅ 분석** → `POST /api/audio/analyze-native` (base64 WAV)
6. **AOMD 피드백** 결과 카드 표시

## Test

```bash
bash ../scripts/test-phase11.sh
```

## Phase 11 Roadmap

| Part | Status |
|------|--------|
| 11-1 | ✅ Expo + Navigation + Native Audio screen |
| 11-2 | ✅ Recording UX + WAV 16kHz |
| 11-3 | ✅ Zustand + Axios interceptors |
| 11-4 | 🔲 WatermelonDB offline |
| 11-5 | 🔲 FCM push |
| 11-6 | 🔲 App Store / Play Store |

See `PHASE11_ROADMAP.md` and `PHASE11_CODE_LOOP_PROMPTS.md`.

# Pronunciation Master — Mobile (Expo)

**Phase:** 11 Part 11-2  
**Stack:** React Native 0.74 + Expo SDK 51 + expo-av (16kHz WAV)

## Features

- JWT Login / Register
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
│   ├── services/
│   │   api.js
│   │   audioService.js         # 16kHz 녹음 + analyze-native
│   │   recordingService.js
│   │   sttService.js
│   │   notificationService.js
│   └── constants/theme.js
└── app.json
```

## Test

```bash
bash ../scripts/test-phase11.sh
```

## Phase 11 Roadmap

| Part | Status |
|------|--------|
| 11-1 | ✅ Expo + Navigation + Native Audio screen |
| 11-2 | ✅ Recording UX + WAV 16kHz |
| 11-3 | 🔲 Zustand/Redux state |
| 11-4 | 🔲 WatermelonDB offline |
| 11-5 | 🔲 FCM push |
| 11-6 | 🔲 App Store / Play Store |

See `PHASE11_ROADMAP.md` and `PHASE11_CODE_LOOP_PROMPTS.md`.

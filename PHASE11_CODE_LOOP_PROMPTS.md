# Phase 11 Code Loop 프롬프트

**상태:** Phase 11 Part 11-4 완료 ✅ | Part 11-5 다음  
**목표:** React Native + Expo 모바일 앱 iOS/Android 출시  
**로드맵:** `PHASE11_ROADMAP.md`  
**장기 전략:** `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md`

---

## Part 11-1: Expo 프로젝트 + 기본 UI ✅

```
완료 (ed89ca5):
- React Navigation Native Stack
- GemmaAudioScreen — /api/audio/analyze-native
- ProfileScreen — subscription + audio info
- mobile/README.md, scripts/test-phase11.sh
- Book Ch14, CURSOR_HANDOVER §1 진행 현황
```

---

## Part 11-2: 음성 녹음 UX + WAV 16kHz ✅

```
완료:
- RecordingUI.js — 타이머 00:00/10:00, 녹음/중지/재생/취소/분석
- audioService.js — initializeRecorder, start/stop, play, analyzeNativeAudio
- expo-av 16kHz mono WAV + base64 → /api/audio/analyze-native
- wavEncoder.js — RIFF 헤더 검증
- EXPO_PUBLIC_AUDIO_SAMPLE_RATE, EXPO_PUBLIC_MAX_RECORDING_SEC
```

---

## Part 11-3: API 연동 + 상태관리 ✅

```
완료:
- useAppStore.js (Zustand): user, token, tier, analysisHistory, isOnline
- apiService.js: Axios + Bearer interceptor + 401/429/500/network
- authService.js, useApi.js hook
- GemmaAudioScreen → useApi + addAnalysis
- LoginScreen / ProfileScreen Zustand 통합
- NetInfo → isOnline
```

---

## Part 11-4: 오프라인 캐시 ✅

```
완료:
- WatermelonDB + expo-sqlite (users, analyses, subscriptions)
- syncService.js — POST /api/analysis/sync, GET /api/analysis/list
- analyzeNativeWithOffline — 오프라인 로컬 저장 (synced: false)
- App.js DatabaseProvider + 온라인 복귀 자동 sync
- GemmaAudioScreen useOfflineAnalyses() 동기화 대기 표시
- ProfileScreen unsynced count + Sync now
- Backend mobile_analyses 테이블 + analysis routes
- 충돌 해결: created_at 기준 마지막 쓰기 우선 (LWW)

완료 기준:
✓ 오프라인 분석 → 로컬 DB (synced: false)
✓ 재연결 시 자동 동기화 → synced: true
✓ ProfileScreen 동기화 상태 표시
```

---

## Part 11-5: 푸시 알림 (FCM) 🔲

```
작업:
- Firebase Cloud Messaging 연동 (expo-notifications 확장)
- Backend /api/notifications/* 연동 검증
- 일일 리마인더 + streak 알림

완료 기준:
✓ FCM 토큰 등록 (iOS/Android)
✓ 푸시 수신 테스트
```

---

## Part 11-6: 스토어 배포 🔲

```
작업:
- EAS Build (eas.json)
- App Store Connect / Google Play Console
- 스크린샷 + 개인정보 처리방침
- CI: mobile lint + expo doctor

완료 기준:
✓ TestFlight / Internal Testing 빌드
✓ 스토어 제출 체크리스트
```

---

## Cursor Ctrl+K — Part 11-2 시작 프롬프트 (복사용)

```
프로젝트: Pronunciation Master - Phase 11 Part 11-2
현재: Part 11-1 완료 (Navigation + GemmaAudioScreen)

작업:
1. mobile/src/services/wavEncoder.js — blob → WAV 16kHz
2. MissionScreen/GemmaAudioScreen 녹음 UX (타이머, replay)
3. CURSOR_HANDOVER.md Phase 11 진행 현황 갱신
4. git commit & push
```

---

Generated: 2026-07-29 | Phase 11 Mobile App

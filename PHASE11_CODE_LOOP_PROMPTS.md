# Phase 11 Code Loop 프롬프트

**상태:** Phase 11 Part 11-1 시작 🚀  
**목표:** React Native + Expo 모바일 앱 iOS/Android 출시  
**로드맵:** `PHASE11_ROADMAP.md`  
**장기 전략:** `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md`

---

## Part 11-1: Expo 프로젝트 + 기본 UI 🚀

```
프로젝트: Pronunciation Master - Phase 11 Part 11-1
현재 상태:
- Phase 10 100% 완료 (Part 1-D Native Audio E2E — 4a4d7d1)
- mobile/ Phase 5–6 스캐폴드 존재 (Login, Home, Mission)

작업 목표: Expo 앱 Phase 11-1 고도화

구현:
1. React Navigation Native Stack (`AppNavigator.js`)
2. GemmaAudioScreen — POST /api/audio/analyze-native
3. ProfileScreen — subscription + /api/audio/info
4. theme.js 공통 스타일
5. mobile/README.md + .env.example
6. scripts/test-phase11.sh
7. CURSOR_HANDOVER.md Phase 11 진행 현황 갱신

완료 기준:
✓ Navigation (Login → Home → Mission/GemmaAudio/Profile)
✓ Native Audio 모바일 연동
✓ Profile 서버 상태 표시
✓ git commit & push
```

---

## Part 11-2: 음성 녹음 UX 확장 🔲

```
작업:
- expo-av 녹음 UI 개선 (파형/타이머/재생)
- WAV 16kHz 변환 (백엔드 native audio 호환)
- 녹음 권한 처리 (iOS/Android)
- MissionScreen + GemmaAudioScreen UX 통합

완료 기준:
✓ 10초 녹음 + 미리듣기
✓ analyze-native에 WAV 전송
✓ 에러/권한 안내 UI
```

---

## Part 11-3: API 연동 + 상태관리 🔲

```
작업:
- Zustand 또는 React Context 전역 상태
- axios interceptors (JWT refresh, 401 처리)
- 오프라인 감지 (NetInfo)
- API 재시도 큐 (기본)

파일:
- mobile/src/store/authStore.js
- mobile/src/services/httpClient.js

완료 기준:
✓ 토큰 만료 시 자동 로그아웃
✓ 네트워크 오류 Toast
```

---

## Part 11-4: 오프라인 캐시 🔲

```
작업:
- WatermelonDB 또는 AsyncStorage 미션 캐시
- Ontology 도메인/개념 로컬 저장
- 오프라인 녹음 → 온라인 시 동기화 큐

완료 기준:
✓ 비행기 모드에서 도메인 목록 표시
✓ 재연결 시 점수/AOMD 동기화
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

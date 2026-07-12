# MOBILE_APP.md — React Native (Expo) 모바일 앱

## 개요

`mobile/` 폴더에 Expo 기반 React Native 앱 스캐폴드가 있습니다.  
Web 백엔드 API(`http://localhost:5000`)를 공유합니다.

## 구조

```
mobile/
├── App.js              # 네비게이션 루트
├── app.json            # Expo 설정
├── package.json
└── src/
    ├── services/api.js # JWT API 클라이언트
    └── screens/
        ├── LoginScreen.js
        └── HomeScreen.js
```

## 실행 방법

```bash
cd mobile
npm install
npx expo start
```

- **Android**: `a` 키 또는 Expo Go 앱
- **iOS**: `i` 키 (Mac 필요)
- API URL: `.env` 또는 `src/services/api.js`의 `API_URL` 수정

## 환경변수

```
EXPO_PUBLIC_API_URL=http://YOUR_IP:5000
```

> 에뮬레이터/실기기에서는 `localhost` 대신 PC IP 주소 사용

## Phase 5 범위

- ✅ 로그인/홈 스캐폴드
- ✅ JWT 토큰 저장 (AsyncStorage)
- ⏳ 발음 녹음 (expo-av) — Phase 5+
- ⏳ 푸시 알림 (expo-notifications) — Phase 5+

---

Generated: 2026-07-12 | Phase 5 Part 3

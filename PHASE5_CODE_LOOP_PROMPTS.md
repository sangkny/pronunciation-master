# Phase 5 Code Loop 프롬프트

**상태:** Phase 4 완료 (4aebfcc) ✅  
**목표:** PWA 모바일 + i18n 확장 + Expo 앱 + Stripe Webhook

---

## Part 1: PWA (모바일 설치 가능 웹)

```
작업 목표: 홈 화면 추가 + 오프라인 기본 캐시

작업 내용:
1. MOBILE_PWA.md 작성
2. frontend/public/manifest.webmanifest
3. frontend/public/sw.js — ontology/API 캐시
4. frontend/src/services/pwaService.js — SW 등록
5. index.html manifest 링크

완료 기준:
✓ manifest.webmanifest 존재
✓ Service Worker 등록
✓ 오프라인 시 앱 셸 로드
```

---

## Part 2: i18n 확장 + 지역별 커리큘럼

```
작업 목표: 일본어/중국어 + 지역 커리큘럼 API

작업 내용:
1. REGIONAL_I18N.md 작성
2. backend/data/regional-curriculum.json
3. backend/src/routes/i18n.js — GET /api/i18n/locales, /curriculum/:locale
4. frontend translations.js — ja, zh 추가
5. useLanguage — 4개 언어 순환

완료 기준:
✓ 4개 언어 (ko/en/ja/zh) 전환
✓ GET /api/i18n/curriculum/ko-KR 200 OK
```

---

## Part 3: React Native Expo 모바일 앱

```
작업 목표: mobile/ Expo 스캐폴드 (Web API 공유)

작업 내용:
1. MOBILE_APP.md 작성
2. mobile/package.json, app.json, App.js
3. mobile/src/services/api.js
4. mobile/src/screens/LoginScreen.js, HomeScreen.js

완료 기준:
✓ mobile/ 폴더 구조 완성
✓ 로그인 + 홈 화면 스캐폴드
✓ API URL 환경변수 설정
```

---

## Part 4: Stripe Webhook

```
작업 목표: 실결제 webhook 엔드포인트

작업 내용:
1. STRIPE_WEBHOOK.md 작성
2. backend/src/routes/stripe.js — POST /api/stripe/webhook
3. server.js — raw body webhook (auth 제외)

완료 기준:
✓ POST /api/stripe/webhook 엔드포인트
✓ payment_intent.succeeded 처리
✓ CURSOR_HANDOVER.md 업데이트
✓ git commit & push
```

---

Generated: 2026-07-12 | Phase 5

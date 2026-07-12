# Phase 4 Code Loop 프롬프트

**상태:** Phase 3 완료 (cacba9d) ✅  
**목표:** STT 개선 + 분석 대시보드 + Leaderboard + i18n

---

## Part 1: STT (음성 인식) 개선

```
프로젝트: Pronunciation Master - Phase 4 Part 1: STT

작업 목표: Web Speech API로 실제 발음 텍스트 인식

작업 내용:
1. STT_SYSTEM.md 작성
2. frontend/src/services/sttService.js — recognizeSpeech()
3. PronunciationMission.jsx — 녹음 시 STT 병렬 실행, 인식 텍스트로 점수 계산

완료 기준:
✓ STT_SYSTEM.md 작성
✓ sttService.js 구현
✓ 녹음 후 인식 텍스트 표시
✓ 인식 텍스트로 scoring API 호출
```

---

## Part 2: 분석 & 리포팅 대시보드

```
프로젝트: Pronunciation Master - Phase 4 Part 2: Analytics

작업 목표: PostgreSQL 기반 개인 통계 대시보드

작업 내용:
1. ANALYTICS_SYSTEM.md 작성
2. backend/src/services/analyticsEngine.js
3. backend/src/routes/analytics.js
4. frontend/src/components/ProgressDashboard.jsx
5. POST /api/analytics/progress — 미션 완료 시 DB 저장

완료 기준:
✓ GET /api/analytics/dashboard 200 OK
✓ GET /api/analytics/weekly 200 OK
✓ GET /api/analytics/weakness 200 OK
✓ Frontend 대시보드 DB 데이터 표시
```

---

## Part 3: Leaderboard

```
프로젝트: Pronunciation Master - Phase 4 Part 3: Leaderboard

작업 목표: 사용자 간 점수 랭킹

작업 내용:
1. GET /api/analytics/leaderboard
2. frontend/src/components/Leaderboard.jsx

완료 기준:
✓ Leaderboard API 200 OK
✓ 대시보드에 랭킹 표시
```

---

## Part 4: 국제화 (i18n)

```
프로젝트: Pronunciation Master - Phase 4 Part 4: i18n

작업 목표: 한국어/영어 UI 전환

작업 내용:
1. frontend/src/i18n/translations.js
2. frontend/src/hooks/useLanguage.js
3. App.jsx 헤더 언어 토글 + 주요 UI 문자열 i18n

완료 기준:
✓ KO/EN 전환 작동
✓ CURSOR_HANDOVER.md Phase 4 업데이트
✓ git commit & push
```

---

Generated: 2026-07-12 | Phase 4

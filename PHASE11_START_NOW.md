# Phase 11 시작 — 모바일 앱 (Expo)

**날짜:** 2026-07-29  
**전제:** Phase 10 100% 완료 (`914aff8` handover, `4a4d7d1` native audio)

---

## Step 1: 환경 확인

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

# Backend 실행
docker compose up -d

# Mobile
cd mobile
npm install
cp .env.example .env
npx expo start
```

---

## Step 2: Part 11-1 완료 항목

| 항목 | 파일 |
|------|------|
| React Navigation | `mobile/src/navigation/AppNavigator.js` |
| Gemma Native Audio | `mobile/src/screens/GemmaAudioScreen.js` |
| Profile + 서버 상태 | `mobile/src/screens/ProfileScreen.js` |
| API 확장 | `mobile/src/services/api.js` |
| 문서 | `mobile/README.md`, `PHASE11_CODE_LOOP_PROMPTS.md` |

---

## Step 3: Cursor Ctrl+K → Part 11-2

`PHASE11_CODE_LOOP_PROMPTS.md` Part 11-2 프롬프트 복사

---

## 테스트

```bash
bash scripts/test-phase11.sh
```

---

Generated: 2026-07-29

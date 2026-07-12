# MOBILE_PWA.md — Progressive Web App

## 개요

모바일 브라우저에서 **홈 화면에 추가** 가능한 PWA로 Web 앱을 확장합니다.

| 항목 | 값 |
|------|-----|
| Manifest | `public/manifest.webmanifest` |
| Service Worker | `public/sw.js` |
| 등록 | `pwaService.js` → `main.jsx` |

## 오프라인 전략

- **App Shell**: `/`, `/index.html`, CSS/JS — Cache First
- **API**: Network First, 실패 시 캐시 폴백
- **Ontology**: `/api/ontology/domains` — 오프라인 캐시

## 설치 방법

1. Chrome/Edge 모바일 → `http://localhost:5173`
2. 메뉴 → "홈 화면에 추가"
3. 앱 아이콘으로 실행

---

Generated: 2026-07-12 | Phase 5 Part 1

# STT_SYSTEM.md — 음성 인식 시스템

## 개요

| 항목 | 값 |
|------|-----|
| API | Web Speech API (`SpeechRecognition`) |
| 언어 | `en-US` (발음 연습) |
| 폴백 | STT 실패 시 focus word 사용 |

## 플로우

```
녹음 시작 → MediaRecorder + SpeechRecognition 병렬
녹음 중지 → transcript 반환 (또는 폴백)
transcript → POST /api/scoring/calculate
transcript → POST /api/aomd/feedback
```

## 브라우저 지원

- Chrome/Edge: ✅
- Firefox: 제한적
- Safari: webkitSpeechRecognition

## sttService API

```javascript
isSupported() → boolean
recognizeSpeech({ lang, maxDurationMs }) → Promise<{ transcript, confidence }>
```

---

Generated: 2026-07-12 | Phase 4 Part 1

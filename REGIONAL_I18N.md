# REGIONAL_I18N.md — 지역별 국제화

## 지원 언어

| 코드 | 언어 | UI | 커리큘럼 |
|------|------|-----|----------|
| ko | 한국어 | ✅ | ko-KR |
| en | English | ✅ | en-US |
| ja | 日本語 | ✅ | ja-JP |
| zh | 中文 | ✅ | zh-CN |

## 지역별 커리큘럼

`backend/data/regional-curriculum.json` — 로케일별 추천 도메인, 발음 기준, UI 라벨

## API

```
GET /api/i18n/locales          → 지원 로케일 목록
GET /api/i18n/curriculum/:locale → 지역 커리큘럼 설정
```

---

Generated: 2026-07-12 | Phase 5 Part 2

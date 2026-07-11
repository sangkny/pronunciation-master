# AOMD_FEEDBACK_UI.md — Frontend 피드백 UI 설계

## 4가지 역할 색상

| 역할 | 색상 | Tailwind | 아이콘 | 위치 |
|------|------|----------|--------|------|
| Advocate | 초록 `#22c55e` | `advocate` | 🟢 ThumbsUp | 상좌 |
| Opposite | 빨강 `#ef4444` | `opposite` | 🔴 AlertCircle | 상우 |
| Meditator | 노랑 `#eab308` | `meditator` | 🟡 Scale | 하좌 |
| Decisioner | 파랑 `#3b82f6` | `decisioner` | 🔵 Target | 하우 |

---

## 레이아웃

### 데스크톱 (≥640px)

```
┌─────────────────┬─────────────────┐
│  🟢 Advocate    │  🔴 Opposite    │
├─────────────────┼─────────────────┤
│  🟡 Meditator   │  🔵 Decisioner  │
└─────────────────┴─────────────────┘
```

2×2 그리드, 각 카드에 역할명 + 피드백 텍스트 + 점수 배지

### 모바일 (<640px)

```
┌─────────────────┐
│  🟢 Advocate    │
├─────────────────┤
│  🔴 Opposite    │
├─────────────────┤
│  🟡 Meditator   │
├─────────────────┤
│  🔵 Decisioner  │
└─────────────────┘
```

세로 스택, 동일 색상 테마

---

## 티어별 조건부 렌더링

| 티어 | Advocate | Opposite | Meditator | Decisioner |
|------|----------|----------|-----------|------------|
| Free | ✅ 표시 | 🔒 회색 잠금 | 🔒 회색 잠금 | 🔒 회색 잠금 |
| Pro | ✅ | ✅ | ✅ | ✅ |
| Enterprise | ✅ | ✅ | ✅ | ✅ |

잠긴 카드: `opacity-40`, Lock 아이콘, "Pro 업그레이드 필요" 텍스트

---

## 애니메이션

1. 점수 표시 후 300ms 딜레이
2. Advocate 카드 fade-in (0ms)
3. Opposite 카드 fade-in (150ms) — Pro만
4. Meditator 카드 fade-in (300ms) — Pro만
5. Decisioner 카드 fade-in (450ms) — Pro만

CSS: `animate-fade-in` + `animation-delay` 인라인 스타일

---

## Props 인터페이스

```typescript
interface AOMDFeedbackPanelProps {
  advocate: string;
  opposite: string | null;
  meditator: string | null;
  decisioner: string | null;
  tier: 'Free' | 'Pro' | 'Enterprise';
  word: string;
  score: number;
  onUpgrade?: () => void;
}
```

---

Generated: 2026-07-12 | Phase 3 Part 4

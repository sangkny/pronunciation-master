# Phase 11–15 로드맵

**기준일:** 2026-07-29  
**전제:** Phase 10 Part 2–4 완료 (프로덕션 SaaS 인프라), Part 1-D Gemma 4 오디오 미완성

---

## Phase 11: 모바일 앱 (React Native + Expo)

**목표:** iOS/Android 네이티브 앱 출시

**구현:**
- Expo 프로젝트 고도화 (`mobile/` 기존 스캐폴드 확장)
- 발음 녹음 + AOMD 피드백 UI
- Backend API 연동 (JWT + 오프라인 큐)
- 오프라인 모드 (로컬 SQLite/WatermelonDB)
- 푸시 알림 (Firebase Cloud Messaging)
- App Store / Play Store 배포

**세부 파트:**
| Part | 내용 |
|------|------|
| 11-1 | Expo 프로젝트 + 기본 UI |
| 11-2 | 음성 녹음 (expo-av 확장) |
| 11-3 | API 연동 (axios + 상태관리) |
| 11-4 | 오프라인 캐시 |
| 11-5 | 푸시 알림 (FCM) |
| 11-6 | 스토어 배포 |

| 항목 | 값 |
|------|-----|
| 복잡도 | ⭐⭐⭐⭐ |
| 예상 시간 | 4–6주 |
| 우선순위 | ⭐⭐⭐⭐⭐ (B2C 접근성) |

---

## Phase 12: 고급 분석 (User Analytics + AI Insights)

**목표:** 개별 학습자 발음 진도 분석 및 AI 기반 추천

**구현:**
- 사용자 학습 데이터 집계 (기존 `analyticsEngine` 확장)
- 어려운 음소 Heatmap
- 학습 패턴 분석 (시간대·도메인별)
- AI 추천 미션 (약한 음소 집중)
- 주간/월간 리포트 자동 생성
- Admin 통계 대시보드

**세부 파트:** 12-1 로깅 → 12-2 집계 → 12-3 Grafana 커스텀 → 12-4 AI 추천 → 12-5 리포트 → 12-6 Admin UI

| 항목 | 값 |
|------|-----|
| 복잡도 | ⭐⭐⭐ |
| 예상 시간 | 3–4주 |
| 우선순위 | ⭐⭐⭐⭐ (B2B 가치) |

---

## Phase 13: 국제화 (i18n + 다국어)

**목표:** 글로벌 사용자 (ko/en/ja/zh/es 등)

**구현:**
- Frontend i18n 확장 (`react-i18next` — 기존 ko/en → ja/zh/es)
- Backend 다국어 Ontology API
- Gemma 4 다국어 프롬프트
- RTL 지원 (아랍어)
- CDN 언어별 캐싱

| 항목 | 값 |
|------|-----|
| 복잡도 | ⭐⭐⭐ |
| 예상 시간 | 2–3주 |
| 우선순위 | ⭐⭐⭐ |

---

## Phase 14: Advanced STT & TTS

**목표:** 고정확도 STT + 자연스러운 TTS

**구현:**
- Whisper Large 배포 (온프레미스 또는 API)
- Google Cloud TTS / ElevenLabs 연동
- 전문 용어 컨텍스트 STT
- Librosa 기반 피치·속도 분석
- 네이티브 vs 사용자 발음 비교 UI
- **Part 1-D 연계:** Gemma 4 native 오디오 완전 연동

| 항목 | 값 |
|------|-----|
| 복잡도 | ⭐⭐⭐⭐ |
| 예상 시간 | 3–4주 |
| 우선순위 | ⭐⭐⭐⭐ (핵심 경쟁력) |

---

## Phase 15: 엔터프라이즈 기능 확장

**목표:** 대규모 교육 기관·기업 고객

**구현:**
- 그룹/클래스 관리 UI 고도화 (기존 Teams 확장)
- 진도 추적 Admin 대시보드
- SCORM/xAPI LMS 연동
- SAML SSO (Azure AD, Okta)
- SLA 99.99% + Audit Log (HIPAA/GDPR)

| 항목 | 값 |
|------|-----|
| 복잡도 | ⭐⭐⭐⭐⭐ |
| 예상 시간 | 4–6주 |
| 우선순위 | ⭐⭐⭐⭐⭐ (B2B 필수) |

---

## 로드맵 우선순위

```
1️⃣ Phase 11 (모바일 앱) — 4–6주
   ↓ B2C 접근성

2️⃣ Phase 12 (고급 분석) — 3–4주
   ↓ B2B 가치

3️⃣ Phase 14 (Advanced STT/TTS) — 3–4주
   ↓ 핵심 경쟁력 (+ Part 1-D 완전 연동)

4️⃣ Phase 13 (국제화) — 2–3주
   ↓ 시장 확대

5️⃣ Phase 15 (엔터프라이즈) — 4–6주
   ↓ B2B SaaS 수익화
```

---

## 예상 총 소요 시간

| Phase | 시간 |
|-------|------|
| 11 | 4–6주 |
| 12 | 3–4주 |
| 13 | 2–3주 |
| 14 | 3–4주 |
| 15 | 4–6주 |
| **총합** | **16–23주** (약 4–6개월) |

---

## 기술 스택 (Phase 11–15)

| Phase | 주요 기술 |
|-------|-----------|
| 11 | React Native, Expo, WatermelonDB, FCM |
| 12 | Elasticsearch, Grafana, Celery, PDF |
| 13 | react-i18next, Crowdin, RTL CSS |
| 14 | Whisper Large, Cloud TTS, Librosa, Gemma 4 Audio |
| 15 | Keycloak/SAML, SCORM, Vault, Audit Log |

---

## 비용 추정 (참고)

| Phase | 인프라 | API | 개발 (4–6주×$5K) | 합계 |
|-------|--------|-----|------------------|------|
| 11 | $500 | $200 | ~$22K | ~$23K |
| 12 | $1K | $500 | ~$20K | ~$22K |
| 13 | $200 | — | ~$10K | ~$10K |
| 14 | $2K | $1K | ~$16K | ~$19K |
| 15 | $5K | $500 | ~$25K | ~$31K |

---

## 결론

Phase 11–15는 Pronunciation Master를 **완전한 엔터프라이즈 SaaS**로 확장합니다.

- **B2C:** 모바일 앱으로 사용자 접근성 확대
- **B2B:** 분석·엔터프라이즈 기능으로 교육 기관 수요 대응
- **기술:** Advanced STT/TTS + Gemma 4 오디오로 발음 교정 품질 강화
- **수익:** Free / Pro / Enterprise 다층 모델 유지·확장

---

Generated: 2026-07-29 | Phase 11–15 Roadmap

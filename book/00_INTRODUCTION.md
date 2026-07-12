# Chapter 0: 서론 — AI 발음 교정 SaaS의 비전

## 목적 (Why)

Pronunciation Master는 **Ontology 기반 개인화 학습**과 **AOMD 4역할 피드백**으로 영어 발음을 교정하는 SaaS 플랫폼입니다. 이 책은 Phase 1(Web MVP)부터 Phase 9(Enterprise B2B)까지의 실제 구현 기록입니다.

### 왜 이 프로젝트인가?
- 직무/분야별 발음(의료, 금융, IT 등) 수요 증가
- LLM(Gemma 4)으로 동적 시나리오·피드백 생성 가능
- 구독 SaaS로 지속 수익 모델 확립

### 기술 선택 이유
| 기술 | 선택 이유 |
|------|-----------|
| React + Vite + Tailwind | 빠른 UI, 반응형 |
| Express + PostgreSQL | JWT·구독·진도 영속화 |
| LMStudio + Gemma 4 | 로컬 LLM, 비용 절감 |
| Docker + WSL | 팀 간 동일 환경 |
| Expo | iOS/Android 크로스 플랫폼 |

## 구현 내용 (How)

장기 전략 문서 `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md`가 9개 Phase 로드맵의 SSOT(Single Source of Truth)입니다.

```
Phase 1–3: Web MVP → Ontology/AOMD → SaaS
Phase 4–5: STT · Analytics · PWA · Mobile
Phase 6–7: 프로덕션 · STT · CI/CD
Phase 8–9: Enterprise SSO · B2B API · CDN
```

## 결과 (What)

- **Phase 1–9** 전 기능 구현 완료
- 5도메인 Ontology, 4역할 AOMD, 3티어 SaaS
- Web + Mobile + Enterprise API

**다음:** [Chapter 1 — 아키텍처 개요](./01_ARCHITECTURE_OVERVIEW.md)

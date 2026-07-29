# Pronunciation Master — Technical Book

AI 기반 영어 발음 교정 SaaS를 **Phase 1부터 Phase 10**까지 구축한 실전 기록.

**기준 문서:** `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md`  
**최종 Phase:** 10 **100% 완료** | **현재:** Phase 11 Part 11-1 🚀  
**다음:** `PHASE11_CODE_LOOP_PROMPTS.md`

---

## 목차

### Part 1: 기초 & Phase 1 (Web MVP)
| Ch | 파일 | 내용 | 커밋 |
|----|------|------|------|
| 0 | [00_INTRODUCTION.md](./00_INTRODUCTION.md) | 서론, 비전, 기술 선택 | — |
| 1 | [01_ARCHITECTURE_OVERVIEW.md](./01_ARCHITECTURE_OVERVIEW.md) | 전체 아키텍처 | — |
| 2 | [02_PHASE1_ENVIRONMENT_SETUP.md](./02_PHASE1_ENVIRONMENT_SETUP.md) | WSL + Docker + LMStudio | 5d7569f |
| 3 | [03_PHASE1_FRONTEND_DEVELOPMENT.md](./03_PHASE1_FRONTEND_DEVELOPMENT.md) | React + Tailwind | 5d7569f |
| 4 | [04_PHASE1_BACKEND_LLM_INTEGRATION.md](./04_PHASE1_BACKEND_LLM_INTEGRATION.md) | Express + Gemma 4 | 5d7569f |
| 5 | [05_PHASE1_TESTING_DEPLOYMENT.md](./05_PHASE1_TESTING_DEPLOYMENT.md) | 테스트 & 배포 | 5d7569f |

### Part 2: Phase 2–3 (Ontology · AOMD · SaaS)
| Ch | 파일 | 내용 | 커밋 |
|----|------|------|------|
| 6 | [06_PHASE2_ONTOLOGY_DESIGN.md](./06_PHASE2_ONTOLOGY_DESIGN.md) | 5도메인 Ontology | 2717f63 |
| 7 | [07_PHASE2_AOMD_IMPLEMENTATION.md](./07_PHASE2_AOMD_IMPLEMENTATION.md) | 4역할 피드백 엔진 | 2717f63 |
| 8 | [08_PHASE3_SAAS_STRATEGY.md](./08_PHASE3_SAAS_STRATEGY.md) | PostgreSQL · JWT · 구독 | cacba9d |

### Part 3: Phase 4–7 (플랫폼 확장 · 프로덕션)
| Ch | 파일 | 내용 | 커밋 |
|----|------|------|------|
| 9 | [09_PHASE4_TO_7_PLATFORM_EXPANSION.md](./09_PHASE4_TO_7_PLATFORM_EXPANSION.md) | STT · PWA · Mobile · CI/CD | 4aebfcc–fc62750 |

### Part 4: Phase 8–9 (Enterprise · B2B)
| Ch | 파일 | 내용 | 커밋 |
|----|------|------|------|
| 10 | [10_PHASE8_TO_9_ENTERPRISE.md](./10_PHASE8_TO_9_ENTERPRISE.md) | SSO · 팀 · API키 · CDN | 69380cd–4a4e4ba |

### Part 5: Phase 10 (프로덕션 SaaS 인프라)
| Ch | 파일 | 내용 | 커밋 |
|----|------|------|------|
| 13 | [13_PHASE10_PRODUCTION_SAAS.md](./13_PHASE10_PRODUCTION_SAAS.md) | Redis · K8s · Prometheus/Grafana | 251681d |

### Part 6: Phase 11+ & 회고
| Ch | 파일 | 내용 | 커밋 |
|----|------|------|------|
| 11 | [11_LESSONS_LEARNED.md](./11_LESSONS_LEARNED.md) | 배운 점 & 최적화 | — |
| 12 | [12_FUTURE_ROADMAP.md](./12_FUTURE_ROADMAP.md) | Phase 11–15 계획 | — |
| 14 | [14_PHASE11_MOBILE_APP.md](./14_PHASE11_MOBILE_APP.md) | Expo 모바일 앱 | 🚀 |

---

## 챕터 구조 (통일)

각 챕터는 **목적(Why) → 구현(How) → 결과(What)** 3단 구성.

## 읽는 순서

1. Ch0–1: 전체 그림
2. Ch2–5: Phase 1 따라하기
3. Ch6–8: Ontology/AOMD/SaaS 심화
4. Ch9–10: 확장 & Enterprise
5. Ch13: Phase 10 프로덕션 인프라
6. Ch14: Phase 11 모바일 앱
7. Ch11–12: 회고 & 로드맵

---

Generated: 2026-07-29 | Book README (Ch0–14)

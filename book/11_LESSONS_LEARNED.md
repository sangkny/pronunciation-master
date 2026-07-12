# Chapter 11: 배운 점 (Lessons Learned)

## 목적 (Why)

Phase 1–9 전 과정에서 얻은 기술·프로세스 인사이트를 기록합니다.

## 구현 내용 (How) — 핵심 교훈

### 1. 문서 SSOT의 중요성
- `LONG_TERM_STRATEGY_ONTOLOGY_AOMD_SAAS.md`를 기준으로 Phase별 Code Loop 프롬프트·Handover·Book을 동기화
- 커밋마다 `CURSOR_HANDOVER.md` 갱신 → 컨텍스트 손실 방지

### 2. Phase 단위 점진 확장
- Phase 1(MVP) → 2(Ontology) → 3(SaaS) 순서가 필수
- Phase 4–7은 병렬 가능 영역(STT, Mobile, CI)이지만 DB·인증 선행 필요

### 3. Mock → Live 전환 패턴
- Stripe, STT, SSO 모두 **mock 폴백 + env 기반 live** 패턴 통일
- 개발 환경에서 외부 키 없이 smoke test 가능

### 4. Docker + WSL 조합
- LMStudio는 호스트, API는 컨테이너 → `host.docker.internal` 필수
- prod는 `docker-compose.prod.yml` + nginx 분리

### 5. Book 형식 문서화
- Why/How/What 구조가 팀 온보딩·기술 블로그에 재활용 용이
- Phase 완료 시 해당 Chapter 업데이트가 회고 역할

### 6. Enterprise 기능 설계
- SSO → 티어 승격 → custom ontology → API key 순 의존성
- `requireTier(['Enterprise'])` 미들웨어로 일관된 게이트

## 결과 (What)

| 영역 | 개선 전 | 개선 후 |
|------|---------|---------|
| 인증 | 없음 | JWT + SSO + API Key |
| 피드백 | 단일 | AOMD 4역할 |
| 배포 | dev only | prod compose + CI |
| 문서 | 산재 | Book Ch0–12 + Strategy SSOT |

**다음:** [Chapter 12 — 미래 로드맵](./12_FUTURE_ROADMAP.md)

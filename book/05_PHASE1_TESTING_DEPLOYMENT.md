# Chapter 5: Phase 1 테스트 & 배포

## 목적 (Why)

Phase 1 Web MVP의 완성도를 검증하고 Phase 2 진입 기준을 확립합니다.

## 구현 내용 (How)

### API 테스트
```bash
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/mission/generate-by-scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario":"hospital meeting","category":"medical","count":3}'
```

### UI 테스트
- 5개 분야 카드 선택 → 상황 입력 → 미션 생성
- TTS(Web Speech API) 재생 확인

### 배포 체크리스트
- [ ] Docker 3서비스 healthy
- [ ] LMStudio 응답 < 30s
- [ ] Frontend 빌드 `npm run build` 성공

## 결과 (What)

| 항목 | 상태 |
|------|------|
| Backend API | ✅ |
| Frontend UI | ✅ |
| LLM 연동 | ✅ (폴백 포함) |
| Docker | ✅ |

Phase 1 완료 → Phase 2 Ontology/AOMD 착수 (`2717f63`)

**다음:** [Chapter 6 — Ontology 설계](./06_PHASE2_ONTOLOGY_DESIGN.md)

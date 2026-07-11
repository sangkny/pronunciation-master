# Phase 2 최종 가이드

## 현재 상황
- Phase 1 (Web MVP): 100% ✅
- Phase 2 (Ontology + AOMD + Scoring + Frontend): 100% ✅
- 최종 커밋: `2717f63` (기능), `409f38f` (HANDOVER)

## 진행 방법
1. code . 로 Cursor 실행
2. Ctrl+K → PHASE2_CODE_LOOP_PROMPTS.md의 Part 1 붙여넣기
3. 완료 기준 충족까지 Code Loop (구현→테스트→수정 반복)
4. Part 1 → 2 → 3 순서로 진행, 각 Part마다 git commit & push

## 테스트 명령어
Part 1: curl -X POST http://localhost:5000/api/aomd/feedback -H "Content-Type: application/json" -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","word":"imaging","score":75,"context":"Medical"}'
Part 2: curl -X POST http://localhost:5000/api/scoring/calculate -H "Content-Type: application/json" -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","userLevel":"intermediate","difficulty":"intermediate"}'
Part 3: 브라우저 http://localhost:5173

## 테스트 실패 시 (Code Loop)
Cursor Ctrl+K에:
"Part X 테스트 실패. API: [주소], 에러: [메시지]. 원인 분석 후 수정하고 다시 테스트해서 통과할 때까지 반복해."

## 코드 변경 후 Docker 재빌드
docker compose down && docker compose build backend frontend && docker compose up -d

## 최종 마무리
- CURSOR_HANDOVER.md: Phase 2 100% 로 갱신
- git add . && git commit -m "Phase 2 완료: AOMD + 점수 + Frontend" && git push origin main

## 핵심 원칙 (잊지 말 것)
1. Ontology 기반 설계  2. AOMD 4관점 피드백  3. SaaS 지속 가능성
4. Book 형식 문서화  5. Code Loop 협업  6. 매 커밋 문서 갱신

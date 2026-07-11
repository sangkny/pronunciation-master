# Phase 2 Code Loop 프롬프트

상태: Ontology 완료 (5d7569f)
목표: AOMD + 점수 시스템 + Frontend 연동

---

## Part 1: AOMD 피드백 엔진 (Cursor Ctrl+K에 붙여넣기)

프로젝트: Pronunciation Master - Phase 2 AOMD 피드백 엔진

현재 상태:
- Ontology 완료: 5개 도메인, 50개 개념
- API: GET /api/ontology/* 모두 작동

작업 목표: AOMD 피드백 엔진 구축.
Code Loop 방식: 아래 완료 기준을 모두 충족할 때까지 스스로 구현-테스트-수정을 반복할 것.

작업 내용:
1. AOMD_FRAMEWORK.md 작성 (프로젝트 루트)
   - 4가지 역할 정의 (Advocate/Opposite/Meditator/Decisioner)
   - 각 역할별 LLM 프롬프트, 예시 피드백

2. backend/src/services/aomdEngine.js 구현
   - async generateAdvocateFeedback()
   - async generateOppositeFeedback()
   - async generateMediatorFeedback()
   - async generateDecisionerFeedback()
   - async generateComprehensiveFeedback()  // Promise.all 병렬 처리
   - 기존 llmManager.js (LMStudio) 재사용, 실패 시 기본 템플릿 폴백

3. backend/src/routes/aomd.js 추가
   POST /api/aomd/feedback
   요청: {userPronunciation, correctPronunciation, word, score, context}
   응답: {advocate, opposite, meditator, decisioner}

4. backend/src/server.js 수정 - aomd 라우트 등록

테스트:
curl -X POST http://localhost:5000/api/aomd/feedback \
  -H "Content-Type: application/json" \
  -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","word":"imaging","score":75,"context":"Medical"}'

완료 기준 (모두 충족까지 반복):
- AOMD_FRAMEWORK.md 작성
- aomdEngine.js 5개 메서드 구현
- POST /api/aomd/feedback 테스트 200 OK
- 4가지 피드백 모두 반환
- CURSOR_HANDOVER.md 업데이트 후 git commit & push

---

## Part 2: 점수 시스템 (Part 1 완료 후)

프로젝트: Pronunciation Master - Phase 2 점수 시스템

작업 목표: 0-100 발음 정확도 채점.
Code Loop 방식: 완료 기준 충족까지 반복.

작업 내용:
1. SCORING_SYSTEM.md 작성
   채점 기준: 음절 정확도(40) + 유창성(30) + 문맥 적절성(20) + 회화성(10)

2. backend/src/services/scoringEngine.js 구현
   - async calculateScore(userPronunciation, correctPronunciation, userLevel)
   - 반환: {totalScore, breakdown:{syllableAccuracy, fluency, contextuality, conversational}}
   - 난이도/사용자 레벨별 조정 포함

3. backend/src/routes/scoring.js 추가 - POST /api/scoring/calculate
4. backend/src/server.js 수정 - scoring 라우트 등록

테스트:
curl -X POST http://localhost:5000/api/scoring/calculate \
  -H "Content-Type: application/json" \
  -d '{"userPronunciation":"ih-MAJ-ing","correctPronunciation":"IM-ij-ing","userLevel":"intermediate","difficulty":"intermediate"}'

완료 기준:
- SCORING_SYSTEM.md 작성
- calculateScore 구현, 점수 0-100 범위 검증
- POST /api/scoring/calculate 테스트 200 OK
- CURSOR_HANDOVER.md 업데이트 후 git commit & push

---

## Part 3: Frontend 연동 (Part 2 완료 후)

프로젝트: Pronunciation Master - Phase 2 Frontend 연동

작업 목표: Frontend에서 Ontology/AOMD/점수 활용.
Code Loop 방식: 완료 기준 충족까지 반복.

작업 내용:
1. frontend/src/App.jsx 수정
   새 흐름: 분야 선택 → 난이도 선택 → 학습 경로 표시 → 개념 선택 → 미션
2. 추가 UI:
   - Difficulty Selector (Beginner/Intermediate/Advanced)
   - Learning Path Visualization (완료/진행중/미해제 상태 표시)
   - Concept Details (어휘, IPA, 예문, 미션 시작 버튼)
3. API 호출:
   - GET /api/ontology/learning-path/:domainId?userLevel=beginner
   - GET /api/ontology/concept/:conceptId

테스트:
1. http://localhost:5173 접속
2. Medical → Beginner → 학습 경로 표시
3. 개념 클릭 → 상세 정보
4. F12 모바일 뷰 반응형 확인

완료 기준:
- 난이도 선택 UI, 학습 경로 시각화, 개념 상세 작동
- 브라우저 테스트 통과
- CURSOR_HANDOVER.md 업데이트 (Phase 2: 100%) 후 git commit & push

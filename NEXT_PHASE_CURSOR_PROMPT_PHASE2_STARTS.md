# 🚀 다음 단계 Cursor 프롬프트 - Phase 2 시작하기

**현재 상태:** Phase 1 완료 (90% ✅)  
**다음 Phase:** Phase 2 - Ontology & AOMD (계획: 8월-9월)  
**목표:** 개인화된 학습 시나리오 엔진 구축

---

## 📋 상황 요약

### Phase 1 완료 사항

```
✅ Web MVP 완성
  - Frontend: React + Vite + Tailwind CSS
  - Backend: Express.js + LMStudio Gemma 4
  - 분야 선택 → 상황 입력 → 미션 생성 완성

✅ 아키텍처 준비
  - 마이크로서비스 패턴
  - LLM 프로바이더 추상화
  - 안정적인 에러 처리

✅ 문서화 완성
  - CURSOR_HANDOVER.md (협업 가이드)
  - Book 챕터 (Ch3, Ch4 완성)
  - API 명세
  - Phase 1 완료 보고서
```

### Phase 2 목표

```
📌 Ontology 기반 시나리오 엔진
   - 도메인별 개념 맵
   - 체계적인 학습 경로
   - 지능형 미션 생성

📌 AOMD 역할 기반 피드백
   - Advocate (옹호자): 긍정적 강화
   - Opposite (반대자): 비판적 분석
   - Meditator (중재자): 균형잡힌 조언
   - Decisioner (결정자): 행동 계획

📌 점수 및 진도 추적
   - 발음 정확도 채점 (0-100)
   - 개념별 습득도 추적
   - 사용자별 학습 경로 추천

📌 데이터베이스 구축
   - 사용자 관리
   - 학습 진행 기록
   - 점수 히스토리
```

---

## 🔄 Phase 1 → Phase 2 전환 체크리스트

### 코드 준비 상황

```
✅ Backend
  - LLMManager.js: LMStudio 통합 완료
  - server.js: 기본 엔드포인트 구현
  - routes/mission.js: 시나리오 생성 API 완성
  
🔄 필요한 추가 작업
  - Database 연결 (MySQL/PostgreSQL)
  - Ontology 엔진 (새로운 서비스)
  - AOMD 피드백 엔진 (새로운 서비스)
  - 점수 계산 엔진 (새로운 서비스)

✅ Frontend
  - App.jsx: 기본 UI 완성
  - API 클라이언트: 기본 구현
  
🔄 필요한 추가 작업
  - 점수 표시 화면
  - 진도 추적 대시보드
  - AOMD 피드백 렌더링
  - 설정/프로필 페이지 (Phase 3)
```

### 문서 준비 상황

```
✅ 기술 문서
  - CURSOR_HANDOVER.md
  - Phase 1 완료 보고서
  - Book Ch3, Ch4 (완성)

🔄 Phase 2 문서 (작성 필요)
  - Ontology 설계 문서
  - AOMD 구현 가이드
  - 점수 시스템 사양서
  - Book Ch6, Ch7 (작성 예정)
```

---

## 🎯 Phase 2 첫 번째 작업 - Ontology 설계

### Cursor에게 할당할 작업 1️⃣

```
프로젝트: Pronunciation Master - Phase 2 Ontology 설계
현재 상태: Phase 1 완료, DB 미준비
개발 환경: WSL + Docker + LMStudio Gemma 4

작업 목표:
Ontology 설계 문서 작성 및 초기 구현

작업 세부사항:

1. Ontology 설계 문서 작성 (project/ONTOLOGY_DESIGN.md)
   
   필요한 내용:
   - 각 도메인별 개념 맵
   - 개념 간 관계 정의
   - 학습 시퀀스
   - 선행 개념 정의
   
   도메인 (5개):
   1. Medical Devices (의료기기)
      - Concepts: Equipment, Procedure, Diagnosis, Safety
      - Vocabulary: 30-50 의료 용어
      - Scenarios: Presentation, Documentation, Communication
   
   2. Telecommunications (통신기술)
      - Concepts: Network, Protocol, Infrastructure, Security
      - Vocabulary: 30-50 기술 용어
      - Scenarios: Technical Meeting, Sales Pitch, Documentation
   
   3. Finance (금융)
      - Concepts: Investment, Risk, Market, Analytics
      - Vocabulary: 30-50 금융 용어
      - Scenarios: Report, Presentation, Negotiation
   
   4. Technology (기술)
      - Concepts: Architecture, Development, Deployment, Scalability
      - Vocabulary: 30-50 기술 용어
      - Scenarios: Code Review, Technical Interview, Documentation
   
   5. Automotive (자동차)
      - Concepts: Design, Manufacturing, Performance, Safety
      - Vocabulary: 30-50 자동차 용어
      - Scenarios: Product Launch, Technical Briefing, Sales

2. Ontology 데이터 구조 설계 (JSON 형식)
   
   예시 구조:
   ```json
   {
     "domains": [
       {
         "id": "medical",
         "name": "Medical Devices",
         "concepts": [
           {
             "id": "imaging",
             "name": "Imaging Systems",
             "difficulty": "intermediate",
             "prerequisites": ["equipment_basics"],
             "vocabulary": ["MRI", "ultrasound", "diagnostic"],
             "scenarios": [...]
           }
         ]
       }
     ]
   }
   ```

3. 초기 데이터 파일 생성
   - backend/data/ontology.json (모든 도메인의 개념 정의)
   - 최소 50개 개념, 각 개념당 5-10개 단어

4. Ontology 서비스 구현 (backend/src/services/ontologyEngine.js)
   - Ontology 데이터 로드
   - 개념 검색
   - 선행 개념 확인
   - 학습 경로 생성

지시사항:
- Ontology 설계는 교육학 관점에서 (학습 효과 극대화)
- 실무 관련성이 높은 개념만 포함
- 난이도 단계를 명확하게 구분 (Beginner, Intermediate, Advanced)
- 개념 간 의존성을 명확히 표시
- 각 개념마다 예제 문장 2-3개 포함

파일 위치:
- 설계 문서: project/ONTOLOGY_DESIGN.md
- 데이터: backend/data/ontology.json
- 서비스: backend/src/services/ontologyEngine.js
```

---

## 🎯 Phase 2 두 번째 작업 - AOMD 피드백 엔진

### Cursor에게 할당할 작업 2️⃣

```
프로젝트: Pronunciation Master - Phase 2 AOMD 피드백
현재 상태: Ontology 설계 완료 (가정)
개발 환경: WSL + Docker + LMStudio Gemma 4

작업 목표:
AOMD 역할 기반 동적 피드백 생성 시스템 구현

작업 세부사항:

1. AOMD 피드백 엔진 설계 (project/AOMD_FRAMEWORK.md)
   
   필요한 내용:
   - 4가지 역할 정의 및 특징
   - 피드백 생성 템플릿
   - 사용자 학습 스타일별 가중치
   - 피드백 톤/스타일 가이드

2. AOMD 역할별 피드백 생성 (backend/src/services/aomdEngine.js)
   
   각 역할이 생성해야 하는 피드백:
   
   🟢 Advocate (옹호자 - 긍정적 강화)
      - 사용자가 잘한 부분 찾기
      - 구체적인 칭찬
      - 동기부여
      - 톤: 따뜻하고 격려하는
      - 예: "Great pronunciation of 'diagnostic'! 
             You nailed the stress on the second syllable."
   
   🔴 Opposite (반대자 - 비판적 분석)
      - 문제점 명확하게 지적
      - 오류 분석
      - 개선 방향 제시
      - 톤: 객관적이고 직설적
      - 예: "Your pronunciation of 'infrastructure' was unclear.
             The stress should be on 'in', not 'ture'."
   
   🟡 Meditator (중재자 - 균형잡힌 조언)
      - 양쪽 관점 제시
      - 문맥별 사용법
      - 예외 상황 설명
      - 톤: 균형잡히고 교육적
      - 예: "Your pronunciation is improving. In formal settings, 
             emphasize 'IN-fra-struc-ture'. In casual speech, 
             'IN-fra-struc-cher' is also acceptable."
   
   🔵 Decisioner (결정자 - 행동 계획)
      - 다음 단계 제시
      - 우선순위 설정
      - 구체적 실행 계획
      - 톤: 행동 지향적
      - 예: "Next, focus on 3 words: 'infrastructure', 
             'electromagnetic', 'implementation'. 
             Spend 5 minutes on each. Then move to scenario 2."

3. LLM을 활용한 동적 피드백 생성
   
   프롬프트 구조:
   ```
   역할: [역할명]
   사용자 발음: [음성 인식 텍스트]
   정답: [정확한 발음]
   정확도: [점수]
   맥락: [학습 시나리오]
   
   요청: 이 역할의 특성에 맞게 피드백 생성
   ```

4. API 엔드포인트 구현
   
   POST /api/pronunciation/analyze
   요청:
   {
     "sentence": "The infrastructure is secure",
     "userRecording": "[음성 데이터]",
     "focusWords": ["infrastructure", "secure"]
   }
   
   응답:
   {
     "overallScore": 85,
     "wordScores": {
       "infrastructure": 75,
       "secure": 95
     },
     "feedback": {
       "advocate": "Great effort on 'secure'!...",
       "opposite": "Your pronunciation of 'infrastructure'...",
       "meditator": "Both pronunciations are acceptable in...",
       "decisioner": "Next, practice these similar words..."
     }
   }

지시사항:
- 각 역할의 톤과 특성을 일관되게 유지
- LLM 프롬프트는 구체적으로 (역할 설명 포함)
- 피드백 길이: 1-3문장 (간결)
- 교육적 가치: 단순 칭찬/비난이 아닌 학습 효과
- 개인화: 학습 수준과 진도에 따라 조정

파일 위치:
- 설계 문서: project/AOMD_FRAMEWORK.md
- 서비스: backend/src/services/aomdEngine.js
```

---

## 🎯 Phase 2 세 번째 작업 - 점수 시스템

### Cursor에게 할당할 작업 3️⃣

```
프로젝트: Pronunciation Master - Phase 2 점수 시스템
현재 상태: AOMD 완료 (가정)
개발 환경: WSL + Docker + LMStudio Gemma 4

작업 목표:
포괄적인 발음 평가 및 점수 계산 시스템 구현

작업 세부사항:

1. 점수 시스템 설계 (project/SCORING_SYSTEM.md)
   
   평가 기준 (0-100):
   
   1. 음절 정확도 (40점)
      - 각 음절 명확도 (20점)
        [명확함] 20 → 15 → 10 → 5 → [불명확]
      - 스트레스/강약 정확도 (15점)
        [정확] 15 → 10 → 5 → [부정확]
      - 음운 정확도 (5점)
        [정확] 5 → 3 → 0 → [부정확]
   
   2. 유창성 (30점)
      - 속도 적절성 (10점)
        [자연스러움] 10 → 7 → 5 → [너무 빠름/느림]
      - 자연스러움 (10점)
        [매끄러움] 10 → 7 → 5 → [어색함]
      - 폴 패턴 (음정 변화) (10점)
        [자연스러움] 10 → 7 → 5 → [로봇 같음]
   
   3. 문맥 적절성 (20점)
      - 상황별 정확도 (10점)
        [포멀/캐주얼 모두 정확] 10 → 7 → 5 → [부적절]
      - 포멀/캐주얼 구분 (10점)
        [완벽히 구분] 10 → 7 → 5 → [미구분]
   
   4. 회화성 (10점)
      - 네이티브 근접성 (10점)
        [네이티브 수준] 10 → 7 → 5 → 0

2. 점수 계산 엔진 (backend/src/services/scoringEngine.js)
   
   입력:
   - 사용자 음성 데이터
   - 정답 발음
   - 개념 난이도
   - 사용자 학습 수준
   
   처리:
   - Web Speech API 또는 외부 STT 사용
   - 각 항목별 점수 계산
   - 난이도 조정 (더 어려운 단어는 높은 점수 가치)
   - 개인화 조정 (초보자는 낮은 기준, 고급자는 높은 기준)
   
   출력:
   - 각 항목별 세부 점수
   - 총점 (0-100)
   - 점수 근거 (왜 이 점수인가)

3. 난이도 조정 로직
   
   예시:
   - Beginner (0-30점 범위): 기본 정확도만 평가
   - Intermediate (30-70점 범위): 모든 항목 평가
   - Advanced (70-100점 범위): 엄격한 기준 적용

4. API 엔드포인트
   
   POST /api/pronunciation/score
   요청:
   {
     "sentence": "infrastructure",
     "userRecording": "[음성 데이터]",
     "userLevel": "intermediate",
     "conceptId": "infrastructure_001"
   }
   
   응답:
   {
     "totalScore": 82,
     "breakdown": {
       "syllableAccuracy": 38,  // 40점 만점
       "fluency": 28,           // 30점 만점
       "contextuality": 18,     // 20점 만점
       "conversational": 8      // 10점 만점
     },
     "feedback": "좋은 발음이지만 강약이 약간 부정확합니다",
     "recommendation": "다음에는 스트레스에 집중하세요"
   }

지시사항:
- 점수는 학습 동기를 유지할 수 있도록 (너무 엄격하지 않게)
- 개선 여지를 명확하게 보여주기
- 시간이 지날수록 기준을 높이기 (적응형)
- 다른 사용자와 비교 금지 (개인 진도 중심)

파일 위치:
- 설계 문서: project/SCORING_SYSTEM.md
- 서비스: backend/src/services/scoringEngine.js
```

---

## 📅 Phase 2 타임라인 및 Milestone

### 주간 계획 (8주)

```
Week 1-2: Ontology 설계 및 초기 구현
  - ☐ Ontology 설계 문서
  - ☐ 데이터 구조 정의
  - ☐ ontologyEngine.js 구현
  - ☐ 50+ 개념 데이터 입력

Week 3-4: AOMD 피드백 엔진
  - ☐ AOMD 프레임워크 설계
  - ☐ aomdEngine.js 구현
  - ☐ LLM 프롬프트 최적화
  - ☐ API 엔드포인트

Week 5-6: 점수 시스템
  - ☐ 점수 시스템 설계
  - ☐ scoringEngine.js 구현
  - ☐ 난이도 조정 로직
  - ☐ STT 통합 (Web Speech API)

Week 7-8: 통합 및 테스트
  - ☐ 모든 모듈 통합
  - ☐ 엔드-투-엔드 테스트
  - ☐ 성능 최적화
  - ☐ Book 챕터 작성 (Ch6, Ch7)
  - ☐ Phase 2 완료 보고서

예상 완료: 2026년 9월 말
```

---

## 💡 Cursor와의 협업 팁

### 각 작업별 프롬프트 구조

```
1. 상황 정의
   - 프로젝트명
   - 현재 상태
   - 개발 환경

2. 작업 목표
   - 최종 결과물
   - 성공 기준
   - 예상 시간

3. 기술 스펙
   - 파일 위치
   - 데이터 구조
   - API 명세

4. 지시사항
   - 코드 표준
   - 에러 처리
   - 테스트 방법

5. 배경 지식
   - 프로젝트 컨텍스트
   - 관련 문서 링크
   - 이전 작업 내용
```

### 매주 확인할 사항

```
✅ CURSOR_HANDOVER.md 업데이트
✅ 진행률 계산 (%)
✅ 다음주 우선순위 정렬
✅ 블로킹 이슈 해결
✅ 문서 최신화
```

---

## 🎯 Phase 2 성공 기준

```
✅ Ontology
  - 5개 도메인, 50+ 개념
  - 각 개념 명확한 정의
  - 학습 경로 검증

✅ AOMD
  - 4가지 역할 피드백 구현
  - LLM 프롬프트 최적화
  - 사용자 만족도 80%+

✅ 점수 시스템
  - 0-100 점수 범위
  - 난이도 조정 로직
  - 개인화 적용

✅ 통합
  - 모든 시스템이 함께 작동
  - 엔드-투-엔드 테스트 통과
  - 성능 기준 충족

✅ 문서
  - 기술 문서 완성
  - Book 챕터 완성
  - 개발자 가이드
```

---

## 🚀 지금 시작하기

```
1. 프로젝트 폴더 정리
   mkdir -p project
   mkdir -p book
   mkdir -p backend/data

2. 파일 배치
   - 모든 프로젝트 문서 → project/
   - Book 챕터들 → book/
   - 데이터 파일들 → backend/data/

3. Cursor 열기
   cd Learning-Languages/pronunciation-master
   code .

4. 첫 작업 요청 (Ctrl+K)
   → Phase 2 Ontology 설계 작업

5. 진행 추적
   → CURSOR_HANDOVER.md 매주 업데이트
```

---

**Phase 2는 Phase 1의 기반 위에서 훨씬 흥미로운 기능들을 구축하는 단계입니다!** 🎓

**Let's go! 🚀**


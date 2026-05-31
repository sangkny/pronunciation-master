# Cursor AI 협업 마스터 프롬프트

이 프롬프트를 Cursor에서 사용하여 프로젝트를 효율적으로 관리하세요.

---

## 🎯 프롬프트 1: 새 기능 개발

```
프로젝트: Pronunciation Master
현재 구조:
- Backend: /backend/src/ (Express.js)
- Frontend: /frontend/src/ (React)
- LLM: Ollama (via llmManager.js)

[새 기능 설명]
[원하는 파일 경로]
[참고할 기존 코드]

요청사항:
1. 다음 파일들을 생성/수정해줘:
   - [파일 경로]
2. 다음 API 엔드포인트를 추가해줘:
   - POST /api/[엔드포인트]
3. 다음 React 컴포넌트를 만들어줘:
   - [컴포넌트명]

기준:
- 기존 코드 스타일 유지
- 에러 처리 포함
- 주석 추가
- Git 커밋 메시지 포함
```

### 사용 예시:

```
프로젝트: Pronunciation Master
현재 구조:
- Backend: /backend/src/ (Express.js)
- Frontend: /frontend/src/ (React)
- LLM: Ollama (via llmManager.js)

새 기능: 사용자가 녹음한 발음을 평가하는 기능 추가

요청사항:
1. 다음 파일을 생성해줘:
   - backend/src/services/pronunciationAnalyzer.js
2. 다음 API 엔드포인트를 추가해줘:
   - POST /api/pronunciation/score
3. 다음 React 컴포넌트를 만들어줘:
   - RecordingAnalysis.jsx

기준:
- 기존 apiClient.js 사용하여 백엔드와 통신
- 발음 정확도 0-100 점수 반환
- 구체적인 피드백 메시지 포함
```

---

## 🎯 프롬프트 2: 버그 수정

```
프로젝트: Pronunciation Master

현재 문제:
[오류 메시지 또는 설명]

발생 위치:
- 파일: [파일 경로]
- 라인: [라인 번호] (있으면)

현재 코드:
[코드 스니펫]

예상 동작:
[무엇이 되어야 하는가]

실제 동작:
[무엇이 일어나는가]

요청:
1. 버그 원인 분석
2. 수정 코드 제공
3. 수정 이유 설명
4. 테스트 방법 제시
```

### 사용 예시:

```
프로젝트: Pronunciation Master

현재 문제:
POST /api/mission/generate-by-scenario 호출 시 "Failed to fetch" 에러

발생 위치:
- 파일: frontend/src/App.jsx
- 함수: generateScenarioBasedMissions()

현재 코드:
const response = await fetch('/api/mission/generate-by-scenario', {
    method: 'POST',
    body: JSON.stringify(data)
});

예상 동작:
미션 데이터 배열을 받아서 화면에 표시

실제 동작:
CORS 에러 또는 404 에러 발생

요청:
1. 버그 원인 분석
2. 수정 코드 제공 (백엔드/프론트엔드 모두)
3. 수정 이유 설명
```

---

## 🎯 프롬프트 3: 코드 리팩토링

```
프로젝트: Pronunciation Master

리팩토링 대상:
- 파일: [파일 경로]
- 이유: [성능/가독성/유지보수성 등]

현재 코드:
[코드 전체]

개선 목표:
1. [개선 항목 1]
2. [개선 항목 2]
3. [개선 항목 3]

요청:
1. 개선된 코드 제공
2. 변경 내역 설명
3. 성능 개선 효과 (있으면)
4. 호환성 확인
```

---

## 🎯 프롬프트 4: 문서 작성

```
프로젝트: Pronunciation Master

문서 유형: [API 스펙/개발 가이드/사용 설명서/기술 문서]

대상:
- 대상 읽자층: [개발자/사용자/운영자]
- 포함할 내용: [내용 리스트]
- 깊이: [개요/상세/매우 상세]

요청:
1. Markdown 형식의 문서 작성
2. 예제 코드 포함 (필요시)
3. 이미지/다이어그램 설명 (필요시)
4. 목차 포함

파일 경로: docs/[문서명].md
```

### 사용 예시:

```
프로젝트: Pronunciation Master

문서 유형: API 스펙

대상:
- 대상 읽자층: 프론트엔드 개발자
- 포함할 내용:
  1. 발음 분석 API
  2. 미션 생성 API
  3. 번역 API
  4. 응답 형식
  5. 에러 처리

요청:
1. 모든 엔드포인트 문서화
2. 요청/응답 예시 포함
3. 상태 코드 설명
4. 오류 케이스 설명

파일 경로: docs/API_SPECIFICATION.md
```

---

## 🎯 프롬프트 5: 배포 준비

```
프로젝트: Pronunciation Master
현재 상태: 로컬 개발 완료

배포 환경:
- 플랫폼: [AWS/Heroku/Docker Hub 등]
- 환경: [프로덕션/스테이징]

요청:
1. Dockerfile 최적화 (멀티스테이지 빌드)
2. docker-compose.prod.yml 생성
3. 환경 변수 설정 가이드
4. 데이터베이스 마이그레이션 스크립트
5. 배포 체크리스트

추가:
- 성능 최적화 제안
- 보안 고려사항
- 모니터링 설정
```

---

## 🎯 프롬프트 6: 성능 최적화

```
프로젝트: Pronunciation Master

성능 문제:
- 화면 로딩 시간: [초]
- API 응답 시간: [초]
- 메모리 사용량: [MB]

분석 대상:
- 파일: [파일 경로들]
- 주요 기능: [기능명]

요청:
1. 병목 지점 분석
2. 최적화 방안 제시
3. 구현 코드 제공
4. 성능 개선 수치 예상

측정 도구:
- Chrome DevTools
- Lighthouse
- MongoDB Profiler (있으면)
```

---

## 🎯 프롬프트 7: 테스트 코드 작성

```
프로젝트: Pronunciation Master

테스트 대상:
- 모듈: [모듈명]
- 파일: [파일 경로]

기능:
[테스트할 기능 설명]

요청:
1. Jest 또는 Mocha 테스트 코드 작성
2. 모든 엣지 케이스 포함
3. 목(Mock) 데이터 포함
4. 테스트 실행 방법

파일 경로: [파일경로].test.js
```

---

## 🎯 프롬프트 8: Docker 설정 최적화

```
프로젝트: Pronunciation Master

현재 상태:
- Dockerfile들이 생성됨
- docker-compose.yml이 설정됨
- 로컬 개발 환경에서 실행 중

요청:
1. Dockerfile 멀티스테이지 빌드로 최적화
2. docker-compose.yml 프로덕션 버전 생성
3. .dockerignore 파일 생성
4. 환경별 설정 분리 (dev/prod)
5. 시작 스크립트 개선

목표:
- 이미지 크기 감소
- 빌드 시간 단축
- 보안 강화
```

---

## 🎯 프롬프트 9: 기능 요구사항 분석

```
프로젝트: Pronunciation Master

새로운 요구사항:
[상세한 기능 설명]

현재 시스템:
[현재 아키텍처 설명]

요청:
1. 기능 분해 (Feature Breakdown)
2. 필요한 파일/폴더 목록
3. API 엔드포인트 설계
4. 데이터베이스 스키마 (필요시)
5. 개발 일정 추정
6. 예상 문제점과 해결 방안
```

---

## 🎯 프롬프트 10: 코드 리뷰

```
프로젝트: Pronunciation Master

리뷰 대상:
- 파일: [파일 경로]
- 변경 사항: [무엇이 바뀌었는가]

제출 코드:
[코드 전체]

리뷰 항목:
1. 코드 스타일 준수
2. 성능 이슈
3. 보안 취약점
4. 에러 처리
5. 테스트 커버리지
6. 문서화

요청:
1. 문제점 지적
2. 개선 제안
3. 승인/반려 결정
4. 수정 코드 (심각한 이슈만)
```

---

## 💡 사용 팁

### 1. 명확한 요청
```
❌ 나쁜 예:
"이 기능을 추가해줘"

✅ 좋은 예:
"backend/src/routes/ 에서 POST /api/pronunciation/score 엔드포인트를 추가해줘.
요청 데이터: {audio: Blob, focusPoints: string[]}"
```

### 2. 파일 경로 명시
```
❌ 나쁜 예:
"App.jsx 수정해줘"

✅ 좋은 예:
"frontend/src/App.jsx 의 generateScenarioBasedMissions() 함수를 수정해줘"
```

### 3. 컨텍스트 제공
```
❌ 나쁜 예:
"에러가 나"

✅ 좋은 예:
"POST /api/mission/generate-by-scenario 호출 시 
CORS 에러가 발생합니다. 
현재 코드: [...코드...]
예상 동작: [...설명...]"
```

### 4. 이전 시도 공유
```
좋은 예:
"이미 다음을 시도했습니다:
1. CORS 헤더 추가
2. 프록시 설정 변경

하지만 여전히 문제가 있습니다."
```

---

## 🔄 워크플로우

### 1. 기능 개발 주기

```
1️⃣ 기능 요구사항 분석 (프롬프트 9)
   ↓
2️⃣ 파일 생성/수정 (프롬프트 1)
   ↓
3️⃣ 테스트 코드 작성 (프롬프트 7)
   ↓
4️⃣ 코드 리뷰 (프롬프트 10)
   ↓
5️⃣ 문서 작성 (프롬프트 4)
   ↓
6️⃣ Git 커밋
   ↓
7️⃣ Docker 테스트
```

### 2. 버그 수정 주기

```
1️⃣ 버그 리포트 (프롬프트 2)
   ↓
2️⃣ 원인 분석
   ↓
3️⃣ 수정 코드 생성
   ↓
4️⃣ 테스트
   ↓
5️⃣ Git 커밋
```

### 3. 배포 준비

```
1️⃣ 배포 요청 (프롬프트 5)
   ↓
2️⃣ 코드 최적화 (프롬프트 6)
   ↓
3️⃣ Docker 최적화 (프롬프트 8)
   ↓
4️⃣ 최종 테스트
   ↓
5️⃣ 배포
```

---

## 📌 주의사항

1. **파일 경로**: 항상 프로젝트 루트 기준의 상대 경로 사용
2. **Git 메시지**: `feat:`, `fix:`, `chore:` 형식 사용
3. **환경 변수**: `.env.local`에서만 관리
4. **Docker**: 로컬 개발은 `docker compose up`, 프로덕션은 별도 설정
5. **API**: `/api/` 경로로 시작하는 RESTful API 사용

---

## 🎓 다음 단계

이 프롬프트들을 사용하여 Cursor AI와 협업하면서:

1. **새 기능 개발** → 프롬프트 1, 7, 10
2. **버그 수정** → 프롬프트 2
3. **코드 개선** → 프롬프트 3, 6
4. **문서화** → 프롬프트 4
5. **배포 준비** → 프롬프트 5, 8

효율적으로 프로젝트를 관리할 수 있습니다!

---

**Happy coding with Cursor! 🚀**

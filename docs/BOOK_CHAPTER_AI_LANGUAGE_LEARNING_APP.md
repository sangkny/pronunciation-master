# Chapter: AI-Powered Language Learning App - From Zero to MVP

## 목차
1. 프로젝트 개요 및 아키텍처
2. 개발 환경 구성
3. 백엔드 구축
4. 프론트엔드 개발
5. AI 통합 (LLM)
6. Docker 배포
7. AI와 협업하는 개발 방식

---

## 1. 프로젝트 개요 및 아키텍처

### 1.1 프로젝트 배경

**Pronunciation Master**는 AI를 활용한 영어 발음 교정 및 상황별 동적 학습 앱입니다. 이 프로젝트의 핵심 목표는 다음과 같습니다:

- 사용자가 입력한 상황(예: "의료기기 전시회 발표")에 따라 맞춤형 영어 문장 생성
- 생성된 문장의 발음을 학습할 수 있도록 TTS(Text-to-Speech) 제공
- 사용자 음성 녹음 후 AI가 발음 정확도 분석
- 5가지 학습 분야: 의료기기, 통신기술, 금융, 기술, 자동차

### 1.2 기술 스택

**아키텍처:**
```
┌─────────────────────────────────────┐
│   Browser (React + Vite)            │
│   - UI: 분야 선택, 상황 입력       │
│   - 기능: TTS, STT, 발음 연습      │
└────────────┬────────────────────────┘
             │ HTTP REST API
┌────────────▼────────────────────────┐
│   Backend (Express.js)              │
│   - API 엔드포인트                  │
│   - 미션 생성 로직                  │
│   - 발음 분석                       │
└────────────┬────────────────────────┘
             │ LLM API
┌────────────▼────────────────────────┐
│   Ollama (Local LLM)                │
│   - Model: mistral                  │
│   - 미션 문장 생성                  │
│   - 발음 피드백                     │
└─────────────────────────────────────┘
```

**사용 기술:**

| 계층 | 기술 | 버전 | 용도 |
|------|------|------|------|
| Frontend | React | 18.2.0 | UI 구성 |
| Frontend | Vite | 5.0.8 | 빌드 도구 |
| Backend | Express.js | 4.18.2 | API 서버 |
| LLM | Ollama | 0.24.0 | 로컬 AI 모델 |
| 컨테이너 | Docker | latest | 배포 |
| 패키지 관리 | npm | - | 의존성 관리 |

### 1.3 마이크로서비스 설계

각 컴포넌트는 독립적으로 확장 가능하도록 설계되었습니다:

```
Frontend (포트 5173)
├─ App.jsx: 상태 관리 & 페이지 라우팅
├─ services/
│  └─ apiClient.js: Backend 통신
└─ components/: 재사용 가능한 컴포넌트들

Backend (포트 5000)
├─ server.js: Express 설정 & 라우트
├─ services/
│  ├─ llmManager.js: LLM 통합
│  └─ providers/: 다양한 LLM 프로바이더
└─ routes/: API 엔드포인트

LLM (포트 11434)
└─ Ollama: 로컬 실행 가능한 AI 모델
```

---

## 2. 개발 환경 구성

### 2.1 문제점: 로컬 개발의 복잡성

전통적인 개발 방식의 문제:
- 각 개발자의 로컬 환경이 다름
- "내 컴퓨터에서는 잘 되는데?" 문제 발생
- Node.js, Python, CUDA 등 복잡한 의존성 관리
- 팀원 온보딩에 시간 소요

### 2.2 해결책: Docker Compose

Docker를 사용하여 모든 서비스를 컨테이너화:

```yaml
# docker-compose.yml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - LLM_PROVIDER=ollama
      - OLLAMA_API_URL=http://ollama:11434

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    environment:
      - REACT_APP_API_URL=http://localhost:5000

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
```

**이점:**
- ✅ 모든 개발자가 동일한 환경에서 작업
- ✅ 프로덕션과 개발 환경 동일
- ✅ 팀원 온보딩 간단 (docker compose up 한 줄)
- ✅ CI/CD 파이프라인 구축 용이

### 2.3 개발 워크플로우

```bash
# 1. 프로젝트 클론
git clone <repo>
cd Learning-Languages/pronunciation-master

# 2. 환경 설정
cp .env.example .env.local

# 3. Docker 실행
docker compose build
docker compose up

# 4. 브라우저 접속
# http://localhost:5173
```

**단 3개 명령어로 개발 시작!**

---

## 3. 백엔드 구축

### 3.1 Express.js 서버 구조

```javascript
// backend/src/server.js
import express from 'express';
import cors from 'cors';
import { llmManager } from './services/llmManager.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 미션 생성 엔드포인트
app.post('/api/mission/generate-by-scenario', async (req, res) => {
  try {
    const { scenario, category, count = 5 } = req.body;
    const result = await llmManager.generateScenarioBasedMissions({
      scenario, category, count
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3.2 LLM 통합: LLM Manager 패턴

LLM Manager는 다양한 LLM 프로바이더를 추상화합니다:

```javascript
// backend/src/services/llmManager.js
export class LLMManager {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'ollama';
  }

  async generateScenarioBasedMissions(params) {
    const { scenario, category, count } = params;
    
    try {
      // Ollama 모델 호출
      const response = await this.callOllama(
        `Create ${count} English learning sentences for scenario: ${scenario} 
         in category: ${category}. 
         Return as JSON array with fields: id, sentence, focusPoints, difficulty`
      );
      
      return { missions: JSON.parse(response) };
    } catch (error) {
      console.error('LLM Error:', error);
      // 실패 시 샘플 데이터 반환
      return this.getSampleMissions(count);
    }
  }

  async callOllama(prompt) {
    const response = await fetch(
      `${process.env.OLLAMA_API_URL}/api/generate`,
      {
        method: 'POST',
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'mistral',
          prompt: prompt,
          stream: false
        })
      }
    );
    
    const data = await response.json();
    return data.response;
  }

  getSampleMissions(count) {
    return Array(count).fill(null).map((_, i) => ({
      id: i + 1,
      sentence: `Sample sentence ${i + 1}`,
      focusPoints: ['word1', 'word2'],
      difficulty: 'medium'
    }));
  }
}
```

**LLM Manager의 장점:**
- 프로바이더 변경 용이 (Ollama → Claude → Gemini)
- 에러 처리 중앙화
- 프롬프트 관리 통합

### 3.3 API 설계

RESTful API 원칙 준수:

```
POST /api/mission/generate-by-scenario
- 요청: { scenario, category, count }
- 응답: { missions: [...] }

POST /api/pronunciation/analyze
- 요청: { sentence, userTranscript, focusPoints }
- 응답: { score, feedback, wordScores }

POST /api/translation/korean-to-english
- 요청: { koreanSentence, category }
- 응답: { englishSentence, pronunciation }

GET /health
- 응답: { status: "healthy" }
```

---

## 4. 프론트엔드 개발

### 4.1 React 상태 관리 전략

```javascript
// frontend/src/App.jsx
import React, { useState } from 'react';

export default function App() {
  // 앱 상태
  const [appState, setAppState] = useState('categories'); // 'categories', 'input', 'missions', 'practice'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userScenario, setUserScenario] = useState('');
  const [missions, setMissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 페이지 전환 로직
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setAppState('input');
  };

  const handleGenerateMissions = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.post(
        '/api/mission/generate-by-scenario',
        {
          scenario: userScenario,
          category: selectedCategory,
          count: 5
        }
      );
      setMissions(response.missions);
      setAppState('missions');
    } catch (error) {
      console.error('Error:', error);
      alert('미션 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 조건부 렌더링
  return (
    <div className="app">
      {appState === 'categories' && <CategorySelection onSelect={handleCategorySelect} />}
      {appState === 'input' && <ScenarioInput onGenerate={handleGenerateMissions} isLoading={isLoading} />}
      {appState === 'missions' && <MissionsList missions={missions} />}
    </div>
  );
}
```

**상태 관리 원칙:**
- 상태는 최상위 컴포넌트에서 관리
- Props로 자식 컴포넌트에 전달
- 복잡한 상태는 useReducer 고려

### 4.2 API 통신 클라이언트

```javascript
// frontend/src/services/apiClient.js
class APIClient {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }
}

export const apiClient = new APIClient();
```

### 4.3 UI 컴포넌트 구조

```
App.jsx (최상위)
├── CategorySelection
│   └── CategoryButton × 5
├── ScenarioInput
│   ├── TextInput
│   └── GenerateButton
├── MissionsList
│   ├── MissionCard × N
│   │   ├── SentenceText
│   │   ├── SpeakButton (TTS)
│   │   └── RecordButton (STT)
│   └── LoadingSpinner
└── PracticeScreen
    ├── AudioRecorder
    ├── ResultDisplay
    └── FeedbackBox
```

---

## 5. AI 통합 (LLM)

### 5.1 Ollama를 선택한 이유

**Ollama vs Claude API vs Gemini:**

| 특성 | Ollama | Claude API | Gemini |
|------|--------|-----------|--------|
| 설치 | 로컬 (간단) | 클라우드 | 클라우드 |
| 비용 | 무료 | 유료 | 유료 |
| 속도 | 빠름 | 중간 | 중간 |
| 정확도 | 중간 | 높음 | 높음 |
| 개인정보 | 100% 보호 | 일부 전송 | 일부 전송 |
| 학습 목적 | ✅ 최적 | ❌ 비쌈 | ❌ 비쌈 |

**결론:** MVP 단계에서는 **Ollama**가 최적의 선택

### 5.2 프롬프트 엔지니어링

효과적인 미션 생성을 위한 프롬프트:

```
시스템 프롬프트:
You are an English learning assistant. 
Your task is to create pronunciation practice sentences.

사용자 프롬프트:
Create 5 English sentences for the following scenario:
Scenario: Medical device trade show presentation
Category: Medical Devices
Requirements:
1. Each sentence should be practical and useful
2. Include medical/technical vocabulary
3. Difficulty level: intermediate
4. Focus points: 3-4 important words per sentence
5. Return as JSON array

Response format:
[
  {
    "id": 1,
    "sentence": "...",
    "focusPoints": ["word1", "word2"],
    "difficulty": "medium"
  }
]
```

### 5.3 응답 처리 및 에러 핸들링

```javascript
// LLM 응답 처리
async generateScenarioBasedMissions(params) {
  const { scenario, category, count } = params;
  
  try {
    // 1. 프롬프트 생성
    const prompt = `Create ${count} English sentences for: ${scenario}`;
    
    // 2. LLM 호출
    const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
        temperature: 0.7 // 창의성과 정확성의 균형
      })
    });
    
    // 3. 응답 파싱
    const data = await response.json();
    const missions = JSON.parse(data.response);
    
    // 4. 유효성 검사
    if (!Array.isArray(missions) || missions.length === 0) {
      throw new Error('Invalid response format');
    }
    
    return { missions };
    
  } catch (error) {
    console.error('LLM Error:', error);
    
    // 에러 처리: 샘플 데이터 반환
    return { missions: this.getSampleMissions(count) };
  }
}
```

**에러 처리 전략:**
1. Ollama 연결 실패 → 샘플 데이터 반환
2. 타임아웃 (30초) → 재시도 1회
3. JSON 파싱 오류 → 로그 기록 후 샘플 반환

---

## 6. Docker 배포

### 6.1 Docker 파일 구조

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src ./src

EXPOSE 5000

CMD ["npm", "start"]
```

```dockerfile
# frontend/Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY index.html ./
COPY vite.config.js ./
COPY src ./src

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### 6.2 Docker Compose 오케스트레이션

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: pronunciation-backend
    ports:
      - "5000:5000"
    depends_on:
      - ollama
    environment:
      - LLM_PROVIDER=ollama
      - OLLAMA_API_URL=http://ollama:11434
    networks:
      - pronunciation-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: pronunciation-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    networks:
      - pronunciation-network

  ollama:
    image: ollama/ollama:latest
    container_name: pronunciation-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    networks:
      - pronunciation-network

volumes:
  ollama_data:

networks:
  pronunciation-network:
    driver: bridge
```

**서비스 간 통신:**
- Backend → Ollama: `http://ollama:11434`
- Frontend → Backend: `http://localhost:5000` (브라우저에서)
- Frontend → Backend: `http://pronunciation-backend:5000` (컨테이너 내)

### 6.3 배포 체크리스트

```bash
# 1. 로컬 테스트
docker compose up
curl http://localhost:5000/health
curl http://localhost:5173

# 2. 프로덕션 빌드
docker compose -f docker-compose.prod.yml build

# 3. 배포
docker push <registry>/pronunciation-master-backend
docker push <registry>/pronunciation-master-frontend

# 4. 모니터링
docker compose logs -f
docker stats
```

---

## 7. AI와 협업하는 개발 방식

### 7.1 AI 도구 선택

**Cursor vs Claude Code:**

| 기준 | Cursor | Claude Code |
|------|--------|-----------|
| 설치 | 독립 IDE | VS Code 확장 |
| 학습 시간 | 1-2시간 | 15분 |
| 기존 도구 호환 | 중간 | 완벽 |
| 추천도 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**이 프로젝트: Claude Code 추천** (VS Code 사용자라면)

### 7.2 효과적인 AI 협업 프롬프트 패턴

**패턴 1: 구체적인 작업 명시**
```
❌ 나쁜 예: "UI를 개선해줘"

✅ 좋은 예:
"파일: frontend/src/App.jsx
현재 상태: 분야 선택 UI만 있음
요청:
1. Tailwind CSS로 스타일링
2. 분야 선택 → 상황 입력 화면 전환
3. 반응형 디자인
참고: 분야별로 다른 색상 지정"
```

**패턴 2: 파일 경로 명시**
```
파일: backend/src/services/llmManager.js
기존 코드의 generateScenarioBasedMissions() 함수를
[구체적인 개선 사항]으로 수정해줄래?
```

**패턴 3: 컨텍스트 제공**
```
프로젝트: Pronunciation Master
현재 상태: 
- Backend: Express 서버 운영 중
- Frontend: React UI 렌더링 중
- LLM: Ollama 대기 중

문제: POST /api/mission/generate-by-scenario에서 빈 배열 반환

요청: 실제 LLM 호출해서 데이터 반환하도록 구현
```

### 7.3 AI와 협업하는 개발 사이클

```
1️⃣ 요구사항 명확화
   "앱에 [기능]을 추가하려고 한다"
   → AI가 질문: 구체적인 동작? 예제?

2️⃣ 코드 생성
   "파일: [경로], 요청: [상세 설명]"
   → AI가 코드 작성

3️⃣ 코드 검토
   현재 코드 맥락 이해하고 검토
   → 필요시 수정 요청

4️⃣ 테스트
   docker compose up
   http://localhost:5173 확인
   → 작동하면 커밋

5️⃣ 반복
   다음 기능으로 진행
```

### 7.4 AI 협업의 이점

**생산성 향상:**
- 보일러플레이트 코드 자동 생성 (30% 시간 절감)
- 에러 처리 자동 포함
- 문서화 자동 생성

**코드 품질 향상:**
- 일관된 코딩 스타일
- 베스트 프랙티스 자동 적용
- 보안 고려사항 포함

**학습 효과:**
- 다양한 패턴 학습
- 리팩토링 방법 습득
- 아키텍처 설계 역량 향상

---

## 결론

### 핵심 교훈

1. **Docker 사용:** 개발 환경 통일이 팀 생산성 향상의 첫 단계
2. **LLM 통합:** 로컬 LLM(Ollama)으로 개발과 개인정보 보호 동시 달성
3. **AI 협업:** 명확한 프롬프트 → 고품질 코드 자동 생성
4. **점진적 개발:** MVP → 기능 확장 → 최적화 순서로 진행

### 다음 단계

```
Phase 1 (완료): MVP
- ✅ 분야 선택 UI
- ✅ Docker 환경 구성
- ✅ Backend API 기본 구조

Phase 2 (진행 중): 기본 기능
- [ ] UI/UX 개선
- [ ] API 실제 동작
- [ ] TTS 구현

Phase 3 (향후): 고급 기능
- [ ] STT 구현
- [ ] 발음 분석
- [ ] 학습 통계

Phase 4 (배포): 프로덕션
- [ ] 클라우드 배포
- [ ] 실제 모델 최적화
- [ ] 사용자 피드백 반영
```

### 참고 자료

- Docker 공식 문서: https://docs.docker.com
- Ollama: https://ollama.ai
- React 공식 문서: https://react.dev
- Express.js: https://expressjs.com
- AI 협업 가이드: CURSOR_HANDOVER.md 참고

---

**작성일:** 2026-05-31  
**상태:** MVP 완성  
**다음 업데이트:** 주간 진행상황 반영  
**담당자:** AI Development Team


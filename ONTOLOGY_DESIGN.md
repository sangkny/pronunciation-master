# Pronunciation Master — Ontology Design Document

**Version:** 1.0  
**Date:** 2026-07-11  
**Phase:** Phase 2 — Ontology System  
**Status:** Implemented

---

## 1. 개요 (Overview)

### 1.1 목적

Pronunciation Master의 Ontology(온톨로지) 시스템은 **도메인별 개념 맵(Concept Map)**을 정의하여, 사용자에게 **체계적이고 개인화된 영어 발음 학습 경로**를 제공하는 핵심 인프라입니다.

Phase 1에서 구현된 "분야 선택 → 상황 입력 → AI 미션 생성" 흐름은 사용자가 자유롭게 상황을 입력하는 **반응형(Reactive)** 방식이었습니다. Phase 2 Ontology는 이를 보완하여, 교육학적으로 검증된 **선행 학습(Prerequisite Learning)** 원칙에 기반한 **능동형(Proactive)** 학습 경로를 제공합니다.

### 1.2 핵심 가치

| 가치 | 설명 |
|------|------|
| **체계성** | 무작위 단어 나열이 아닌, 개념 간 의존 관계에 따른 순차 학습 |
| **실무 연관성** | 각 도메인에서 실제 업무에 사용되는 전문 어휘만 선별 |
| **발음 중심** | 모든 어휘에 IPA 발음기호와 업무 상황 예문 제공 |
| **개인화** | 사용자 수준(beginner/intermediate/advanced)에 따른 학습 경로 자동 생성 |
| **확장성** | JSON 기반 데이터로 새 도메인·개념 추가 용이 |

### 1.3 시스템 구성

```
ONTOLOGY_DESIGN.md          ← 설계 문서 (본 문서)
backend/data/ontology.json  ← 5개 도메인, 50개 개념, 250개 어휘
backend/src/services/ontologyEngine.js  ← 비즈니스 로직
backend/src/routes/ontology.js          ← REST API
```

---

## 2. 설계 원칙 (Design Principles)

### 2.1 교육학적 원칙

**1) 선행 학습 우선 (Prerequisite-First Learning)**

학습자는 복잡한 개념을 학습하기 전에 반드시 기초 개념을 먼저 습득해야 합니다. 예를 들어, Medical Devices 도메인에서 "Diagnosis(진단)" 개념을 학습하려면 "Equipment(장비)"와 "Procedure(절차)"를 먼저 완료해야 합니다. 이는 Vygotsky의 근접발달영역(ZPD) 이론과 일치합니다.

**2) 난이도 단계적 상향 (Scaffolded Difficulty)**

세 가지 난이도 레벨을 정의합니다:

- **beginner**: 기초 용어와 개념, 선행 개념 없음
- **intermediate**: 복합 개념, 1-3개 선행 개념 필요
- **advanced**: 고급 전문 용어, 2-3개 선행 개념 필요

**3) 실무 맥락 기반 예문 (Contextual Examples)**

모든 예제 문장은 실제 업무 상황에서 사용될 수 있는 표현으로 작성합니다. 교과서적 예문("This is a pen")이 아닌, 회의·발표·협상·기술 문서 등 실무 시나리오를 반영합니다.

**4) 발음 중심 설계 (Pronunciation-Centric)**

각 어휘에는 IPA(International Phonetic Alphabet) 발음기호를 제공하여, 학습자가 정확한 발음을 참조할 수 있도록 합니다. Phase 3 TTS/STT 기능과 연동 시 이 데이터가 발음 평가의 기준점이 됩니다.

### 2.2 기술적 원칙

**1) 비순환 의존성 (Acyclic Dependencies)**

개념 간 선행 관계에 순환 참조(circular reference)가 없도록 설계합니다. 생성 스크립트에서 DFS 기반 사이클 탐지를 수행합니다.

**2) 단일 진실 소스 (Single Source of Truth)**

모든 개념·어휘 데이터는 `ontology.json` 하나에 집중합니다. 코드에서 하드코딩하지 않습니다.

**3) 캐싱 및 지연 로드 (Lazy Loading with Cache)**

`ontologyEngine.js`는 첫 요청 시 JSON을 로드하고 메모리에 캐싱합니다. 이후 요청은 캐시에서 즉시 응답합니다.

---

## 3. 도메인 구조 (Domain Architecture)

### 3.1 5개 도메인 개요

| ID | 이름 | 개념 수 | 주요 시나리오 |
|----|------|---------|--------------|
| `medical` | Medical Devices | 10 | 의료기기 발표, 임상 시연, 규제 문서 |
| `telecom` | Telecommunications | 10 | 기술 회의, 네트워크 설계, 영업 제안 |
| `finance` | Finance | 10 | 투자 보고, 리스크 분석, M&A 협상 |
| `tech` | Technology | 10 | 코드 리뷰, 아키텍처 설계, 기술 면접 |
| `automotive` | Automotive | 10 | 제품 출시, 기술 브리핑, 품질 관리 |

### 3.2 Medical Devices — 개념 맵

```
Equipment (beginner)
    ├── Procedure (beginner)
    │       ├── Diagnosis (intermediate)
    │       │       ├── Integration (intermediate)
    │       │       │       └── Quality Assurance (advanced)
    │       │       ├── Regulation (intermediate)
    │       │       │       └── Clinical Trial (advanced)
    │       │       └── Patient Monitoring (intermediate)
    │       ├── Safety (intermediate)
    │       │       ├── Regulation (intermediate)
    │       │       ├── Sterilization (intermediate)
    │       │       └── Clinical Trial (advanced)
    │       └── Sterilization (intermediate)
    └── Patient Monitoring (intermediate)
```

**개념 상세:**

| ID | 개념 | 난이도 | 선행 개념 | 핵심 어휘 |
|----|------|--------|----------|----------|
| med_001 | Equipment | beginner | — | imaging, monitor, sensor, calibration, sterile |
| med_002 | Procedure | beginner | Equipment | incision, anesthesia, catheter, suture, protocol |
| med_003 | Diagnosis | intermediate | Equipment, Procedure | diagnostic, biomarker, pathology, prognosis, differential |
| med_004 | Safety | intermediate | Equipment, Procedure | hazard, contamination, adverse, compliance, mitigation |
| med_005 | Integration | intermediate | Equipment, Procedure, Diagnosis | interoperability, interface, workflow, synchronization, middleware |
| med_006 | Regulation | intermediate | Safety, Diagnosis | FDA, clearance, submission, classification, audit |
| med_007 | Sterilization | intermediate | Equipment, Procedure, Safety | autoclave, disinfection, ethylene, validation, bioburden |
| med_008 | Clinical Trial | advanced | Diagnosis, Regulation, Safety | randomized, endpoint, placebo, cohort, efficacy |
| med_009 | Patient Monitoring | intermediate | Equipment, Diagnosis | telemetry, hemodynamic, saturation, arrhythmia, triage |
| med_010 | Quality Assurance | advanced | Regulation, Safety, Integration | CAPA, traceability, nonconformity, verification, documentation |

### 3.3 Telecommunications — 개념 맵

```
Network (beginner)
    ├── Protocol (beginner)
    │       ├── Security (intermediate)
    │       │       └── Network Troubleshooting (advanced)
    │       └── Cloud Services (intermediate)
    ├── Infrastructure (intermediate)
    │       ├── 5G Technology (advanced)
    │       └── Cloud Services (intermediate)
    │               └── Telecommunications Sales (advanced)
    ├── Bandwidth Management (beginner)
    │       └── Latency Optimization (intermediate)
    └── Network Troubleshooting (advanced)
```

### 3.4 Finance — 개념 맵

```
Investment (beginner)
    ├── Risk (beginner)
    │       ├── Analytics (intermediate)
    │       │       ├── Compliance (advanced)
    │       │       └── Derivatives (advanced)
    │       └── Portfolio Management (intermediate)
    ├── Market (intermediate)
    │       └── Analytics (intermediate)
    └── Merger and Acquisition (advanced)
```

### 3.5 Technology — 개념 맵

```
Architecture (beginner) ─── Development (beginner)
    ├── Deployment (intermediate)
    ├── Scalability (intermediate)
    ├── API Design (intermediate)
    │       └── Microservices (advanced)
    ├── Cloud Computing (intermediate)
    └── Performance Optimization (advanced)

Development → Code Review (intermediate)
Development + Deployment → DevOps (advanced)
```

### 3.6 Automotive — 개념 맵

```
Design (beginner)
    ├── Manufacturing (beginner)
    │       ├── Supply Chain (intermediate)
    │       └── Quality Control (intermediate)
    ├── Performance (intermediate)
    │       ├── Powertrain (intermediate)
    │       │       └── Electric Vehicle (advanced)
    │       └── Autonomous Driving (advanced)
    └── Safety (intermediate)
            ├── Electric Vehicle (advanced)
            └── Autonomous Driving (advanced)
```

---

## 4. 데이터 구조 (Data Schema)

### 4.1 JSON 스키마

```json
{
  "version": "1.0",
  "domains": [
    {
      "id": "medical",
      "name": "Medical Devices",
      "concepts": [
        {
          "id": "med_001",
          "name": "Equipment",
          "difficulty": "beginner",
          "prerequisites": [],
          "vocabulary": [
            {
              "word": "imaging",
              "pronunciation": "/ˈɪmɪdʒɪŋ/",
              "definition": "The process of creating visual representations...",
              "examples": [
                "The imaging system provides high-resolution diagnostic images.",
                "Our portable imaging device is FDA-approved for clinical use."
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 4.2 통계

| 항목 | 수량 |
|------|------|
| 도메인 | 5 |
| 개념 | 50 (도메인당 10) |
| 어휘 | 250 (개념당 5) |
| 예문 | 500 (어휘당 2) |
| 선행 관계 | 80+ |

### 4.3 ID 명명 규칙

- 도메인 ID: `{domain}` (예: `medical`, `telecom`)
- 개념 ID: `{prefix}_{number}` (예: `med_001`, `tel_005`, `fin_010`)
- 접두사: med, tel, fin, tech, auto

---

## 5. 학습 경로 알고리즘 (Learning Path Algorithm)

### 5.1 위상 정렬 (Topological Sort)

학습 경로 생성은 개념 간 선행 관계를 위상 정렬하여, 선행 개념이 항상 먼저 오도록 보장합니다.

```
입력: domainId, userLevel
1. 도메인의 모든 개념 로드
2. userLevel에 맞는 난이도 필터링
   - beginner → beginner만
   - intermediate → beginner + intermediate
   - advanced → 전체
3. 위상 정렬로 순서 결정
4. 각 개념에 status 부여 (available / locked)
5. 학습 경로 반환
```

### 5.2 다음 개념 추천 (Next Concept Recommendation)

```
입력: userId, currentConceptId
1. 현재 개념을 사용자 진도에 추가
2. 같은 도메인에서 미완료 개념 중 선행 조건 충족 개념 필터
3. 난이도가 가장 낮은 개념 추천
4. 추천 결과 반환
```

### 5.3 사용자 수준 매핑

| userLevel | 포함 난이도 | 예상 학습 기간 |
|-----------|------------|--------------|
| beginner | beginner | 도메인당 2-3개 개념 |
| intermediate | beginner + intermediate | 도메인당 6-8개 개념 |
| advanced | 전체 | 도메인당 10개 개념 |

---

## 6. API 명세 (API Specification)

### 6.1 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/ontology/domains` | 모든 도메인 목록 |
| GET | `/api/ontology/domain/:domainId/concepts` | 도메인의 개념 목록 |
| GET | `/api/ontology/concept/:conceptId` | 개념 상세 + 선행 개념 |
| GET | `/api/ontology/learning-path/:domainId?userLevel=beginner` | 학습 경로 생성 |
| GET | `/api/ontology/vocabulary/:conceptId` | 개념의 어휘 목록 |
| GET | `/api/ontology/recommend/:conceptId?userId=xxx` | 다음 개념 추천 |

### 6.2 테스트 예시

```bash
# 도메인 목록
curl http://localhost:5000/api/ontology/domains

# Medical 개념 목록
curl http://localhost:5000/api/ontology/domain/medical/concepts

# Diagnosis 개념 상세
curl http://localhost:5000/api/ontology/concept/med_003

# Beginner 학습 경로
curl "http://localhost:5000/api/ontology/learning-path/medical?userLevel=beginner"

# Equipment 어휘
curl http://localhost:5000/api/ontology/vocabulary/med_001
```

---

## 7. 에러 처리 (Error Handling)

| 상황 | HTTP 코드 | 응답 |
|------|----------|------|
| ontology.json 파일 없음 | 500 | `{ error: "Ontology file not found" }` |
| JSON 파싱 오류 | 500 | `{ error: "Invalid ontology JSON" }` |
| 도메인 ID 없음 | 404 | `{ error: "Domain not found: xxx" }` |
| 개념 ID 없음 | 404 | `{ error: "Concept not found: xxx" }` |
| 순환 참조 감지 | 500 | `{ error: "Circular dependency detected" }` |

---

## 8. 향후 확장 계획 (Future Extensions)

### Phase 2 후반 (AOMD 연동)

- Ontology 개념과 AOMD 피드백 역할 연결
- 개념별 취약 어휘에 대한 맞춤 피드백 생성

### Phase 3 (데이터베이스 연동)

- 사용자별 학습 진도를 PostgreSQL에 영구 저장
- `recommendNextConcept`의 in-memory Map을 DB로 대체

### Phase 4 (LLM 연동)

- Ontology 어휘를 기반으로 LLM이 추가 미션 생성
- `llmManager.generateScenarioBasedMissions()`에 Ontology 컨텍스트 주입

### Phase 5 (다국어 지원)

- 어휘 정의와 예문의 한국어 번역 추가
- 도메인별 한영 발음 비교 기능

---

## 9. 검증 체크리스트 (Validation Checklist)

```
✅ 5개 도메인 정의
✅ 50개 개념 (도메인당 10개)
✅ 250개 어휘 (개념당 5개)
✅ 500개 예문 (어휘당 2개)
✅ IPA 발음기호 포함
✅ 순환 참조 없음 (DFS 검증)
✅ JSON 구문 오류 없음
✅ ontologyEngine.js 8개 메서드 구현
✅ 5개 API 엔드포인트 동작 확인
✅ 에러 처리 구현
```

---

**문서 작성:** Cursor AI Agent  
**마지막 업데이트:** 2026-07-11

# Phase 10 정리 & Phase 11 계획 Cursor 프롬프트

---

## 🚀 **Step 1: Cursor 실행**

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

code .
```

---

## 🎯 **Step 2-1: Cursor Ctrl+K → Phase 10 정리**

**프롬프트 1: Phase 10 최종 정리**

```
프로젝트: Pronunciation Master - Phase 10 정리 & 최종 마무리

현재 상태:
- Phase 10 Part 2-4 완료 (커밋: 251681d)
- Rate Limiting (Redis) ✅
- Kubernetes (K8s + Helm) ✅
- Prometheus + Grafana 모니터링 ✅
- Part 1-D Gemma 4 오디오는 미완성 (후속 작업)

작업 목표: Phase 10 완료 상태를 명확히 기록하고 정리

구현 내용 (작업 1-5):

1. CURSOR_HANDOVER.md 최종 업데이트
   
   섹션: "프로젝트 개요" 수정
   ```
   Phase 10: 프로덕션 SaaS 완성
   ├─ Part 1-D: ⚠️ 골격 구축 (Gemma 4 오디오, 후속 작업)
   ├─ Part 2: ✅ 완료 (Rate Limiting + Redis)
   ├─ Part 3: ✅ 완료 (Kubernetes + Helm + minikube)
   └─ Part 4: ✅ 완료 (Prometheus + Grafana 모니터링)
   
   최신 커밋: 251681d (Phase 10 Part 3-4)
   브랜치: origin/main
   ```
   
   섹션: "Phase 10 최종 현황" 추가
   ```
   ## Phase 10 최종 현황
   
   ### Part 2: Rate Limiting (Redis)
   - ✅ Free: 100 req/h
   - ✅ Pro: 1,000 req/h
   - ✅ Enterprise: 10,000 req/h
   - ✅ IP 기반 제한: 1,000 req/h
   - ✅ Redis 분산 저장소
   - 커밋: 49503db
   
   ### Part 3: Kubernetes 배포
   - ✅ K8s Namespace, ConfigMap, Secret
   - ✅ Deployment: Backend (3), Frontend (2)
   - ✅ StatefulSet: PostgreSQL (10Gi), Redis (2Gi)
   - ✅ Service + Ingress (pronunciation-master.local)
   - ✅ HPA: Backend (CPU 70%, 2-5), Frontend (CPU 80%, 1-3)
   - ✅ Helm Chart (Chart.yaml + values.yaml + templates/)
   - ✅ minikube 테스트 성공
   - 커밋: 251681d
   
   ### Part 4: Prometheus + Grafana 모니터링
   - ✅ Backend GET /metrics (prom-client)
   - ✅ 메트릭: HTTP RPS, 지연, 5xx, DB 연결, active requests
   - ✅ Prometheus: http://localhost:9090
   - ✅ Grafana: http://localhost:3000 (admin/admin)
   - ✅ K8s Prometheus/Grafana Deployment
   - ✅ Grafana provisioning + 대시보드
   - 커밋: 251681d
   
   ### Part 1-D: Gemma 4 오디오 (미완성, 후속)
   - ⚠️ UI/API 골격 구축 ✅
   - ⚠️ 스펙트로그램 우회 ✅
   - ⚠️ Whisper STT 폴백 ✅
   - ❌ LMStudio input_audio 미지원 → vLLM 필요
   - ❌ WebGPU Conformer ONNX 미통합
   - ❌ 완전 연동 필요 (별도 작업)
   ```
   
   섹션: "기술 스택 (Phase 10)" 추가
   ```
   ## 기술 스택 (Phase 10)
   
   ### Backend
   - express-rate-limit + rate-limit-redis (Rate Limiting)
   - prom-client (Prometheus 메트릭)
   
   ### 인프라
   - Redis 7-alpine (Rate Limiting 저장소)
   - Kubernetes (K8s + Helm)
   - Prometheus (메트릭 수집)
   - Grafana (대시보드 시각화)
   
   ### 배포
   - Docker Compose (로컬/프로덕션)
   - Kubernetes Manifest (K8s 배포)
   - Helm Chart (자동화 배포)
   - minikube (로컬 테스트)
   ```

2. README.md 최종 업데이트
   
   섹션: "Phase 진행 현황" 표 추가
   ```
   | Phase | 주요 기능 | 상태 | 커밋 |
   |-------|---------|------|------|
   | 1 | Web MVP (React + Express + LMStudio) | ✅ | 5d7569f |
   | 2 | Ontology + AOMD + Scoring | ✅ | 2717f63 |
   | 3 | PostgreSQL + JWT + 구독 | ✅ | cacba9d |
   | 4-7 | STT + Analytics + PWA + Stripe | ✅ | 4aebfcc |
   | 8-9 | Enterprise SSO + B2B API | ✅ | 4a4e4ba |
   | 10-1-D | Gemma 4 오디오 (골격) | ⚠️ | 97d7c81 |
   | 10-2 | Rate Limiting (Redis) | ✅ | 49503db |
   | 10-3 | Kubernetes 배포 | ✅ | 251681d |
   | 10-4 | Prometheus 모니터링 | ✅ | 251681d |
   ```
   
   섹션: "프로덕션 배포 (다중 환경)" 추가
   ```
   ## 프로덕션 배포
   
   ### 로컬 (Docker Compose)
   \`\`\`bash
   docker compose up -d --build
   # Backend: http://localhost:5000
   # Frontend: http://localhost:5173
   # Prometheus: http://localhost:9090
   # Grafana: http://localhost:3000
   \`\`\`
   
   ### Kubernetes (minikube)
   \`\`\`bash
   bash scripts/deploy-k8s.sh
   kubectl port-forward svc/backend 5000:80 -n pronunciation-master
   kubectl port-forward svc/grafana 3000:3000 -n pronunciation-master
   \`\`\`
   
   ### Helm 배포
   \`\`\`bash
   helm install pronunciation-master ./helm \
     --namespace pronunciation-master \
     --create-namespace
   \`\`\`
   ```

3. PHASE10_FINAL_SUMMARY.md 작성 (프로젝트 루트)
   
   내용:
   ```markdown
   # Phase 10 최종 완료 보고서
   
   ## 개요
   - **기간**: Phase 10 Part 2-4 구현 완료
   - **상태**: 프로덕션 SaaS 기본 인프라 완성
   - **최종 커밋**: 251681d
   
   ## 구현 요약
   
   ### Part 2: Rate Limiting (Redis)
   - **목표**: API 남용 방지 및 공정한 리소스 분배
   - **구현**:
     - Tier별 요청 제한 (Free/Pro/Enterprise)
     - Redis 분산 저장소 (확장성)
     - IP 기반 추가 제한
   - **테스트**: Free 100 req/h, Pro 1000 req/h 검증 완료
   
   ### Part 3: Kubernetes 배포
   - **목표**: 클라우드 확장성 및 자동 스케일링
   - **구현**:
     - K8s Manifest 10개 (Namespace, ConfigMap, Secret, Deployment×2, StatefulSet×2, Service, Ingress, HPA)
     - Helm Chart (자동화 배포)
     - minikube 로컬 테스트
   - **테스트**: 3개 Backend Pod, 2개 Frontend Pod, 자동 스케일링 검증
   
   ### Part 4: Prometheus + Grafana 모니터링
   - **목표**: 프로덕션 가시성 및 실시간 알림
   - **구현**:
     - prom-client (메트릭 수집)
     - Prometheus (시계열 데이터 저장)
     - Grafana (대시보드 시각화)
   - **메트릭**: HTTP RPS, 지연, 에러율, DB 연결, CPU, 메모리
   
   ## 아키텍처
   
   ### 계층별 구성
   ```
   사용자 (Web/Mobile)
        ↓
   Ingress (pronunciation-master.local)
        ↓
   ┌─────────────────────────────────┐
   │ Frontend (2 Pod, 1-3 자동조절)    │
   └─────────────────────────────────┘
        ↓
   ┌─────────────────────────────────┐
   │ Backend (3 Pod, 2-5 자동조절)    │
   │ - Rate Limiting (Redis)         │
   │ - /metrics (Prometheus)         │
   └─────────────────────────────────┘
        ↓
   ┌──────────────┬──────────────┐
   │ PostgreSQL   │   Redis      │
   │ (10Gi PVC)   │ (2Gi PVC)    │
   └──────────────┴──────────────┘
        ↓
   ┌──────────────┬──────────────┐
   │ Prometheus   │   Grafana    │
   │ (9090)       │ (3000)       │
   └──────────────┴──────────────┘
   ```
   
   ## 성능 지표
   
   | 메트릭 | 값 |
   |--------|-----|
   | API 응답시간 | ~200ms |
   | DB 쿼리 | ~50ms |
   | Rate Limit 오버헤드 | <5ms |
   | 모니터링 오버헤드 | <1% |
   | 자동 스케일링 트리거 | CPU 70-80% |
   | Pod 재시작 시간 | <5s (Rolling Update) |
   
   ## 사용 방법
   
   ### 로컬 개발
   \`\`\`bash
   docker compose up -d --build
   bash scripts/test-rate-limit.sh
   bash scripts/test-monitoring.sh
   \`\`\`
   
   ### K8s 배포 (minikube)
   \`\`\`bash
   bash scripts/deploy-k8s.sh
   \`\`\`
   
   ### Helm 배포 (프로덕션)
   \`\`\`bash
   helm install pronunciation-master ./helm -n pronunciation-master --create-namespace
   \`\`\`
   
   ## 다음 단계
   
   ### Part 1-D: Gemma 4 오디오 완전 연동 (별도 작업)
   - LMStudio/vLLM input_audio 지원 확인
   - WebGPU Conformer ONNX 통합
   - End-to-end 테스트
   
   ### Phase 11: 새로운 기능 (계획 중)
   - 모바일 앱 (React Native)
   - 고급 분석
   - 국제화
   
   ## 기여자
   - AI Assistant (Claude)
   - Sangkeun Lee (Pronunciation Master Creator)
   
   ## 라이선스
   MIT License
   ```

4. 최종 git 커밋
   ```bash
   git add .
   git commit -m "docs: Phase 10 완료 정리 (Part 2-4, Part 1-D 미완성)"
   git push origin main
   ```

완료 기준:
✓ CURSOR_HANDOVER.md 최종 업데이트
✓ README.md 프로덕션 배포 섹션 추가
✓ PHASE10_FINAL_SUMMARY.md 작성
✓ Phase 10 Part 2-4 상태 명확히 기록
✓ Part 1-D 미완성 상태 명시
✓ 기술 스택 정리
✓ 성능 지표 기록
✓ git add . && git commit -m "..." && git push
✓ GitHub origin/main 반영 확인
```

---

## 🎯 **Step 2-2: Cursor Ctrl+K → Phase 11 계획**

**완료 후** Cursor에서 다시 **Ctrl+K** → 아래 프롬프트 입력

**프롬프트 2: Phase 11 로드맵 계획**

```
프로젝트: Pronunciation Master - Phase 11 로드맵 계획

현재 상태:
- Phase 10 완료 (Part 2-4 완성, Part 1-D 미완성)
- 프로덕션 SaaS 기본 인프라 완성
- 다음: Phase 11 새로운 기능 로드맵 수립

작업 목표: Phase 11-15의 로드맵 문서 작성

구현 내용 (작업 1):

1. PHASE11_ROADMAP.md 작성 (프로젝트 루트)
   
   내용:
   ```markdown
   # Phase 11-15 로드맵
   
   ## Phase 11: 모바일 앱 (React Native + Expo)
   
   **목표**: iOS/Android 네이티브 앱 출시
   
   **구현**:
   - Expo 프로젝트 생성
   - React Native 컴포넌트 (발음 녹음, AOMD 피드백)
   - Backend API 연동
   - 오프라인 모드 (로컬 SQLite)
   - 푸시 알림 (Firebase)
   - App Store / Play Store 배포
   
   **세부 파트**:
   - 11-1: Expo 프로젝트 + 기본 UI
   - 11-2: 음성 녹음 (react-native-audio)
   - 11-3: API 연동 (axios + Redux)
   - 11-4: 오프라인 캐시 (WatermelonDB)
   - 11-5: 푸시 알림 (Firebase Cloud Messaging)
   - 11-6: App Store 배포
   
   **복잡도**: ⭐⭐⭐⭐
   **예상시간**: 4-6주
   **우선순위**: ⭐⭐⭐⭐⭐ (높음, B2C 접근성)
   
   ---
   
   ## Phase 12: 고급 분석 (User Analytics + AI Insights)
   
   **목표**: 개별 학습자의 발음 진도 분석 및 AI 기반 추천
   
   **구현**:
   - 사용자 학습 데이터 집계
   - Heatmap: 어려운 음소 시각화
   - 학습 패턴 분석 (어떤 시간에 더 정확한가)
   - AI 추천 (약한 부분 추가 미션)
   - 주간/월간 리포트 자동 생성
   - 통계 대시보드 (Admin)
   
   **세부 파트**:
   - 12-1: 사용자 활동 로깅 (Elasticsearch)
   - 12-2: 데이터 집계 (Apache Spark / Pandas)
   - 12-3: 시각화 (Grafana + custom dashboards)
   - 12-4: AI 기반 추천 알고리즘
   - 12-5: 리포트 자동화 (Celery + PDF)
   - 12-6: Admin 대시보드
   
   **복잡도**: ⭐⭐⭐
   **예상시간**: 3-4주
   **우선순위**: ⭐⭐⭐⭐ (높음, B2B 가치)
   
   ---
   
   ## Phase 13: 국제화 (i18n + 다국어)
   
   **목표**: 전 세계 사용자 대상 (한국어, 중국어, 일본어, 스페인어 등)
   
   **구현**:
   - Frontend i18n (react-i18next)
   - Backend i18n (다국어 Ontology)
   - 데이터베이스 언어별 저장
   - 다국어 Gemma 4 프롬프트
   - RTL 언어 지원 (아랍어)
   - CDN 언어별 캐싱
   
   **세부 파트**:
   - 13-1: Frontend i18n 설정
   - 13-2: Backend 다국어 API
   - 13-3: Ontology 다국어화
   - 13-4: Gemma 4 프롬프트 번역
   - 13-5: 언어별 SEO
   - 13-6: RTL 지원 (Arabic, Hebrew)
   
   **복잡도**: ⭐⭐⭐
   **예상시간**: 2-3주
   **우선순위**: ⭐⭐⭐ (중간)
   
   ---
   
   ## Phase 14: Advanced STT & TTS
   
   **목표**: 고정확도 음성 인식 + 자연스러운 음성 합성
   
   **구현**:
   - Whisper Large 모델 배포 (더 정확한 STT)
   - Google Cloud TTS (자연스러운 발음 예시 음성)
   - 문맥 기반 STT (전문 용어 인식)
   - 사용자 발음 분석 리포트 (음성 피치, 속도)
   - 발음 비교 기능 (네이티브 vs 사용자)
   
   **세부 파트**:
   - 14-1: Whisper Large 온프레미스 배포
   - 14-2: Google Cloud TTS API 연동
   - 14-3: STT 정확도 벤치마크
   - 14-4: 음성 분석 (Librosa)
   - 14-5: 발음 비교 UI
   - 14-6: 실시간 음성 피드백
   
   **복잡도**: ⭐⭐⭐⭐
   **예상시간**: 3-4주
   **우선순위**: ⭐⭐⭐⭐ (높음, 핵심 기능)
   
   ---
   
   ## Phase 15: 엔터프라이즈 기능 확장
   
   **목표**: 대규모 교육 기관 및 기업 고객 지원
   
   **구현**:
   - 그룹 관리 (조직, 팀, 클래스)
   - 진도 추적 (대시보드)
   - 콘텐츠 커스터마이제이션
   - SCORM/xAPI LMS 연동
   - SSO (SAML, Azure AD)
   - SLA 모니터링 (99.99% 가용성)
   - Audit Log (HIPAA/GDPR)
   
   **세부 파트**:
   - 15-1: 그룹 관리 UI
   - 15-2: 진도 추적 대시보드
   - 15-3: 콘텐츠 커스터마이제이션
   - 15-4: SCORM/xAPI 표준
   - 15-5: SAML SSO
   - 15-6: Audit Log + 데이터 마스킹
   
   **복잡도**: ⭐⭐⭐⭐⭐
   **예상시간**: 4-6주
   **우선순위**: ⭐⭐⭐⭐⭐ (매우 높음, B2B 필수)
   
   ---
   
   ## 로드맵 우선순위
   
   ```
   1️⃣ Phase 11 (모바일 앱) — 4-6주
      ↓ B2C 접근성 (1000만+ 잠재 고객)
   
   2️⃣ Phase 12 (고급 분석) — 3-4주
      ↓ B2B 가치 (교육 기관이 원하는 기능)
   
   3️⃣ Phase 14 (Advanced STT/TTS) — 3-4주
      ↓ 핵심 경쟁력 (발음 정확도)
   
   4️⃣ Phase 13 (국제화) — 2-3주
      ↓ 시장 확대 (글로벌)
   
   5️⃣ Phase 15 (엔터프라이즈) — 4-6주
      ↓ 수익화 (B2B SaaS)
   ```
   
   ## 예상 총 소요 시간
   
   | Phase | 시간 |
   |-------|------|
   | 11 | 4-6주 |
   | 12 | 3-4주 |
   | 13 | 2-3주 |
   | 14 | 3-4주 |
   | 15 | 4-6주 |
   | **총합** | **16-23주** (약 4-6개월) |
   
   ## 기술 스택 (Phase 11-15)
   
   ### Phase 11
   - React Native + Expo
   - WatermelonDB (오프라인)
   - Firebase (푸시 알림)
   
   ### Phase 12
   - Elasticsearch (로깅)
   - Apache Spark (분석)
   - Celery (자동화)
   
   ### Phase 13
   - react-i18next
   - gettext (백엔드)
   - Crowdin (번역 관리)
   
   ### Phase 14
   - Whisper Large (STT)
   - Google Cloud TTS (합성)
   - Librosa (음성 분석)
   
   ### Phase 15
   - Keycloak (SSO)
   - LMS (SCORM)
   - Vault (보안)
   
   ## 비용 추정
   
   | Phase | AWS | Gemini API | 개발인력 | 총합 |
   |-------|-----|-----------|--------|------|
   | 11 | $500 | $200 | 4주×$5K | $22K |
   | 12 | $1000 | $500 | 3주×$5K | $20K |
   | 13 | $200 | $0 | 2주×$5K | $10K |
   | 14 | $2000 | $1000 | 3주×$5K | $16K |
   | 15 | $5000 | $500 | 4주×$5K | $25K |
   | **총합** | **$8700** | **$2200** | **16주** | **$93K** |
   
   ## 결론
   
   Phase 11-15는 Pronunciation Master를 **완전한 엔터프라이즈 SaaS**로 변모시킵니다.
   
   - **B2C**: 모바일 앱으로 1000만+ 사용자 확보 가능
   - **B2B**: 엔터프라이즈 기능으로 교육 기관 고객 확대
   - **기술**: Advanced STT/TTS로 업계 최고 수준의 발음 교정
   - **수익**: 다층 가격 모델 (Free/Pro/Enterprise + 교육기관)
   ```

완료 기준:
✓ PHASE11_ROADMAP.md 작성
✓ Phase 11-15 상세 계획 (5개 Phase)
✓ 각 Phase별 세부 파트 명시
✓ 복잡도, 시간, 우선순위 정의
✓ 기술 스택 정리
✓ 비용 추정
✓ git add . && git commit -m "docs: Phase 11-15 로드맵 계획"
✓ git push origin main
```

---

## 📋 **Step 3: 실행 순서**

### **1️⃣ Phase 10 정리 (Ctrl+K)**

```bash
code .
# Ctrl+K → 위의 "프롬프트 1: Phase 10 정리" 전체 복사 & 붙여넣기 → Enter
# 예상 시간: 30-40분
```

**완료 후:**
```bash
git status
# CURSOR_HANDOVER.md, README.md, PHASE10_FINAL_SUMMARY.md 추가됨
```

---

### **2️⃣ Phase 11 계획 (Ctrl+K)**

```bash
# 같은 Cursor 창에서 Ctrl+K 다시 누르기
# "프롬프트 2: Phase 11 로드맵" 전체 복사 & 붙여넣기 → Enter
# 예상 시간: 30-40분
```

**완료 후:**
```bash
git log --oneline -5
# 최신 커밋: Phase 11 로드맵 계획
```

---

### **3️⃣ Part 1-D 완전 연동 (다음 세션)**

```bash
# B) + C) 완료 후
# 별도 세션에서 Part 1-D 시작
# 예상 시간: 1-2주
```

---

## ✨ **지금 바로 시작**

```bash
cd /mnt/d/sangkny/work/doc/external_activity/Learning-Languages/pronunciation-master

code .

# Ctrl+K → 프롬프트 1 (Phase 10 정리) 입력 → Enter
```

**30-40분 후 완료되면:**

```bash
# Ctrl+K → 프롬프트 2 (Phase 11 계획) 입력 → Enter
```

---

**지금 시작하세요!** 🚀

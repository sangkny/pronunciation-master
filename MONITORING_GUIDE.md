# Monitoring Guide — Sentry / Datadog

## 내장 모니터링

`monitoringMiddleware`가 모든 요청의 지연 시간·상태 코드를 수집합니다.

```bash
curl http://localhost:5000/api/monitoring/status
```

응답 필드:
- `requestCount` — 총 요청 수
- `errorCount` — 5xx + 캡처된 에러
- `avgLatencyMs` — 평균 응답 시간
- `integrations.sentry` / `integrations.datadog` — 외부 연동 여부

## 클라이언트 에러 리포트

```bash
curl -X POST http://localhost:5000/api/monitoring/report \
  -H "Content-Type: application/json" \
  -d '{"message":"UI crash","url":"/mission"}'
```

## Sentry 연동

```env
SENTRY_DSN=https://{key}@{host}/{project}
```

설정 시 서버 에러가 Sentry Store API로 전달됩니다.

## Datadog 연동

```env
DATADOG_API_KEY=your-datadog-api-key
```

설정 시 에러 이벤트가 Datadog 파이프라인으로 로깅됩니다 (확장 가능).

## CI 연동

`scripts/test-phase8.sh` — SSO, custom ontology, monitoring smoke test.

---

Generated: 2026-07-12 | Phase 8

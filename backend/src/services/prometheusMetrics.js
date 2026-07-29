import client from 'prom-client';

const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: 'pronunciation_',
});

export const httpRequestDuration = new client.Histogram({
  name: 'pronunciation_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestsTotal = new client.Counter({
  name: 'pronunciation_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

export const httpErrorsTotal = new client.Counter({
  name: 'pronunciation_http_errors_total',
  help: 'Total HTTP 5xx errors',
  labelNames: ['method', 'route'],
  registers: [register],
});

export const dbConnected = new client.Gauge({
  name: 'pronunciation_db_connected',
  help: 'PostgreSQL connection status (1=connected)',
  registers: [register],
});

export const activeRequests = new client.Gauge({
  name: 'pronunciation_active_requests',
  help: 'In-flight HTTP requests',
  registers: [register],
});

function normalizeRoute(req) {
  const path = req.route?.path
    ? `${req.baseUrl || ''}${req.route.path}`
    : req.originalUrl.split('?')[0];
  return path.replace(/\d+/g, ':id');
}

export function recordHttpMetrics(req, res, durationMs) {
  const route = normalizeRoute(req);
  const labels = {
    method: req.method,
    route,
    status_code: String(res.statusCode),
  };

  httpRequestsTotal.inc(labels);
  httpRequestDuration.observe(labels, durationMs / 1000);

  if (res.statusCode >= 500) {
    httpErrorsTotal.inc({ method: req.method, route });
  }
}

export function setDbConnected(connected) {
  dbConnected.set(connected ? 1 : 0);
}

export async function metricsHandler(req, res) {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
}

export { register };

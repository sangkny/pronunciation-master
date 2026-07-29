import { monitoringService } from '../services/monitoringService.js';
import { recordHttpMetrics, activeRequests } from '../services/prometheusMetrics.js';

export function monitoringMiddleware(req, res, next) {
  const start = Date.now();
  activeRequests.inc();

  res.on('finish', () => {
    const duration = Date.now() - start;
    monitoringService.recordRequest(duration, res.statusCode);
    recordHttpMetrics(req, res, duration);
    activeRequests.dec();
  });

  next();
}

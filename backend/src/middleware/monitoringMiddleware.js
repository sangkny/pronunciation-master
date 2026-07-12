import crypto from 'crypto';
import { monitoringService } from '../services/monitoringService.js';

export function monitoringMiddleware(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    monitoringService.recordRequest(duration, res.statusCode);
  });

  next();
}

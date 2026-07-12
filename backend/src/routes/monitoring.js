import { Router } from 'express';
import { monitoringService } from '../services/monitoringService.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({ success: true, ...monitoringService.getStatus() });
});

router.get('/errors', (req, res) => {
  const limit = parseInt(req.query.limit || '10', 10);
  res.json({
    success: true,
    errors: monitoringService.getRecentErrors(limit),
  });
});

router.post('/report', (req, res) => {
  const { message, stack, url, userAgent } = req.body;
  monitoringService.reportClientError({ message, stack, url, userAgent });
  res.json({ success: true, received: true });
});

export default router;

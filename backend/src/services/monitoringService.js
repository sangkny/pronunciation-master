import crypto from 'crypto';

class MonitoringService {
  constructor() {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      totalLatencyMs: 0,
      lastError: null,
      startedAt: new Date().toISOString(),
    };
    this.recentErrors = [];
    this.maxRecentErrors = 50;
  }

  isSentryConfigured() {
    const dsn = process.env.SENTRY_DSN || '';
    return dsn.length > 0 && !dsn.includes('placeholder');
  }

  isDatadogConfigured() {
    const key = process.env.DATADOG_API_KEY || '';
    return key.length > 0 && !key.includes('placeholder');
  }

  recordRequest(durationMs, statusCode) {
    this.metrics.requestCount += 1;
    this.metrics.totalLatencyMs += durationMs;
    if (statusCode >= 500) {
      this.metrics.errorCount += 1;
    }
  }

  captureError(error, context = {}) {
    const entry = {
      message: error.message || String(error),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };

    this.metrics.errorCount += 1;
    this.metrics.lastError = entry;
    this.recentErrors.unshift(entry);
    if (this.recentErrors.length > this.maxRecentErrors) {
      this.recentErrors.pop();
    }

    console.error('[Monitoring]', entry.message, context);

    if (this.isSentryConfigured()) {
      this.forwardToSentry(entry);
    }
    if (this.isDatadogConfigured()) {
      this.forwardToDatadog(entry);
    }
  }

  async forwardToSentry(entry) {
    try {
      const dsn = process.env.SENTRY_DSN;
      const match = dsn.match(/https:\/\/([^@]+)@([^/]+)\/(\d+)/);
      if (!match) return;

      const [, key, host, projectId] = match;
      const url = `https://${host}/api/${projectId}/store/`;

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${key}`,
        },
        body: JSON.stringify({
          event_id: crypto.randomUUID().replace(/-/g, ''),
          message: entry.message,
          level: 'error',
          platform: 'node',
          timestamp: entry.timestamp,
          extra: entry.context,
        }),
      });
    } catch (err) {
      console.warn('Sentry forward failed:', err.message);
    }
  }

  async forwardToDatadog(entry) {
    console.log('[Datadog] Error event:', entry.message);
  }

  reportClientError({ message, stack, url, userAgent }) {
    this.captureError(new Error(message || 'Client error'), {
      source: 'client',
      stack,
      url,
      userAgent,
    });
  }

  getStatus() {
    const avgLatency = this.metrics.requestCount > 0
      ? Math.round(this.metrics.totalLatencyMs / this.metrics.requestCount)
      : 0;

    return {
      uptime: process.uptime(),
      startedAt: this.metrics.startedAt,
      requestCount: this.metrics.requestCount,
      errorCount: this.metrics.errorCount,
      avgLatencyMs: avgLatency,
      integrations: {
        sentry: this.isSentryConfigured(),
        datadog: this.isDatadogConfigured(),
      },
      recentErrorCount: this.recentErrors.length,
    };
  }

  getRecentErrors(limit = 10) {
    return this.recentErrors.slice(0, limit);
  }
}

export const monitoringService = new MonitoringService();

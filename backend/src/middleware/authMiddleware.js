import { authManager } from '../services/authManager.js';
import { apiKeyManager } from '../services/apiKeyManager.js';

const PUBLIC_PATHS = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/health',
  '/api/stripe/webhook',
  '/api/i18n',
  '/api/sso',
  '/api/monitoring',
  '/health',
];

export async function verifyToken(req, res, next) {
  const fullPath = req.originalUrl.split('?')[0];

  if (PUBLIC_PATHS.some(p => fullPath === p || fullPath.startsWith(p))) {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  if (apiKey) {
    try {
      const user = await apiKeyManager.validateKey(apiKey);
      if (user) {
        req.user = { userId: user.id, email: user.email, authMethod: 'apiKey' };
        return next();
      }
      return res.status(401).json({ success: false, error: 'Invalid API key' });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token required' });
  }

  const token = authHeader.slice(7);
  const decoded = authManager.verifyJWT(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  req.user = { ...decoded, authMethod: 'jwt' };
  next();
}

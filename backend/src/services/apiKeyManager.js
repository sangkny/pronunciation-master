import crypto from 'crypto';
import { dbManager } from './dbManager.js';

class ApiKeyManager {
  generateKey() {
    const raw = crypto.randomBytes(32).toString('hex');
    return `pm_live_${raw}`;
  }

  hashKey(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  getKeyPrefix(key) {
    return `${key.slice(0, 12)}...`;
  }

  async createApiKey(userId, name = 'Default') {
    const key = this.generateKey();
    const keyHash = this.hashKey(key);
    const record = await dbManager.createApiKey(userId, name, keyHash, this.getKeyPrefix(key));
    return { ...record, key };
  }

  async listApiKeys(userId) {
    const keys = await dbManager.getApiKeys(userId);
    return keys.map((k) => ({
      id: k.id,
      name: k.name,
      prefix: k.key_prefix,
      enabled: k.enabled,
      createdAt: k.created_at,
      lastUsedAt: k.last_used_at,
    }));
  }

  async revokeApiKey(userId, keyId) {
    const revoked = await dbManager.revokeApiKey(userId, keyId);
    if (!revoked) throw new Error('API key not found');
    return revoked;
  }

  async validateKey(apiKey) {
    if (!apiKey || !apiKey.startsWith('pm_live_')) return null;
    const keyHash = this.hashKey(apiKey);
    const record = await dbManager.getApiKeyByHash(keyHash);
    if (!record || !record.enabled) return null;

    await dbManager.touchApiKey(record.id);
    const user = await dbManager.getUserById(record.user_id);
    return user;
  }
}

export const apiKeyManager = new ApiKeyManager();

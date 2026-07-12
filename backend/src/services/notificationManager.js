import { dbManager } from './dbManager.js';

class NotificationManager {
  async registerPushToken(userId, expoPushToken, platform) {
    if (!expoPushToken) {
      throw new Error('expoPushToken is required');
    }
    return dbManager.savePushToken(userId, expoPushToken, platform);
  }

  async getSettings(userId) {
    const tokens = await dbManager.getPushTokens(userId);
    return {
      pushEnabled: tokens.length > 0,
      tokenCount: tokens.length,
      platforms: [...new Set(tokens.map(t => t.platform))],
    };
  }

  async updateSettings(userId, { pushEnabled }) {
    await dbManager.setPushEnabled(userId, pushEnabled !== false);
    return this.getSettings(userId);
  }
}

export const notificationManager = new NotificationManager();

import { dbManager } from './dbManager.js';

const TIER_FEATURES = {
  Free: {
    dailyPracticeLimit: 5,
    aomdFull: false,
    scoreRetentionDays: 7,
    weeklyReport: false,
    teamManagement: false,
    apiAccess: false,
  },
  Pro: {
    dailyPracticeLimit: Infinity,
    aomdFull: true,
    scoreRetentionDays: Infinity,
    weeklyReport: true,
    teamManagement: false,
    apiAccess: false,
  },
  Enterprise: {
    dailyPracticeLimit: Infinity,
    aomdFull: true,
    scoreRetentionDays: Infinity,
    weeklyReport: true,
    teamManagement: true,
    apiAccess: true,
  },
};

const TIER_PRICES = {
  Free: 0,
  Pro: 9.99,
  Enterprise: 299,
};

const UPGRADE_PATH = {
  Free: 'Pro',
  Pro: 'Enterprise',
  Enterprise: null,
};

class SubscriptionManager {
  async getUserTier(userId) {
    const user = await dbManager.getUserById(userId);
    return user?.tier || 'Free';
  }

  async checkFeatureAccess(userId, featureName) {
    const tier = await this.getUserTier(userId);
    const features = TIER_FEATURES[tier] || TIER_FEATURES.Free;

    switch (featureName) {
      case 'generateAOMDFeedback':
        return features.aomdFull;
      case 'dailyPracticeLimit':
        return features.dailyPracticeLimit;
      case 'scoreRetention':
        return features.scoreRetentionDays;
      case 'weeklyReport':
        return features.weeklyReport;
      case 'teamManagement':
        return features.teamManagement;
      case 'apiAccess':
        return features.apiAccess;
      default:
        return false;
    }
  }

  async canPracticeToday(userId) {
    const limit = await this.checkFeatureAccess(userId, 'dailyPracticeLimit');
    if (limit === Infinity) return { allowed: true, used: 0, limit: 'unlimited' };

    const usage = await dbManager.getDailyUsage(userId);
    const used = usage?.practice_count || 0;
    return { allowed: used < limit, used, limit };
  }

  async recordPractice(userId) {
    const check = await this.canPracticeToday(userId);
    if (!check.allowed) {
      throw new Error(`Daily practice limit reached (${check.used}/${check.limit})`);
    }
    await dbManager.incrementDailyUsage(userId);

    const retention = await this.checkFeatureAccess(userId, 'scoreRetention');
    if (retention !== Infinity) {
      await dbManager.deleteOldScores(userId, retention);
    }
  }

  async upgradeTier(userId, newTier, stripePaymentId = null) {
    const validTiers = ['Free', 'Pro', 'Enterprise'];
    if (!validTiers.includes(newTier)) {
      throw new Error(`Invalid tier: ${newTier}`);
    }

    const user = await dbManager.updateUserTier(userId, newTier);
    const subscription = await dbManager.createSubscription(userId, newTier, stripePaymentId);
    return { user, subscription };
  }

  async getSubscriptionStatus(userId) {
    const tier = await this.getUserTier(userId);
    const subscription = await dbManager.getActiveSubscription(userId);
    const usage = await dbManager.getDailyUsage(userId);
    const features = TIER_FEATURES[tier];
    const limit = features.dailyPracticeLimit;

    return {
      tier,
      startDate: subscription?.start_date || null,
      endDate: subscription?.end_date || null,
      status: subscription?.status || 'active',
      dailyUsage: {
        used: usage?.practice_count || 0,
        limit: limit === Infinity ? 'unlimited' : limit,
      },
      features: Object.keys(features).filter(k => features[k] === true || (typeof features[k] === 'number' && features[k] > 0)),
    };
  }

  getTierInfo(tier) {
    const features = TIER_FEATURES[tier] || TIER_FEATURES.Free;
    return {
      tier,
      price: TIER_PRICES[tier],
      features: {
        dailyPractice: features.dailyPracticeLimit === Infinity ? 'Unlimited' : `${features.dailyPracticeLimit}/day`,
        aomdFeedback: features.aomdFull ? 'All 4 roles' : 'Advocate only',
        scoreRetention: features.scoreRetentionDays === Infinity ? 'Unlimited' : `${features.scoreRetentionDays} days`,
        weeklyReport: features.weeklyReport,
        teamManagement: features.teamManagement,
        apiAccess: features.apiAccess,
      },
      nextUpgrade: UPGRADE_PATH[tier],
    };
  }

  filterAomdByTier(tier, feedback) {
    if (TIER_FEATURES[tier]?.aomdFull) {
      return feedback;
    }
    return {
      advocate: feedback.advocate,
      opposite: null,
      meditator: null,
      decisioner: null,
      tierRestricted: true,
    };
  }
}

export const subscriptionManager = new SubscriptionManager();

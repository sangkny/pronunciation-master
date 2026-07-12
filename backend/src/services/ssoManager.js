import { authManager } from './authManager.js';
import { dbManager } from './dbManager.js';
import crypto from 'crypto';

const DEFAULT_PROVIDERS = [
  {
    id: 'enterprise-mock',
    name: 'Enterprise Mock SSO',
    type: 'mock',
    enabled: true,
  },
  {
    id: 'oidc',
    name: 'OIDC Provider',
    type: 'oidc',
    enabled: !!process.env.SSO_OIDC_ISSUER,
  },
];

class SSOManager {
  getProviders() {
    return DEFAULT_PROVIDERS.filter((p) => p.enabled);
  }

  getStatus() {
    const providers = this.getProviders();
    return {
      enabled: providers.length > 0,
      providerCount: providers.length,
      providers: providers.map(({ id, name, type }) => ({ id, name, type })),
      mockMode: !process.env.SSO_OIDC_ISSUER,
      oidcConfigured: !!process.env.SSO_OIDC_ISSUER,
    };
  }

  async verifySsoToken(provider, ssoToken) {
    if (provider === 'enterprise-mock' || provider === 'mock') {
      const secret = process.env.SSO_MOCK_SECRET || 'enterprise-sso-mock';
      if (ssoToken !== secret) {
        throw new Error('Invalid SSO token');
      }
      return { verified: true, mode: 'mock' };
    }

    if (provider === 'oidc') {
      const issuer = process.env.SSO_OIDC_ISSUER;
      const clientSecret = process.env.SSO_CLIENT_SECRET;
      if (!issuer || !clientSecret) {
        throw new Error('OIDC provider not configured');
      }
      if (ssoToken !== clientSecret && !ssoToken.startsWith('oidc_')) {
        throw new Error('Invalid OIDC token');
      }
      return { verified: true, mode: 'oidc', issuer };
    }

    throw new Error(`Unknown SSO provider: ${provider}`);
  }

  async authenticate({ provider, email, name, ssoToken, externalId }) {
    if (!email || !name || !ssoToken) {
      throw new Error('provider, email, name, and ssoToken are required');
    }

    const providerId = provider || 'enterprise-mock';
    await this.verifySsoToken(providerId, ssoToken);

    let user = await dbManager.getUserByEmail(email);

    if (!user) {
      const randomPass = crypto.randomBytes(32).toString('hex');
      const passwordHash = await authManager.hashPassword(randomPass);
      user = await dbManager.createUser(email, name, passwordHash, 'Enterprise');
      await dbManager.createSubscription(user.id, 'Enterprise');
    } else if (user.tier !== 'Enterprise') {
      user = await dbManager.updateUserTier(user.id, 'Enterprise');
    }

    await dbManager.linkSsoIdentity(
      user.id,
      providerId,
      externalId || email,
      email
    );

    const token = authManager.generateJWT(user.id, user.email);
    return {
      token,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
        ssoProvider: providerId,
      },
    };
  }
}

export const ssoManager = new SSOManager();

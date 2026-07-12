import Stripe from 'stripe';
import { subscriptionManager } from './subscriptionManager.js';

const stripe = process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const TIER_AMOUNTS = {
  Pro: 999,
  Enterprise: 29900,
};

class StripeManager {
  isConfigured() {
    return stripe !== null;
  }

  isProduction() {
    const key = process.env.STRIPE_SECRET_KEY || '';
    return key.startsWith('sk_live_');
  }

  getMode() {
    if (this.isProduction()) return 'production';
    if (this.isConfigured()) return 'test';
    return 'mock';
  }

  getProductionReadiness() {
    const mode = this.getMode();
    const checks = {
      secretKey: !!process.env.STRIPE_SECRET_KEY
        && !process.env.STRIPE_SECRET_KEY.includes('placeholder'),
      webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
        && !process.env.STRIPE_WEBHOOK_SECRET.includes('placeholder'),
      publicKey: !!process.env.STRIPE_PUBLIC_KEY
        && !process.env.STRIPE_PUBLIC_KEY.includes('placeholder'),
      liveKeyFormat: this.isProduction(),
    };

    return {
      mode,
      isProduction: this.isProduction(),
      isConfigured: this.isConfigured(),
      checks,
      productionReady: checks.secretKey
        && checks.webhookSecret
        && checks.publicKey
        && (mode === 'test' || checks.liveKeyFormat),
    };
  }

  async verifyLiveConnection() {
    if (!this.isProduction() || !stripe) {
      return { connected: false, reason: 'Not in production mode' };
    }

    try {
      await stripe.balance.retrieve();
      return { connected: true };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }

  async getProductionStatus() {
    const readiness = this.getProductionReadiness();
    let liveVerification = null;

    if (this.isProduction()) {
      liveVerification = await this.verifyLiveConnection();
    }

    return { ...readiness, liveVerification };
  }

  async createPaymentIntent(userId, tier, amount) {
    if (!stripe) {
      return {
        mock: true,
        clientSecret: `mock_secret_${tier}_${userId}`,
        paymentIntentId: `mock_pi_${Date.now()}`,
        amount: amount || TIER_AMOUNTS[tier],
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || TIER_AMOUNTS[tier],
      currency: 'usd',
      metadata: { userId: String(userId), tier },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
    };
  }

  async confirmPayment(paymentIntentId) {
    if (!stripe) {
      return { success: true, mock: true, paymentIntentId };
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    };
  }

  async handleWebhook(event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const { userId, tier } = event.data.object.metadata;
        if (userId && tier) {
          await subscriptionManager.upgradeTier(parseInt(userId, 10), tier, event.data.object.id);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const userId = event.data.object.metadata?.userId;
        if (userId) {
          await subscriptionManager.upgradeTier(parseInt(userId, 10), 'Free');
        }
        break;
      }
      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }
    return { received: true };
  }

  async handleWebhookRequest(rawBody, signature) {
    let event;

    if (stripe && process.env.STRIPE_WEBHOOK_SECRET && !process.env.STRIPE_WEBHOOK_SECRET.includes('placeholder')) {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      const payload = typeof rawBody === 'string' ? JSON.parse(rawBody) : JSON.parse(rawBody.toString());
      event = payload;
      console.log('Stripe webhook: mock mode (no signature verification)');
    }

    return this.handleWebhook(event);
  }
}

export const stripeManager = new StripeManager();

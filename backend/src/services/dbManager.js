import pg from 'pg';

const { Pool } = pg;

class DBManager {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  getConfig() {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME || 'pronunciation_master',
      user: process.env.DB_USER || 'dev',
      password: process.env.DB_PASSWORD || 'devpass',
    };
  }

  async initializeDatabase() {
    this.pool = new Pool(this.getConfig());

    const client = await this.pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          tier VARCHAR(20) DEFAULT 'Free' CHECK (tier IN ('Free', 'Pro', 'Enterprise')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS user_progress (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          domain_id VARCHAR(50) NOT NULL,
          concept_id VARCHAR(100) NOT NULL,
          status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'skipped')),
          completed_at TIMESTAMP,
          UNIQUE(user_id, domain_id, concept_id)
        );

        CREATE TABLE IF NOT EXISTS user_scores (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          word VARCHAR(100) NOT NULL,
          user_pronunciation TEXT,
          score INTEGER CHECK (score >= 0 AND score <= 100),
          feedback_aomd JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          tier VARCHAR(20) NOT NULL CHECK (tier IN ('Free', 'Pro', 'Enterprise')),
          start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          end_date TIMESTAMP,
          status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
          stripe_payment_id VARCHAR(255)
        );

        CREATE TABLE IF NOT EXISTS daily_usage (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          usage_date DATE DEFAULT CURRENT_DATE,
          practice_count INTEGER DEFAULT 0,
          UNIQUE(user_id, usage_date)
        );

        CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_scores_user ON user_scores(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_scores_created ON user_scores(created_at);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, usage_date);
      `);

      this.isConnected = true;
      console.log('PostgreSQL connected and tables initialized');
    } finally {
      client.release();
    }
  }

  async query(text, params) {
    if (!this.pool) throw new Error('Database not initialized');
    return this.pool.query(text, params);
  }

  async createUser(email, name, passwordHash, tier = 'Free') {
    const result = await this.query(
      `INSERT INTO users (email, name, password_hash, tier)
       VALUES ($1, $2, $3, $4) RETURNING id, email, name, tier, created_at`,
      [email, name, passwordHash, tier]
    );
    return result.rows[0];
  }

  async getUserById(userId) {
    const result = await this.query(
      'SELECT id, email, name, tier, created_at FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  }

  async getUserByEmail(email) {
    const result = await this.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async updateUserTier(userId, tier) {
    const result = await this.query(
      'UPDATE users SET tier = $1 WHERE id = $2 RETURNING id, email, name, tier',
      [tier, userId]
    );
    return result.rows[0];
  }

  async saveUserProgress(userId, domainId, conceptId, status) {
    const completedAt = status === 'completed' ? new Date() : null;
    const result = await this.query(
      `INSERT INTO user_progress (user_id, domain_id, concept_id, status, completed_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, domain_id, concept_id)
       DO UPDATE SET status = $4, completed_at = COALESCE($5, user_progress.completed_at)
       RETURNING *`,
      [userId, domainId, conceptId, status, completedAt]
    );
    return result.rows[0];
  }

  async getUserProgress(userId, domainId) {
    const result = await this.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND domain_id = $2 ORDER BY id',
      [userId, domainId]
    );
    return result.rows;
  }

  async saveUserScore(userId, word, userPronunciation, score, aomdFeedback) {
    const result = await this.query(
      `INSERT INTO user_scores (user_id, word, user_pronunciation, score, feedback_aomd)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, word, userPronunciation, score, JSON.stringify(aomdFeedback)]
    );
    return result.rows[0];
  }

  async getUserScores(userId, limit = 50) {
    const result = await this.query(
      `SELECT * FROM user_scores WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  async getDailyUsage(userId) {
    const result = await this.query(
      `INSERT INTO daily_usage (user_id, usage_date, practice_count)
       VALUES ($1, CURRENT_DATE, 0)
       ON CONFLICT (user_id, usage_date) DO NOTHING`,
      [userId]
    );
    const usage = await this.query(
      'SELECT * FROM daily_usage WHERE user_id = $1 AND usage_date = CURRENT_DATE',
      [userId]
    );
    return usage.rows[0];
  }

  async incrementDailyUsage(userId) {
    await this.getDailyUsage(userId);
    const result = await this.query(
      `UPDATE daily_usage SET practice_count = practice_count + 1
       WHERE user_id = $1 AND usage_date = CURRENT_DATE
       RETURNING *`,
      [userId]
    );
    return result.rows[0];
  }

  async createSubscription(userId, tier, stripePaymentId = null) {
    const endDate = tier === 'Free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const result = await this.query(
      `INSERT INTO subscriptions (user_id, tier, end_date, stripe_payment_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, tier, endDate, stripePaymentId]
    );
    return result.rows[0];
  }

  async getActiveSubscription(userId) {
    const result = await this.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active'
       ORDER BY start_date DESC LIMIT 1`,
      [userId]
    );
    return result.rows[0] || null;
  }

  async deleteOldScores(userId, daysToKeep) {
    await this.query(
      `DELETE FROM user_scores WHERE user_id = $1
       AND created_at < NOW() - INTERVAL '1 day' * $2`,
      [userId, daysToKeep]
    );
  }
}

export const dbManager = new DBManager();

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

        CREATE TABLE IF NOT EXISTS push_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          expo_push_token VARCHAR(255) NOT NULL,
          platform VARCHAR(20),
          enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, expo_push_token)
        );

        CREATE TABLE IF NOT EXISTS sso_identities (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider VARCHAR(50) NOT NULL,
          external_id VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(provider, external_id)
        );

        CREATE TABLE IF NOT EXISTS custom_ontologies (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          domain_id VARCHAR(100) NOT NULL,
          name VARCHAR(200) NOT NULL,
          ontology_data JSONB NOT NULL DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, domain_id)
        );

        CREATE TABLE IF NOT EXISTS teams (
          id SERIAL PRIMARY KEY,
          owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(200) NOT NULL,
          max_members INTEGER DEFAULT 100,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS team_members (
          id SERIAL PRIMARY KEY,
          team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(team_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS api_keys (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          key_hash VARCHAR(64) NOT NULL UNIQUE,
          key_prefix VARCHAR(20) NOT NULL,
          enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_used_at TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_scores_user ON user_scores(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_scores_created ON user_scores(created_at);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_usage(user_id, usage_date);
        CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens(user_id);
        CREATE INDEX IF NOT EXISTS idx_sso_identities_user ON sso_identities(user_id);
        CREATE INDEX IF NOT EXISTS idx_custom_ontologies_user ON custom_ontologies(user_id);
        CREATE INDEX IF NOT EXISTS idx_teams_owner ON teams(owner_id);
        CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
        CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
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

  async getUserScoreStats(userId) {
    const result = await this.query(
      `SELECT
         COUNT(*)::int AS total_practices,
         COALESCE(ROUND(AVG(score)), 0)::int AS avg_score,
         COALESCE(MAX(score), 0)::int AS best_score
       FROM user_scores WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  async getCompletedConceptCount(userId) {
    const result = await this.query(
      `SELECT COUNT(*)::int AS count FROM user_progress
       WHERE user_id = $1 AND status = 'completed'`,
      [userId]
    );
    return result.rows[0].count;
  }

  async getWeeklyScoreSummary(userId) {
    const result = await this.query(
      `SELECT DATE(created_at) AS day,
              COUNT(*)::int AS practices,
              COALESCE(ROUND(AVG(score)), 0)::int AS avg_score
       FROM user_scores
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY day`,
      [userId]
    );
    return result.rows;
  }

  async getWeakWords(userId, limit = 5) {
    const result = await this.query(
      `SELECT word,
              COUNT(*)::int AS attempts,
              COALESCE(ROUND(AVG(score)), 0)::int AS avg_score
       FROM user_scores WHERE user_id = $1
       GROUP BY word
       HAVING COUNT(*) >= 1
       ORDER BY avg_score ASC, attempts DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  }

  async getAllUserProgress(userId) {
    const result = await this.query(
      `SELECT * FROM user_progress WHERE user_id = $1 ORDER BY completed_at DESC NULLS LAST`,
      [userId]
    );
    return result.rows;
  }

  async getLeaderboard(limit = 10) {
    const result = await this.query(
      `SELECT u.id AS user_id, u.name, u.tier,
              COUNT(s.id)::int AS total_practices,
              COALESCE(ROUND(AVG(s.score)), 0)::int AS avg_score
       FROM users u
       LEFT JOIN user_scores s ON u.id = s.user_id
       GROUP BY u.id, u.name, u.tier
       HAVING COUNT(s.id) > 0
       ORDER BY avg_score DESC, total_practices DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  async savePushToken(userId, expoPushToken, platform = 'unknown') {
    const result = await this.query(
      `INSERT INTO push_tokens (user_id, expo_push_token, platform)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, expo_push_token)
       DO UPDATE SET platform = $3, enabled = true
       RETURNING *`,
      [userId, expoPushToken, platform]
    );
    return result.rows[0];
  }

  async getPushTokens(userId) {
    const result = await this.query(
      'SELECT * FROM push_tokens WHERE user_id = $1 AND enabled = true',
      [userId]
    );
    return result.rows;
  }

  async setPushEnabled(userId, enabled) {
    await this.query(
      'UPDATE push_tokens SET enabled = $1 WHERE user_id = $2',
      [enabled, userId]
    );
  }

  async linkSsoIdentity(userId, provider, externalId, email) {
    const result = await this.query(
      `INSERT INTO sso_identities (user_id, provider, external_id, email)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (provider, external_id)
       DO UPDATE SET user_id = $1, email = $4
       RETURNING *`,
      [userId, provider, externalId, email]
    );
    return result.rows[0];
  }

  async getSsoIdentity(provider, externalId) {
    const result = await this.query(
      'SELECT * FROM sso_identities WHERE provider = $1 AND external_id = $2',
      [provider, externalId]
    );
    return result.rows[0] || null;
  }

  async saveCustomOntology(userId, domainId, name, ontologyData) {
    const result = await this.query(
      `INSERT INTO custom_ontologies (user_id, domain_id, name, ontology_data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, domain_id)
       DO UPDATE SET name = $3, ontology_data = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, domainId, name, JSON.stringify(ontologyData)]
    );
    return result.rows[0];
  }

  async getCustomOntologies(userId) {
    const result = await this.query(
      'SELECT * FROM custom_ontologies WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return result.rows;
  }

  async getCustomOntology(userId, domainId) {
    const result = await this.query(
      'SELECT * FROM custom_ontologies WHERE user_id = $1 AND domain_id = $2',
      [userId, domainId]
    );
    return result.rows[0] || null;
  }

  async deleteCustomOntology(userId, domainId) {
    const result = await this.query(
      'DELETE FROM custom_ontologies WHERE user_id = $1 AND domain_id = $2 RETURNING *',
      [userId, domainId]
    );
    return result.rows[0] || null;
  }

  async createTeam(ownerId, name, maxMembers = 100) {
    const result = await this.query(
      'INSERT INTO teams (owner_id, name, max_members) VALUES ($1, $2, $3) RETURNING *',
      [ownerId, name, maxMembers]
    );
    const team = result.rows[0];
    await this.query(
      'INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)',
      [team.id, ownerId, 'owner']
    );
    return team;
  }

  async getTeamsForUser(userId) {
    const result = await this.query(
      `SELECT t.*, tm.role
       FROM teams t
       JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  async getTeamById(teamId) {
    const result = await this.query('SELECT * FROM teams WHERE id = $1', [teamId]);
    return result.rows[0] || null;
  }

  async getTeamMembership(teamId, userId) {
    const result = await this.query(
      'SELECT * FROM team_members WHERE team_id = $1 AND user_id = $2',
      [teamId, userId]
    );
    return result.rows[0] || null;
  }

  async getTeamMembers(teamId) {
    const result = await this.query(
      `SELECT tm.role, tm.joined_at, u.id, u.email, u.name, u.tier
       FROM team_members tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.team_id = $1
       ORDER BY tm.joined_at`,
      [teamId]
    );
    return result.rows;
  }

  async getTeamMemberCount(teamId) {
    const result = await this.query(
      'SELECT COUNT(*)::int AS count FROM team_members WHERE team_id = $1',
      [teamId]
    );
    return result.rows[0].count;
  }

  async addTeamMember(teamId, userId, role = 'member') {
    const result = await this.query(
      `INSERT INTO team_members (team_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (team_id, user_id) DO UPDATE SET role = $3
       RETURNING *`,
      [teamId, userId, role]
    );
    return result.rows[0];
  }

  async removeTeamMember(teamId, userId) {
    const result = await this.query(
      'DELETE FROM team_members WHERE team_id = $1 AND user_id = $2 RETURNING *',
      [teamId, userId]
    );
    return result.rows[0] || null;
  }

  async createApiKey(userId, name, keyHash, keyPrefix) {
    const result = await this.query(
      `INSERT INTO api_keys (user_id, name, key_hash, key_prefix)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, name, keyHash, keyPrefix]
    );
    return result.rows[0];
  }

  async getApiKeys(userId) {
    const result = await this.query(
      'SELECT * FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }

  async getApiKeyByHash(keyHash) {
    const result = await this.query(
      'SELECT * FROM api_keys WHERE key_hash = $1',
      [keyHash]
    );
    return result.rows[0] || null;
  }

  async touchApiKey(keyId) {
    await this.query(
      'UPDATE api_keys SET last_used_at = CURRENT_TIMESTAMP WHERE id = $1',
      [keyId]
    );
  }

  async revokeApiKey(userId, keyId) {
    const result = await this.query(
      'UPDATE api_keys SET enabled = false WHERE id = $1 AND user_id = $2 RETURNING *',
      [keyId, userId]
    );
    return result.rows[0] || null;
  }
}

export const dbManager = new DBManager();

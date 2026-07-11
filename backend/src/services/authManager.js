import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { dbManager } from './dbManager.js';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'pronunciation-master-dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthManager {
  async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  generateJWT(userId, email) {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { userId: decoded.userId, email: decoded.email };
    } catch {
      return null;
    }
  }

  async registerUser(email, name, password) {
    const existing = await dbManager.getUserByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = await this.hashPassword(password);
    const user = await dbManager.createUser(email, name, passwordHash);
    await dbManager.createSubscription(user.id, 'Free');

    const token = this.generateJWT(user.id, user.email);
    return { user, token };
  }

  async loginUser(email, password) {
    const user = await dbManager.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const valid = await this.comparePassword(password, user.password_hash);
    if (!valid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateJWT(user.id, user.email);
    return {
      token,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
      },
    };
  }
}

export const authManager = new AuthManager();

import { Router } from 'express';
import { authManager } from '../services/authManager.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'email, name, and password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const { user, token } = await authManager.registerUser(email, name, password);

    res.json({
      success: true,
      message: 'Registration successful',
      userId: user.id,
      token,
      user: {
        userId: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier,
      },
    });
  } catch (error) {
    const status = error.message === 'Email already registered' ? 409 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'email and password are required',
      });
    }

    const { token, user } = await authManager.loginUser(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    const status = error.message === 'Invalid email or password' ? 401 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;

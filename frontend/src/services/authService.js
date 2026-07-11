import apiClient from './apiClient.js';

const TOKEN_KEY = 'pm_token';
const USER_KEY = 'pm_user';

class AuthService {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
    apiClient.setToken(token);
  }

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async register(email, name, password) {
    const data = await apiClient.postPublic('/api/auth/register', { email, name, password });
    if (data.token) {
      this.setToken(data.token);
      this.setUser(data.user || { userId: data.userId, email, name, tier: 'Free' });
    }
    return data;
  }

  async login(email, password) {
    const data = await apiClient.postPublic('/api/auth/login', { email, password });
    if (data.token) {
      this.setToken(data.token);
      this.setUser(data.user);
    }
    return data;
  }

  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch {
      // ignore
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    apiClient.setToken(null);
  }

  restoreSession() {
    const token = this.getToken();
    if (token) {
      apiClient.setToken(token);
      return this.getUser();
    }
    return null;
  }
}

const authService = new AuthService();
export default authService;

import apiClient from './apiService';

export async function login(email, password) {
  const { data } = await apiClient.post('/api/auth/login', { email, password });
  return data;
}

export async function register(email, name, password) {
  const { data } = await apiClient.post('/api/auth/register', { email, name, password });
  return data;
}

export async function fetchSubscription() {
  const { data } = await apiClient.get('/api/subscription/status');
  return data;
}

export async function upgradeSubscription(tier) {
  const { data } = await apiClient.post('/api/subscription/upgrade', { tier });
  return data;
}

export async function refreshToken() {
  try {
    const { data } = await apiClient.post('/api/auth/refresh');
    return data;
  } catch {
    return null;
  }
}

export async function logoutRemote() {
  try {
    await apiClient.post('/api/auth/logout');
  } catch {
    // optional endpoint
  }
}

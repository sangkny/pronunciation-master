const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

let authToken = null;

export function setToken(token) {
  authToken = token;
}

export function getToken() {
  return authToken;
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }
  return data;
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email, name, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, name, password }),
  });
}

export async function getDomains() {
  return request('/api/ontology/domains');
}

export async function getCurriculum(locale) {
  return request(`/api/i18n/curriculum/${locale}`);
}

export async function getDashboard() {
  return request('/api/analytics/dashboard');
}

export { API_URL };

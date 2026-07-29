import apiClient, { API_BASE_URL } from './apiService';
import { useAppStore } from '../store/useAppStore';

export const API_URL = API_BASE_URL;

export function setToken(token) {
  useAppStore.setState({ token });
}

export function getToken() {
  return useAppStore.getState().token;
}

async function get(path) {
  const { data } = await apiClient.get(path);
  return data;
}

async function post(path, body) {
  const { data } = await apiClient.post(path, body);
  return data;
}

export async function login(email, password) {
  return post('/api/auth/login', { email, password });
}

export async function register(email, name, password) {
  return post('/api/auth/register', { email, name, password });
}

export async function getDomains() {
  return get('/api/ontology/domains');
}

export async function getCurriculum(locale) {
  return get(`/api/i18n/curriculum/${locale}`);
}

export async function getDashboard() {
  return get('/api/analytics/dashboard');
}

export async function calculateScore(payload) {
  return post('/api/scoring/calculate', payload);
}

export async function getAomdFeedback(payload) {
  return post('/api/aomd/feedback', payload);
}

export async function registerPushToken(expoPushToken, platform) {
  return post('/api/notifications/register-token', { expoPushToken, platform });
}

export async function transcribeAudio(payload) {
  return post('/api/stt/transcribe', payload);
}

export async function getSttStatus() {
  return get('/api/stt/status');
}

export async function getAudioInfo() {
  return get('/api/audio/info');
}

export async function analyzeNativeAudio(payload) {
  return post('/api/audio/analyze-native', payload);
}

export async function getSubscriptionStatus() {
  return get('/api/subscription/status');
}

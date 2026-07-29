import axios from 'axios';
import { useAppStore } from '../store/useAppStore';
import { navigateToLogin } from '../navigation/navigationRef';
import { getLocalUserId, saveAnalysisLocal } from './localDbService';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const { token } = useAppStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    const { setError, logout } = useAppStore.getState();

    if (status === 401) {
      setError('세션이 만료되었습니다. 다시 로그인해주세요.');
      logout().then(() => navigateToLogin());
    } else if (status === 429) {
      setError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
    } else if (status >= 500) {
      setError('서버 오류가 발생했습니다.');
    } else if (!error.response) {
      setError('네트워크 연결을 확인해주세요.');
      useAppStore.getState().setOnline(false);
    }

    return Promise.reject(error);
  }
);

export async function analyzeNativeWithOffline({
  word,
  correctPronunciation,
  userLevel,
  audioBase64,
  audioUri = '',
  audioDuration = 0,
}) {
  const { isOnline, user, token } = useAppStore.getState();
  const userId = getLocalUserId(user, token);
  const payload = {
    audioBase64,
    audioFormat: 'wav',
    word,
    correctPronunciation,
    userLevel,
  };

  const saveOffline = async (analysisPayload, synced = false) => {
    await saveAnalysisLocal({
      userId,
      word,
      audioUri,
      audioDuration,
      payload: analysisPayload,
      synced,
      confidence: analysisPayload.confidence || 0,
    });
    return {
      ...analysisPayload,
      offline: !synced,
      word,
    };
  };

  if (!isOnline) {
    return saveOffline({
      analysis: 'Offline - 나중에 동기화됩니다',
      provider: 'local',
      offline: true,
    });
  }

  try {
    const { data } = await apiClient.post('/api/audio/analyze-native', payload);
    await saveAnalysisLocal({
      userId,
      word,
      audioUri,
      audioDuration,
      payload: data,
      synced: true,
      confidence: data.confidence || 0,
    });
    return data;
  } catch (error) {
    if (!error.response) {
      return saveOffline({
        analysis: 'Offline - 나중에 동기화됩니다',
        provider: 'local',
        offline: true,
      });
    }
    throw error;
  }
}

export default apiClient;

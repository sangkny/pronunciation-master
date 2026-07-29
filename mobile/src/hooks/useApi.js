import apiClient from '../services/apiService';
import { useAppStore } from '../store/useAppStore';

export function useApi() {
  const setLoading = useAppStore((s) => s.setLoading);
  const setError = useAppStore((s) => s.setError);

  const request = async (method, url, data = null) => {
    try {
      setLoading(true);
      const response = await apiClient.request({
        method: method.toLowerCase(),
        url,
        data: data ?? undefined,
      });
      setError(null);
      return response.data;
    } catch (error) {
      if (!useAppStore.getState().error) {
        const msg = error.response?.data?.error || error.message;
        setError(msg);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { request };
}

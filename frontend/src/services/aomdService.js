import apiClient from './apiClient.js';

class AOMDService {
  constructor() {
    this.loading = false;
  }

  isLoading() {
    return this.loading;
  }

  async fetchAOMDFeedback({ userPronunciation, correctPronunciation, word, score, context }) {
    this.loading = true;
    try {
      const data = await apiClient.post('/api/aomd/feedback', {
        userPronunciation,
        correctPronunciation,
        word,
        score,
        context,
      });

      if (data.tierRestricted) {
        return {
          advocate: data.advocate,
          opposite: null,
          meditator: null,
          decisioner: null,
          tierRestricted: true,
          tier: data.tier,
        };
      }

      return {
        advocate: data.advocate,
        opposite: data.opposite,
        meditator: data.meditator,
        decisioner: data.decisioner,
        tier: data.tier,
      };
    } catch (error) {
      if (error.status === 403) {
        throw new Error('일일 연습 한도에 도달했습니다. Pro로 업그레이드하세요.');
      }
      return {
        advocate: `"${word}" 발음을 시도하셨습니다. 계속 연습하면 개선됩니다!`,
        opposite: null,
        meditator: null,
        decisioner: null,
        tierRestricted: true,
        fallback: true,
      };
    } finally {
      this.loading = false;
    }
  }
}

const aomdService = new AOMDService();
export default aomdService;

export class LLMManager {
  constructor() {
    this.provider = process.env.LLM_PROVIDER || 'ollama';
  }

  async generateScenarioBasedMissions(params) {
    const { scenario, category, count } = params;
    try {
      const response = await this.callLLM(
        `Create ${count} learning missions for scenario: ${scenario}`
      );
      return JSON.parse(response);
    } catch (error) {
      console.error('Error:', error);
      return this.getSampleMissions(count);
    }
  }

  async callLLM(prompt) {
    return JSON.stringify([]);
  }

  getSampleMissions(count) {
    return Array(count).fill(null).map((_, i) => ({
      id: i + 1,
      text: `Mission ${i + 1}`,
      category: 'general'
    }));
  }
}

export const llmManager = new LLMManager();

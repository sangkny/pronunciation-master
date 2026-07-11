class APIClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }

  async generateScenarioMissions(scenario, category, count = 5) {
    return this.post('/api/mission/generate-by-scenario', { scenario, category, count });
  }

  async getLearningPath(domainId, userLevel) {
    return this.get(`/api/ontology/learning-path/${domainId}?userLevel=${userLevel}`);
  }

  async getConcept(conceptId) {
    return this.get(`/api/ontology/concept/${conceptId}`);
  }

  async getAomdFeedback(params) {
    return this.post('/api/aomd/feedback', params);
  }

  async calculateScore(params) {
    return this.post('/api/scoring/calculate', params);
  }
}

const apiClient = new APIClient();
export default apiClient;

class APIClient {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders(includeAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const err = new Error(`API error: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = new Error(`API error: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }

  async postPublic(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error || `API error: ${response.status}`);
    }
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

  async getSubscriptionTier() {
    return this.get('/api/subscription/tier');
  }

  async getSubscriptionStatus() {
    return this.get('/api/subscription/status');
  }
}

const apiClient = new APIClient();
export default apiClient;

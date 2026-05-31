class APIClient {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    }
    async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await response.json();
    }
    async generateScenarioMissions(scenario, category, count = 5) {
        return this.post('/api/mission/generate-by-scenario', { scenario, category, count });
    }
}
const apiClient = new APIClient();
export default apiClient;

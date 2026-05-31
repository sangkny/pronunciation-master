import express from 'express';
import cors from 'cors';
import { llmManager } from './services/llmManager.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.post('/api/mission/generate-by-scenario', async (req, res) => {
  try {
    const { scenario, category, count = 5 } = req.body;
    const result = await llmManager.generateScenarioBasedMissions({
      scenario, category, count
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

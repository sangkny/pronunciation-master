import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { llmManager } from './services/llmManager.js';
import { dbManager } from './services/dbManager.js';
import { verifyToken } from './middleware/authMiddleware.js';
import ontologyRouter from './routes/ontology.js';
import aomdRouter from './routes/aomd.js';
import scoringRouter from './routes/scoring.js';
import authRouter from './routes/auth.js';
import subscriptionRouter from './routes/subscription.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', database: dbManager.isConnected });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: dbManager.isConnected });
});

app.use('/api/auth', authRouter);
app.use(verifyToken);
app.use('/api/ontology', ontologyRouter);
app.use('/api/aomd', aomdRouter);
app.use('/api/scoring', scoringRouter);
app.use('/api/subscription', subscriptionRouter);
app.use('/api/analytics', analyticsRouter);

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

async function startServer() {
  try {
    await dbManager.initializeDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  }

  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

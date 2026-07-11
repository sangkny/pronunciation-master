import { Router } from 'express';
import { ontologyEngine } from '../services/ontologyEngine.js';

const router = Router();

router.get('/domains', (req, res) => {
  try {
    const domains = ontologyEngine.getDomains();
    res.json({ success: true, domains });
  } catch (error) {
    console.error('Ontology domains error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/domain/:domainId/concepts', (req, res) => {
  try {
    const { domainId } = req.params;
    const difficulty = req.query.difficulty;

    const concepts = difficulty
      ? ontologyEngine.getConceptsByDifficulty(domainId, difficulty)
      : ontologyEngine.getConceptsByDomain(domainId);

    res.json({ success: true, domainId, concepts });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    console.error('Ontology concepts error:', error);
    res.status(status).json({ success: false, error: error.message });
  }
});

router.get('/concept/:conceptId', (req, res) => {
  try {
    const concept = ontologyEngine.getConcept(req.params.conceptId);
    const prerequisites = ontologyEngine.getPrerequisiteConcepts(req.params.conceptId);
    res.json({ success: true, concept, prerequisites });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    console.error('Ontology concept error:', error);
    res.status(status).json({ success: false, error: error.message });
  }
});

router.get('/learning-path/:domainId', (req, res) => {
  try {
    const { domainId } = req.params;
    const userLevel = req.query.userLevel || 'beginner';
    const path = ontologyEngine.generateLearningPath(domainId, userLevel);
    res.json({ success: true, ...path });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    console.error('Ontology learning path error:', error);
    res.status(status).json({ success: false, error: error.message });
  }
});

router.get('/vocabulary/:conceptId', (req, res) => {
  try {
    const vocabulary = ontologyEngine.getVocabularyByConcept(req.params.conceptId);
    res.json({ success: true, ...vocabulary });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    console.error('Ontology vocabulary error:', error);
    res.status(status).json({ success: false, error: error.message });
  }
});

router.get('/recommend/:conceptId', (req, res) => {
  try {
    const userId = req.query.userId || 'anonymous';
    const recommendation = ontologyEngine.recommendNextConcept(userId, req.params.conceptId);
    res.json({ success: true, ...recommendation });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 500;
    console.error('Ontology recommend error:', error);
    res.status(status).json({ success: false, error: error.message });
  }
});

export default router;

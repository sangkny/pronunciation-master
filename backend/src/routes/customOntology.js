import { Router } from 'express';
import { customOntologyManager } from '../services/customOntologyManager.js';
import { requireTier } from '../middleware/tierMiddleware.js';

const router = Router();

router.use(requireTier(['Enterprise']));

router.get('/', async (req, res) => {
  try {
    const ontologies = await customOntologyManager.listCustomOntologies(req.user.userId);
    res.json({ success: true, ontologies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const ontology = await customOntologyManager.createCustomOntology(
      req.user.userId,
      req.body
    );
    res.status(201).json({ success: true, ontology });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:domainId/merge', async (req, res) => {
  try {
    const merged = await customOntologyManager.mergeWithBase(
      req.user.userId,
      req.params.domainId
    );
    res.json({ success: true, ...merged });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

router.get('/:domainId', async (req, res) => {
  try {
    const ontology = await customOntologyManager.getCustomOntology(
      req.user.userId,
      req.params.domainId
    );
    res.json({ success: true, ontology });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

router.put('/:domainId', async (req, res) => {
  try {
    const ontology = await customOntologyManager.updateCustomOntology(
      req.user.userId,
      req.params.domainId,
      req.body
    );
    res.json({ success: true, ontology });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:domainId', async (req, res) => {
  try {
    await customOntologyManager.deleteCustomOntology(
      req.user.userId,
      req.params.domainId
    );
    res.json({ success: true, message: 'Custom ontology deleted' });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

export default router;

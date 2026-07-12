import { Router } from 'express';
import { teamManager } from '../services/teamManager.js';
import { requireTier } from '../middleware/tierMiddleware.js';

const router = Router();

router.use(requireTier(['Enterprise']));

router.get('/', async (req, res) => {
  try {
    const teams = await teamManager.listTeams(req.user.userId);
    res.json({ success: true, teams });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, maxMembers } = req.body;
    const team = await teamManager.createTeam(req.user.userId, name, maxMembers);
    res.status(201).json({ success: true, team });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/:teamId', async (req, res) => {
  try {
    const team = await teamManager.getTeam(req.user.userId, parseInt(req.params.teamId, 10));
    res.json({ success: true, team });
  } catch (error) {
    const status = error.message.includes('not found') || error.message.includes('Not a member') ? 404 : 500;
    res.status(status).json({ success: false, error: error.message });
  }
});

router.post('/:teamId/members', async (req, res) => {
  try {
    const { email, role } = req.body;
    const member = await teamManager.addMember(
      req.user.userId,
      parseInt(req.params.teamId, 10),
      email,
      role
    );
    res.status(201).json({ success: true, member });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/:teamId/members/:memberId', async (req, res) => {
  try {
    await teamManager.removeMember(
      req.user.userId,
      parseInt(req.params.teamId, 10),
      parseInt(req.params.memberId, 10)
    );
    res.json({ success: true, message: 'Member removed' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;

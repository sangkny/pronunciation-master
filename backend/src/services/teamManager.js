import { dbManager } from './dbManager.js';

class TeamManager {
  async createTeam(ownerId, name, maxMembers = 100) {
    if (!name) throw new Error('Team name is required');
    return dbManager.createTeam(ownerId, name, maxMembers);
  }

  async listTeams(userId) {
    return dbManager.getTeamsForUser(userId);
  }

  async getTeam(userId, teamId) {
    const team = await dbManager.getTeamById(teamId);
    if (!team) throw new Error('Team not found');

    const membership = await dbManager.getTeamMembership(teamId, userId);
    if (!membership) throw new Error('Not a member of this team');

    const members = await dbManager.getTeamMembers(teamId);
    return { ...team, members, role: membership.role };
  }

  async addMember(ownerId, teamId, email, role = 'member') {
    const team = await dbManager.getTeamById(teamId);
    if (!team) throw new Error('Team not found');
    if (team.owner_id !== ownerId) throw new Error('Only team owner can add members');

    const memberCount = await dbManager.getTeamMemberCount(teamId);
    if (memberCount >= team.max_members) {
      throw new Error(`Team member limit reached (${team.max_members})`);
    }

    const user = await dbManager.getUserByEmail(email);
    if (!user) throw new Error(`User not found: ${email}`);

    return dbManager.addTeamMember(teamId, user.id, role);
  }

  async removeMember(ownerId, teamId, memberUserId) {
    const team = await dbManager.getTeamById(teamId);
    if (!team) throw new Error('Team not found');
    if (team.owner_id !== ownerId) throw new Error('Only team owner can remove members');
    if (team.owner_id === memberUserId) throw new Error('Cannot remove team owner');

    const removed = await dbManager.removeTeamMember(teamId, memberUserId);
    if (!removed) throw new Error('Member not found');
    return removed;
  }
}

export const teamManager = new TeamManager();

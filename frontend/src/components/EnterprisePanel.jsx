import React, { useState, useEffect } from 'react';
import apiClient from '../services/apiClient.js';

export default function EnterprisePanel({ onBack }) {
  const [teams, setTeams] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [teamsData, keysData] = await Promise.all([
        apiClient.getTeams(),
        apiClient.getApiKeys(),
      ]);
      setTeams(teamsData.teams || []);
      setApiKeys(keysData.keys || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    try {
      await apiClient.createTeam(newTeamName.trim());
      setNewTeamName('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeamId || !memberEmail.trim()) return;
    try {
      await apiClient.addTeamMember(selectedTeamId, memberEmail.trim());
      setMemberEmail('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateKey = async () => {
    try {
      const data = await apiClient.createApiKey(newKeyName.trim() || 'B2B Key');
      setCreatedKey(data.key);
      setNewKeyName('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRevokeKey = async (keyId) => {
    try {
      await apiClient.revokeApiKey(keyId);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-6 flex items-center justify-center">
        Loading Enterprise panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <button onClick={onBack} className="text-purple-400 mb-6">← Back</button>
      <h1 className="text-2xl font-bold text-purple-300 mb-2">Enterprise Console</h1>
      <p className="text-slate-400 mb-6">Team management & B2B API keys</p>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <section className="mb-8 bg-slate-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Teams</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-slate-700 rounded px-3 py-2"
            placeholder="Team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
          />
          <button onClick={handleCreateTeam} className="bg-purple-600 px-4 py-2 rounded">Create</button>
        </div>
        {teams.map((team) => (
          <div key={team.id} className="border border-slate-600 rounded p-3 mb-2">
            <p className="font-medium">{team.name}</p>
            <p className="text-sm text-slate-400">Role: {team.role} · Max: {team.max_members}</p>
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <select
            className="bg-slate-700 rounded px-3 py-2"
            value={selectedTeamId || ''}
            onChange={(e) => setSelectedTeamId(Number(e.target.value))}
          >
            <option value="">Select team</option>
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input
            className="flex-1 bg-slate-700 rounded px-3 py-2"
            placeholder="Member email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
          />
          <button onClick={handleAddMember} className="bg-purple-600 px-4 py-2 rounded">Add</button>
        </div>
      </section>

      <section className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">B2B API Keys</h2>
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 bg-slate-700 rounded px-3 py-2"
            placeholder="Key name"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <button onClick={handleCreateKey} className="bg-purple-600 px-4 py-2 rounded">Generate</button>
        </div>
        {createdKey && (
          <div className="bg-green-900/30 border border-green-600 rounded p-3 mb-4 text-sm break-all">
            <p className="text-green-300 font-medium mb-1">New key (copy now):</p>
            <code>{createdKey}</code>
          </div>
        )}
        {apiKeys.map((key) => (
          <div key={key.id} className="flex justify-between items-center border border-slate-600 rounded p-3 mb-2">
            <div>
              <p className="font-medium">{key.name}</p>
              <p className="text-sm text-slate-400">{key.prefix} · {key.enabled ? 'active' : 'revoked'}</p>
            </div>
            {key.enabled && (
              <button onClick={() => handleRevokeKey(key.id)} className="text-red-400 text-sm">Revoke</button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

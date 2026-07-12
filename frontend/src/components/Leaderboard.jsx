import React, { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';
import apiClient from '../services/apiClient.js';

export default function Leaderboard({ t }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/analytics/leaderboard')
      .then(data => setLeaderboard(data.leaderboard || []))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!leaderboard.length) return null;

  const rankColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];

  return (
    <div className="bg-white/5 border border-yellow-400/20 rounded-xl p-5 space-y-3">
      <h2 className="font-bold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        {t('leaderboard')}
      </h2>
      <div className="space-y-2">
        {leaderboard.map((entry, i) => (
          <div
            key={entry.userId}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              i < 3 ? 'bg-yellow-500/10 border border-yellow-400/20' : 'bg-black/20'
            }`}
          >
            <span className={`w-6 text-center font-bold text-sm ${rankColors[i] || 'text-gray-500'}`}>
              {entry.rank <= 3 ? <Medal className="w-4 h-4 inline" /> : entry.rank}
            </span>
            <div className="flex-1 min-w-0">
              <span className="font-semibold truncate block">{entry.name}</span>
              <span className="text-xs text-gray-500">{entry.tier} · {entry.totalPractices} {t('practices')}</span>
            </div>
            <span className="font-bold text-green-400">{entry.avgScore}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

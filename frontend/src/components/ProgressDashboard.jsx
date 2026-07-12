import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Award, AlertTriangle } from 'lucide-react';
import apiClient from '../services/apiClient.js';
import Leaderboard from './Leaderboard.jsx';

export default function ProgressDashboard({ t, onBack }) {
  const [dashboard, setDashboard] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [weakness, setWeakness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [dash, week, weak] = await Promise.all([
          apiClient.get('/api/analytics/dashboard'),
          apiClient.get('/api/analytics/weekly'),
          apiClient.get('/api/analytics/weakness'),
        ]);
        setDashboard(dash);
        setWeekly(week);
        setWeakness(weak);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-purple-300 animate-pulse">
        {t('loadingStats')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        {t('learningStats')}
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={BarChart3} value={dashboard.totalPractices} label={t('totalPractices')} color="text-green-400" />
        <StatCard icon={TrendingUp} value={`${dashboard.avgScore}%`} label={t('avgScore')} color="text-purple-400" />
        <StatCard icon={Target} value={dashboard.completedConcepts} label={t('completedConcepts')} color="text-blue-400" />
        <StatCard icon={Award} value={`${dashboard.bestScore}%`} label={t('bestScore')} color="text-yellow-400" />
      </div>

      {weekly && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
          <h2 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            {t('weeklyReport')}
            {weekly.tier === 'Free' && (
              <span className="text-xs text-gray-500 font-normal">({t('basicOnly')})</span>
            )}
          </h2>
          <div className="flex gap-4 text-sm">
            <span>{t('thisWeek')}: <strong className="text-green-400">{weekly.weekTotal}</strong></span>
            <span>{t('weekAvg')}: <strong className="text-purple-400">{weekly.weekAvg}%</strong></span>
          </div>
          {weekly.dailyBreakdown?.length > 0 && (
            <div className="space-y-1">
              {weekly.dailyBreakdown.map((day, i) => (
                <div key={i} className="flex justify-between text-xs text-gray-400">
                  <span>{new Date(day.day).toLocaleDateString()}</span>
                  <span>{day.practices} {t('practices')} · {day.avg_score}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {weakness?.weakWords?.length > 0 && (
        <div className="bg-white/5 border border-orange-400/20 rounded-xl p-5 space-y-3">
          <h2 className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            {t('weaknessAnalysis')}
            <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">
              {weakness.skillLevel}
            </span>
          </h2>
          {weakness.weakWords.map((w, i) => (
            <div key={i} className="flex justify-between items-center text-sm bg-black/20 rounded-lg px-3 py-2">
              <span className="font-semibold text-orange-200">{w.word}</span>
              <span className="text-gray-400">{w.avgScore}% · {w.attempts}x</span>
            </div>
          ))}
        </div>
      )}

      <Leaderboard t={t} />

      <button
        onClick={onBack}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold"
      >
        {t('backHome')}
      </button>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }) {
  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-5 text-center">
      <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

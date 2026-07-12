import { dbManager } from './dbManager.js';
import { ontologyEngine } from './ontologyEngine.js';
import { subscriptionManager } from './subscriptionManager.js';

class AnalyticsEngine {
  async getDashboard(userId) {
    const [stats, completedConcepts, progress, recentScores] = await Promise.all([
      dbManager.getUserScoreStats(userId),
      dbManager.getCompletedConceptCount(userId),
      dbManager.getAllUserProgress(userId),
      dbManager.getUserScores(userId, 5),
    ]);

    return {
      totalPractices: stats.total_practices,
      avgScore: stats.avg_score,
      bestScore: stats.best_score,
      completedConcepts,
      inProgressCount: progress.filter(p => p.status === 'in_progress').length,
      recentScores: recentScores.map(s => ({
        word: s.word,
        score: s.score,
        createdAt: s.created_at,
      })),
    };
  }

  async getWeeklyReport(userId) {
    const tier = await subscriptionManager.getUserTier(userId);
    const summary = await dbManager.getWeeklyScoreSummary(userId);
    const stats = await dbManager.getUserScoreStats(userId);

    const weekTotal = summary.reduce((sum, d) => sum + d.practices, 0);
    const weekAvg = summary.length
      ? Math.round(summary.reduce((sum, d) => sum + d.avg_score, 0) / summary.length)
      : 0;

    const report = {
      tier,
      weekTotal,
      weekAvg,
      dailyBreakdown: summary,
      overallAvg: stats.avg_score,
    };

    if (tier === 'Free') {
      report.note = 'Upgrade to Pro for detailed weekly insights';
      report.detailed = false;
    } else {
      report.detailed = true;
    }

    return report;
  }

  async getWeaknessAnalysis(userId) {
    const weakWords = await dbManager.getWeakWords(userId, 5);
    const stats = await dbManager.getUserScoreStats(userId);

    return {
      weakWords: weakWords.map(w => ({
        word: w.word,
        attempts: w.attempts,
        avgScore: w.avg_score,
        suggestion: w.avg_score < 60
          ? `Focus on "${w.word}" — practice 3 more times`
          : `Good progress on "${w.word}" — keep refining`,
      })),
      totalPractices: stats.total_practices,
      skillLevel: this._skillLevel(stats.avg_score),
    };
  }

  async getLeaderboard(limit = 10) {
    const rows = await dbManager.getLeaderboard(limit);
    return rows.map((row, idx) => ({
      rank: idx + 1,
      userId: row.user_id,
      name: row.name,
      tier: row.tier,
      totalPractices: row.total_practices,
      avgScore: row.avg_score,
    }));
  }

  async getRecommendedNext(userId, domainId, userLevel = 'beginner') {
    const progress = await dbManager.getAllUserProgress(userId);
    const completed = progress.filter(
      p => p.domain_id === domainId && p.status === 'completed'
    );

    const lastCompleted = completed
      .filter(p => p.completed_at)
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0];

    if (!lastCompleted) {
      const path = ontologyEngine.generateLearningPath(domainId, userLevel);
      const first = path.path.find(item => item.status === 'available');
      return {
        domainId,
        completedCount: 0,
        recommendation: first
          ? { conceptId: first.conceptId, name: first.name, reason: 'Start with first available concept' }
          : null,
      };
    }

    const result = ontologyEngine.recommendNextConcept(userId, lastCompleted.concept_id);
    return {
      domainId,
      completedCount: completed.length,
      recommendation: result.recommendation
        ? {
            conceptId: result.recommendation.id,
            name: result.recommendation.name,
            difficulty: result.recommendation.difficulty,
            reason: result.message || 'Based on your progress',
          }
        : null,
      message: result.message,
    };
  }

  _skillLevel(avgScore) {
    if (avgScore >= 81) return 'Expert';
    if (avgScore >= 61) return 'Advanced';
    if (avgScore >= 31) return 'Intermediate';
    return 'Beginner';
  }
}

export const analyticsEngine = new AnalyticsEngine();

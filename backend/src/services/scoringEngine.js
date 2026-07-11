const DIFFICULTY_MULTIPLIER = {
  beginner: 1.1,
  intermediate: 1.0,
  advanced: 0.9,
};

const LEVEL_BOUNDS = {
  beginner: { min: 20, max: 85 },
  intermediate: { min: 10, max: 95 },
  advanced: { min: 0, max: 100 },
};

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z\-]/g, '');
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  if (!a && !b) return 1;
  if (!a || !b) return 0;
  const maxLen = Math.max(a.length, b.length);
  return 1 - levenshtein(a, b) / maxLen;
}

function getSyllables(pronunciation) {
  return pronunciation.split('-').filter(Boolean);
}

function getStressPositions(pronunciation) {
  const syllables = getSyllables(pronunciation);
  return syllables
    .map((syl, i) => (/[A-Z]{2,}|[A-Z]/.test(syl) ? i : -1))
    .filter(i => i >= 0);
}

function stressMatchScore(user, correct) {
  const userStress = getStressPositions(user);
  const correctStress = getStressPositions(correct);
  if (correctStress.length === 0) return 1;
  const matches = correctStress.filter(s => userStress.includes(s)).length;
  return matches / correctStress.length;
}

export class ScoringEngine {
  calculateSyllableAccuracy(user, correct) {
    const normUser = normalize(user);
    const normCorrect = normalize(correct);
    const sim = similarity(normUser, normCorrect);

    const syllableMatch = (() => {
      const userSyls = getSyllables(user);
      const correctSyls = getSyllables(correct);
      if (correctSyls.length === 0) return 0;
      let matched = 0;
      for (let i = 0; i < Math.min(userSyls.length, correctSyls.length); i++) {
        if (similarity(normalize(userSyls[i]), normalize(correctSyls[i])) >= 0.6) matched++;
      }
      return matched / correctSyls.length;
    })();

    const stressScore = stressMatchScore(user, correct);

    const syllableClarity = Math.round(sim * 20);
    const stressAccuracy = Math.round(stressScore * 15);
    const phonemeAccuracy = Math.round(syllableMatch * 5);

    return {
      total: syllableClarity + stressAccuracy + phonemeAccuracy,
      syllableClarity,
      stressAccuracy,
      phonemeAccuracy,
    };
  }

  calculateFluency(user, correct, syllableSim) {
    const userSyls = getSyllables(user);
    const correctSyls = getSyllables(correct);
    const sylDiff = Math.abs(userSyls.length - correctSyls.length);

    const speedScore = sylDiff <= 1 ? 10 : sylDiff <= 2 ? 7 : 4;
    const naturalness = Math.round(syllableSim * 10);
    const rhythm = Math.round(stressMatchScore(user, correct) * 10);

    return { total: speedScore + naturalness + rhythm, speedScore, naturalness, rhythm };
  }

  calculateContextuality(user, correct, overallSim) {
    const stressScore = stressMatchScore(user, correct);
    const situational = Math.round(overallSim * 10);
    const formality = stressScore >= 0.8 ? 10 : stressScore >= 0.5 ? 6 : 3;
    return { total: situational + formality, situational, formality };
  }

  calculateConversational(overallSim) {
    if (overallSim >= 0.9) return 10;
    if (overallSim >= 0.75) return 7;
    if (overallSim >= 0.6) return 5;
    if (overallSim >= 0.4) return 3;
    return 0;
  }

  getGrade(score) {
    if (score >= 81) return 'advanced';
    if (score >= 61) return 'intermediate';
    if (score >= 31) return 'developing';
    return 'beginner';
  }

  getFeedback(score, breakdown) {
    if (score >= 85) return 'Excellent pronunciation! You sound very natural.';
    if (score >= 70) return 'Good attempt! Minor stress adjustments will improve clarity.';
    if (score >= 50) return 'Keep practicing. Focus on syllable stress and vowel sounds.';
    if (breakdown.stressAccuracy < 8) return 'Pay attention to primary stress placement on the correct syllable.';
    return 'Start slow: practice each syllable separately, then combine at natural speed.';
  }

  async calculateScore(params) {
    const {
      userPronunciation,
      correctPronunciation,
      userLevel = 'intermediate',
      difficulty = 'intermediate',
    } = params;

    if (!userPronunciation || !correctPronunciation) {
      throw new Error('userPronunciation and correctPronunciation are required');
    }

    const normUser = normalize(userPronunciation);
    const normCorrect = normalize(correctPronunciation);
    const overallSim = similarity(normUser, normCorrect);

    const syllable = this.calculateSyllableAccuracy(userPronunciation, correctPronunciation);
    const fluency = this.calculateFluency(userPronunciation, correctPronunciation, overallSim);
    const contextuality = this.calculateContextuality(userPronunciation, correctPronunciation, overallSim);
    const conversational = this.calculateConversational(overallSim);

    let totalScore = syllable.total + fluency.total + contextuality.total + conversational;

    const multiplier = DIFFICULTY_MULTIPLIER[difficulty] ?? 1.0;
    totalScore = Math.round(totalScore * multiplier);

    const bounds = LEVEL_BOUNDS[userLevel] ?? LEVEL_BOUNDS.intermediate;
    totalScore = Math.max(bounds.min, Math.min(bounds.max, totalScore));

    const breakdown = {
      syllableAccuracy: syllable.total,
      fluency: fluency.total,
      contextuality: contextuality.total,
      conversational,
    };

    return {
      totalScore,
      breakdown,
      feedback: this.getFeedback(totalScore, syllable),
      grade: this.getGrade(totalScore),
      similarity: Math.round(overallSim * 100),
      userLevel,
      difficulty,
    };
  }
}

export const scoringEngine = new ScoringEngine();

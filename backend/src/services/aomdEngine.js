import { llmManager } from './llmManager.js';

const ROLE_CONFIG = {
  advocate: {
    name: 'Advocate',
    tone: 'warm, encouraging, positive',
    systemPrompt: 'You are an Advocate — a warm, encouraging English pronunciation coach who highlights what the learner did well. Respond in 1-2 sentences only. Be specific and motivating.',
  },
  opposite: {
    name: 'Opposite',
    tone: 'objective, direct, analytical',
    systemPrompt: 'You are an Opposite — an objective pronunciation analyst who clearly identifies errors and what needs fixing. Respond in 1-2 sentences only. Be direct but constructive.',
  },
  meditator: {
    name: 'Meditator',
    tone: 'balanced, educational, nuanced',
    systemPrompt: 'You are a Meditator — a balanced pronunciation teacher who presents both perspectives and explains context. Respond in 1-2 sentences only. Be educational and fair.',
  },
  decisioner: {
    name: 'Decisioner',
    tone: 'action-oriented, practical, clear',
    systemPrompt: 'You are a Decisioner — an action-oriented coach who gives concrete next steps for improvement. Respond in 1-2 sentences only. Be specific about what to practice next.',
  },
};

export class AOMDEngine {
  buildPrompt(role, params) {
    const { userPronunciation, correctPronunciation, word, score, context } = params;
    const config = ROLE_CONFIG[role];

    return `[Role] ${config.name} (${config.tone})

[Context] ${context || 'General'}
[Word] ${word}
[User Pronunciation] ${userPronunciation}
[Correct Pronunciation] ${correctPronunciation}
[Accuracy Score] ${score}/100

Generate ${config.name} feedback for this pronunciation attempt.
Respond with feedback text only — no labels, no JSON.`;
  }

  getFallbackFeedback(role, params) {
    const { userPronunciation, correctPronunciation, word, score, context } = params;

    const fallbacks = {
      advocate: `Great effort on "${word}"! Your pronunciation "${userPronunciation}" shows you understand the word structure. With a bit more practice on the stress pattern in "${correctPronunciation}", you'll sound more natural in ${context || 'professional'} settings.`,
      opposite: `Your pronunciation "${userPronunciation}" for "${word}" differs from the target "${correctPronunciation}". The primary stress and vowel sounds need adjustment. Score: ${score}/100 — focus on the first syllable emphasis.`,
      meditator: `Your attempt "${userPronunciation}" is understandable in casual ${context || 'professional'} contexts, though "${correctPronunciation}" is preferred in formal presentations. Both approaches have merit depending on the situation.`,
      decisioner: `Next step: practice "${word}" as "${correctPronunciation}" five times slowly, then use it in a ${context || 'workplace'} sentence. Focus on syllable stress first, then integrate into the full sentence within 5 minutes.`,
    };

    return fallbacks[role];
  }

  async generateRoleFeedback(role, params) {
    const config = ROLE_CONFIG[role];
    const prompt = this.buildPrompt(role, params);

    try {
      const feedback = await llmManager.generateText(prompt, config.systemPrompt);
      if (feedback && feedback.length > 10) {
        return { role: config.name, feedback, source: 'llm' };
      }
      throw new Error('LLM returned insufficient feedback');
    } catch (error) {
      console.error(`AOMD ${role} LLM error:`, error.message);
      return { role: config.name, feedback: this.getFallbackFeedback(role, params), source: 'template' };
    }
  }

  async generateAdvocateFeedback(params) {
    return this.generateRoleFeedback('advocate', params);
  }

  async generateOppositeFeedback(params) {
    return this.generateRoleFeedback('opposite', params);
  }

  async generateMediatorFeedback(params) {
    return this.generateRoleFeedback('meditator', params);
  }

  async generateDecisionerFeedback(params) {
    return this.generateRoleFeedback('decisioner', params);
  }

  async generateComprehensiveFeedback(params) {
    const [advocate, opposite, meditator, decisioner] = await Promise.all([
      this.generateAdvocateFeedback(params),
      this.generateOppositeFeedback(params),
      this.generateMediatorFeedback(params),
      this.generateDecisionerFeedback(params),
    ]);

    return {
      word: params.word,
      score: params.score,
      context: params.context,
      advocate: advocate.feedback,
      opposite: opposite.feedback,
      meditator: meditator.feedback,
      decisioner: decisioner.feedback,
      sources: {
        advocate: advocate.source,
        opposite: opposite.source,
        meditator: meditator.source,
        decisioner: decisioner.source,
      },
    };
  }
}

export const aomdEngine = new AOMDEngine();

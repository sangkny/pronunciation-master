export class LLMManager {
  constructor() {
    this.lmstudioApiUrl = process.env.LMSTUDIO_API_URL;
    this.lmstudioModel = process.env.LMSTUDIO_MODEL || 'google/gemma-4-e4b';
    this.ollamaApiUrl = process.env.OLLAMA_API_URL;
    this.ollamaModel = process.env.OLLAMA_MODEL || 'gemma:4b';
    this.provider = process.env.LLM_PROVIDER || 'ollama';
    this.timeoutMs = 30000;
  }

  async generateScenarioBasedMissions(params) {
    const { scenario, category, count = 5 } = params;

    try {
      const prompt = this.buildScenarioPrompt(scenario, category, count);
      const responseText = await this.generateText(
        prompt,
        'You are an English pronunciation teacher. Respond only with valid JSON.'
      );
      const missions = this.parseMissionsResponse(responseText, count);
      return { missions };
    } catch (error) {
      console.error('LLM Error:', error.message);
      return { missions: this.getSampleMissions(count, category, scenario) };
    }
  }

  async generateText(prompt, systemPrompt = 'You are a helpful assistant.') {
    if (this.lmstudioApiUrl) {
      return await this.callLMStudio(prompt, systemPrompt);
    }
    if (this.provider === 'ollama' && this.ollamaApiUrl) {
      return await this.callOllama(prompt);
    }
    throw new Error('No LLM provider configured');
  }

  buildScenarioPrompt(scenario, category, count) {
    const categoryMap = {
      medical: '의료기기 및 의료 분야',
      telecom: '통신 기술',
      finance: '금융',
      tech: '기술 및 컴퓨터',
      automotive: '자동차 산업',
    };

    return `You are a professional English pronunciation teacher.

[Category]
${categoryMap[category] || category}

[Scenario]
"${scenario}"

Create ${count} practical English sentences for pronunciation practice in this scenario.

Requirements:
- Natural expressions used in real situations
- 8-20 words per sentence
- Include 3-4 focus words for pronunciation practice
- Difficulty: easy, medium, or hard

Respond ONLY with valid JSON in this format:
{
  "missions": [
    {
      "id": 1,
      "sentence": "English sentence here",
      "focusPoints": ["word1", "word2", "word3"],
      "difficulty": "medium"
    }
  ]
}`;
  }

  async callLMStudio(prompt, systemPrompt = 'You are a helpful assistant.') {
    const baseUrl = this.lmstudioApiUrl.replace(/\/$/, '');
    const url = `${baseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.lmstudioModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`LMStudio API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('LMStudio returned empty response');
      }

      return content.trim();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async callOllama(prompt) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.ollamaApiUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API error ${response.status}`);
      }

      const data = await response.json();
      return data.response || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  parseMissionsResponse(responseText, count) {
    const jsonText = this.extractJson(responseText);
    const parsed = JSON.parse(jsonText);

    const missions = Array.isArray(parsed)
      ? parsed
      : parsed.missions || [];

    return missions.slice(0, count).map((mission, index) => ({
      id: mission.id ?? index + 1,
      sentence: mission.sentence || mission.text || `Sample sentence ${index + 1}`,
      focusPoints: mission.focusPoints || ['practice', 'pronunciation'],
      difficulty: mission.difficulty || 'medium',
      isGenerated: true,
    }));
  }

  extractJson(text) {
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }

    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return objectMatch[0];
    }

    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return arrayMatch[0];
    }

    return text.trim();
  }

  getSampleMissions(count, category = 'general', scenario = '') {
    const samplesByCategory = {
      medical: [
        {
          sentence: 'This advanced imaging system provides real-time diagnostic capabilities.',
          focusPoints: ['imaging', 'diagnostic', 'capabilities'],
          difficulty: 'medium',
        },
        {
          sentence: 'The patient monitoring device transmits vital signs continuously.',
          focusPoints: ['monitoring', 'transmits', 'vital'],
          difficulty: 'medium',
        },
        {
          sentence: 'Our surgical instruments meet the highest safety standards.',
          focusPoints: ['surgical', 'instruments', 'standards'],
          difficulty: 'easy',
        },
      ],
      telecom: [
        {
          sentence: 'The 5G network infrastructure enables faster data transmission.',
          focusPoints: ['infrastructure', 'enables', 'transmission'],
          difficulty: 'medium',
        },
        {
          sentence: 'Signal coverage has improved significantly in rural areas.',
          focusPoints: ['coverage', 'significantly', 'rural'],
          difficulty: 'easy',
        },
      ],
      finance: [
        {
          sentence: 'Portfolio diversification is essential for risk management.',
          focusPoints: ['diversification', 'essential', 'management'],
          difficulty: 'hard',
        },
        {
          sentence: 'Interest rates affect long-term investment strategies.',
          focusPoints: ['interest', 'investment', 'strategies'],
          difficulty: 'medium',
        },
      ],
      tech: [
        {
          sentence: 'Cloud computing revolutionized our infrastructure architecture.',
          focusPoints: ['computing', 'revolutionized', 'architecture'],
          difficulty: 'hard',
        },
        {
          sentence: 'The software update includes critical security patches.',
          focusPoints: ['software', 'critical', 'patches'],
          difficulty: 'medium',
        },
      ],
      automotive: [
        {
          sentence: 'Advanced safety systems minimize collision risks.',
          focusPoints: ['advanced', 'minimize', 'collision'],
          difficulty: 'medium',
        },
        {
          sentence: 'Electric vehicle batteries require specialized maintenance.',
          focusPoints: ['electric', 'batteries', 'maintenance'],
          difficulty: 'medium',
        },
      ],
    };

    const pool = samplesByCategory[category] || samplesByCategory.tech;

    return Array.from({ length: count }, (_, i) => {
      const sample = pool[i % pool.length];
      return {
        id: i + 1,
        sentence: scenario
          ? `[Sample] ${sample.sentence}`
          : sample.sentence,
        focusPoints: sample.focusPoints,
        difficulty: sample.difficulty,
        isGenerated: false,
      };
    });
  }
}

export const llmManager = new LLMManager();

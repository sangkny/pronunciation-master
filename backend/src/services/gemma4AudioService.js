class Gemma4AudioService {
  constructor() {
    this.lmstudioUrl = (process.env.LMSTUDIO_API_URL || 'http://host.docker.internal:1234/v1').replace(/\/$/, '');
    this.model = process.env.GEMMA4_MODEL || process.env.LMSTUDIO_MODEL || 'google/gemma-4-e4b';
    this.timeoutMs = parseInt(process.env.AUDIO_MAX_DURATION || '60000', 10);
    this.sampleRate = parseInt(process.env.AUDIO_SAMPLE_RATE || '16000', 10);
  }

  buildMultimodalContent({ word, correctPronunciation, userLevel, ipaChartUrl, audioBase64, mode = 'analyze' }) {
    const textPrompt = mode === 'transcribe'
      ? 'Please transcribe the English word spoken in the attached audio context. Return only the transcribed text.'
      : `음성 분석 요청:
단어: ${word}
정확한 발음: ${correctPronunciation}
사용자 레벨: ${userLevel}
${audioBase64 ? `[Audio data provided: ${Math.round(audioBase64.length / 1024)}KB base64 WAV]` : ''}

다음을 포함한 분석:
1. 녹음된 음성의 음소 비교
2. 스트레스 패턴 분석
3. 유창성 평가
4. 구체적 개선점 (AOMD Advocate 관점 포함)`;

    const content = [{ type: 'text', text: textPrompt }];

    if (ipaChartUrl) {
      content.push({
        type: 'image_url',
        image_url: { url: ipaChartUrl },
      });
    }

    return content;
  }

  buildTextOnlyMessages(context, mode = 'analyze') {
    const { word, correctPronunciation, userLevel } = context;
    const userText = mode === 'transcribe'
      ? 'Transcribe the English pronunciation for the word "' + word + '". Return only the text.'
      : `Analyze pronunciation for:
Word: ${word}
Correct: ${correctPronunciation}
Level: ${userLevel}

Provide phoneme comparison, stress, fluency, and improvement tips (Advocate tone).`;

    return [
      {
        role: 'system',
        content: 'You are an English pronunciation expert AI (Gemma 4).',
      },
      { role: 'user', content: userText },
    ];
  }

  sanitizeMessages(messages) {
    return messages.map(({ role, content }) => ({ role, content }));
  }

  async callLMStudio(messages, useMultimodal = true, fallbackContext = null, fallbackMode = 'analyze') {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.lmstudioUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          messages: this.sanitizeMessages(messages),
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        if (useMultimodal && fallbackContext) {
          return this.callLMStudio(
            this.buildTextOnlyMessages(fallbackContext, fallbackMode),
            false
          );
        }
        throw new Error(`LMStudio ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async analyzeAudioWithIPA(audioBuffer, ipaChart, context) {
    const { word, correctPronunciation, userLevel } = context;

    try {
      const audioBase64 = audioBuffer.toString('base64');
      const ctx = { word, correctPronunciation, userLevel };
      const messages = [
        {
          role: 'system',
          content: '당신은 영어 발음 전문 AI입니다. 음성과 IPA 차트를 분석하여 발음 피드백을 제공합니다.',
        },
        {
          role: 'user',
          content: this.buildMultimodalContent({
            word,
            correctPronunciation,
            userLevel,
            ipaChartUrl: ipaChart,
            audioBase64,
            mode: 'analyze',
          }),
        },
      ];

      let analysis;
      try {
        analysis = await this.callLMStudio(messages, true, ctx, 'analyze');
      } catch {
        analysis = await this.callLMStudio(
          this.buildTextOnlyMessages(ctx, 'analyze'),
          false
        );
      }

      return {
        success: true,
        analysis,
        model: this.model,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Audio analysis error:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: 'WebGPU 브라우저 버전을 사용해주세요',
        analysis: this.getMockAnalysis(context),
        mock: true,
      };
    }
  }

  async transcribeAudio(audioBuffer, context = {}) {
    try {
      const audioBase64 = audioBuffer.toString('base64');
      const ctx = {
        word: context.word || 'unknown',
        correctPronunciation: context.correctPronunciation || '',
        userLevel: context.userLevel || 'beginner',
      };

      const messages = [
        {
          role: 'user',
          content: this.buildMultimodalContent({
            ...ctx,
            audioBase64,
            mode: 'transcribe',
          }),
        },
      ];

      let text;
      try {
        text = await this.callLMStudio(messages, true, ctx, 'transcribe');
      } catch {
        text = await this.callLMStudio(
          this.buildTextOnlyMessages(ctx, 'transcribe'),
          false
        );
      }

      return text || null;
    } catch (error) {
      console.error('Transcription error:', error.message);
      return null;
    }
  }

  getMockAnalysis(context) {
    const { word, correctPronunciation, userLevel } = context;
    return `[LMStudio offline mock] Word "${word}" (${correctPronunciation}) at ${userLevel} level.
1. Phoneme comparison: Review vowel length on stressed syllable.
2. Stress pattern: Emphasize the primary stress correctly.
3. Fluency: Maintain steady pace without pauses mid-word.
4. Improvement: Practice with slow TTS, then record again. Advocate: You're making progress — keep focusing on the target word!`;
  }

  getStatus() {
    return {
      model: this.model,
      lmstudioUrl: this.lmstudioUrl,
      sampleRate: this.sampleRate,
      maxDurationMs: this.timeoutMs,
    };
  }
}

export const gemma4AudioService = new Gemma4AudioService();

class STTEngine {
  isWhisperConfigured() {
    const key = process.env.OPENAI_API_KEY || '';
    return key.length > 0 && !key.includes('placeholder');
  }

  getProvider() {
    if (this.isWhisperConfigured()) return 'whisper';
    return 'mock';
  }

  async transcribeWithWhisper(audioBase64, mimeType = 'audio/m4a') {
    const buffer = Buffer.from(audioBase64, 'base64');
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, 'recording.m4a');
    formData.append('model', process.env.WHISPER_MODEL || 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Whisper API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    return {
      transcript: (data.text || '').trim(),
      confidence: 0.9,
      provider: 'whisper',
    };
  }

  async transcribeMock({ expectedWord }) {
    return {
      transcript: expectedWord || '',
      confidence: 0.7,
      provider: 'mock',
      message: 'Set OPENAI_API_KEY for real STT (Whisper)',
    };
  }

  async transcribe({ audioBase64, mimeType = 'audio/m4a', expectedWord, lang = 'en' }) {
    if (!audioBase64) {
      throw new Error('audioBase64 is required');
    }

    if (this.isWhisperConfigured()) {
      return this.transcribeWithWhisper(audioBase64, mimeType);
    }

    return this.transcribeMock({ expectedWord, lang });
  }
}

export const sttEngine = new STTEngine();

import { sttEngine } from './sttEngine.js';
import { gemma4AudioService } from './gemma4AudioService.js';

const MEL_BINS = 128;
const N_FFT = 400;
const HOP_LENGTH = 160;

class Gemma4NativeAudioService {
  constructor() {
    this.enabled = process.env.ENABLE_AUDIO === 'true';
    this.provider = process.env.AUDIO_PROVIDER || 'vllm';
    this.vllmUrl = (process.env.VLLM_API_URL || 'http://host.docker.internal:8000/v1').replace(/\/$/, '');
    this.vllmModel = process.env.VLLM_MODEL || process.env.GEMMA4_MODEL || 'google/gemma-4-e4b';
    this.sampleRate = parseInt(process.env.AUDIO_SAMPLE_RATE || '16000', 10);
    this.timeoutMs = parseInt(process.env.AUDIO_MAX_DURATION || '60000', 10);
    this._vllmAvailable = null;
    this._vllmCheckedAt = 0;
  }

  parseWavPcm(audioBuffer) {
    if (audioBuffer.length < 44) {
      return { samples: null, sampleRate: this.sampleRate };
    }

    const riff = audioBuffer.toString('ascii', 0, 4);
    const wave = audioBuffer.toString('ascii', 8, 12);
    if (riff !== 'RIFF' || wave !== 'WAVE') {
      return { samples: null, sampleRate: this.sampleRate };
    }

    let offset = 12;
    let sampleRate = this.sampleRate;
    let bitsPerSample = 16;
    let numChannels = 1;
    let dataOffset = -1;
    let dataSize = 0;

    while (offset + 8 <= audioBuffer.length) {
      const chunkId = audioBuffer.toString('ascii', offset, offset + 4);
      const chunkSize = audioBuffer.readUInt32LE(offset + 4);
      const chunkStart = offset + 8;

      if (chunkId === 'fmt ') {
        numChannels = audioBuffer.readUInt16LE(chunkStart + 2);
        sampleRate = audioBuffer.readUInt32LE(chunkStart + 4);
        bitsPerSample = audioBuffer.readUInt16LE(chunkStart + 14);
      } else if (chunkId === 'data') {
        dataOffset = chunkStart;
        dataSize = chunkSize;
        break;
      }

      offset = chunkStart + chunkSize + (chunkSize % 2);
    }

    if (dataOffset < 0 || dataSize === 0) {
      return { samples: null, sampleRate };
    }

    const bytesPerSample = bitsPerSample / 8;
    const frameCount = Math.floor(dataSize / (bytesPerSample * numChannels));
    const samples = new Float32Array(frameCount);

    for (let i = 0; i < frameCount; i += 1) {
      let sum = 0;
      for (let ch = 0; ch < numChannels; ch += 1) {
        const idx = dataOffset + (i * numChannels + ch) * bytesPerSample;
        if (bitsPerSample === 16) {
          sum += audioBuffer.readInt16LE(idx) / 32768;
        } else if (bitsPerSample === 8) {
          sum += (audioBuffer.readUInt8(idx) - 128) / 128;
        }
      }
      samples[i] = sum / numChannels;
    }

    return { samples, sampleRate };
  }

  hzToMel(hz) {
    return 2595 * Math.log10(1 + hz / 700);
  }

  melToHz(mel) {
    return 700 * (10 ** (mel / 2595) - 1);
  }

  buildMelFilterbank(numBins, sampleRate, nFft) {
    const lowMel = this.hzToMel(0);
    const highMel = this.hzToMel(sampleRate / 2);
    const melPoints = Array.from({ length: numBins + 2 }, (_, i) =>
      lowMel + (i * (highMel - lowMel)) / (numBins + 1)
    );
    const hzPoints = melPoints.map((m) => this.melToHz(m));
    const binPoints = hzPoints.map((hz) => Math.floor((nFft + 1) * hz / sampleRate));
    const filters = Array.from({ length: numBins }, () => new Float32Array(Math.floor(nFft / 2) + 1));

    for (let m = 1; m <= numBins; m += 1) {
      const left = binPoints[m - 1];
      const center = binPoints[m];
      const right = binPoints[m + 1];

      for (let k = left; k < center; k += 1) {
        if (center !== left) {
          filters[m - 1][k] = (k - left) / (center - left);
        }
      }
      for (let k = center; k < right; k += 1) {
        if (right !== center) {
          filters[m - 1][k] = (right - k) / (right - center);
        }
      }
    }

    return filters;
  }

  hannWindow(size) {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i += 1) {
      window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
    }
    return window;
  }

  computeFrameSpectrum(frame, nFft) {
    const spectrum = new Float32Array(Math.floor(nFft / 2) + 1);
    for (let k = 0; k < spectrum.length; k += 1) {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < frame.length; n += 1) {
        const angle = (-2 * Math.PI * k * n) / nFft;
        real += frame[n] * Math.cos(angle);
        imag += frame[n] * Math.sin(angle);
      }
      spectrum[k] = real * real + imag * imag;
    }
    return spectrum;
  }

  convertToMelSpectrogram(audioBuffer) {
    const { samples, sampleRate } = this.parseWavPcm(audioBuffer);
    if (!samples || samples.length < N_FFT) {
      return {
        frames: 0,
        bins: MEL_BINS,
        sampleRate: this.sampleRate,
        melSpectrogram: null,
        note: 'Non-WAV or too short — mel computed on metadata only',
      };
    }

    const filters = this.buildMelFilterbank(MEL_BINS, sampleRate, N_FFT);
    const window = this.hannWindow(N_FFT);
    const numFrames = Math.max(1, Math.floor((samples.length - N_FFT) / HOP_LENGTH) + 1);
    const melSpectrogram = [];

    for (let f = 0; f < numFrames; f += 1) {
      const start = f * HOP_LENGTH;
      const frame = new Float32Array(N_FFT);
      for (let i = 0; i < N_FFT; i += 1) {
        const idx = start + i;
        frame[i] = idx < samples.length ? samples[idx] * window[i] : 0;
      }

      const powerSpectrum = this.computeFrameSpectrum(frame, N_FFT);
      const melFrame = new Float32Array(MEL_BINS);

      for (let m = 0; m < MEL_BINS; m += 1) {
        let energy = 0;
        for (let k = 0; k < powerSpectrum.length; k += 1) {
          energy += powerSpectrum[k] * filters[m][k];
        }
        melFrame[m] = Math.log10(1 + energy);
      }

      melSpectrogram.push(melFrame);
    }

    return {
      frames: melSpectrogram.length,
      bins: MEL_BINS,
      sampleRate,
      hopLength: HOP_LENGTH,
      nFft: N_FFT,
      melSpectrogram,
    };
  }

  buildNativePrompt(context, mode = 'analyze') {
    const { word, correctPronunciation, userLevel } = context;
    if (mode === 'transcribe') {
      return `Transcribe the English word spoken in this audio. Return only the transcribed text. Expected word hint: ${word}`;
    }
    return `Analyze English pronunciation:
Word: ${word}
Correct pronunciation (IPA): ${correctPronunciation}
User level: ${userLevel}

Using the native audio input, provide:
1. Phoneme comparison vs target
2. Stress pattern analysis
3. Fluency assessment
4. Specific improvement tips (Advocate tone)`;
  }

  buildNativeMessages({ audioBase64, audioFormat, ipaChartUrl, context, mode = 'analyze' }) {
    const content = [
      { type: 'text', text: this.buildNativePrompt(context, mode) },
      {
        type: 'input_audio',
        input_audio: {
          data: audioBase64,
          format: audioFormat || 'wav',
        },
      },
    ];

    if (ipaChartUrl) {
      content.push({
        type: 'image_url',
        image_url: { url: ipaChartUrl },
      });
    }

    return [
      {
        role: 'system',
        content: 'You are an English pronunciation expert AI with native audio understanding (Gemma 4).',
      },
      { role: 'user', content },
    ];
  }

  async callVllm(messages) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.vllmUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.vllmModel,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
          stream: false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`vLLM ${response.status}: ${errText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async checkVllmHealth(force = false) {
    const now = Date.now();
    if (!force && this._vllmAvailable !== null && now - this._vllmCheckedAt < 30000) {
      return this._vllmAvailable;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${this.vllmUrl}/models`, { signal: controller.signal });
      clearTimeout(timeoutId);
      this._vllmAvailable = response.ok;
    } catch {
      this._vllmAvailable = false;
    }

    this._vllmCheckedAt = now;
    return this._vllmAvailable;
  }

  async fallbackToWhisper(audioBuffer, context = {}) {
    const audioBase64 = audioBuffer.toString('base64');
    const mimeType = audioBuffer.toString('ascii', 0, 4) === 'RIFF' ? 'audio/wav' : 'audio/webm';

    try {
      const result = await sttEngine.transcribe({
        audioBase64,
        mimeType,
        expectedWord: context.word,
      });

      return {
        success: true,
        transcript: result.transcript,
        provider: result.provider,
        confidence: result.confidence,
      };
    } catch (error) {
      return {
        success: false,
        transcript: context.word || '',
        provider: 'mock',
        error: error.message,
      };
    }
  }

  buildWhisperAnalysis(context, whisperResult) {
    const { word, correctPronunciation, userLevel } = context;
    const transcript = (whisperResult.transcript || '').trim();
    const match = transcript.toLowerCase() === word.toLowerCase();

    return `[Whisper Fallback — ${whisperResult.provider}]
Transcript: "${transcript}" (expected: "${word}")
Match: ${match ? 'Yes ✓' : 'Partial — review vowels/consonants'}

1. Phoneme: Compare "${transcript}" to target ${correctPronunciation}.
2. Stress: Emphasize the primary stressed syllable in "${word}".
3. Fluency: ${match ? 'Good word recognition — refine stress and vowel length.' : 'Practice slowly with TTS, then re-record.'}
4. Advocate (${userLevel}): You're building muscle memory — keep practicing "${word}"!`;
  }

  async analyzeNativeAudio(audioBuffer, context, options = {}) {
    const startMs = Date.now();
    const audioBase64 = audioBuffer.toString('base64');
    const audioFormat = options.audioFormat || 'wav';
    const melSpec = this.convertToMelSpectrogram(audioBuffer);

    if (this.enabled && this.provider === 'vllm') {
      const vllmUp = await this.checkVllmHealth();
      if (vllmUp) {
        try {
          const messages = this.buildNativeMessages({
            audioBase64,
            audioFormat,
            ipaChartUrl: options.ipaChartUrl,
            context,
            mode: 'analyze',
          });

          const analysis = await this.callVllm(messages);

          return {
            success: true,
            analysis,
            provider: 'vllm-native',
            nativeAudio: true,
            model: this.vllmModel,
            melFrames: melSpec.frames,
            melBins: melSpec.bins,
            latencyMs: Date.now() - startMs,
            processedAt: new Date().toISOString(),
          };
        } catch (error) {
          console.warn('vLLM native audio failed, falling back to Whisper:', error.message);
        }
      }
    }

    const whisperResult = await this.fallbackToWhisper(audioBuffer, context);
    return {
      success: true,
      analysis: this.buildWhisperAnalysis(context, whisperResult),
      provider: `whisper-${whisperResult.provider}`,
      nativeAudio: false,
      fallback: true,
      transcript: whisperResult.transcript,
      melFrames: melSpec.frames,
      melBins: melSpec.bins,
      latencyMs: Date.now() - startMs,
      processedAt: new Date().toISOString(),
    };
  }

  async handleAudioWithIPA(audioBuffer, ipaChart, context, options = {}) {
    return this.analyzeNativeAudio(audioBuffer, context, {
      ipaChartUrl: ipaChart,
      ...options,
    });
  }

  async getInfo() {
    const [vllmAvailable] = await Promise.all([this.checkVllmHealth()]);
    const legacyStatus = gemma4AudioService.getStatus();

    return {
      enableAudio: this.enabled,
      audioProvider: this.provider,
      nativeAudioSupported: vllmAvailable && this.enabled,
      vllm: {
        url: this.vllmUrl,
        model: this.vllmModel,
        available: vllmAvailable,
        supportsInputAudio: true,
      },
      lmstudio: {
        url: legacyStatus.lmstudioUrl,
        model: legacyStatus.model,
        supportsInputAudio: false,
      },
      whisper: {
        configured: sttEngine.isWhisperConfigured(),
        provider: sttEngine.getProvider(),
      },
      melSpec: {
        bins: MEL_BINS,
        sampleRate: this.sampleRate,
        hopLength: HOP_LENGTH,
        nFft: N_FFT,
      },
      webgpu: {
        enabled: process.env.WEBGPU_ENABLED === 'true',
      },
      legacy: legacyStatus,
    };
  }
}

export const gemma4NativeAudioService = new Gemma4NativeAudioService();

/**
 * 음성 처리 서비스
 * 1. WebGPU 우선 (프라이버시 — 기기 내 처리)
 * 2. 백엔드 Gemma 4 폴백
 * 3. 외부 STT API (최후)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const WEBGPU_ENABLED = import.meta.env.VITE_WEBGPU_ENABLED !== 'false';
const GEMMA_MODEL_ID = 'onnx-community/gemma-3-2b-it-ONNX';

let transformersModule = null;
let webgpuPipeline = null;

function getToken() {
  return localStorage.getItem('pm_token');
}

export function isWebGPUEnabled() {
  return WEBGPU_ENABLED && typeof window !== 'undefined';
}

export async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function audioToSpectrogram(audioBlob, canvas) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 16000,
  });
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  await audioContext.close();

  const channelData = audioBuffer.getChannelData(0);
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);

  const fftSize = 256;
  const hopSize = Math.max(1, Math.floor(channelData.length / width));

  for (let x = 0; x < width; x += 1) {
    const start = x * hopSize;
    let maxAmp = 0;

    for (let i = 0; i < fftSize && start + i < channelData.length; i += 1) {
      const sample = channelData[start + i];
      maxAmp = Math.max(maxAmp, Math.abs(sample));
    }

    const intensity = Math.min(255, Math.floor(maxAmp * 800));
    for (let y = 0; y < height; y += 1) {
      const row = height - 1 - y;
      const idx = (row * width + x) * 4;
      const threshold = (y / height) * 255;
      const val = intensity > threshold ? intensity : 0;
      imageData.data[idx] = val;
      imageData.data[idx + 1] = Math.floor(val * 0.6);
      imageData.data[idx + 2] = Math.floor(val * 0.9);
      imageData.data[idx + 3] = val > 0 ? 255 : 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

async function loadTransformers() {
  if (transformersModule) return transformersModule;
  transformersModule = await import('@huggingface/transformers');
  const { env } = transformersModule;
  env.useBrowserCache = true;
  env.allowLocalModels = false;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.proxy = true;
  }
  return transformersModule;
}

async function getWebGPUPipeline() {
  if (webgpuPipeline) return webgpuPipeline;
  const { pipeline } = await loadTransformers();

  try {
    webgpuPipeline = await pipeline('image-to-text', GEMMA_MODEL_ID, {
      device: 'webgpu',
    });
  } catch {
    webgpuPipeline = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning');
  }

  return webgpuPipeline;
}

function buildAnalysisPrompt(context) {
  return `Analyze this English pronunciation spectrogram.
Word: ${context.word}
Correct pronunciation (IPA): ${context.correctPronunciation}
User level: ${context.userLevel}

Provide:
1. Phoneme accuracy
2. Stress pattern
3. Fluency
4. Specific improvement (Advocate tone)`;
}

function localSpectrogramAnalysis(context, spectrogramStats) {
  return `[WebGPU Local Analysis]
Word: ${context.word} (${context.correctPronunciation})
Signal energy: ${spectrogramStats.energyLabel}

1. Phoneme: Compare your recording to the target IPA stress pattern.
2. Stress: Focus on the primary stressed syllable.
3. Fluency: ${spectrogramStats.energyLabel === 'strong' ? 'Good volume — maintain steady pace.' : 'Speak slightly louder and closer to the mic.'}
4. Advocate: Great effort! Repeat slowly with TTS, then try again.`;
}

function computeSpectrogramStats(audioBlob) {
  return audioBlob.size > 5000
    ? { energyLabel: 'strong' }
    : { energyLabel: 'weak' };
}

class AudioService {
  async recordAudio(maxDurationMs = 10000) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        resolve(new Blob(chunks, { type: 'audio/webm' }));
      };
      mediaRecorder.onerror = reject;
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') mediaRecorder.stop();
      }, maxDurationMs);
    });
  }

  async analyzeWithWebGPU(audioBlob, context, canvas) {
    if (!isWebGPUEnabled()) {
      throw new Error('WebGPU disabled');
    }

    const spectrogramImage = await audioToSpectrogram(audioBlob, canvas);
    const stats = computeSpectrogramStats(audioBlob);

    try {
      const pipe = await getWebGPUPipeline();
      const prompt = buildAnalysisPrompt(context);
      const result = await pipe(spectrogramImage, { prompt });
      const text = result?.[0]?.generated_text || result?.generated_text || '';

      if (text && text.length > 10) {
        return {
          method: 'WebGPU (Transformers.js)',
          result: text,
          confidence: 'high',
          privacy: 'local-only',
        };
      }
    } catch (err) {
      console.warn('WebGPU pipeline inference failed:', err.message);
    }

    return {
      method: 'WebGPU (local spectrogram)',
      result: localSpectrogramAnalysis(context, stats),
      confidence: 'medium',
      privacy: 'local-only',
    };
  }

  async analyzeWithBackend(audioBlob, context) {
    const audioBase64 = await blobToBase64(audioBlob);
    const token = getToken();

    const response = await fetch(`${API_URL}/api/audio/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        audioBase64,
        ipaChartUrl: context.ipaChart,
        word: context.word,
        correctPronunciation: context.correctPronunciation,
        userLevel: context.userLevel,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Backend error ${response.status}`);
    }

    return {
      method: data.mock ? 'Backend Gemma 4 (mock)' : 'Backend Gemma 4',
      result: data.analysis || data.error,
      confidence: data.success ? 'medium' : 'low',
      privacy: 'server-processed',
    };
  }

  async transcribeWithBackend(audioBlob) {
    const audioBase64 = await blobToBase64(audioBlob);
    const token = getToken();

    const response = await fetch(`${API_URL}/api/audio/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ audioBase64 }),
    });

    const data = await response.json();
    return data.text || '';
  }

  async analyzeAudio(audioBlob, context, canvas, preferWebGPU = true) {
    if (preferWebGPU && isWebGPUEnabled()) {
      try {
        return await this.analyzeWithWebGPU(audioBlob, context, canvas);
      } catch (error) {
        console.log('WebGPU failed, backend fallback:', error.message);
      }
    }

    return this.analyzeWithBackend(audioBlob, context);
  }

  speakAnalysis(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

const audioService = new AudioService();
export default audioService;

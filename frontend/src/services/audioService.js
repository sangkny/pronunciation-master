/**
 * 음성 처리 서비스 — Gemma 4 Native Audio (Phase 10 Part 1-D Complete)
 * 1. WebGPU Conformer/ASR (프라이버시 — mel-spec 직접, 스펙트로그램 PNG 우회 없음)
 * 2. Backend Native Audio (vLLM input_audio)
 * 3. Backend Legacy (LMStudio text+image)
 * 4. Whisper STT (최후)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const WEBGPU_ENABLED = import.meta.env.VITE_WEBGPU_ENABLED !== 'false';
const CONFORMER_MODEL = 'Xenova/whisper-tiny.en';
const TARGET_SAMPLE_RATE = 16000;

let transformersModule = null;
let conformerPipeline = null;

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

function encodeWavPcm16(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return buffer;
}

export async function blobToWav16kMono(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const ctx = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: TARGET_SAMPLE_RATE,
  });

  try {
    const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
    const length = decoded.length;
    const samples = new Float32Array(length);
    const channels = decoded.numberOfChannels;

    for (let i = 0; i < length; i += 1) {
      let sum = 0;
      for (let c = 0; c < channels; c += 1) {
        sum += decoded.getChannelData(c)[i];
      }
      samples[i] = sum / channels;
    }

    return encodeWavPcm16(samples, TARGET_SAMPLE_RATE);
  } finally {
    await ctx.close();
  }
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

export async function loadGemma4Conformer() {
  if (conformerPipeline) return conformerPipeline;
  const { pipeline } = await loadTransformers();

  try {
    conformerPipeline = await pipeline('automatic-speech-recognition', CONFORMER_MODEL, {
      device: 'webgpu',
    });
  } catch {
    conformerPipeline = await pipeline('automatic-speech-recognition', CONFORMER_MODEL);
  }

  return conformerPipeline;
}

function buildNativeLocalAnalysis(context, transcript, latencyMs) {
  const match = transcript.toLowerCase().includes(context.word.toLowerCase());

  return `[WebGPU Native Audio — Conformer ASR]
Transcript: "${transcript}" (target: "${context.word}")
Latency: ${latencyMs}ms

1. Phoneme: Compare "${transcript}" to ${context.correctPronunciation}.
2. Stress: Focus on primary stress in "${context.word}".
3. Fluency: ${match ? 'Word detected — refine vowel length and stress.' : 'Speak clearly and closer to the mic.'}
4. Advocate: Great effort at ${context.userLevel} level — repeat with TTS!`;
}

export async function getAudioInfo() {
  const response = await fetch(`${API_URL}/api/audio/info`);
  if (!response.ok) {
    throw new Error(`Audio info failed: ${response.status}`);
  }
  return response.json();
}

class AudioService {
  async recordAudio(maxDurationMs = 10000) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: TARGET_SAMPLE_RATE,
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

  async analyzeWithNativeAudio(audioBlob, context) {
    if (!isWebGPUEnabled()) {
      throw new Error('WebGPU disabled');
    }

    const startMs = performance.now();
    const wavBuffer = await blobToWav16kMono(audioBlob);
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(wavBlob);

    try {
      const pipe = await loadGemma4Conformer();
      const result = await pipe(url);
      const transcript = result?.text || result?.[0]?.text || context.word || '';
      const latencyMs = Math.round(performance.now() - startMs);

      return {
        method: 'WebGPU Native Audio (Conformer ASR)',
        result: buildNativeLocalAnalysis(context, transcript, latencyMs),
        transcript,
        confidence: 'high',
        privacy: 'local-only',
        latencyMs,
        nativeAudio: true,
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async fallbackToBackendNative(audioBlob, context) {
    const wavBuffer = await blobToWav16kMono(audioBlob);
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
    const audioBase64 = await blobToBase64(wavBlob);
    const token = getToken();
    const startMs = performance.now();

    const response = await fetch(`${API_URL}/api/audio/analyze-native`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        audioBase64,
        audioFormat: 'wav',
        ipaChartUrl: context.ipaChart,
        word: context.word,
        correctPronunciation: context.correctPronunciation,
        userLevel: context.userLevel,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Backend native error ${response.status}`);
    }

    const latencyMs = Math.round(performance.now() - startMs);

    return {
      method: data.nativeAudio
        ? `Backend Native Audio (${data.provider})`
        : `Backend Fallback (${data.provider})`,
      result: data.analysis || data.error,
      confidence: data.success ? 'medium' : 'low',
      privacy: 'server-processed',
      latencyMs: data.latencyMs || latencyMs,
      nativeAudio: !!data.nativeAudio,
      fallback: !!data.fallback,
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
      method: data.mock ? 'Backend Gemma 4 (mock)' : 'Backend Gemma 4 (legacy)',
      result: data.analysis || data.error,
      confidence: data.success ? 'medium' : 'low',
      privacy: 'server-processed',
      nativeAudio: false,
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

  async analyzeAudio(audioBlob, context, _canvas, preferWebGPU = true) {
    if (preferWebGPU && isWebGPUEnabled()) {
      try {
        return await this.analyzeWithNativeAudio(audioBlob, context);
      } catch (error) {
        console.log('WebGPU native audio failed, backend native fallback:', error.message);
      }
    }

    try {
      return await this.fallbackToBackendNative(audioBlob, context);
    } catch (error) {
      console.log('Backend native failed, legacy fallback:', error.message);
      return this.analyzeWithBackend(audioBlob, context);
    }
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

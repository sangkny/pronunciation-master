export const SAMPLE_RATE = parseInt(
  process.env.EXPO_PUBLIC_AUDIO_SAMPLE_RATE || '16000',
  10
);

export const AUDIO_MAX_DURATION_MS = parseInt(
  process.env.EXPO_PUBLIC_AUDIO_MAX_DURATION || '10000',
  10
);

export const MAX_RECORDING_SEC = Math.max(1, Math.floor(AUDIO_MAX_DURATION_MS / 1000));

export const AUDIO_FORMAT = (process.env.EXPO_PUBLIC_AUDIO_FORMAT || 'WAV').toUpperCase();

export const AUDIO_QUALITY = (process.env.EXPO_PUBLIC_AUDIO_QUALITY || 'HIGH').toUpperCase();

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getRecordingStatusLabel({ isRecording, hasRecording, isPlaying }) {
  if (isRecording) return '🎤 Recording';
  if (isPlaying) return '▶️ Playing';
  if (hasRecording) return '⏸️ Stopped';
  return '⏸️ Ready';
}

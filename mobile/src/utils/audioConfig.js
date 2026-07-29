export const SAMPLE_RATE = parseInt(
  process.env.EXPO_PUBLIC_AUDIO_SAMPLE_RATE || '16000',
  10
);

export const MAX_RECORDING_SEC = parseInt(
  process.env.EXPO_PUBLIC_MAX_RECORDING_SEC || '10',
  10
);

export function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

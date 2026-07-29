import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { SAMPLE_RATE, MAX_RECORDING_SEC } from '../utils/audioConfig';
import { isWavBase64 } from '../utils/wavEncoder';
import * as api from './api';

let recordingInstance = null;
let playbackSound = null;
let durationCallback = null;
let recordingStoppedCallback = null;
let playbackFinishedCallback = null;
let statusSubscription = null;

export const RECORDING_OPTIONS = {
  isMeteringEnabled: true,
  android: {
    extension: '.wav',
    outputFormat: Audio.AndroidOutputFormat.DEFAULT,
    audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
    sampleRate: SAMPLE_RATE,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: SAMPLE_RATE,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/wav',
    bitsPerSecond: 128000,
  },
};

export function setDurationCallback(cb) {
  durationCallback = cb;
}

export function setRecordingStoppedCallback(cb) {
  recordingStoppedCallback = cb;
}

export function setPlaybackFinishedCallback(cb) {
  playbackFinishedCallback = cb;
}

function notifyDuration(seconds) {
  durationCallback?.(seconds);
}

function clearStatusSubscription() {
  if (statusSubscription) {
    statusSubscription.remove?.();
    statusSubscription = null;
  }
}

export async function initializeRecorder() {
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('마이크 권한이 필요합니다');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  return { sampleRate: SAMPLE_RATE, format: 'wav', maxDurationSec: MAX_RECORDING_SEC };
}

export async function startRecording() {
  await initializeRecorder();

  if (recordingInstance) {
    await cancelRecording();
  }

  const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
  recordingInstance = recording;

  clearStatusSubscription();
  statusSubscription = recording.setOnRecordingStatusUpdate((status) => {
    if (status.isRecording && status.durationMillis != null) {
      const sec = status.durationMillis / 1000;
      notifyDuration(sec);
      if (sec >= MAX_RECORDING_SEC) {
        stopRecording()
          .then((result) => {
            if (result) recordingStoppedCallback?.(result);
          })
          .catch(() => {});
      }
    }
  });

  await recording.startAsync();
  notifyDuration(0);
  return recording;
}

export async function stopRecording() {
  if (!recordingInstance) {
    return null;
  }

  clearStatusSubscription();

  let durationMs = 0;
  try {
    const status = await recordingInstance.getStatusAsync();
    durationMs = status.durationMillis || 0;
  } catch {
    durationMs = 0;
  }

  await recordingInstance.stopAndUnloadAsync();
  const rawUri = recordingInstance.getURI();
  recordingInstance = null;

  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

  if (!rawUri) {
    return null;
  }

  const info = await FileSystem.getInfoAsync(rawUri);
  const audioBase64 = await FileSystem.readAsStringAsync(rawUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const wavUri = rawUri.endsWith('.wav')
    ? rawUri
    : `${FileSystem.cacheDirectory}recording-${Date.now()}.wav`;

  if (wavUri !== rawUri) {
    await FileSystem.copyAsync({ from: rawUri, to: wavUri });
  }

  const durationSec = durationMs > 0
    ? Math.min(MAX_RECORDING_SEC, durationMs / 1000)
    : Math.min(MAX_RECORDING_SEC, Math.max(0.1, (info.size || 0) / (SAMPLE_RATE * 2)));

  const result = {
    audioUri: wavUri,
    rawUri,
    audioBase64,
    duration: durationSec,
    isWav: isWavBase64(audioBase64),
    sampleRate: SAMPLE_RATE,
  };

  notifyDuration(durationSec);
  return result;
}

export async function cancelRecording() {
  clearStatusSubscription();
  if (recordingInstance) {
    try {
      await recordingInstance.stopAndUnloadAsync();
    } catch {
      // already stopped
    }
    recordingInstance = null;
  }
  await stopPlayback();
  notifyDuration(0);
}

export async function playRecording(audioUri) {
  if (!audioUri) return null;

  await stopPlayback();

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });

  const { sound } = await Audio.Sound.createAsync(
    { uri: audioUri },
    { shouldPlay: true }
  );
  playbackSound = sound;

  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      stopPlayback();
      playbackFinishedCallback?.();
    }
  });

  return sound;
}

export async function stopPlayback() {
  if (playbackSound) {
    try {
      await playbackSound.stopAsync();
      await playbackSound.unloadAsync();
    } catch {
      // ignore
    }
    playbackSound = null;
  }
}

export function isPlaying() {
  return playbackSound !== null;
}

export async function analyzeNativeAudio(audioBase64, context) {
  return api.analyzeNativeAudio({
    audioBase64,
    audioFormat: 'wav',
    word: context.word,
    correctPronunciation: context.correctPronunciation,
    userLevel: context.userLevel || 'beginner',
  });
}

export async function analyzeNativeAudioFromRecording(recording, context) {
  const base64 = recording?.audioBase64;
  if (!base64) {
    throw new Error('녹음 데이터가 없습니다');
  }
  return analyzeNativeAudio(base64, context);
}

export async function getServerAudioInfo() {
  return api.getAudioInfo();
}

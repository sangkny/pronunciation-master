import * as FileSystem from 'expo-file-system';
import * as api from './api';

export async function analyzeNativeAudio(audioUri, context) {
  const base64 = await FileSystem.readAsStringAsync(audioUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return api.analyzeNativeAudio({
    audioBase64: base64,
    audioFormat: 'wav',
    word: context.word,
    correctPronunciation: context.correctPronunciation,
    userLevel: context.userLevel || 'beginner',
  });
}

export async function getServerAudioInfo() {
  return api.getAudioInfo();
}

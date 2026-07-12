import * as FileSystem from 'expo-file-system';
import * as api from './api';

export async function transcribeRecording(uri, expectedWord) {
  if (!uri) {
    throw new Error('Recording URI is required');
  }

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return api.transcribeAudio({
    audioBase64: base64,
    mimeType: 'audio/m4a',
    expectedWord,
    lang: 'en',
  });
}

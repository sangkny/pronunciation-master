import { Audio } from 'expo-av';

let recording = null;

export async function startRecording() {
  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Microphone permission required');
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const { recording: newRecording } = await Audio.Recording.createAsync(
    Audio.RecordingOptionsPresets.HIGH_QUALITY
  );
  recording = newRecording;
  return recording;
}

export async function stopRecording() {
  if (!recording) return null;

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  recording = null;
  await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  return uri;
}

export function isRecording() {
  return recording !== null;
}

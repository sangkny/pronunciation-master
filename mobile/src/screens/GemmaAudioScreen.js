import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import RecordingUI from '../components/RecordingUI';
import * as audioService from '../services/audioService';
import { MAX_RECORDING_SEC } from '../utils/audioConfig';
import { colors, spacing } from '../constants/theme';

export default function GemmaAudioScreen({ route, navigation }) {
  const domain = route.params?.domain;
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [serverInfo, setServerInfo] = useState(null);
  const durationRef = useRef(0);

  const word = 'equipment';
  const correctPronunciation = 'ih-KWIP-muhnt';

  useEffect(() => {
    audioService.getServerAudioInfo().then(setServerInfo).catch(() => null);
    audioService.setDurationCallback((sec) => {
      durationRef.current = sec;
      setDuration(sec);
    });
    audioService.setRecordingStoppedCallback((recording) => {
      if (recording) {
        setRecordedAudio(recording);
        setIsRecording(false);
        setDuration(recording.duration || durationRef.current);
      }
    });
    audioService.setPlaybackFinishedCallback(() => {
      setIsPlaying(false);
    });

    return () => {
      audioService.setDurationCallback(null);
      audioService.setRecordingStoppedCallback(null);
      audioService.setPlaybackFinishedCallback(null);
      audioService.cancelRecording().catch(() => {});
    };
  }, []);

  const resetSession = useCallback(() => {
    setRecordedAudio(null);
    setDuration(0);
    durationRef.current = 0;
    setResult(null);
    setError('');
    setIsPlaying(false);
  }, []);

  const startRecording = async () => {
    setError('');
    resetSession();
    try {
      await audioService.startRecording();
      setIsRecording(true);
    } catch (err) {
      setError(err.message);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setError('');
    try {
      const recording = await audioService.stopRecording();
      setIsRecording(false);
      if (recording) {
        setRecordedAudio(recording);
        setDuration(recording.duration || durationRef.current);
      }
    } catch (err) {
      setError(err.message);
      setIsRecording(false);
    }
  };

  const playRecording = async () => {
    if (!recordedAudio?.audioUri) return;
    setError('');
    try {
      await audioService.playRecording(recordedAudio.audioUri);
      setIsPlaying(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const stopPlayback = async () => {
    await audioService.stopPlayback();
    setIsPlaying(false);
  };

  const handleCancel = async () => {
    await audioService.cancelRecording();
    resetSession();
    setIsRecording(false);
  };

  const analyzeAudio = async () => {
    if (!recordedAudio?.audioBase64) {
      setError('먼저 녹음을 완료해주세요');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResult(null);

    try {
      await audioService.stopPlayback();
      setIsPlaying(false);

      const data = await audioService.analyzeNativeAudio(
        recordedAudio.audioBase64,
        { word, correctPronunciation, userLevel: 'beginner' }
      );

      setResult({
        analysis: data.analysis,
        provider: data.provider,
        nativeAudio: data.nativeAudio,
        latencyMs: data.latencyMs,
        fallback: data.fallback,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const vllmStatus = serverInfo?.vllm?.available
    ? 'vLLM Native ✅'
    : serverInfo?.whisper?.configured
      ? 'Whisper Fallback'
      : 'Mock Fallback';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.headerRow}>
        <Text style={styles.title}>Gemma 4 Native Audio</Text>
        {serverInfo && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{vllmStatus}</Text>
          </View>
        )}
      </View>

      {domain && (
        <Text style={styles.domain}>{domain.emoji} {domain.name}</Text>
      )}
      <Text style={styles.word}>{word}</Text>
      <Text style={styles.ipa}>{correctPronunciation}</Text>

      <RecordingUI
        isRecording={isRecording}
        isPlaying={isPlaying}
        isAnalyzing={isAnalyzing}
        duration={duration}
        maxDuration={MAX_RECORDING_SEC}
        recordedAudio={recordedAudio}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onPlayRecording={playRecording}
        onStopPlayback={stopPlayback}
        onCancel={handleCancel}
        onAnalyze={analyzeAudio}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.provider}>
            {result.nativeAudio ? '🟢 Native Audio' : '🟡 Fallback'} · {result.provider}
            {result.latencyMs ? ` · ${result.latencyMs}ms` : ''}
          </Text>
          <Text style={styles.analysis}>{result.analysis}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 60 },
  backBtn: { marginBottom: spacing.md },
  backText: { color: colors.primaryLight, fontSize: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.primaryLight },
  badge: { backgroundColor: '#312e81', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: colors.primaryLight, fontSize: 11 },
  domain: { fontSize: 16, color: colors.textMuted, marginBottom: 8 },
  word: { fontSize: 32, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  ipa: { fontSize: 16, color: colors.primary, marginBottom: spacing.lg },
  error: { color: colors.error, marginTop: spacing.md, textAlign: 'center' },
  resultCard: { marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md },
  provider: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.sm },
  analysis: { color: colors.text, lineHeight: 22 },
});

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import RecordingUI from '../components/RecordingUI';
import * as audioService from '../services/audioService';
import { useApi } from '../hooks/useApi';
import { useAppStore } from '../store/useAppStore';
import { MAX_RECORDING_SEC, SAMPLE_RATE, AUDIO_FORMAT } from '../utils/audioConfig';
import { colors, spacing } from '../constants/theme';

export default function GemmaAudioScreen({ route, navigation }) {
  const domain = route.params?.domain;
  const tier = useAppStore((s) => s.tier);
  const isLoading = useAppStore((s) => s.isLoading);
  const storeError = useAppStore((s) => s.error);
  const isOnline = useAppStore((s) => s.isOnline);
  const addAnalysis = useAppStore((s) => s.addAnalysis);
  const { request } = useApi();
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

    if (!isOnline) {
      setError('네트워크 연결을 확인해주세요.');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResult(null);

    try {
      await audioService.stopPlayback();
      setIsPlaying(false);

      const data = await request('post', '/api/audio/analyze-native', {
        audioBase64: recordedAudio.audioBase64,
        audioFormat: 'wav',
        word,
        correctPronunciation,
        userLevel: (tier || 'Free').toLowerCase(),
      });

      const analysisResult = {
        analysis: data.analysis,
        provider: data.provider,
        nativeAudio: data.nativeAudio,
        latencyMs: data.latencyMs,
        fallback: data.fallback,
        word,
      };

      addAnalysis(analysisResult);
      setResult(analysisResult);
    } catch (err) {
      setError(storeError || err.response?.data?.error || err.message);
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

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>발음 분석</Text>
        <Text style={styles.headerSubtitle}>Gemma 4 Native Audio</Text>
        {serverInfo && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{vllmStatus}</Text>
          </View>
        )}
      </View>

      {/* Word card */}
      <View style={styles.wordCard}>
        {domain && (
          <Text style={styles.domain}>{domain.emoji} {domain.name}</Text>
        )}
        <Text style={styles.word}>{word}</Text>
        <Text style={styles.ipa}>{correctPronunciation}</Text>
        <Text style={styles.hint}>
          {SAMPLE_RATE}Hz · {AUDIO_FORMAT} · 최대 {MAX_RECORDING_SEC}초
        </Text>
      </View>

      <RecordingUI
        isRecording={isRecording}
        isPlaying={isPlaying}
        isAnalyzing={isAnalyzing || isLoading}
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

      {error || storeError ? (
        <Text style={styles.error}>{error || storeError}</Text>
      ) : null}

      {!isOnline && (
        <Text style={styles.offline}>📡 오프라인 — 분석 불가</Text>
      )}

      {/* AOMD Feedback result */}
      {isAnalyzing && !result && (
        <View style={styles.resultCard}>
          <ActivityIndicator color={colors.primaryLight} size="small" />
          <Text style={styles.analyzingLabel}>AOMD 피드백 생성 중...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>AOMD 피드백</Text>
          <Text style={styles.provider}>
            {result.nativeAudio ? '🟢 Native Audio' : '🟡 Fallback'} · {result.provider}
            {result.latencyMs ? ` · ${result.latencyMs}ms` : ''}
          </Text>
          <View style={styles.feedbackBox}>
            <Text style={styles.analysis}>{result.analysis}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 56, paddingBottom: 40 },
  backBtn: { marginBottom: spacing.md },
  backText: { color: colors.primaryLight, fontSize: 16 },
  header: { marginBottom: spacing.lg, gap: 4 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 14, color: colors.textMuted },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#312e81',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  badgeText: { color: colors.primaryLight, fontSize: 11 },
  wordCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  domain: { fontSize: 14, color: colors.textMuted, marginBottom: 8 },
  word: { fontSize: 36, fontWeight: 'bold', color: colors.text },
  ipa: { fontSize: 18, color: colors.primary, marginTop: 4 },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  error: {
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
    fontSize: 14,
  },
  offline: {
    color: colors.warning,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 13,
  },
  resultCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#4c1d95',
    gap: spacing.sm,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryLight,
  },
  analyzingLabel: { color: colors.textMuted, textAlign: 'center', marginTop: 8 },
  provider: { color: colors.textMuted, fontSize: 12 },
  feedbackBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  analysis: { color: colors.text, lineHeight: 24, fontSize: 15 },
});

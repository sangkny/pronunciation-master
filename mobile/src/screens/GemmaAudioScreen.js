import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import * as recordingService from '../services/recordingService';
import * as audioService from '../services/audioService';
import { colors, spacing } from '../constants/theme';

export default function GemmaAudioScreen({ route, navigation }) {
  const domain = route.params?.domain;
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [serverInfo, setServerInfo] = useState(null);

  const word = 'equipment';
  const correctPronunciation = 'ih-KWIP-muhnt';

  useEffect(() => {
    audioService.getServerAudioInfo().then(setServerInfo).catch(() => null);
  }, []);

  const handleRecord = async () => {
    setError('');
    try {
      if (!recording) {
        await recordingService.startRecording();
        setRecording(true);
        setResult(null);
      } else {
        setRecording(false);
        setProcessing(true);

        const audioUri = await recordingService.stopRecording();
        const data = await audioService.analyzeNativeAudio(audioUri, {
          word,
          correctPronunciation,
          userLevel: 'beginner',
        });

        setResult({
          analysis: data.analysis,
          provider: data.provider,
          nativeAudio: data.nativeAudio,
          latencyMs: data.latencyMs,
          fallback: data.fallback,
        });
      }
    } catch (err) {
      setError(err.message);
      setRecording(false);
    } finally {
      setProcessing(false);
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

      <TouchableOpacity
        style={[styles.recordBtn, recording && styles.recording]}
        onPress={handleRecord}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.recordText}>
            {recording ? '⏹ Stop & Analyze' : '🎤 Gemma 4 Record'}
          </Text>
        )}
      </TouchableOpacity>

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
  word: { fontSize: 32, fontWeight: 'bold', color: colors.text },
  ipa: { fontSize: 16, color: colors.primary, marginBottom: spacing.lg },
  recordBtn: { backgroundColor: colors.primary, borderRadius: 12, padding: 20, alignItems: 'center' },
  recording: { backgroundColor: colors.error },
  recordText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: colors.error, marginTop: spacing.md, textAlign: 'center' },
  resultCard: { marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md },
  provider: { color: colors.textMuted, fontSize: 12, marginBottom: spacing.sm },
  analysis: { color: colors.text, lineHeight: 22 },
});

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import * as recordingService from '../services/recordingService';
import * as sttService from '../services/sttService';
import * as api from '../services/api';

export default function MissionScreen({ domain, onBack }) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const practiceWord = 'equipment';
  const correctPronunciation = 'ih-KWIP-muhnt';

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
        const sttData = await sttService.transcribeRecording(audioUri, practiceWord);
        const userPronunciation = sttData.transcript || practiceWord;

        const scoreData = await api.calculateScore({
          userPronunciation,
          correctPronunciation,
          userLevel: 'beginner',
          difficulty: 'beginner',
        });

        const aomdData = await api.getAomdFeedback({
          userPronunciation,
          correctPronunciation,
          word: practiceWord,
          score: scoreData.totalScore,
          context: domain?.id || 'medical',
        });

        setResult({
          score: scoreData.totalScore,
          transcript: userPronunciation,
          sttProvider: sttData.provider,
          advocate: aomdData.advocate,
          tier: aomdData.tier,
        });
      }
    } catch (err) {
      setError(err.message);
      setRecording(false);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.domain}>{domain?.emoji} {domain?.name}</Text>
      <Text style={styles.word}>{practiceWord}</Text>
      <Text style={styles.ipa}>{correctPronunciation}</Text>
      <Text style={styles.sentence}>Practice the word: {practiceWord}</Text>

      <TouchableOpacity
        style={[styles.recordBtn, recording && styles.recording]}
        onPress={handleRecord}
        disabled={processing}
      >
        {processing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.recordText}>
            {recording ? '⏹ Stop & Analyze' : '🎤 Start Recording'}
          </Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.scoreLabel}>Recognized</Text>
          <Text style={styles.transcript}>{result.transcript}</Text>
          <Text style={styles.provider}>STT: {result.sttProvider}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{result.score}%</Text>
          <Text style={styles.aomdLabel}>AOMD Advocate ({result.tier})</Text>
          <Text style={styles.aomdText}>{result.advocate}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingTop: 60 },
  backBtn: { marginBottom: 20 },
  backText: { color: '#c084fc', fontSize: 16 },
  domain: { fontSize: 18, color: '#94a3b8', marginBottom: 8 },
  word: { fontSize: 32, fontWeight: 'bold', color: '#e2e8f0' },
  ipa: { fontSize: 16, color: '#7c3aed', marginBottom: 12 },
  sentence: { fontSize: 14, color: '#94a3b8', marginBottom: 24 },
  recordBtn: { backgroundColor: '#7c3aed', borderRadius: 12, padding: 20, alignItems: 'center' },
  recording: { backgroundColor: '#ef4444' },
  recordText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  error: { color: '#f87171', marginTop: 12, textAlign: 'center' },
  resultCard: { marginTop: 24, backgroundColor: '#1e293b', borderRadius: 12, padding: 16 },
  scoreLabel: { color: '#94a3b8', fontSize: 12, marginTop: 8 },
  transcript: { fontSize: 18, color: '#e2e8f0', fontWeight: '600' },
  provider: { fontSize: 11, color: '#64748b', marginBottom: 8 },
  scoreValue: { fontSize: 36, fontWeight: 'bold', color: '#4ade80', marginBottom: 12 },
  aomdLabel: { color: '#c084fc', fontWeight: 'bold', marginBottom: 8 },
  aomdText: { color: '#e2e8f0', lineHeight: 22 },
});

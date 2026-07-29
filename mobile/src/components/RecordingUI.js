import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { formatTime } from '../utils/audioConfig';
import { colors, spacing } from '../constants/theme';

export default function RecordingUI({
  isRecording = false,
  isPlaying = false,
  isAnalyzing = false,
  duration = 0,
  maxDuration = 10,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onStopPlayback,
  onCancel,
  onAnalyze,
  recordedAudio = null,
}) {
  const hasRecording = !!recordedAudio?.audioUri;

  return (
    <View style={styles.container}>
      <View style={styles.timerBox}>
        <Text style={styles.timer}>
          {formatTime(duration)} / {formatTime(maxDuration)}
        </Text>
        {isRecording && (
          <View style={styles.recordingDot}>
            <Text style={styles.recordingLabel}>● REC</Text>
          </View>
        )}
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, (duration / maxDuration) * 100)}%` },
            isRecording && styles.progressRecording,
          ]}
        />
      </View>

      {isAnalyzing && (
        <View style={styles.analyzingRow}>
          <ActivityIndicator color={colors.primaryLight} />
          <Text style={styles.analyzingText}>Gemma 4 분석 중...</Text>
        </View>
      )}

      {!isAnalyzing && !isRecording && !hasRecording && (
        <TouchableOpacity style={styles.primaryBtn} onPress={onStartRecording}>
          <Text style={styles.primaryBtnText}>🎤 녹음 시작</Text>
        </TouchableOpacity>
      )}

      {isRecording && (
        <TouchableOpacity style={styles.stopBtn} onPress={onStopRecording}>
          <Text style={styles.primaryBtnText}>⏹️ 중지</Text>
        </TouchableOpacity>
      )}

      {hasRecording && !isRecording && !isPlaying && !isAnalyzing && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onPlayRecording}>
            <Text style={styles.secondaryBtnText}>▶️ 재생</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={onCancel}>
            <Text style={styles.secondaryBtnText}>🔄 다시 녹음</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.analyzeBtn} onPress={onAnalyze}>
            <Text style={styles.primaryBtnText}>✅ 분석</Text>
          </TouchableOpacity>
        </View>
      )}

      {isPlaying && (
        <TouchableOpacity style={styles.secondaryBtn} onPress={onStopPlayback}>
          <Text style={styles.secondaryBtnText}>⏸️ 재생 중지</Text>
        </TouchableOpacity>
      )}

      {hasRecording && recordedAudio.isWav === false && (
        <Text style={styles.hint}>
          ⚠️ WAV 헤더 미확인 — 백엔드 Whisper 폴백 가능
        </Text>
      )}

      {hasRecording && recordedAudio.sampleRate && (
        <Text style={styles.hint}>
          {recordedAudio.sampleRate}Hz · {formatTime(recordedAudio.duration || duration)} · WAV
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  timerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  timer: { fontSize: 28, fontWeight: 'bold', color: colors.text, fontVariant: ['tabular-nums'] },
  recordingDot: { backgroundColor: '#7f1d1d', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  recordingLabel: { color: colors.error, fontSize: 12, fontWeight: 'bold' },
  progressTrack: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  progressRecording: { backgroundColor: colors.error },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: 12, padding: 18, alignItems: 'center' },
  stopBtn: { backgroundColor: colors.error, borderRadius: 12, padding: 18, alignItems: 'center' },
  analyzeBtn: { flex: 1, backgroundColor: colors.success, borderRadius: 12, padding: 16, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  secondaryBtn: { flex: 1, minWidth: '45%', backgroundColor: colors.surface, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { color: colors.primaryLight, fontSize: 15, fontWeight: '600' },
  analyzingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.md },
  analyzingText: { color: colors.primaryLight },
  hint: { textAlign: 'center', color: colors.textMuted, fontSize: 12 },
});

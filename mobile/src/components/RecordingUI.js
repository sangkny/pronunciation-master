import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import {
  formatTime,
  getRecordingStatusLabel,
  SAMPLE_RATE,
  AUDIO_FORMAT,
} from '../utils/audioConfig';
import { colors, spacing } from '../constants/theme';

function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

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
  const statusLabel = getRecordingStatusLabel({ isRecording, hasRecording, isPlaying });

  return (
    <View style={styles.container}>
      {/* Card 1: Timer + status + record controls */}
      <Card>
        <Text style={styles.cardTitle}>녹음</Text>

        <Text style={styles.timer}>
          {formatTime(duration)} / {formatTime(maxDuration)}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(100, (duration / maxDuration) * 100)}%` },
              isRecording && styles.progressRecording,
            ]}
          />
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, isRecording && styles.statusRecording]}>
            {statusLabel}
          </Text>
          <Text style={styles.metaText}>
            {SAMPLE_RATE}Hz · {AUDIO_FORMAT}
          </Text>
        </View>

        {isAnalyzing ? (
          <View style={styles.analyzingRow}>
            <ActivityIndicator color={colors.primaryLight} />
            <Text style={styles.analyzingText}>Gemma 4 분석 중...</Text>
          </View>
        ) : !hasRecording ? (
          isRecording ? (
            <TouchableOpacity style={styles.stopBtn} onPress={onStopRecording}>
              <Text style={styles.primaryBtnText}>⏹️ 녹음 중지</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryBtn} onPress={onStartRecording}>
              <Text style={styles.primaryBtnText}>🎤 녹음 시작</Text>
            </TouchableOpacity>
          )
        ) : null}
      </Card>

      {/* Card 2: Playback + analyze (after recording) */}
      {hasRecording && !isRecording && (
        <Card>
          <Text style={styles.cardTitle}>검수 & 분석</Text>

          {isPlaying ? (
            <TouchableOpacity style={styles.secondaryBtn} onPress={onStopPlayback}>
              <Text style={styles.secondaryBtnText}>⏸️ 재생 중지</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={onPlayRecording}
                disabled={isAnalyzing}
              >
                <Text style={styles.secondaryBtnText}>▶️ 재생</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={onCancel}
                disabled={isAnalyzing}
              >
                <Text style={styles.secondaryBtnText}>🔄 다시</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.analyzeBtn, isAnalyzing && styles.btnDisabled]}
                onPress={onAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>✅ 분석</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {recordedAudio.isWav === false && (
            <Text style={styles.hint}>⚠️ WAV 헤더 미확인 — Whisper 폴백 가능</Text>
          )}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressRecording: { backgroundColor: colors.error },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: { fontSize: 15, color: colors.textMuted, fontWeight: '600' },
  statusRecording: { color: colors.error },
  metaText: { fontSize: 12, color: colors.textMuted },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  stopBtn: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  analyzeBtn: {
    flex: 1,
    backgroundColor: colors.success,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  secondaryBtn: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: { color: colors.primaryLight, fontSize: 14, fontWeight: '600' },
  analyzingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  analyzingText: { color: colors.primaryLight },
  hint: { textAlign: 'center', color: colors.warning, fontSize: 12, marginTop: 4 },
});

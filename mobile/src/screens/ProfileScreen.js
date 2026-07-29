import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import * as audioService from '../services/audioService';
import { API_URL } from '../services/api';
import { colors, spacing } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const user = useAppStore((s) => s.user);
  const tier = useAppStore((s) => s.subscriptionTier);
  const token = useAppStore((s) => s.token);
  const isOnline = useAppStore((s) => s.isOnline);
  const analysisHistory = useAppStore((s) => s.analysisHistory);
  const logout = useAppStore((s) => s.logout);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const storeError = useAppStore((s) => s.error);

  const [audioInfo, setAudioInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    audioService.getServerAudioInfo()
      .then(setAudioInfo)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>{user?.email || user?.name || 'User'}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Subscription Tier</Text>
        <Text style={styles.cardValue}>{tier}</Text>
        <Text style={styles.cardHint}>Zustand: subscriptionTier</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Session</Text>
        <Text style={styles.cardRow}>
          Token: {token ? `✅ ${token.slice(0, 12)}...` : '❌ None'}
        </Text>
        <Text style={styles.cardRow}>
          Network: {isOnline ? '🟢 Online' : '🔴 Offline'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Analysis History</Text>
        <Text style={styles.cardValue}>{analysisHistory.length}</Text>
        {analysisHistory.length > 0 && (
          <>
            <Text style={styles.cardRow} numberOfLines={2}>
              Latest: {analysisHistory[0]?.word} — {analysisHistory[0]?.provider}
            </Text>
            <TouchableOpacity onPress={clearHistory}>
              <Text style={styles.clearLink}>Clear history</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {audioInfo && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Native Audio Server</Text>
          <Text style={styles.cardRow}>
            vLLM: {audioInfo.vllm?.available ? '✅ Available' : '❌ Offline'}
          </Text>
          <Text style={styles.cardRow}>
            Whisper: {audioInfo.whisper?.configured ? '✅ Configured' : 'Mock'}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>API</Text>
        <Text style={styles.apiUrl}>{API_URL}</Text>
      </View>

      {storeError ? (
        <Text style={styles.storeError}>{storeError}</Text>
      ) : null}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 60 },
  center: { justifyContent: 'center', alignItems: 'center' },
  backBtn: { marginBottom: spacing.md },
  backText: { color: colors.primaryLight, fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  email: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLabel: { color: colors.primaryLight, fontWeight: 'bold', marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: colors.success },
  cardHint: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  cardRow: { color: colors.text, fontSize: 14, marginBottom: 4 },
  clearLink: { color: colors.primaryLight, marginTop: 8, fontSize: 13 },
  apiUrl: { color: colors.textMuted, fontSize: 12 },
  storeError: { color: colors.error, textAlign: 'center', marginBottom: spacing.sm },
  logoutBtn: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    marginTop: spacing.md,
  },
  logoutText: { color: colors.error, fontWeight: 'bold' },
});

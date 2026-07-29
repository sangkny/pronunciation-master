import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import * as audioService from '../services/audioService';
import { API_URL } from '../services/api';
import { getLocalUserId } from '../services/localDbService';
import { useSyncStats } from '../hooks/useOfflineData';
import { syncData } from '../services/syncService';
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

  const userId = getLocalUserId(user, token);
  const { unsyncedCount, totalCount } = useSyncStats(userId);

  const [audioInfo, setAudioInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    audioService.getServerAudioInfo()
      .then(setAudioInfo)
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleSync = async () => {
    if (!isOnline || !token) {
      setSyncMessage('온라인 상태에서만 동기화할 수 있습니다.');
      return;
    }
    setSyncing(true);
    setSyncMessage('');
    try {
      const result = await syncData();
      setLastSync(new Date());
      setSyncMessage(`업로드 ${result.uploaded} · 다운로드 ${result.downloaded}`);
    } catch (err) {
      setSyncMessage(err.message || '동기화 실패');
    } finally {
      setSyncing(false);
    }
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
        <Text style={styles.cardLabel}>Offline Cache (WatermelonDB)</Text>
        <Text style={styles.cardRow}>
          Local analyses: {totalCount}
        </Text>
        <Text style={styles.cardRow}>
          Unsynced: {unsyncedCount > 0 ? `⏳ ${unsyncedCount}` : '✅ 0'}
        </Text>
        <Text style={styles.cardRow}>
          Last sync: {lastSync ? lastSync.toLocaleTimeString() : '—'}
        </Text>
        {syncMessage ? (
          <Text style={styles.syncMsg}>{syncMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.syncBtn, (!isOnline || syncing) && styles.syncBtnDisabled]}
          onPress={handleSync}
          disabled={!isOnline || syncing}
        >
          {syncing ? (
            <ActivityIndicator color={colors.primaryLight} size="small" />
          ) : (
            <Text style={styles.syncBtnText}>Sync now</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Analysis History (memory)</Text>
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
  syncBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  syncBtnDisabled: { opacity: 0.5 },
  syncBtnText: { color: colors.text, fontWeight: 'bold' },
  syncMsg: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
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

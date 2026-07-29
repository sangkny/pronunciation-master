import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';
import * as audioService from '../services/audioService';
import { colors, spacing } from '../constants/theme';

export default function ProfileScreen({ user, onLogout, navigation }) {
  const [tier, setTier] = useState(null);
  const [audioInfo, setAudioInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sub, info] = await Promise.all([
          api.getSubscriptionStatus().catch(() => null),
          audioService.getServerAudioInfo().catch(() => null),
        ]);
        setTier(sub?.tier || 'Free');
        setAudioInfo(info);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('pm_token');
    api.setToken(null);
    onLogout();
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
      <Text style={styles.email}>{user?.email || user?.name}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Subscription</Text>
        <Text style={styles.cardValue}>{tier}</Text>
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
          <Text style={styles.cardRow}>
            Mel-spec: {audioInfo.melSpec?.bins}-bin @ {audioInfo.melSpec?.sampleRate}Hz
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>API</Text>
        <Text style={styles.apiUrl}>{api.API_URL}</Text>
      </View>

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
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  cardLabel: { color: colors.primaryLight, fontWeight: 'bold', marginBottom: 8 },
  cardValue: { fontSize: 24, fontWeight: 'bold', color: colors.success },
  cardRow: { color: colors.text, fontSize: 14, marginBottom: 4 },
  apiUrl: { color: colors.textMuted, fontSize: 12 },
  logoutBtn: { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.error, marginTop: spacing.md },
  logoutText: { color: colors.error, fontWeight: 'bold' },
});

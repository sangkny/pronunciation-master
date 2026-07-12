import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

const DOMAINS = [
  { id: 'medical', name: 'Medical', emoji: '🏥' },
  { id: 'telecom', name: 'Telecom', emoji: '📡' },
  { id: 'finance', name: 'Finance', emoji: '💰' },
  { id: 'tech', name: 'Technology', emoji: '💻' },
  { id: 'automotive', name: 'Automotive', emoji: '🚗' },
];

export default function HomeScreen({ user, onLogout, onSelectDomain }) {
  const [dashboard, setDashboard] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dash, curriculum] = await Promise.all([
          api.getDashboard().catch(() => null),
          api.getCurriculum('ko-KR').catch(() => null),
        ]);
        setDashboard(dash);
        if (curriculum?.greeting) setGreeting(curriculum.greeting);
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
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting || "Today's Practice"}</Text>
          <Text style={styles.userName}>{user?.name || user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {dashboard && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.totalPractices}</Text>
            <Text style={styles.statLabel}>Practices</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{dashboard.avgScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      )}

      <Text style={styles.sectionTitle}>Select Domain</Text>
      {DOMAINS.map((d) => (
        <TouchableOpacity
          key={d.id}
          style={styles.domainCard}
          onPress={() => onSelectDomain?.(d)}
        >
          <Text style={styles.domainEmoji}>{d.emoji}</Text>
          <Text style={styles.domainName}>{d.name}</Text>
          <Text style={styles.comingSoon}>Practice →</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 20, paddingTop: 60 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: '#e2e8f0' },
  userName: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  logoutBtn: { padding: 8 },
  logoutText: { color: '#c084fc' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#1e293b', borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4ade80' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#c084fc', marginBottom: 12 },
  domainCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#334155' },
  domainEmoji: { fontSize: 28, marginRight: 12 },
  domainName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#e2e8f0' },
  comingSoon: { fontSize: 12, color: '#7c3aed' },
});

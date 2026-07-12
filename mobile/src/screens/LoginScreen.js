import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const data = mode === 'login'
        ? await api.login(email, password)
        : await api.register(email, name, password);

      await AsyncStorage.setItem('pm_token', data.token);
      api.setToken(data.token);
      onLogin(data.user || { email, name: name || email });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronunciation Master</Text>
      <Text style={styles.subtitle}>Mobile</Text>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setMode('login')} style={[styles.tab, mode === 'login' && styles.tabActive]}>
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMode('register')} style={[styles.tab, mode === 'register' && styles.tabActive]}>
          <Text style={styles.tabText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {mode === 'register' && (
        <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#666" value={name} onChangeText={setName} />
      )}
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#666" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#666" value={password} onChangeText={setPassword} secureTextEntry />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Register'}</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#c084fc', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 32 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tab: { flex: 1, padding: 10, borderRadius: 8, backgroundColor: '#1e293b', alignItems: 'center' },
  tabActive: { backgroundColor: '#7c3aed' },
  tabText: { color: '#fff', fontWeight: '600' },
  input: { backgroundColor: '#1e293b', color: '#fff', borderRadius: 8, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  button: { backgroundColor: '#7c3aed', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#f87171', marginBottom: 8, textAlign: 'center' },
});

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const [localError, setLocalError] = useState('');

  const login = useAppStore((s) => s.login);
  const registerUser = useAppStore((s) => s.registerUser);
  const isLoading = useAppStore((s) => s.isLoading);
  const storeError = useAppStore((s) => s.error);
  const setError = useAppStore((s) => s.setError);

  const handleSubmit = async () => {
    setLocalError('');
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await registerUser(email, password, name);
      }
    } catch (err) {
      setLocalError(err.response?.data?.error || storeError || '로그인 실패');
    }
  };

  const displayError = localError || storeError;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pronunciation Master</Text>
      <Text style={styles.subtitle}>Mobile</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => { setMode('login'); setError(null); setLocalError(''); }}
          style={[styles.tab, mode === 'login' && styles.tabActive]}
        >
          <Text style={styles.tabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setMode('register'); setError(null); setLocalError(''); }}
          style={[styles.tab, mode === 'register' && styles.tabActive]}
        >
          <Text style={styles.tabText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {mode === 'register' && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {displayError ? <Text style={styles.error}>{displayError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{mode === 'login' ? 'Login' : 'Register'}</Text>
        )}
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
  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#f87171', marginBottom: 8, textAlign: 'center' },
});

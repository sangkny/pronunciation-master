import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import * as api from './src/services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('pm_token').then((token) => {
      if (token) {
        api.setToken(token);
        setUser({ restored: true });
      }
      setBooting(false);
    });
  }, []);

  if (booting) return null;

  return (
    <>
      <StatusBar style="light" />
      {user ? (
        <HomeScreen user={user} onLogout={() => setUser(null)} />
      ) : (
        <LoginScreen onLogin={setUser} />
      )}
    </>
  );
}

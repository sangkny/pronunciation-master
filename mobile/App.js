import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MissionScreen from './src/screens/MissionScreen';
import * as api from './src/services/api';
import * as notificationService from './src/services/notificationService';

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('pm_token').then((token) => {
      if (token) {
        api.setToken(token);
        setUser({ restored: true });
        notificationService.registerForPushNotifications().catch(() => {});
        notificationService.scheduleDailyReminder(9, 0).catch(() => {});
      }
      setBooting(false);
    });
  }, []);

  if (booting) return null;

  return (
    <>
      <StatusBar style="light" />
      {user ? (
        selectedDomain ? (
          <MissionScreen
            domain={selectedDomain}
            onBack={() => setSelectedDomain(null)}
          />
        ) : (
          <HomeScreen
            user={user}
            onLogout={() => setUser(null)}
            onSelectDomain={setSelectedDomain}
          />
        )
      ) : (
        <LoginScreen onLogin={(u) => {
          setUser(u);
          notificationService.registerForPushNotifications().catch(() => {});
          notificationService.scheduleDailyReminder(9, 0).catch(() => {});
        }} />
      )}
    </>
  );
}

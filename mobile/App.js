import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import * as api from './src/services/api';
import * as notificationService from './src/services/notificationService';
import { colors } from './src/constants/theme';

export default function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

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

  const handleLogin = (u) => {
    setUser(u);
    notificationService.registerForPushNotifications().catch(() => {});
    notificationService.scheduleDailyReminder(9, 0).catch(() => {});
  };

  const handleLogout = () => setUser(null);

  if (booting) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AppNavigator user={user} onLogin={handleLogin} onLogout={handleLogout} />
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
});

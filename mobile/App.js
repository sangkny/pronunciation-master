import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';
import * as notificationService from './src/services/notificationService';
import { colors } from './src/constants/theme';

export default function App() {
  const isHydrated = useAppStore((s) => s.isHydrated);
  const token = useAppStore((s) => s.token);
  const setOnline = useAppStore((s) => s.setOnline);
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected ?? true);
    });
    return () => unsubscribe();
  }, [setOnline]);

  useEffect(() => {
    if (token) {
      notificationService.registerForPushNotifications().catch(() => {});
      notificationService.scheduleDailyReminder(9, 0).catch(() => {});
    }
  }, [token]);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

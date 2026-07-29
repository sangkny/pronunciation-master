import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/store/useAppStore';
import * as notificationService from './src/services/notificationService';
import database from './src/database';
import { syncData } from './src/services/syncService';
import { colors } from './src/constants/theme';

export default function App() {
  const isHydrated = useAppStore((s) => s.isHydrated);
  const token = useAppStore((s) => s.token);
  const setOnline = useAppStore((s) => s.setOnline);
  const hydrate = useAppStore((s) => s.hydrate);
  const wasOnlineRef = useRef(true);

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

  useEffect(() => {
    if (!isHydrated || !token) {
      return undefined;
    }

    const runSync = () => {
      syncData().catch(() => {});
    };

    runSync();

    const unsubscribe = useAppStore.subscribe((state, prevState) => {
      const cameOnline = state.isOnline && !prevState.isOnline;
      if (cameOnline && state.token) {
        runSync();
      }
      wasOnlineRef.current = state.isOnline;
    });

    return unsubscribe;
  }, [isHydrated, token]);

  if (!isHydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <DatabaseProvider database={database}>
      <AppNavigator />
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

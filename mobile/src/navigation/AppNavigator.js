import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MissionScreen from '../screens/MissionScreen';
import GemmaAudioScreen from '../screens/GemmaAudioScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAppStore } from '../store/useAppStore';
import { navigationRef } from './navigationRef';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useAppStore((s) => s.token);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        key={token ? 'main' : 'auth'}
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Mission" component={MissionScreen} />
            <Stack.Screen name="GemmaAudio" component={GemmaAudioScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

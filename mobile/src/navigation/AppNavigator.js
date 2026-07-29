import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import MissionScreen from '../screens/MissionScreen';
import GemmaAudioScreen from '../screens/GemmaAudioScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ user, onLogin, onLogout }) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {!user ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLogin={onLogin} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen {...props} user={user} onLogout={onLogout} />
              )}
            </Stack.Screen>
            <Stack.Screen name="GemmaAudio" component={GemmaAudioScreen} />
            <Stack.Screen name="Profile">
              {(props) => (
                <ProfileScreen {...props} user={user} onLogout={onLogout} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

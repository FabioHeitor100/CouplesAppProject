import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import SwipeScreen from '../screens/SwipeScreen';
import ConnectScreen from '../screens/ConnectScreen';
import MatchScreen from '../screens/MatchScreen';
import MemoryLogScreen from '../screens/MemoryLogScreen';
import CustomActivitiesScreen from '../screens/CustomActivitiesScreen';
import ChallengeScreen from '../screens/ChallengeScreen';
import PremiumScreen from '../screens/PremiumScreen';
import StartManagerScreen from '../screens/StartManagerScreen';
import ActivityScreen from '../screens/ActivityScreen';
import SwipeMoreScreen from '../screens/SwipeMoreScreen';
const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="Swipe" component={SwipeScreen} options={{ title: 'Swipe Activities' }} />
        <Stack.Screen name="SwipeMore" component={SwipeMoreScreen} options={{ title: 'Swipe Activities' }} />
        <Stack.Screen name="Connect" component={ConnectScreen} options={{ title: 'Connect with Partner' }} />
        <Stack.Screen name="Match" component={MatchScreen} options={{ title: "It's a Match!" }} />
        <Stack.Screen name="MemoryLog" component={MemoryLogScreen} options={{ title: 'Memory Log' }} />
        <Stack.Screen name="CustomActivities" component={CustomActivitiesScreen} options={{ title: 'Custom Activities' }} />
        <Stack.Screen name="Challenge" component={ChallengeScreen} options={{ title: 'Challenge Mode' }} />
        <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: 'Go Premium' }} />
        <Stack.Screen name="StartManager" component={StartManagerScreen} options={{ title: 'Go Premium' }} />
        <Stack.Screen name="Activity" component={ActivityScreen} options={{ title: 'Go Premium' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

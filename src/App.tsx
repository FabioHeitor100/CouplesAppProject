import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator'; // ✅ Correct import

export default function App() {
  return (
      <AppNavigator />
  );
}
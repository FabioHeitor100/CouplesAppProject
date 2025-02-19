import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RootStackParamList } from '../navigation/types';

// Define props for HomeScreen
type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>What To Do Now</Text>
      <Button title="Start Now" onPress={() => navigation.navigate('StartManager')} />
      <Button title="Connect" onPress={() => navigation.navigate('Connect')} />
      <Button title="Memory Log" onPress={() => navigation.navigate('MemoryLog')} />
      <Button title="Custom Activities" onPress={() => navigation.navigate('CustomActivities')} />
      <Button title="Go Premium" onPress={() => navigation.navigate('Premium')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});





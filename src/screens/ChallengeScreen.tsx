import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'Challenge'>;

export default function ChallengeScreen({ route, navigation }: Props) {
  const { remainingActivities } = route.params || {};
  const [randomActivity, setRandomActivity] = useState<string | null>(null);

  useEffect(() => {
    if (remainingActivities && remainingActivities.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingActivities.length);
      setRandomActivity(remainingActivities[randomIndex]);
    }
  }, [remainingActivities]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenge Mode!</Text>
      <Text style={styles.subTitle}>No match after several swipes.</Text>
      {randomActivity ? (
        <>
          <Text style={styles.activity}>Try: {randomActivity}</Text>
          <Button title="Accept Challenge" onPress={() => navigation.navigate('Match', { activity: randomActivity, solo:false })} />
        </>
      ) : (
        <Text>No activities available.</Text>
      )}
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  activity: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
});

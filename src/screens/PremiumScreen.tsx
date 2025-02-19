import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'Premium'>;

export default function PremiumScreen({ navigation }: Props) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    const premium = await AsyncStorage.getItem('premiumUser');
    setIsPremium(premium === 'true');
  };

  const handlePurchase = async () => {
    try {
      // Simulate purchase (in a real app, use In-App Purchases)
      await AsyncStorage.setItem('premiumUser', 'true');
      setIsPremium(true);
      alert('Purchase successful!');
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go Premium</Text>
      {isPremium ? (
        <Text style={styles.info}>You already have Premium!</Text>
      ) : (
        <>
          <Text style={styles.info}>Buy premium to remove ads & unlock more features.</Text>
          <Button title="Buy Premium" onPress={handlePurchase} />
        </>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

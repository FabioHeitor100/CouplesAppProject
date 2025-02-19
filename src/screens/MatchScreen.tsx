import React from 'react';
import { View, Text, Button, StyleSheet,Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<RootStackParamList, 'Match'>;

export default function MatchScreen({ route, navigation }: Props) {
  const { activity } = route.params;
  const { solo } = route.params;

  const startActivity = async () => {

    navigation.navigate('Home')

    let stored = await AsyncStorage.getItem('memoryLog');
    let log = stored ? JSON.parse(stored) : [];
    let newActivityLog:any = {};
    newActivityLog['photoUrl'] = activity.photoUrl
    
    newActivityLog['description'] = activity.description
    
    newActivityLog['date'] = new Date();
    
    log.push(newActivityLog)
    console.log("LOG", log);
    console.log("LOG", newActivityLog);
    await AsyncStorage.setItem('memoryLog', JSON.stringify(log));
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>It's a Match!!!</Text>
      <Image source={{ uri: activity.photoUrl }} style={styles.image} />
      { solo && <Text style={styles.activity}>You chose: {activity.description}</Text>}
      {!solo &&<Text style={styles.activity}>You both chose: {activity.description}</Text>}
      <Button title="Start Activity" onPress={() =>startActivity()} />
      <Button title="Choose Again" onPress={() => navigation.navigate('Home')} />
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
  activity: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
},
});

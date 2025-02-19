import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

type Props = StackScreenProps<RootStackParamList, 'StartManager'>;

export default function MyNewScreen({ navigation} : Props) {

  const [activitiesData,setActivitiesData] = useState([]);   

  useEffect(() => {
    // set default activies on the array
    const test = async () => {
        await AsyncStorage.setItem('myActivities', "TEST");
    }

    test();
    
    console.log(AsyncStorage.getAllKeys());
  }, [] );

  const useDefault = () => {
    navigation.navigate('Swipe', { useDefault : true});
  }

  const useMine = () => {
    navigation.navigate('Swipe', { useDefault : false });
  }

  const supriseMe = () => {
    navigation.navigate('Match', {activity : { photoUrl: "", description: ""}, solo : true});
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your options:</Text>
      <Button title='Suprise Me!' onPress={useDefault}></Button>
      <Button title='Use default' onPress={useDefault}></Button>
      <Button title='Use Mine Activities' onPress={useMine}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});

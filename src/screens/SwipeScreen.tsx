import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet , Image, FlatList} from 'react-native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Activity } from '../types/activityType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shuffleArray } from "../util/functionsUtil";
// create activity class

const defaultActivities = [
  {
    description: "Walk in the park",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    description: "Watch a movie",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    description: "Cook dinner",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    description: "Play board games",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    description: "Go for a drive",
    photoUrl: "https://www.libertymutual.com/images/safe-driving-tips.jpg",
  },
  {
    description: "Try a new restaurant",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    description: "Workout together",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
  {
    description: "Read a book",
    photoUrl: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
  },
];

// Define props for HomeScreen
type Props = StackScreenProps<RootStackParamList, 'Swipe'>;

export default function SwipeScreen({ route, navigation } : Props) {
  const { useDefault } = route.params;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 
  const [starAgain, setStartAgain] = useState<boolean>(false);

  useEffect(() => {
    
    const loadActivities = async () => {
      setIsLoading(true);
      if(useDefault){
        setActivities(shuffleArray(defaultActivities))
      } else {
        let stored = await AsyncStorage.getItem("customActivities");
  
      // ✅ Ensure TypeScript knows it's an array (parse JSON)
      let customActivities = stored ? JSON.parse(stored) : [];
        setActivities(shuffleArray(customActivities))
      }
      console.log("activities", activities)
      setIsLoading(false);
    }

    loadActivities();
    

  }, [])

 

  const handleNext = () => {

    if(useDefault && index === defaultActivities.length -1){
      setActivities(shuffleArray(defaultActivities))
      setStartAgain(true);
      return;
    } else if(index === activities.length -1) {
      setActivities(shuffleArray(activities))
      setStartAgain(true);
      return;
    }

    setIndex((prev) => (prev + 1) % activities.length);
  };

  const startAgainSwipe = async () => {
    setIndex(0);
    if(useDefault){
      setActivities(shuffleArray(defaultActivities))
    } else {
      setActivities(shuffleArray(activities))
    }
    setStartAgain(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swipe Activities</Text>
       {/* <FlatList
              data={activities}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View>
                  {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.image} />}
                </View>
              )}
            /> */}
      
      { !isLoading && !starAgain && <Image source={{ uri: activities[index].photoUrl }} style={styles.image} /> }
      { !isLoading && !starAgain && <Text style={styles.activity}>{activities[index].description}</Text> }
      {!isLoading && !starAgain &&  <Button title="Next" onPress={handleNext} />}
      {!isLoading && !starAgain && <Button title="Select" onPress={() => navigation.navigate('Match', { activity: activities[index] , solo: true })} /> }
      {starAgain && <Button title="startAgain" onPress={() =>  startAgainSwipe()} /> }
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

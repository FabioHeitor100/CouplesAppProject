import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet , Image, FlatList} from 'react-native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Activity } from '../types/activityType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shuffleArray } from "../util/functionsUtil";
// create activity class


// Define props for HomeScreen
type Props = StackScreenProps<RootStackParamList, 'SwipeMore'>;

export default function SwipeMoreScreen({ route, navigation } : Props) {
  const { Activities, myId , partnerId } = route.params;
  console.log("-------------------------- ", myId);
  console.log("-------------------------- ", Activities);
  console.log("-------------------------- ", partnerId);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 
  const [ws, setWs] = useState<WebSocket | null>(null);

  const [rightActivitiesPartner, setRightActivitiesPartner] = useState<Activity[]>([]); 

  useEffect(() => {
    
    const loadActivities = async () => {
      setIsLoading(true);
      setActivities(shuffleArray(Activities));
      setIsLoading(false);
    }

    loadActivities();
    

  }, [])

  useEffect(() => {
    const newWs = new WebSocket("ws://192.168.1.21:8080"); // Change to your WebSocket server

    newWs.onopen = () => {
      console.log("Connected to WebSocket in SwipeScreen");
    };

    newWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      if (data.type === "userRight") {
        console.log("Both users matched on:", data.activity);
        rightActivitiesPartner.push(data.activity);
        setRightActivitiesPartner(rightActivitiesPartner);
      }

      if (data.type === "swipeMatch") {
        navigation.navigate('Match', {activity: data.activity, solo: false} );
      }


    };

    newWs.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(newWs);

    return () => {
      newWs.close(); // Clean up WebSocket on screen exit
    };
  }, []);

 

  const handleSwipe = (action: "left" | "right") => {
    console.log("RIGHT??")
    if (!ws) return;
    console.log("RIGHT??")
    // check if its a match 

    console.log("activities",activities)
    console.log("rightActivitiesPartner",rightActivitiesPartner);
    console.log("activities",myId)
    console.log("rightActivitiesPartner",partnerId);
    let match = checkMatch(activities[index]);

    if(match) return


    if (action === "right") {
      console.log(`User swiped right on: ${activities[index]}`);
      ws.send(
        JSON.stringify({
          type: "swipe",
          myId: myId,
          partnerId : partnerId,
          activity: activities[index],
        })
      );
    }

    const nextIndex = index < activities.length - 1 ? index + 1 : 0;
    setIndex(nextIndex);
  };

  const checkMatch = (activity: Activity) => {
    for( let i=0; i < rightActivitiesPartner.length; i++){
        if(rightActivitiesPartner[i].description === activity.description && rightActivitiesPartner[i].photoUrl === activity.photoUrl ) {
            // its a match
            matchFound(activity);
            return true;
        }
    }  

    return false;
  }

  const matchFound = ( activity : Activity) => {
    if (!ws) return;

    ws.send(
        JSON.stringify({
          type: "swipeMatch",
          myId,
          partnerId,
          activity: activity,
        })
    );

    navigation.navigate('Match', {activity: activity, solo: false} );
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
      
      { !isLoading && <Image source={{ uri: activities[index].photoUrl }} style={styles.image} /> }
      { !isLoading && <Text style={styles.activity}>{activities[index].description}</Text> }
      <Text style={styles.activity}>teste</Text>
      <Text style={styles.activity}>{index}</Text>
      <Button title="Right" onPress={() => handleSwipe('right')} />
      <Button title="Left" onPress={() => handleSwipe('left')} />
      {/* <Button title="Select" onPress={() => navigation.navigate('Match', { activity: defaultActivities[index] })} /> */}
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

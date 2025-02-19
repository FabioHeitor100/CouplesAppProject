import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Activity } from '../types/activityType';
import * as ImagePicker from 'expo-image-picker';
import { useImageManipulator, SaveFormat ,ImageManipulator} from "expo-image-manipulator";

type Props = StackScreenProps<RootStackParamList, 'Activity'>;

export default function ActivityScreen({  route, navigation }: Props) {
  const { activity } = route.params ? route.params : {}; 
  const { index } = route.params; 
  const [newAct, setNewAct] = useState<Boolean>(true);
  const [newActivity, setNewActivity] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const [photo, setPhoto] = useState('');

  useEffect(() => {
    loadCustomActivity();
  }, []);

  const loadCustomActivity = () => {
    const { activity } = route.params; 
    if( !activity && !index) {
        return;
    }

    setDescription(activity.description);
    setPhotoUrl(activity.photoUrl);
    setNewAct(false)
  };

  const pickImage = async () => {
    // Request camera roll permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Let user pick an image from the gallery
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

    if (!result.canceled) {
      let image = compressImage(result.assets[0].uri)
      image.then((image) => {
        console.log("IMAGE",image);
        setPhoto(image);
        setPhotoUrl(image);
      })
    
      console.log("IMAGE URI",result.assets[0].uri);

      ; // The local URI to the image file
    }
  };

  const saveCustomActivities = async (updatedList: Activity[]) => {
    await AsyncStorage.setItem('customActivities', JSON.stringify(updatedList));
  };

  const saveActivity = async () => {
    if (!photoUrl || !description.trim()) {
      alert('Please select an image and enter a description.');
      return;
    }

    // Build an 'activity' object
    const activity = {
      photoUrl,
      description,
    };

    // Load existing activities from AsyncStorage
    let stored = await AsyncStorage.getItem('customActivities');
    let activities: Activity[] = stored ? JSON.parse(stored) : [];

    // Add the new activity

    if(newAct) {
        activities.push(activity);
    } else {
        activities[index] = activity;
    }
   

    // Save back to AsyncStorage
    await AsyncStorage.setItem('customActivities', JSON.stringify(activities));
    alert(`Activity saved! ${activities.length}`);
    // Clear form
    // setPhotoUrl(null);
    // setDescription('');

    navigation.navigate('CustomActivities');
  };

  const compressImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.from(uri).manipulate([{ resize: { width: 800 } }], {
        compress: 0.3,
        format: SaveFormat.JPEG,
      });
  
      return manipResult.uri;
    } catch (error) {
      console.error("Image compression failed:", error);
      return uri;
    }
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Activity</Text>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {photoUrl && <Image source={{ uri: photoUrl }} style={styles.image} />}
      {photoUrl && <Image source={{ uri: photo }} style={styles.image} />}
      <TextInput
        style={styles.input}
        placeholder="Enter a custom activity"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add" onPress={saveActivity} />
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 10,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    itemText: {  // 🔥 Add this missing style
      fontSize: 16,
    },
    deleteButton: {
      backgroundColor: '#ff4d4d',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 4,
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    image: {
        width: 200,
        height: 200,
    },
  });
  
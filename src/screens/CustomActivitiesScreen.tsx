import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Activity } from '../types/activityType';
import { useImageManipulator, SaveFormat ,ImageManipulator} from "expo-image-manipulator";


type Props = StackScreenProps<RootStackParamList, 'CustomActivities'>;

export default function CustomActivitiesScreen({ navigation }: Props) {
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState('');

  useEffect(() => {
    loadCustomActivities();
  }, []);

  const loadCustomActivities = async () => {
    const stored = await AsyncStorage.getItem('customActivities');
    setCustomActivities(stored ? JSON.parse(stored) : []);
  };

  const saveCustomActivities = async (updatedList: Object[]) => {
    await AsyncStorage.setItem('customActivities', JSON.stringify(updatedList));
  };

  const addActivity = () => {
    navigation.navigate('Activity', {});
  };

  const removeActivity = (index: number) => {
    const updatedList = customActivities.filter((_, i) => i !== index);
    setCustomActivities(updatedList);
    saveCustomActivities(updatedList);
  };

  const editActivity = ( index: number ) => {
    // EDIT ACXTIVITY
    navigation.navigate('Activity', { activity : customActivities[index] , index: index});
  };

  const cleatActivities = async () => {
    await AsyncStorage.setItem('activities', JSON.stringify([]));
  };
  
//   const compressImage = async (uri: string) => {
//     try {
//       const { manipulate } = useImageManipulator(); // Get manipulation function
//       const manipResult = await manipulate(uri, [{ resize: { width: 800 } }], {
//         compress: 0.5,
//         format: SaveFormat.JPEG,
//       });
//       return manipResult.uri;
//     } catch (error) {
//       console.error("Image compression failed:", error);
//       return uri;
//     }
//   };


// const compressImage2 = async (uri: string) => {
//   try {
//     const manipResult = await ImageManipulator.manipulate(uri, [{ resize: { width: 800 } }], {
//       compress: 0.5,
//       format: SaveFormat.JPEG,
//     });
//     return manipResult.uri;
//   } catch (error) {
//     console.error("Image compression failed:", error);
//     return uri;
//   }
// };

// const ImageCompressor = ({ uri, onCompressed }) => {
//   const { manipulate } = useImageManipulator(uri); // ✅ Pass the image source as an argument

//   const compressImage = async () => {
//     try {
//       const manipResult = await manipulate([{ resize: { width: 800 } }], {
//         compress: 0.5,
//         format: SaveFormat.JPEG,
//       });

//       onCompressed(manipResult.uri); // ✅ Pass the new URI to the parent
//     } catch (error) {
//       console.error("Image compression failed:", error);
//     }
//   };

//   return <Button title="Compress Image" onPress={compressImage} />;
// };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Your Activities</Text>
      <Button title="New Activity" onPress={() => addActivity()} />
      <Button title="CLEAR ALL" onPress={() => cleatActivities()} />
      
      <FlatList
        data={customActivities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.image} />}
            <Text style={styles.itemText}>{item.description}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => editActivity(index)}>
              <Text style={styles.deleteButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeActivity(index)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
  
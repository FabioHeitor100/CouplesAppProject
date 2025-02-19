import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Activity } from '../types/activityType';
import { MemoryLog } from '../types/memotyLogType';
type Props = StackScreenProps<RootStackParamList, 'MemoryLog'>;

export default function MemoryLogScreen({ navigation }: Props) {
  const [memoryLog, setMemoryLog] = useState<MemoryLog[]>([]);

  useEffect(() => {
    const loadMemoryLog = async () => {
      try {
        const log = await AsyncStorage.getItem('memoryLog');
        console.log("LOG2", log);
        if (log) {
          console.log("LOG", log);
          setMemoryLog(JSON.parse(log));
        } 

      } catch (error) {
        console.error('Error loading memory log', error);
      }
    };
    loadMemoryLog();
  }, []);

  const clearMemoryLog = async () => {
    await AsyncStorage.removeItem('memoryLog');
    setMemoryLog([]);
  };

  const removeActivity = (index: number) => {
    const updatedList = memoryLog.filter((_, i) => i !== index);
    setMemoryLog(updatedList);
    saveCustomActivities(updatedList);
  };

  const saveCustomActivities = async (updatedList: Object[]) => {
    await AsyncStorage.setItem('memoryLog', JSON.stringify(updatedList));
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Log</Text>
      <FlatList
        data={memoryLog}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index } : { item : MemoryLog, index: number} ) => <View style={styles.listItem}>
                    {item.photoUrl && <Image source={{ uri: item.photoUrl }} style={styles.image} />}
                    <Text style={styles.itemText}>{item.description}</Text>
                    <Text style={styles.itemText}>{item.date}</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removeActivity(index)}>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>}
      />
      <Button title="Clear Log" onPress={clearMemoryLog} />
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

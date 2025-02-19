import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Activity } from '../types/activityType';

type Props = StackScreenProps<RootStackParamList, 'Connect'>;

export default function ConnectScreen({ navigation }: Props) {
  const [partnerId, setPartnerId] = useState('');
  const [myId, setMyId] = useState('');
  const [partnerIdServer, setPartnerIdServer] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [ready, setReady] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const [isFirstUser, setIsFirstUser] = useState<boolean>(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const connectionEstablished = useRef(false);

  useEffect(() => {
    const initializeUser = async () => {
      let storedId = await AsyncStorage.getItem('myId');
      if (!storedId) {
        storedId = Math.random().toString(36).substring(7); // Generate random ID
        await AsyncStorage.setItem('myId', storedId);
      }
      setMyId(storedId);
      connectWebSocket(storedId);
    };

    initializeUser();
  }, []);

  const connectWebSocket = (id: string) => {
    if (connectionEstablished.current) return;
    ws.current = new WebSocket('ws://192.168.1.21:8080'); // Replace with your server URL

    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      ws.current?.send(JSON.stringify({ type: 'register', myId: id }));
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'matchFound') {
        navigation.navigate('Home'); // Navigate to Swipe Screen when matched
      }

      if (data.type === 'partnerWaiting') {
        console.log("AITING!!",data);
        setPartnerIdServer(data.waitingPartner) // Navigate to Swipe Screen when matched
      }

      if (data.type === 'connectionSuccess') {
        console.log("connectionSuccess")
         // Navigate to Swipe Screen when matched
         console.log("MY ID",myId);
         console.log("MY PARTNER ID",partnerId);
         console.log("MY PARTNER ID",data);
         setIsFirstUser(data.isFirst);
         //setPartnerId(data.partnerId)

         // DA PARA COLOCAR AQUI
         setReady(true);
         console.log("MY ID",myId);
         console.log("MY PARTNER ID",partnerId);
      }

      if (data.type === 'receiveActivitiesBack') {
        // Navigate to Swipe Screen when matched
        console.log("receiveActivities");
        console.log("receiveActivities",partnerId);
        console.log("receiveActivities",data);
        console.log("receiveActivities",partnerIdServer);
        console.log("receiveActivities",data.partnerId);
        setLoading(true);
        let myActivities = await loadLocalActivities()
        const combinedActivities = [...myActivities, ...data.activities];
        setActivities(combinedActivities);
        console.log("combinedActivities",combinedActivities);
        console.log("receiveActivities",partnerId);
        console.log("receiveActivities",partnerIdServer);
        ws.current?.send(JSON.stringify({ type: 'finalActivities', partnerId : data.partnerId , activities: combinedActivities, myId: myId }));
        setLoading(false);
        navigation.navigate('SwipeMore', { Activities: combinedActivities , myId: data.myId, partnerId : data.partnerId })
      }

      if (data.type === 'finalActivities') {
        // Navigate to Swipe Screen when matched
        console.log("RECIVE FINAL???");
        setLoading(false);
        navigation.navigate('SwipeMore', { Activities: data.activities , myId: data.myId, partnerId : data.partnerId })
      }



    };



    ws.current.onerror = (error) => console.error('WebSocket error:', error);
    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };
  };

  const connectToPartner = () => {
    if (!partnerId.trim()) {
      Alert.alert('Enter a valid Partner ID');
      return;
    }
    console.log("partnerId",partnerId);
    console.log("MY ID",myId);
    console.log("MY PARTNER ID",partnerId);
    let newPartnerId = partnerId;
    //setPartnerId(partnerIdServer);
    ws.current?.send(JSON.stringify({ type: 'connect', myId, partnerId: newPartnerId }));
    setWaiting(true);;
    console.log("MY ID",myId);
    console.log("MY PARTNER ID",partnerId);
  
  };

  const startSwipe = async () => {
    setLoading(true);
    const firstUserActivities = await loadLocalActivities();
    console.log("----------------- MY ID", myId);
    console.log("partnerId", partnerId);
    console.log("partnerIdServer", partnerIdServer);
    ws.current?.send(JSON.stringify({ type: 'receiveActivities', partnerId, activities: firstUserActivities, myId: myId }));
  }


  const loadLocalActivities = async (): Promise<Activity[]> => {
    let stored = await AsyncStorage.getItem("customActivities");
    return stored ? JSON.parse(stored) : [];
  };

  return (
    <View style={styles.container}>
      {isConnected && <Text style={styles.connected}>Connected to Server  4e0qs4</Text>}
      <Text style={styles.title}>Your ID: {myId}</Text>
       { !waiting &&
        <><TextInput
          style={styles.input}
          placeholder="Enter Partner ID"
          value={partnerId}
          onChangeText={setPartnerId} /><Button title="Connect" onPress={connectToPartner} disabled={!isConnected} /></> }
      {ready && isFirstUser && <Button title="START" onPress={startSwipe} />}
      {waiting && <Text style={styles.connected}>Waiting for your partner to join</Text>}
      {partnerIdServer && <Text style={styles.connected}>Your partner {partnerIdServer} is waiting for you</Text>}
      <Button title="Back" onPress={() => navigation.goBack()} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, borderRadius: 4, textAlign: 'center' },
  connected: { color: 'green', fontSize: 16, marginTop: 10 },
});

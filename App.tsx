import React, {useEffect, useState} from 'react';
import type {} from 'react';
import {
  Alert,
  LogBox,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {ChatComponent} from './src/components/ChatComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Message, User} from './src/utils/types';
import Geolocation from 'react-native-geolocation-service';
import {MessageContext} from './src/utils/MessageContext';

LogBox.ignoreAllLogs();
function App(): JSX.Element {
  const [users, setUsers] = useState<Array<User>>([]);
  const [currentUserCoordinates, setCurrentUserCoordinates] = useState({});
  const [messages, setMessages] = useState([]);

  const requestLocationPermission = async () => {
    console.log('inside requestLocationPermission');
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Hey There Location Permission',
        message:
          'Hey There needs access to your location ' +
          'so you can take awesome chats.',
        // buttonNeutral: "Ask Me Later",
        buttonNegative: 'Cancel',
        buttonPositive: 'Allow',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('inside requestLocationPermission GRANTED');
      getCurrentUserCoordinates();
      fetchUsers();
    } else {
      console.log('inside requestLocationPermission DENIED');
      Alert.alert(
        'Permission Denied!',
        'You need to give location permission to use this app',
      );
    }
  };

  useEffect(() => {
    requestLocationPermission();
    getCurrentUserCoordinates();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const storedUsers = await AsyncStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // If no users are stored, create mock users based on device location
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          const mockUsers = createMockUsers(latitude, longitude);
          await AsyncStorage.setItem('users', JSON.stringify(mockUsers));
          setUsers(mockUsers);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  const getCurrentUserCoordinates = () => {
    Geolocation.getCurrentPosition(
      async position => {
        setCurrentUserCoordinates(position.coords);
        console.log('found current user coordinates', position.coords);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const createMockUsers = (
    latitude: number,
    longitude: number,
  ): Array<User> => {
    // Create 10 mock users
    const mockUsers = Array.from({length: 10}, (_, i) => {
      const userId = `mockuser${i}`;
      return {
        id: userId,
        username: `Mock User ${i}`,
        location: {
          latitude: latitude + Math.random() * 0.01, // Random location nearby
          longitude: longitude + Math.random() * 0.01,
        },
        messages: [], // Generate 5 messages per user
      };
    });

    return mockUsers;
  };

  const onMessageSend = async (selectedUser, message: Message) => {
    console.log('onMessageSend', message);
    // Updating users array with the new message
    const updatedUsers = users.map(user => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          messages: [...user.messages, message],
        };
      }
      return user;
    });

    // Storing updated users in AsyncStorage
    await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    console.log('updatedUsers in onMessageSend', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  return (
    <MessageContext.Provider value={{messages, setMessages}}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle={'dark-content'} backgroundColor={'#fff'} />
        <ChatComponent
          userList={users}
          onMessageSend={onMessageSend}
          currentUserCoordinates={currentUserCoordinates}
        />
      </SafeAreaView>
    </MessageContext.Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {ChatComponent} from './src/components/ChatComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Message, User} from './src/utils/types';
import Geolocation from 'react-native-geolocation-service';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [users, setUsers] = useState<Array<User>>([]);
  const [currentUserCoordinates, setCurrentUserCoordinates] = useState({});
  

  useEffect(() => {
    console.log('starting requestLocationPermission');
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

        fetchUsers();
      } else {
        console.log('inside requestLocationPermission DENIED');
        Alert.alert(
          'Permission Denied!',
          'You need to give location permission to use this app',
        );
      }
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
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

  const createMockMessages = (
    userId: string,
    numberOfMessages: number,
  ): Array<Message> => {
    return Array.from({length: numberOfMessages}, (_, i) => ({
      _id: `${userId}-message${i}`,
      text: `Mock message ${i} from ${userId}`,
      createdAt: new Date(),
      user: {
        _id: userId,
        name: userId,
      },
    }));
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
        messages: createMockMessages(userId, 5), // Generate 5 messages per user
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

  const messageReducer = (state, action) => {
    switch (action.type) {
      case 'add':
        return [...state, action.message];
      default:
        throw new Error();
    }
  }
  
  

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ChatComponent
        userList={users}
        onMessageSend={onMessageSend}
        currentUserCoordinates={currentUserCoordinates}
      />
    </SafeAreaView>
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

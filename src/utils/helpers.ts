import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {User} from './types';
import {Alert, PermissionsAndroid} from 'react-native';

export const createMockUsers = (
  latitude: number,
  longitude: number,
): Array<User> => {
  const mockUsers = Array.from({length: 10}, (_, i) => {
    const userId = `mockuser${i}`;
    return {
      id: userId,
      username: `Mock User ${i}`,
      location: {
        latitude: latitude + Math.random() * 0.01, 
        longitude: longitude + Math.random() * 0.01,
      },
      messages: [], 
    };
  });

  return mockUsers;
};

export const fetchUsers = async setUsers => {
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

export const requestLocationPermission = async (
  setLocationPermissionGranted,
  setUsers,
  setCurrentUserCoordinates,
) => {
  console.log('inside requestLocationPermission');
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Hey There Location Permission',
      message:
        'Hey There needs access to your location ' +
        'so you can take awesome chats.',
      buttonNegative: 'Cancel',
      buttonPositive: 'Allow',
    },
  );

  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    console.log('inside requestLocationPermission GRANTED');
    setLocationPermissionGranted(true);
    setLocationPermissionGranted(true);
    getCurrentUserCoordinates(setCurrentUserCoordinates);
    fetchUsers(setUsers);
  } else {
    setLocationPermissionGranted(false);
    console.log('inside requestLocationPermission DENIED');
    Alert.alert(
      'Permission Denied!',
      'You need to give location permission to use this app',
    );
  }
};

export const getCurrentUserCoordinates = setCurrentUserCoordinates => {
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

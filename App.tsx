import React, {useEffect, useState} from 'react';
import type {} from 'react';
import {
  LogBox,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {ChatComponent} from './src/components/ChatComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Message, User} from './src/utils/types';
import {MessageContext} from './src/utils/MessageContext';
import {requestLocationPermission} from './src/utils/helpers';

LogBox.ignoreAllLogs();
function App(): JSX.Element {
  const [users, setUsers] = useState<Array<User>>([]);
  const [currentUserCoordinates, setCurrentUserCoordinates] = useState({});
  const [messages, setMessages] = useState([]);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  useEffect(() => {
    console.log('calling useEffect');
    setCurrentUserCoordinates;
    requestLocationPermission(
      setLocationPermissionGranted,
      setUsers,
      setCurrentUserCoordinates,
    );
  }, [locationPermissionGranted]);

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

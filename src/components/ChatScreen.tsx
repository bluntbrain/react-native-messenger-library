import React, {useState, useEffect, useContext} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {View, StyleSheet} from 'react-native';
import {MessageContext} from '../utils/MessageContext';
import AppBar from './AppbarComponent';

interface ChatScreenProps {
  onSend: any;
  onBack: any;
  selectedUser: any;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  onSend,
  onBack,
  selectedUser,
}) => {
  const {messages} = useContext(MessageContext);
  let sortedmessages = messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <View style={styles.container}>
      <AppBar title={selectedUser.username} onBack={onBack} />
      <GiftedChat
        messages={sortedmessages}
        onSend={message => {
          console.log('messages in gifted chat on send ==', message);
          onSend(message);
        }}
        user={{_id: selectedUser?.id}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});

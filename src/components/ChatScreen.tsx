import React, {useState, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {User, Message} from '../utils/types';
import {Dimensions, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
let {width, height} = Dimensions.get('window');

interface ChatScreenProps {
  messages: Array<Message>;
  onSend: any
  onBack: any;
  selectedUser:any
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
    messages,
    onSend,
    onBack,
    selectedUser
  }) => {
    const [messagesState, setMessagesState] = useState(messages ? messages : []);
  
    useEffect(() => {
      setMessagesState(messages);
    }, [messages]); // Update dependency to messages prop
  
    console.log('selectedUser', selectedUser)
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack}>
          <Text>back</Text>
          <Text>{selectedUser?.username}</Text>
        </TouchableOpacity>
        <GiftedChat
          messages={messagesState}
          onSend={message => {
            console.log('messages in gifted chat on send ==', message)
            onSend(message)
            setMessagesState([...messagesState, message])
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
    //   backgroundColor: 'red',
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
  

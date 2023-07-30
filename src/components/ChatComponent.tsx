import {useContext, useState} from 'react';
import {User, Message} from '../utils/types';
import {ChatScreen} from './ChatScreen';
import {MapScreen} from './MapScreen';
import {View, StyleSheet, Dimensions} from 'react-native';
import {MessageContext} from '../utils/MessageContext';
let {width, height} = Dimensions.get('window');
interface ChatComponentProps {
  userList: Array<User>;
  onMessageSend: (userMessage: Message) => void;
  currentUserCoordinates: any;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  userList,
  onMessageSend,
  currentUserCoordinates,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const {messages, setMessages} = useContext(MessageContext);

  const handleUserSelection = (user: User) => {
    if (user) {
      setSelectedUser(user);
      setMessages(user.messages);
    }else{
        setSelectedUser(null);
    }
  };

  const handleSend = (newMessages: Array<Message>) => {
    console.log('handleSend', newMessages);
    setMessages([...messages, newMessages[0]]);
    onMessageSend(selectedUser, newMessages[0]);
  };

  return selectedUser ? (
    <View style={styles.container}>
      <ChatScreen
        messages={selectedUser.messages}
        onSend={handleSend}
        onBack={() => handleUserSelection(null)}
        selectedUser={selectedUser}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <MapScreen
        users={userList}
        currentUserCoordinates={currentUserCoordinates}
        onMarkerPress={handleUserSelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    flex: 1,
    // padding: 10,
    width: width,
    height: height,
  },
});

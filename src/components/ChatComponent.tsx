import {useState} from 'react';
import {User, Message} from '../utils/types';
import {ChatScreen} from './ChatScreen';
import {MapScreen} from './MapScreen';
import {View, StyleSheet, Dimensions} from 'react-native';
let {width, height} = Dimensions.get('window');
interface ChatComponentProps {
  userList: Array<User>;
  onMessageSend: (userMessage: Message) => void;
  currentUserCoordinates:any
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  userList,
  onMessageSend,
  currentUserCoordinates
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  

  const handleUserSelection = (user: User) => {
    setSelectedUser(user);
  };

  const handleSend = (messages: Array<Message>) => {
    console.log('handleSend',messages)
    onMessageSend(selectedUser, messages[0]);
  };

  return selectedUser ? (
    <View style={styles.container}>
      <ChatScreen messages={selectedUser.messages} onSend={handleSend} onBack={() => handleUserSelection(null)} selectedUser={selectedUser}/>
    </View>
  ) : (
    <View style={styles.container}>
      <MapScreen users={userList} currentUserCoordinates={currentUserCoordinates} onMarkerPress={handleUserSelection}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    flex: 1,
    padding: 10,
    width: width,
    height: height,
  },
});

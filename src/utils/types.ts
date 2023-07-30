export interface User {
  id: string;
  username: string;
  location: {
    latitude: number;
    longitude: number;
  };
  messages: Array<Message>;
}

export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  user: User;
}

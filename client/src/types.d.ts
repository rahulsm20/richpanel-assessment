export type ImageType = {
  title: string;
  description: string;
  filepath: string;
  createdAt: string;
};

export type RootState = {
  auth: {
    isAuthenticated: boolean;
    user: {
      email: string;
    };
    facebookUser: {
      id: string;
      displayName: string;
    };
  };
  conversations: {
    conversations: ConversationType[];
    currentConversation: ConversationType;
  };
};

export type ConversationType = {
  conversation: {
    lastActiveAt: string;
    _id: string;
    messages: MessageType[];
  };
  senderData: SenderDataType;
};

export type MessageType = {
  content: string;
  createdAt: string;
  senderId: string;
  updatedAt: string;
  _id: string;
};

export type SenderDataType = {
  first_name: string;
  last_name: string;
  id: string;
  profile_pic: string;
};

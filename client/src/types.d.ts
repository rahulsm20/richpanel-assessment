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
};

export type ConversationType = {
  id: string;
  message: string;
  user: string;
  mode: string;
  time: string;
};

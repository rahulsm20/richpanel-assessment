import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import conversationReducer from "./conversationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    conversations: conversationReducer,
  },
});

export default store;

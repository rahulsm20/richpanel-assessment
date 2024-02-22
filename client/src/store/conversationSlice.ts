import { createSlice } from "@reduxjs/toolkit";
import { ConversationType } from "../types";

const initialState: {
  conversations: ConversationType[];
} = {
  conversations: [],
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
});

export const { setConversations } = conversationSlice.actions;
export default conversationSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { ConversationType } from "../types";

const initialState: {
  conversations: ConversationType[];
  currentConversation: ConversationType | undefined;
} = {
  conversations: [],
  currentConversation: undefined,
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = state.conversations.find(
        (conversation) => conversation.conversation._id == action.payload
      );
    },
    addMessage: (state, action) => {
      const { message } = action.payload;

      // Check if currentConversation exists and has conversation data
      if (state.currentConversation && state.currentConversation.conversation) {
        const conversation = state.currentConversation.conversation;

        // Create a new array with the existing messages and the new message
        const updatedMessages = [...conversation.messages, message];

        // Update the conversation object with the new messages array
        const updatedConversation = {
          ...conversation,
          messages: updatedMessages,
        };

        // Update the state with the updated conversation object
        state.currentConversation.conversation = updatedConversation;
      }
    },
  },
});

export const { setConversations, setCurrentConversation, addMessage } =
  conversationSlice.actions;
export default conversationSlice.reducer;

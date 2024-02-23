import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversations,
  setCurrentConversation,
} from "../store/conversationSlice";
import { RootState } from "../types";
import { useEffect } from "react";

const Conversations = () => {
  const conversations = useSelector(
    (state: RootState) => state.conversations.conversations
  );

  const dispatch = useDispatch();
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );

  const fetchConversations = async () => {
    // setTimeout(async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/chat/conversations"
      );
      console.log(res.data);
      dispatch(setConversations(res.data));
      if (currentConversation) {
        dispatch(setCurrentConversation(currentConversation.conversation._id));
      }
    } catch (err) {
      console.log(err);
    }
    // }, 3000);
  };

  setTimeout(async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_SERVER_URL + "/chat/conversations"
      );
      console.log(res.data);
      dispatch(setConversations(res.data));
      if (currentConversation) {
        dispatch(setCurrentConversation(currentConversation.conversation._id));
      }
    } catch (err) {
      console.log(err);
    }
  }, 1000);

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleConversationChange = (conversationId: string) => {
    dispatch(setCurrentConversation(conversationId));
  };
  const conversationsLIst = conversations.map((conversation) => {
    return (
      <li
        className="menu p-5 border-b-2 border-l-2 border-r-2"
        onClick={() => handleConversationChange(conversation.conversation._id)}
      >
        <div className="flex justify-between">
          <div className="flex flex-col justify-start items-start">
            <p>
              {conversation.senderData.first_name +
                " " +
                conversation.senderData.last_name}
            </p>
          </div>
          <p>
            {new Date(
              conversation.conversation.messages[0].createdAt
            ).toDateString()}
          </p>
        </div>
        <p className="flex text-gray-500">
          {conversation.conversation.messages[0].content}
        </p>
      </li>
    );
  });
  return (
    <div className="bg-slate-50 w-96 h-screen border border-gray-200 border-r-0">
      <div className="flex gap-5 border  justify-between p-3">
        <div className="flex gap-5">
          <button>
            <img src="/bars.svg" className="w-5" />
          </button>
          <p className="text-xl font-bold">Conversations</p>
        </div>
        <button
          className="btn bg-transparent hover:bg-inherit"
          onClick={() => fetchConversations()}
        >
          <img src="/arrow-path.svg" className="w-5" />
        </button>
      </div>
      <ul>{conversationsLIst}</ul>
    </div>
  );
};

export default Conversations;

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../types";
import { sendMessage } from "../api";
import { FormEvent, useState } from "react";
import { addMessage } from "../store/conversationSlice";

const ConversationWindow = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  if (!currentConversation) {
    return <div className="flex flex-col gap-5 bg-slate-50 w-80"></div>;
  }
  const { senderData: currentUser } = currentConversation;
  if (!currentUser) {
    return (
      <div className="flex flex-col gap-5 bg-slate-200 border border-gray-900 border-t-0">
        <img src="/background.jpg" className="" />
      </div>
    );
  }

  const replyToMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendMessage(currentUser.id, message);
      const newMessage = {
        senderId: import.meta.env.VITE_RECIPIENT_ID,
        content: message,
        createdAt: new Date().getTime(),
      };
      console.log(newMessage);
      dispatch(addMessage({ message: newMessage }));
    } catch (err) {
      console.log(err);
      console.log(message, e.target);
    }
  };
  const user = currentUser.first_name + " " + currentUser.last_name;
  return (
    <div className="flex flex-col bg-slate-200 w-1/2">
      <div className="flex p-3 border bg-slate-50 m-0 text-xl font-semibold ">
        {currentUser.first_name + " " + currentUser.last_name}
      </div>
      <section className="flex flex-col p-4 h-full overflow-y-auto">
        {currentConversation.conversation.messages.map((message) => {
          const isSelf = message.senderId == import.meta.env.VITE_RECIPIENT_ID;
          return (
            <div className={`flex flex-col ${isSelf && "items-end"}`}>
              <div className="gap-1 justify-self-end">
                <div className="flex justify-center items-center p-2 gap-3 w-max">
                  {!isSelf && (
                    <img
                      src={currentUser.profile_pic}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <p className="rounded-lg bg-slate-50 p-2">
                    {message.content}
                  </p>
                </div>
                <div className="text-xs flex px-2">
                  {!isSelf && user + " - "}
                  {new Date(message.createdAt).toDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </section>
      <form onSubmit={replyToMessage}>
        <input
          placeholder={`Message ${user}`}
          onChange={(e) => setMessage(e.target.value)}
          className="input bg-slate-50 border- w-full input-bordered"
        ></input>
      </form>
    </div>
  );
};

export default ConversationWindow;

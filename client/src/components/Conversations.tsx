const Conversations = () => {
  const conversations = [
    {
      id: 1,
      user: "rahul",
      mode: "facebook dm",
      time: "10m",
      message: "hello",
    },
    {
      id: 2,
      user: "nagesh",
      mode: "facebook dm",
      time: "10m",
      message: "hello",
    },
  ];

  const handleConversationChange = (conversationId: number) => {
    console.log(conversationId);
  };
  const conversationsLIst = conversations.map((conversation) => {
    return (
      <li
        className="p-5 border-b-2 border-l-2 border-r-2"
        onClick={() => handleConversationChange(conversation.id)}
      >
        <div className="flex justify-between">
          <div className="flex flex-col justify-start items-start">
            <p>{conversation.user}</p>
            <p>{conversation.mode}</p>
          </div>
          <p>{conversation.time}</p>
        </div>
        <p className="flex text-gray-500">{conversation.message}</p>
      </li>
    );
  });
  return (
    <div className="bg-slate-50 w-96 h-screen">
      <div className="flex gap-5 border border-gray-200 justify-between p-3">
        <div className="flex gap-5">
          <img src="/bars.svg" className="w-5" />
          <p className="text-xl font-bold">Conversations</p>
        </div>
        <img src="/arrow-path.svg" className="w-5" />
      </div>
      <ul>{conversationsLIst}</ul>
    </div>
  );
};

export default Conversations;

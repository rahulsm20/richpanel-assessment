import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Conversations from "../components/Conversations";
import ConversationWindow from "../components/ConversationWindow";
import ContactWIndow from "../components/ContactWIndow";
const Helpdesk = () => {
  const getImages = async () => {
    try {
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getImages();
  }, []);
  return (
    <div className="flex gap-0 h-screen">
      <Sidebar />
      <Conversations />
      <ConversationWindow />
      <ContactWIndow />
    </div>
  );
};

export default Helpdesk;

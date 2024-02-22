import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Conversations from "../components/Conversations";
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
    <div className="flex gap-0">
      <Sidebar />
      <Conversations />
    </div>
  );
};

export default Helpdesk;

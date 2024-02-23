import { useSelector } from "react-redux";
import { RootState } from "../types";

const ContactWIndow = () => {
  const currentConversation = useSelector(
    (state: RootState) => state.conversations.currentConversation
  );
  if (!currentConversation) {
    return (
      <div className="flex flex-col gap-5 bg-slate-50 w-80">
        <img src="/background.jpg" className="" />
      </div>
    );
  }
  const { senderData: currentUser } = currentConversation;
  if (!currentUser) {
    return (
      <div className="flex flex-col gap-5 bg-slate-200 border border-gray-900 border-t-0">
        <img src="/background.jpg" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5 bg-slate-200 border border-gray-900 border-t-0 w-80">
      <div className="flex flex-col p-5 items-center bg-slate-50 h-max w-full">
        <div className="flex flex-col p-5 items-center">
          <img
            className="w-20 h-20 rounded-full"
            src="https://scontent.fblr1-7.fna.fbcdn.net/v/t1.30497-1/84628273_176159830277856_972693363922829312_n.jpg?stp=dst-jpg_p720x720&_nc_cat=1&ccb=1-7&_nc_sid=810bd0&_nc_ohc=-17iDpc2TxcAX838OSX&_nc_ht=scontent.fblr1-7.fna&edm=AP4hL3IEAAAA&oh=00_AfDZH_BZ-x89yBzzAbNtzVRG-jEzsO2Gl4H4H4zPiIigyg&oe=65FFEF99"
          />
          <p className="text-lg font-semibold">
            {currentUser.first_name + " " + currentUser.last_name}
          </p>
          <span className="text-base">* Offline</span>
        </div>
        <div className="flex gap-5">
          <button className="btn bg-transparent hover:bg-transparent">
            <img src="/phone.svg" className="w-5" />
            <span>Call</span>
          </button>
          <button className="btn bg-transparent hover:bg-transparent">
            <img src="/user-circle.svg" className="w-5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-slate-50 m-5 p-5 rounded-xl drop-shadow-md">
        <p className="flex">Customer details</p>
        <ul className="flex flex-col gap-2 text-xs">
          <li className="flex justify-between">
            <p className="text-gray-500">Email</p>
            <p>example@gmail.com</p>
          </li>
          <li className="flex justify-between">
            <p className="text-gray-500">FIrst Name</p>
            <p>{currentUser.first_name}</p>
          </li>
          <li className="flex justify-between">
            <p className="text-gray-500">Last Name</p>
            <p>{currentUser.last_name}</p>
          </li>
        </ul>
        <p className="text-blue-700 flex text-sm">VIew more details</p>
      </div>
    </div>
  );
};

export default ContactWIndow;

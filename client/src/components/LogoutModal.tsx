import React, { useRef } from "react";
interface LogoutModalProps {
  handleLogout: () => Promise<void>;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ handleLogout }) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };
  return (
    <div>
      <button
        className="btn btn-transparent hover:bg-white bg-slate-200 normal-case text-black btn-sm text-sm flex justify-center content-center"
        onClick={openModal}
      >
        Logout
      </button>
      <dialog ref={modalRef} className="modal justify-center">
        <div className="w-3/4 bg-zinc-900 p-8 rounded-xl">
          <p className="font-bold text-lg mb-5">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-3">
            <button
              className="btn btn-transparent hover:bg-red-600 bg-red-500 normal-case text-white btn-sm text-sm"
              onClick={handleLogout}
            >
              Yes
            </button>
            <form method="dialog">
              <button className="btn btn-sm normal-case bg-blue-500 hover:bg-blue-600 text-white">
                No
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default LogoutModal;

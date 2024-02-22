import queryString from "query-string";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const query = window.location.search;
  const { section } = queryString.parse(query);
  useEffect(() => {
    if (!section) {
      navigate("?section=conversations");
    }
  }, []);
  return (
    <div className="drawer text-white w-20">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked />
      <div className="drawer-content"></div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar"></label>
        <ul className="flex flex-col w-20 gap-5 min-h-full bg-[#050c60]">
          <li className="p-2 flex justify-center items-center">
            <img
              src="https://assets-global.website-files.com/5efccc15b40a7dfbb529ea1a/5fa1b350a973f63a3cdb0a84_Richpanel_Logo_Mark_Color-p-500.png"
              className="w-12"
            />
          </li>
          <li
            className={`${
              section == "conversations" ? "bg-white" : "bg-transparent"
            } flex justify-center items-center p-4`}
          >
            <a href="?section=conversations">
              <img src="/inbox.svg" className="w-8" />
            </a>
          </li>
          <li
            className={`${
              section == "users" ? "bg-white" : "bg-transparent"
            } flex justify-center items-center p-4 `}
          >
            <a href="?section=users">
              <img src="/users.svg" className="w-8" />
            </a>
          </li>
          <li
            className={`${
              section == "analytics" ? "bg-white" : "bg-transparent"
            } flex justify-center items-center p-4`}
          >
            <a href="?section=analytics">
              <img src="/analytics.svg" className="w-8" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

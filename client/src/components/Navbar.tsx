import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// import { logout } from "../api";
import { setAuthenticated } from "../store/authSlice";
import { RootState } from "../types";
import LogoutModal from "./LogoutModal";
const Navbar = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      sessionStorage.clear();
      dispatch(setAuthenticated(false));
      window.location.replace("/login");
    } catch (err) {
      console.log("Error logging out: " + err);
    }
  };

  return (
    <div className="top-0 nav p-5 sticky flex flex-col md:flex-row gap-5 justify-between items-center border-b border-gray-600 z-10 w-full">
      <div className="flex gap-2 bg- rounded-2xl p-2 bg-black">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Blinkit-yellow-rounded.svg/1200px-Blinkit-yellow-rounded.svg.png"
          className="w-8"
        />
      </div>
      <ul className="flex gap-2">
        {isAuthenticated && (
          <div>
            <li className="hover:underline">
              <Link to="/upload">Upload Image</Link>
            </li>
            <li className="hover:underline">
              <Link to="/view-images">View your images</Link>
            </li>
          </div>
        )}
        {!isAuthenticated && (
          <li className="hover:underline">
            <Link to="/signup">Signup</Link>
          </li>
        )}
      </ul>
      {isAuthenticated ? (
        <div className="gap-4 items-center flex flex-col md:flex-row">
          {user.email.split("@")[0]}
          <LogoutModal handleLogout={handleLogout} />
        </div>
      ) : (
        <div className="hover:underline">
          <Link to="/login">
            <button className="btn btn-transparent hover:bg-white bg-slate-200 normal-case text-black btn-sm text-sm flex justify-center content-center">
              Login
              <img src="/arrow-right.svg" className="w-5" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

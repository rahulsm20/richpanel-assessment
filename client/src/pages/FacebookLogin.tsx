import { useEffect } from "react";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { setFacebookUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../types";
import { verifyFacebook } from "../api";

const FacebookLogin = () => {
  const facebookUser = useSelector(
    (state: RootState) => state.auth.facebookUser
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = window.location.search;
        const { user_data } = queryString.parse(query);
        console.log(user_data);
        const userDataString = user_data as string;
        if (Object.keys(facebookUser).length == 0) {
          const storedUser = sessionStorage.getItem("facebookUserData");
          if (storedUser && storedUser?.length > 0) {
            const user = JSON.parse(storedUser || "");
            const res = await verifyFacebook(user);
            console.log(res.data);
            navigate("/helpdesk");
          }
        }
        if (user_data) {
          sessionStorage.setItem("facebookUserData", userDataString);
          console.log(userDataString);
          const userData = JSON.parse(userDataString);
          console.log(userDataString);
          dispatch(setFacebookUser(userData));
          navigate("/helpdesk");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  // if (facebookUser) {
  // }

  const FBLogin = import.meta.env.VITE_SERVER_URL + "/auth/facebook";
  return (
    <div className="flex flex-col gap-10 mt-10 justify-center items-center">
      <div className="flex flex-col justify-center items-center bg-slate-50 p-10 rounded-xl gap-5">
        <p>Facebook integration</p>
        <a
          className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
          href={FBLogin}
        >
          Connect Page
        </a>
      </div>
    </div>
  );
};

export default FacebookLogin;

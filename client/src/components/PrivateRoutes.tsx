import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { verify } from "../api";
import { setAuthenticated, setFacebookUser, setUser } from "../store/authSlice";
const PrivateRoute = () => {
  // const navigate = useNavigate();
  // const isAuthenticated = useSelector(
  //   (state: RootState) => state.auth.isAuthenticated
  // );

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await verify();
        const facebookUserData = JSON.parse(
          sessionStorage.getItem("facebookUserData") || ""
        );
        console.log(facebookUserData);
        dispatch(setFacebookUser(facebookUserData));
        dispatch(setAuthenticated(true));
        dispatch(setUser(result));
      } catch (err) {
        console.error("Error verifying token:", err);
        navigate("/login");
        dispatch(setAuthenticated(false));
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return <Outlet />;
};

export default PrivateRoute;

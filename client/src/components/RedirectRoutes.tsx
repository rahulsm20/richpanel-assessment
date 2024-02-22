import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { verify } from "../api";
import { setAuthenticated, setUser } from "../store/authSlice";
const RedirectRoutes = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await verify();
        dispatch(setAuthenticated(true));
        dispatch(setUser(result));
        navigate("/fb-login");
      } catch (err) {
        console.error("Error verifying token:", err);
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
export default RedirectRoutes;

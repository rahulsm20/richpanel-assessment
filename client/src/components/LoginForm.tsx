import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser } from "../store/authSlice";
import Input from "./Input";
import { login } from "../api";

const LoginForm = () => {
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [loading,setLoading] = useState(false)

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await login(formData)
      dispatch(setAuthenticated(true));
      sessionStorage.setItem("AUTH_TOKEN", res.token);
      dispatch(setUser(res));
      window.location.replace("/fb-login");
    } catch (err) {
      setError(true);
      console.log(err);
    }
    finally{
    setLoading(false)
    }
  };

  const handleFormChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="flex justify-center items-center flex-col gap-5 bg-slate-50 text-black px-10 py-5 rounded-xl">
      <h3 className="text-lg">Login to your account</h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          name="email"
          type="email"
          onChange={(e) => handleFormChange(e)}
        ></Input>
        <Input
          label="Password"
          name="password"
          type="password"
          onChange={(e) => handleFormChange(e)}
        ></Input>
        <div className="flex gap-5">
          <input
            name="remember_me"
            type="checkbox"
            className="flex gap-2 bg-slate-50 border"
            onChange={(e) => handleFormChange(e)}
          ></input>
          <label htmlFor="remember_me">Remember me </label>
        </div>
        {
          loading ? 
          <img src='/loadin.gif' className="w-10"/>
          :
          <button
          type="submit"
          className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-lg border-0"
          >
          Login
        </button>
    }
      </form>
      {error && <span className="text-red-500">Failed to login user</span>}
      <p>
        New to FB-Helpdesk? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default LoginForm;

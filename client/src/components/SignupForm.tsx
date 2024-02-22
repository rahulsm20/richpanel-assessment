import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthenticated, setUser } from "../store/authSlice";
import Input from "./Input";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      await axios.post(
        import.meta.env.VITE_SERVER_URL + "/auth/signup",
        formData
      );
      const userData = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/auth/login",
        formData
      );
      localStorage.setItem("loginResponse", JSON.stringify(userData));
      dispatch(setAuthenticated(true));
      dispatch(setUser(userData.data));
      sessionStorage.setItem("AUTH_TOKEN", userData.data.token);
      window.location.replace("/fb-login");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  const handleFormChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };
  return (
    <div className="flex justify-center items-center flex-col gap-5 bg-slate-50 px-10 py-5 rounded-xl mt-10">
      <h3 className="text-2xl">Create account</h3>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Input
          label="Name"
          name="name"
          type="text"
          onChange={(e) => handleFormChange(e)}
        ></Input>
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
        <button
          type="submit"
          className="btn bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          Signup
        </button>
      </form>
      {error && <span className="text-red-500">Failed to signup user</span>}
      <p>
        Already have an account? <a href="/">Login</a>
      </p>
    </div>
  );
};

export default SignupForm;

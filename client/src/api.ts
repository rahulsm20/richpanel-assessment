import axios from "axios";

const authToken = sessionStorage.getItem("AUTH_TOKEN") || "";
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    Authorization: "Bearer: " + authToken,
  },
});

export const verify = async () => {
  const res = await api.post("auth/verify?verify=true");
  return res.data;
};

export const verifyFacebook = async(user:any)=>{
  const res = await api.post("auth/facebook/verify",user)
  return res.data
}
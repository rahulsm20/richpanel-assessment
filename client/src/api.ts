import axios from "axios";

const authToken = sessionStorage.getItem("AUTH_TOKEN") || "";
export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    Authorization: "Bearer: " + authToken,
  },
});

export const verify = async () => {
  const res = await api.post("auth/verify?verify=true");
  return res.data;
};

export const verifyFacebook = async (user: any) => {
  const res = await api.post("auth/facebook/verify", user);
  return res.data;
};

export const sendMessage = async (receiverId: string, messageText: string) => {
  // const senderId = import.meta.env.PAGE_ID;
  const data = {
    receiverId,
    messageText,
  };
  const res = await api.post("send-message", data);
  return res.data;
};

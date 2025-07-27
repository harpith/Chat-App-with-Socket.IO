// utils/chatAPI.js
import axios from "axios";

export const fetchChats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.get("http://localhost:5000/api/chat", config);
  return data;
};

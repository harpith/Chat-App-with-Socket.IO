import axios from "axios";

export const fetchMessagesApi = async (chatId, token) => {
  const { data } = await axios.get(`http://localhost:5000/api/message/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const sendMessageApi = async (content, chatId, token) => {
  const { data } = await axios.post(
    `http://localhost:5000/api/message`,
    { content, chatId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

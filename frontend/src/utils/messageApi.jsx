import axios from "axios"

export const sendMessageApi = async (content, chatId, token) => {
  const { data } = await axios.post(
    "http://localhost:5000/api/message",
    { content, chatId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
  return data
}

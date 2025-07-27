"use client"

import { createContext, useContext, useEffect, useState } from "react"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [notification, setNotification] = useState([])

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo)
     if (!userInfo) history.push("/");
  }, [history])

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)

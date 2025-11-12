"use client"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { initSocket, cleanupSocket } from "../utils/socket"

const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chats, setChats] = useState([])
  const [notification, setNotification] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo)

    socketRef.current = initSocket()
    // ensure we don't attach duplicates
    socketRef.current.off("message received")
    socketRef.current.on("message received", (message) => {
      // handle incoming message (update chats state etc.)
    })

    return () => {
      // remove listeners and disconnect when provider unmounts
      if (socketRef.current) {
        socketRef.current.off("message received")
      }
      cleanupSocket()
    }
  }, [])

  // Prevent infinite reload when already on a public/auth page
  useEffect(() => {
    const publicPaths = ["/", "/login", "/register"]
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "/"

    if (!user && !publicPaths.includes(currentPath)) {
      window.location.href = "/"
    }
  }, [user])

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

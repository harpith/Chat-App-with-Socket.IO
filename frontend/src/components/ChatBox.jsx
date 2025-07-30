"use client"

import { useEffect, useRef, useState } from "react"
import { ChatState } from "../context/ChatContext"
import { sendMessageApi, fetchMessagesApi } from "../utils/messageApi"
import GroupChatActions from "./GroupChatActions"
import { PencilIcon } from "@heroicons/react/24/solid"
import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000"
let socket
let selectedChatCompare

export default function ChatBox({ onBack, notifications, setNotifications }) {
  const { selectedChat, user } = ChatState()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [showGroupActions, setShowGroupActions] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [typingDots, setTypingDots] = useState("")
  const scrollRef = useRef(null)

  const isGroupAdmin =
    selectedChat?.isGroupChat && selectedChat?.groupAdmin?._id === user._id

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)

    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", () => setTyping(true))
    socket.on("stop typing", () => setTyping(false))

    return () => socket.off("message received")
  }, [])

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.find((n) => n._id === newMessageReceived._id)) {
          setNotifications((prev) => [newMessageReceived, ...prev])
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived])
      }
    })

    return () => socket.off("message received")
  }, [messages, selectedChatCompare, notifications, setNotifications])

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return
      try {
        const data = await fetchMessagesApi(selectedChat._id, user.token)
        setMessages(data)
        socket.emit("join chat", selectedChat._id)
        selectedChatCompare = selectedChat
      } catch (error) {
        console.error("❌ Error fetching messages:", error)
      }
    }

    loadMessages()
  }, [selectedChat, user.token])

  const handleSend = async () => {
    if (!message.trim()) return

    try {
      const newMessage = await sendMessageApi(
        message,
        selectedChat._id,
        user.token
      )

      setMessages((prev) => [...prev, newMessage])
      setMessage("")
      socket.emit("stop typing", selectedChat._id)
      socket.emit("new message", newMessage)
    } catch (error) {
      alert("❌ Failed to send message")
    }
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (typing) {
      const dotInterval = setInterval(() => {
        setTypingDots((prev) => (prev.length >= 3 ? "" : prev + "."))
      }, 500)
      return () => clearInterval(dotInterval)
    } else {
      setTypingDots("")
    }
  }, [typing])

  let typingTimeout
  const handleTyping = (e) => {
    setMessage(e.target.value)

    if (!socketConnected) return
    socket.emit("typing", selectedChat._id)

    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id)
    }, 2000)
  }

  if (!selectedChat) {
    return (
      <div className="text-center text-gray-500 my-auto">
        Select a chat to start messaging
      </div>
    )
  }

  const chatPartnerName = selectedChat.isGroupChat
    ? selectedChat.chatName
    : selectedChat.users.find((u) => u._id !== user._id)?.name

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-indigo-50 to-blue-100 p-6 rounded-xl shadow-xl border border-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <h2 className="text-xl font-bold text-center flex-1 text-gray-800">
          {chatPartnerName}
        </h2>

        {isGroupAdmin ? (
          <button
            onClick={() => setShowGroupActions(true)}
            className="text-gray-500 hover:text-gray-700"
            title="Edit Group"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        ) : (
          <span className="w-5 h-5" />
        )}
      </div>

      {/* Messages */}
      <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl flex-1 overflow-y-auto shadow-inner space-y-3 border border-gray-200">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          <>
            {messages.map((msg) => {
              const isMine = msg.sender._id === user._id
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm shadow-md ${
                      isMine
                        ? "bg-blue-500 text-white"
                        : "bg-green-200 text-green-900"
                    }`}
                  >
                    <strong className="block font-medium">
                      {msg.sender.name}
                    </strong>
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {typing && (
              <div className="text-sm text-gray-500 italic px-2">
                Typing{typingDots}
              </div>
            )}

            <div ref={scrollRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>

      {/* Group Chat Edit */}
      {showGroupActions && (
        <GroupChatActions
          onClose={() => setShowGroupActions(false)}
          chat={selectedChat}
        />
      )}
    </div>
  )
}

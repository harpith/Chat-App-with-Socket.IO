"use client"

import { useEffect, useState } from "react"
import { ChatState } from "../context/ChatContext"
import { fetchChats } from "../utils/chatApi"
import CreateGroupModal from "./CreateGroupModal"
import ChatBox from "./ChatBox"

export default function ChatDashboard() {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState()
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [search, setSearch] = useState("")

  const loadChats = async () => {
    try {
      const data = await fetchChats(user.token)
      setChats(data)
    } catch (error) {
      alert("Failed to load chats")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userInfo")
    window.location.reload()
  }

  const handleGroupCreated = () => {
    setShowCreateGroup(false)
    loadChats()
  }

  useEffect(() => {
    if (user) loadChats()
  }, [user])

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <input
          type="text"
          placeholder="🔍 Search User"
          className="px-4 py-1 rounded-md border w-40 md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h1 className="text-md md:text-xl font-semibold text-gray-700">Talk-A-Tive</h1>

        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative group">
            <span className="cursor-pointer relative">
              🔔
              {notifications.length > 0 && (
                <span className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs px-1 rounded-full">
                  {notifications.length}
                </span>
              )}
            </span>
            {notifications.length > 0 && (
              <div className="absolute top-6 right-0 bg-white shadow rounded w-64 text-sm hidden group-hover:block z-10">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedChat(n.chat)
                      setNotifications((prev) => prev.filter((_, idx) => idx !== i))
                    }}
                  >
                    📩 New Message from {n.sender?.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <img src={user.pic} alt="avatar" className="w-8 h-8 rounded-full" />
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-1 md:py-2 rounded-md transition duration-200 text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-1/4 border-r bg-blue-50 p-4 overflow-y-auto transition-all duration-300 ${
          selectedChat ? "hidden md:block" : "block"
        }`}>
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">My Chats</h2>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md"
            >
              ➕ New Group
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto h-[85vh] pr-2">
            {chats?.map((chat) => {
              const chatName = chat.isGroupChat
                ? chat.chatName
                : chat.users.find((u) => u._id !== user._id)?.name

              return (
                <div
                  key={chat._id}
                  className={`p-3 rounded-lg cursor-pointer ${
                    selectedChat?._id === chat._id
                      ? "bg-cyan-600 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="font-medium">{chatName}</div>
                  {chat.latestMessage && (
                    <div className="text-sm truncate">
                      <strong>{chat.latestMessage.sender.name}:</strong>{" "}
                      {chat.latestMessage.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 w-full ${selectedChat ? "block" : "hidden"} md:block`}>
          <ChatBox
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal onCreated={handleGroupCreated} onClose={() => setShowCreateGroup(false)} />
      )}
    </div>
  )
}
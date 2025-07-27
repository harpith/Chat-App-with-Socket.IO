"use client"

import { useState } from "react"
import CreateGroupModal from "./CreateGroupModal"

export default function ChatDashboard() {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [selectedChat, setSelectedChat] = useState("Prabin Acharya")
  const [searchUser, setSearchUser] = useState("")
  const [message, setMessage] = useState("")

  const chats = [
    { name: "wAW", type: "group", lastMessage: "", active: false },
    { name: "Prabin Acharya", type: "user", lastMessage: "bhabin : what up bro?", active: true },
    { name: "Hello_World", type: "group", lastMessage: "Guest User : 1", active: false },
    { name: "user", type: "user", lastMessage: "Guest User : hello", active: false },
    { name: "AB", type: "user", lastMessage: "Guest User : Hi", active: false },
    { name: "JS", type: "user", lastMessage: "Guest User : hii", active: false },
    { name: "kihoo", type: "user", lastMessage: "123456 : ssssssssssssssssss", active: false },
    { name: "cgat", type: "user", lastMessage: "Guest User : hii", active: false },
    { name: "Amiy", type: "user", lastMessage: "Guest User : hey!!", active: false },
  ]

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder="Search User"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="pl-10 w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <h1 className="text-2xl font-light text-gray-700">Talk-A-Tive</h1>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            🔔
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            <span>⬇️</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 bg-gradient-to-b from-cyan-400 to-blue-500 p-4">
          <div className="bg-white rounded-2xl h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-gray-700">My Chats</h2>
              <button
                onClick={() => setShowCreateGroup(true)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-3 py-1 text-sm flex items-center space-x-1"
              >
                <span>New Group Chat ➕</span>
              </button>
            </div>

            <div className="space-y-2">
              {chats.map((chat, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    chat.active ? "bg-teal-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setSelectedChat(chat.name)}
                >
                  <div className="font-medium">{chat.name}</div>
                  {chat.lastMessage && (
                    <div className={`text-sm ${chat.active ? "text-teal-100" : "text-gray-500"}`}>
                      {chat.lastMessage}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-gradient-to-b from-cyan-400 to-blue-500 p-4">
          <div className="bg-white rounded-2xl h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">{selectedChat}</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">👁️</button>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-end">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">P</span>
                    </div>
                    <div className="bg-green-200 text-gray-800 px-3 py-2 rounded-lg max-w-xs">what up bro?</div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-xs">Hello</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <input
                placeholder="Enter a message.."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {showCreateGroup && <CreateGroupModal onClose={() => setShowCreateGroup(false)} />}
    </div>
  )
}

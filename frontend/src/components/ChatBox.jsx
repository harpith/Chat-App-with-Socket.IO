"use client"

import { useState } from "react"
import { ChatState } from "../context/ChatContext"
import { sendMessageApi } from "../utils/messageApi"
import GroupChatActions from "./GroupChatActions"
import { PencilIcon } from "@heroicons/react/24/solid" // Optional, you can use another icon if not using Heroicons

export default function ChatBox() {
  const { selectedChat, user } = ChatState()
  const [message, setMessage] = useState("")
  const [showGroupActions, setShowGroupActions] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    try {
      await sendMessageApi(message, selectedChat._id, user.token)
      setMessage("")
      // Optionally: update message list (if implemented)
    } catch (error) {
      alert("Failed to send message")
      console.error(error)
    }
  }

  if (!selectedChat) {
    return <div className="text-center text-gray-500 my-auto">Select a chat to start messaging</div>
  }

  const isGroupAdmin = selectedChat.isGroupChat && selectedChat.groupAdmin?._id === user._id

  return (
    <div className="flex-1 bg-gray-100 p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">
          {selectedChat.isGroupChat
            ? selectedChat.chatName
            : selectedChat.users.find((u) => u._id !== user._id)?.name}
        </h2>

        {isGroupAdmin && (
          <button
            onClick={() => setShowGroupActions(true)}
            className="text-gray-500 hover:text-gray-700"
            title="Edit Group"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Area */}
      <div className="bg-white p-4 rounded-lg h-[70vh] overflow-y-auto shadow-inner">
        {/* Chat messages would go here */}
        <p className="text-gray-500 text-center">No messages yet</p>
      </div>

      {/* Message Input */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>

      {/* Group Actions Modal */}
      {showGroupActions && (
        <GroupChatActions onClose={() => setShowGroupActions(false)} chat={selectedChat} />
      )}
    </div>
  )
}

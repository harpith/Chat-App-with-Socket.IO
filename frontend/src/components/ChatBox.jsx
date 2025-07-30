"use client";

import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatContext";
import { sendMessageApi, fetchMessagesApi } from "../utils/messageApi";
import GroupChatActions from "./GroupChatActions";
import { PencilIcon } from "@heroicons/react/24/solid";

export default function ChatBox() {
  const { selectedChat, user } = ChatState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showGroupActions, setShowGroupActions] = useState(false);

  const isGroupAdmin =
    selectedChat?.isGroupChat && selectedChat?.groupAdmin?._id === user._id;

  // Fetch messages when selectedChat changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat) return;
      try {
        const data = await fetchMessagesApi(selectedChat._id, user.token);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    loadMessages();
  }, [selectedChat, user.token]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const newMessage = await sendMessageApi(
        message,
        selectedChat._id,
        user.token
      );
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (error) {
      alert("Failed to send message");
      console.error(error);
    }
  };

  if (!selectedChat) {
    return (
      <div className="text-center text-gray-500 my-auto">
        Select a chat to start messaging
      </div>
    );
  }

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

      {/* Message Display */}
      <div className="bg-white p-4 rounded-lg h-[70vh] overflow-y-auto shadow-inner space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                  msg.sender._id === user._id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <strong className="block">{msg.sender.name}</strong>
                {msg.content}
              </div>
            </div>
          ))
        )}
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

      {/* Group Management Modal */}
      {showGroupActions && (
        <GroupChatActions
          onClose={() => setShowGroupActions(false)}
          chat={selectedChat}
        />
      )}
    </div>
  );
}

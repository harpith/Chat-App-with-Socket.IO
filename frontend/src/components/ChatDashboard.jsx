"use client";

import { useEffect, useState } from "react";
import { ChatState } from "../context/ChatContext";
import { fetchChats, accessChat } from "../utils/chatApi";
import CreateGroupModal from "./CreateGroupModal";

export default function ChatDashboard() {
  const { user } = ChatState();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  

  const loadChats = async () => {
    try {
      const data = await fetchChats(user.token);
      setChats(data);
    } catch (error) {
      alert("Failed to load chats");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.reload();
  };

  const handleAccessChat = async (userId) => {
    try {
      const chat = await accessChat(userId, user.token);
      if (!chats.find((c) => c._id === chat._id)) {
        setChats([chat, ...chats]);
      }
      setSelectedChat(chat);
    } catch (error) {
      alert("Error accessing chat");
    }
  };

  useEffect(() => {
    if (user) loadChats();
  }, [user]);

  const handleGroupCreated = () => {
    setShowCreateGroup(false);
    loadChats();
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
        <input
          type="text"
          placeholder="🔍 Search User"
          className="px-4 py-1 rounded-md border w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <h1 className="text-xl font-semibold text-gray-700">Talk-A-Tive</h1>

        <div className="flex items-center space-x-4">
          <div className="relative group">
            <span className="cursor-pointer">🔔</span>
            {notifications.length > 0 && (
              <div className="absolute top-6 right-0 bg-white shadow rounded w-64 text-sm hidden group-hover:block z-10">
                {notifications.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedChat(n.chat);
                      setNotifications((prev) =>
                        prev.filter((_, idx) => idx !== i)
                      );
                    }}
                  >
                    New Message from {n.sender?.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <img
              src={user.pic}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <button onClick={handleLogout}>🚪</button>
          </div>
        </div>
      </header>

      {/* Main Chat Layout */}
      <div className="flex flex-1">
        {/* Chat List Sidebar */}
        <div className="w-1/4 bg-blue-50 border-r p-4">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">My Chats</h2>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="text-sm bg-blue-500 text-white px-2 py-1 rounded-md"
            >
              New Group Chat ➕
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto h-[85vh] pr-2">
            {chats.map((chat) => {
              const chatName = chat.isGroupChat
                ? chat.chatName
                : chat.users.find((u) => u._id !== user._id)?.name;
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
              );
            })}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 bg-gray-100 p-4 flex flex-col justify-between">
          {selectedChat ? (
            <>
              <div>
                <h2 className="text-lg font-bold mb-2">
                  {selectedChat.isGroupChat
                    ? selectedChat.chatName
                    : selectedChat.users.find((u) => u._id !== user._id)?.name}
                </h2>
                <div className="bg-white p-4 rounded-lg h-[70vh] overflow-y-auto shadow-inner">
                  {/* Messages will appear here */}
                  <p className="text-gray-500 text-center">No messages yet</p>
                </div>
              </div>
              <div className="mt-4">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 my-auto">
              Select a chat to start messaging
            </div>
          )}
        </div>
      </div>

      {showCreateGroup && <CreateGroupModal onCreated={handleGroupCreated} />}
    </div>
  );
}

"use client"

import { useState } from "react"

export default function CreateGroupModal({ onClose }) {
  const [groupName, setGroupName] = useState("Hello")
  const [searchUser, setSearchUser] = useState("John")
  const [selectedUsers, setSelectedUsers] = useState(["JOHN100"])

  const users = [
    { name: "Guest User", email: "guest@example.com", selected: true },
    { name: "Guest User", email: "guest@example.com", selected: false },
    { name: "Guest User", email: "guest@example.com", selected: false },
    { name: "Guest User", email: "guest@example.com", selected: false },
  ]

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-gray-800">Create Group Chat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">✖️</button>
        </div>

        <div className="space-y-4">
          <input
            placeholder="Chat Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            placeholder="Add Users eg: John, Piyush, Jane"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user, index) => (
              <div key={index} className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <span>{user}</span>
                <button onClick={() => removeUser(user)} className="text-white hover:text-gray-200">✖️</button>
              </div>
            ))}
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {users.map((user, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                user.selected ? "bg-teal-500 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">G</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className={`text-sm ${user.selected ? "text-teal-100" : "text-gray-500"}`}>
                    <span className="font-medium">Email:</span> {user.email}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-lg font-medium" onClick={onClose}>
            Create Chat
          </button>
        </div>
      </div>
    </div>
  )
}

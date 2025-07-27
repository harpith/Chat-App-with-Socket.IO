// components/CreateGroupModal.jsx
"use client"

import { useState } from "react"
import axios from "axios"

export default function CreateGroupModal({ onClose, onCreated }) {
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))

  const handleSearch = async () => {
    if (!searchTerm) return
    const { data } = await axios.get(`http://localhost:5000/api/user?search=${searchTerm}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    })
    setSearchResults(data)
  }

  const handleAddUser = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId))
  }

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      alert("Group must have a name and at least 2 users.")
      return
    }

    const { data } = await axios.post(
      "http://localhost:5000/api/chat/group",
      {
        name: groupName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    )

    onCreated(data)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800">Create Group Chat</h2>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-2 rounded-md">
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <div key={user._id} className="bg-blue-100 px-2 py-1 rounded-full text-sm flex items-center gap-1">
              {user.name}
              <button onClick={() => handleRemoveUser(user._id)} className="text-red-500 text-xs">x</button>
            </div>
          ))}
        </div>

        <div className="max-h-32 overflow-y-auto">
          {searchResults.map((user) => (
            <div
              key={user._id}
              className="cursor-pointer hover:bg-gray-100 px-2 py-1"
              onClick={() => handleAddUser(user)}
            >
              {user.name} <span className="text-xs text-gray-400">({user.email})</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-black">Cancel</button>
          <button onClick={handleCreateGroup} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

// components/GroupChatActions.jsx
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ChatState } from "../context/ChatContext"

export default function GroupChatActions({ chat, onClose, onUpdated }) {
  const { user } = ChatState()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    const { data } = await axios.get(`http://localhost:5000/api/user?search=${searchTerm}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
    setSearchResults(data)
  }

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults([])
      return
    }
    const delay = setTimeout(() => handleSearch(), 300)
    return () => clearTimeout(delay)
  }, [searchTerm])

  const handleAddUser = async (u) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        { chatId: chat._id, userId: u._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      onUpdated(data)
    } catch (error) {
      alert("Failed to add user")
    }
  }

  const handleRemoveUser = async (u) => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        { chatId: chat._id, userId: u._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      onUpdated(data)
    } catch (error) {
      alert("Failed to remove user")
    }
  }

  return (
    <div className="p-4 bg-white border rounded shadow-md w-full max-w-md mx-auto mt-4 space-y-4">
      <h3 className="text-lg font-semibold">Manage Group Members</h3>

      <div className="flex flex-wrap gap-2">
        {chat.users.map((u) => (
          <div key={u._id} className="bg-blue-100 px-2 py-1 rounded-full text-sm flex items-center gap-2">
            {u.name}
            {chat.groupAdmin._id === user._id && u._id !== user._id && (
              <button onClick={() => handleRemoveUser(u)} className="text-red-500 text-xs">✖</button>
            )}
          </div>
        ))}
      </div>

      {chat.groupAdmin._id === user._id && (
        <>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users to add"
            className="w-full px-4 py-2 border rounded-md"
          />

          <div className="max-h-32 overflow-y-auto space-y-1">
            {searchResults.map((u) => (
              <div
                key={u._id}
                className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                onClick={() => handleAddUser(u)}
              >
                {u.name} ({u.email})
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-600 hover:text-black">Close</button>
      </div>
    </div>
  )
}

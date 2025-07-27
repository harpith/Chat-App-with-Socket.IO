"use client"

import { useEffect, useState } from "react"
import LoginForm from "./components/LoginForm"
import SignupForm from "./components/SignupForm"
import ChatDashboard from "./components/ChatDashboard"
import { ChatState } from "./context/ChatContext"

export default function App() {
  const [currentView, setCurrentView] = useState("login")
  const { user, setUser } = ChatState()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if (userInfo) {
      setUser(userInfo)
    }
  }, [setUser])

  if (user) {
    return <ChatDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-4">
      {currentView === "login" ? (
        <LoginForm
          onSwitchToSignup={() => setCurrentView("signup")}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={() => setCurrentView("login")}
        />
      )}
    </div>
  )
}

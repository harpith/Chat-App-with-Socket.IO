"use client"

import { useState } from "react"
import LoginForm from "./components/LoginForm"
import SignupForm from "./components/SignupForm"
import ChatDashboard from "./components/ChatDashboard"

export default function App() {
  const [currentView, setCurrentView] = useState("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn) {
    return <ChatDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-4">
      {currentView === "login" ? (
        <LoginForm onSwitchToSignup={() => setCurrentView("signup")} onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setCurrentView("login")} onSignup={() => setIsLoggedIn(true)} />
      )}
    </div>
  )
}

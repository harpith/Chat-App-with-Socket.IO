"use client"

import { useState } from "react"
import axios from "axios";


export default function LoginForm({ onSwitchToSignup, onLogin }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async(e) => {
    e.preventDefault()
    try{
      const { data } =  await axios.post("http://localhost:5000/api/user/login",{
      email,
      password,
      });
    localStorage.setItem('userInfo',JSON.stringify(data))
    onLogin()
    }
  catch(error){
     alert(error.response?.data?.message || "Login failed. Try again.");
  }
  }

  const handleGuestLogin = () => {
    setEmail("guest@example.com")
    setPassword("123456")
    setTimeout(() => onLogin(), 500)
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
      <div className="text-center pb-2">
        <h1 className="text-4xl font-light text-gray-700 mb-8">Talk-A-Tive</h1>
        <div className="flex rounded-full bg-gray-100 p-1 mb-6">
          <button className="flex-1 rounded-full bg-blue-300 text-gray-700 hover:bg-blue-400 py-2 px-4 transition-colors">
            Login
          </button>
          <button
            className="flex-1 rounded-full text-gray-500 hover:bg-gray-200 py-2 px-4 transition-colors"
            onClick={onSwitchToSignup}
          >
            Sign Up
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 px-2 py-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              Show
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 text-lg font-medium">
          Login
        </button>
      </form>

      <button
        onClick={handleGuestLogin}
        className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 text-lg font-medium"
      >
        Get Guest User Credentials
      </button>
    </div>
  )
}

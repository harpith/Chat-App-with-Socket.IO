import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader } from "../components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    navigate('/chat');
  };

  const handleGuestCredentials = () => {
    setEmail("guest@example.com");
    setPassword("123456");
    // Auto login as guest
    setTimeout(() => navigate('/chat'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-chat-bg to-cyan-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
          <CardHeader className="text-center py-8 px-8">
            <div className="bg-white rounded-2xl py-4 px-8 mb-6 shadow-sm">
              <h1 className="text-3xl font-light text-gray-700">Talk-A-Tive</h1>
            </div>
            <div className="flex bg-gray-100 rounded-full p-1">
              <Button
                asChild
                className="flex-1 bg-primary text-white rounded-full shadow-none border-0 h-12"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="flex-1 text-gray-600 rounded-full h-12"
              >
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  className="h-12 bg-inputBg border-0 rounded-lg text-gray-700 placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="h-12 bg-inputBg border-0 rounded-lg text-gray-700 placeholder:text-gray-400 pr-16"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 h-8 px-3"
                  >
                    Show
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg text-base font-medium"
                >
                  Login
                </Button>
                
                <Button
                  type="button"
                  onClick={handleGuestCredentials}
                  className="w-full h-12 bg-guest-btn hover:bg-guest-btn/90 text-white rounded-lg text-base font-medium"
                >
                  Get Guest User Credentials
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

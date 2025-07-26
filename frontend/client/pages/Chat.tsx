import { useState } from "react";
import { Search, Plus, Bell, Settings, MoreVertical, Send, Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import CreateGroupModal from "../components/CreateGroupModal";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  isGroup: boolean;
  avatar?: string;
  isActive?: boolean;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Piyush Acharya",
    lastMessage: "Heydhds, what up bro?",
    timestamp: "Just now",
    isGroup: false,
    isActive: true
  },
  {
    id: "2", 
    name: "Hello World",
    lastMessage: "Guest User : hi",
    timestamp: "2 mins ago",
    isGroup: true
  },
  {
    id: "3",
    name: "UHT",
    lastMessage: "Guest User : hello",
    timestamp: "5 mins ago", 
    isGroup: false
  },
  {
    id: "4",
    name: "All",
    lastMessage: "Guest User : hi",
    timestamp: "10 mins ago",
    isGroup: false
  },
  {
    id: "5",
    name: "jk",
    lastMessage: "Guest User : hi",
    timestamp: "1 hour ago",
    isGroup: false
  },
  {
    id: "6",
    name: "Mihoo",
    lastMessage: "123456 : ssssssssssssssssss",
    timestamp: "2 hours ago",
    isGroup: false
  },
  {
    id: "7",
    name: "Gua",
    lastMessage: "Guest User : hi",
    timestamp: "1 day ago",
    isGroup: false
  },
  {
    id: "8",
    name: "Amy",
    lastMessage: "Guest User : hey!",
    timestamp: "2 days ago",
    isGroup: false
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "what up bro?",
    sender: "Piyush Acharya", 
    timestamp: "2:30 PM",
    isOwn: false
  },
  {
    id: "2",
    content: "Hello",
    sender: "You",
    timestamp: "2:35 PM", 
    isOwn: true
  }
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [message, setMessage] = useState("");
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-white flex relative">
      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
             onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <div className={`w-80 lg:w-80 md:w-72 border-r border-gray-200 flex flex-col bg-white z-50 ${
        showSidebar ? 'fixed left-0 top-0 h-full md:relative' : 'hidden md:flex'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 mr-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search User"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-0 rounded-lg"
              />
            </div>
            <div className="text-center">
              <h1 className="text-lg font-medium text-gray-800">Talk-A-Tive</h1>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-gray-800">My Chats</h2>
            <Button
              onClick={() => setShowGroupModal(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg h-8"
            >
              New Group Chat <Plus className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedChat?.id === chat.id ? 'bg-chat-selected text-white' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                    <span className="text-xs opacity-75 flex-shrink-0">{chat.timestamp}</span>
                  </div>
                  <p className="text-xs opacity-75 truncate">
                    <span className="font-medium">{chat.lastMessage.split(' : ')[0]} :</span>
                    <span className="ml-1">{chat.lastMessage.split(' : ')[1] || chat.lastMessage}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col md:flex">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 md:hidden"
                    onClick={() => setShowSidebar(true)}
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-medium text-gray-800">{selectedChat.name}</h2>
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        msg.isOwn
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="h-12 bg-gray-50 border-0 rounded-full pr-12"
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90 text-white rounded-full w-12 h-12 p-0"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Select a chat to start messaging</h3>
              <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={showGroupModal} 
        onClose={() => setShowGroupModal(false)} 
      />
    </div>
  );
}

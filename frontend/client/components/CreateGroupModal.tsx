import { useState } from "react";
import { X, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Guest User",
    email: "guest@example.com",
    avatar: "/placeholder.svg"
  },
  {
    id: "2", 
    name: "Guest User",
    email: "guest@example.com"
  },
  {
    id: "3",
    name: "Guest User", 
    email: "guest@example.com"
  },
  {
    id: "4",
    name: "Guest User",
    email: "guest@example.com"
  }
];

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  if (!isOpen) return null;

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user: User) => {
    if (selectedUsers.find(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      // Handle group creation logic
      onClose();
      setGroupName("");
      setSelectedUsers([]);
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Create Group Chat</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Group Name Input */}
          <div className="mb-4">
            <Input
              placeholder="Hello"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="h-12 bg-gray-50 border-0 rounded-lg text-gray-700"
            />
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <Input
              placeholder="John"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 bg-gray-50 border-0 rounded-lg text-gray-700"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {user.name}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => handleUserSelect(user)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* User List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredUsers.map((user, index) => {
              const isSelected = selectedUsers.find(u => u.id === user.id);
              const isHighlighted = index === 0;
              
              return (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isHighlighted 
                      ? 'bg-chat-selected text-white' 
                      : isSelected 
                        ? 'bg-purple-50' 
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${isHighlighted ? 'text-white' : 'text-gray-800'}`}>
                      {user.name}
                    </h3>
                    <p className={`text-xs ${isHighlighted ? 'text-white/80' : 'text-gray-500'}`}>
                      <span className="font-medium">Email :</span> {user.email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Chat
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { useMessages } from './hooks/useMessages';
import { MessageItem } from './components/MessageItem';
import { MessageInput } from './components/MessageInput';
import { ConnectionStatus } from './components/ConnectionStatus';
import { generateRandomAnimalName, generateUserId } from './utils/animalNames';
import { UserData } from './types/message';

function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const { messages, sendMessage, isConnected } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize user on first load
  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      const newUser: UserData = {
        id: generateUserId(),
        username: generateRandomAnimalName(),
      };
      setCurrentUser(newUser);
      localStorage.setItem('chatUser', JSON.stringify(newUser));
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate online users count (in a real app, this would come from Firebase)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 50) + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!currentUser) return;

    try {
      await sendMessage(messageText, currentUser.username, currentUser.id);
    } catch (error) {
      console.error('Failed to send message:', error);
      // In a real app, you'd show a user-friendly error message
    }
  };

  const resetUser = () => {
    const newUser: UserData = {
      id: generateUserId(),
      username: generateRandomAnimalName(),
    };
    setCurrentUser(newUser);
    localStorage.setItem('chatUser', JSON.stringify(newUser));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MessageCircle className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  AI Live Chat
                </h1>
                <p className="text-sm text-gray-600">
                  Anonymous real-time conversations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{onlineUsers} online</span>
              </div>
              <ConnectionStatus isConnected={isConnected} />
            </div>
          </div>
        </div>
      </header>

      {/* User info */}
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">You are chatting as:</p>
              <p className="font-semibold text-blue-600">{currentUser.username}</p>
            </div>
            <button
              onClick={resetUser}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              New Identity
            </button>
          </div>
        </div>

        {/* Chat info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-yellow-200 rounded">
              <MessageCircle size={16} className="text-yellow-700" />
            </div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-xs">
                <li>• Messages disappear after 10 seconds</li>
                <li>• You have 20 seconds to type and send a message</li>
                <li>• Everyone gets a random animal username</li>
                <li>• Chat in real-time with people around the world</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white rounded-lg shadow-sm min-h-96 max-h-96 overflow-y-auto">
          <div className="p-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isOwnMessage={message.userId === currentUser.id}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message input - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 
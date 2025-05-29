import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Users, Sparkles } from 'lucide-react';
import { useMessages } from './hooks/useMessages';
import { MessageItem } from './components/MessageItem';
import { MessageInput } from './components/MessageInput';
import { ConnectionStatus } from './components/ConnectionStatus';
import { generateRandomAnimalName, generateUserId } from './utils/animalNames';
import { UserData } from './types/message';

function App() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(1);
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const { messages, sendMessage, isConnected, onlineCount } = useMessages();
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

  // Update online users count from Firebase
  useEffect(() => {
    setOnlineUsers(onlineCount);
  }, [onlineCount]);

  const handleSendMessage = async (messageText: string) => {
    if (!currentUser) return;

    // Rate limiting: only allow 1 message every 2 seconds
    const now = Date.now();
    if (now - lastMessageTime < 2000) {
      // Could show a toast or error message here
      console.log('Rate limited: Please wait before sending another message');
      return;
    }

    try {
      await sendMessage(messageText, currentUser.username, currentUser.id);
      setLastMessageTime(now);
    } catch (error) {
      console.error('Failed to send message:', error);
      // In a real app, you'd show a user-friendly error message
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-lg">
          <div className="animate-spin rounded-full h-20 w-20 border-8 border-indigo-100 border-t-indigo-300 mx-auto"></div>
          <p className="mt-6 text-2xl text-indigo-400 font-bold">Getting ready... 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-200 to-purple-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white rounded-full shadow-md">
                <MessageCircle className="text-indigo-400" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
                  AI Live Chat <Sparkles className="text-amber-300" size={28} />
                </h1>
                <p className="text-xl text-indigo-500 font-medium">
                  🎪 Anonymous fun conversations! 🎭
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-lg text-indigo-600 bg-white/60 px-6 py-3 rounded-full shadow-md">
                <Users size={24} />
                <span className="font-bold">{onlineUsers} online! 🌟</span>
              </div>
              <ConnectionStatus isConnected={isConnected} />
            </div>
          </div>
        </div>
      </header>

      {/* User info */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-3xl shadow-md p-6 mb-6 border-2 border-amber-200">
          <div className="text-center">
            <p className="text-lg text-amber-700 font-medium">🎭 You are chatting as:</p>
            <p className="text-2xl font-bold text-amber-800 flex items-center justify-center gap-2">
              🐾 {currentUser.username} ✨
            </p>
          </div>
        </div>

        {/* Chat info */}
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-200 rounded-3xl p-6 mb-6 shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-200 rounded-full">
              <MessageCircle size={24} className="text-cyan-600" />
            </div>
            <div className="text-cyan-700">
              <p className="text-2xl font-bold mb-3 flex items-center gap-2">
                🎪 How the magic works! ✨
              </p>
              <ul className="space-y-2 text-lg font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-2xl">⏰</span>
                  Messages vanish after 10 seconds!
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  You have 20 seconds to type & send!
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🛡️</span>
                  Rate limited: 1 message every 2 seconds max!
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🐾</span>
                  Everyone gets a fun animal name!
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  Chat with people from around the world!
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="max-w-6xl mx-auto px-6 pb-32">
        <div className="bg-white rounded-3xl shadow-lg min-h-96 max-h-96 overflow-y-auto border-2 border-indigo-100">
          <div className="p-6">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">💬</div>
                <p className="text-2xl text-indigo-400 font-bold mb-2">No messages yet!</p>
                <p className="text-xl text-indigo-300">Start the fun conversation! 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
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
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-200 to-purple-200 shadow-lg border-t-2 border-indigo-100">
        <div className="max-w-6xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={!isConnected}
            lastMessageTime={lastMessageTime}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 
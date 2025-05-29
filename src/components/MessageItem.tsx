import { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { Message } from '../types/message';

interface MessageItemProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageItem({ message, isOwnMessage }: MessageItemProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, message.expiresAt - now);
      const total = message.expiresAt - message.timestamp;
      const progressPercent = (remaining / total) * 100;
      
      setTimeRemaining(Math.ceil(remaining / 1000));
      setProgress(progressPercent);
    };

    // Update immediately
    updateProgress();

    // Update every 100ms for smooth progress bar
    const interval = setInterval(updateProgress, 100);

    return () => clearInterval(interval);
  }, [message.expiresAt, message.timestamp]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getProgressColor = () => {
    if (progress > 50) return 'bg-gradient-to-r from-emerald-200 to-green-300';
    if (progress > 25) return 'bg-gradient-to-r from-amber-200 to-yellow-300';
    return 'bg-gradient-to-r from-rose-200 to-pink-300';
  };

  const getMessageEmoji = () => {
    const emojis = ['💫', '✨', '🌟', '⭐', '🎭', '🎪', '🎨', '🎯', '🎲', '🎊'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div 
      className={`animate-bounce-in mb-6 max-w-md lg:max-w-lg transform transition-all duration-300 hover:scale-105 ${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      }`}
    >
      <div
        className={`relative p-6 rounded-3xl shadow-lg border-2 transform transition-all duration-300 ${
          isOwnMessage
            ? 'bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 text-gray-700 border-indigo-200'
            : 'bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 text-gray-700 border-orange-200'
        }`}
      >
        {/* Floating sparkle */}
        <div className={`absolute -top-2 ${isOwnMessage ? '-left-2' : '-right-2'}`}>
          <Sparkles size={20} className={`${isOwnMessage ? 'text-amber-400' : 'text-indigo-400'} animate-pulse`} />
        </div>

        {/* Message content */}
        <div className="mb-4">
          <p className={`text-lg font-bold mb-3 flex items-center gap-2 ${
            isOwnMessage ? 'text-indigo-600' : 'text-amber-700'
          }`}>
            <span className="text-xl">{getMessageEmoji()}</span>
            {message.username}
            <span className="text-xl">🐾</span>
          </p>
          <p className="text-xl leading-relaxed break-words font-medium text-gray-700">
            {message.text}
          </p>
        </div>

        {/* Timestamp and time remaining */}
        <div className={`flex items-center justify-between text-base font-bold ${
          isOwnMessage ? 'text-indigo-500' : 'text-amber-600'
        }`}>
          <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full shadow-sm">
            <Clock size={16} />
            <span>{formatTime(message.timestamp)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-full shadow-sm">
            <span className="text-lg">⏰</span>
            <span className="text-lg">
              {timeRemaining}s
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className={`mt-4 h-3 rounded-full ${
          isOwnMessage ? 'bg-indigo-100/80' : 'bg-orange-100/80'
        } overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-all duration-100 ease-linear shadow-sm ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Fun bubble tail */}
        <div className={`absolute bottom-0 ${
          isOwnMessage 
            ? 'right-6 transform rotate-45 bg-gradient-to-br from-indigo-100 to-purple-100' 
            : 'left-6 transform -rotate-45 bg-gradient-to-br from-amber-50 to-orange-50'
        } w-4 h-4 translate-y-2 border-2 ${
          isOwnMessage ? 'border-indigo-200' : 'border-orange-200'
        }`}></div>
      </div>
    </div>
  );
} 
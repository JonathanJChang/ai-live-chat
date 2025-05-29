import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
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
    if (progress > 50) return 'bg-green-500';
    if (progress > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div 
      className={`animate-slide-in mb-3 max-w-xs lg:max-w-md ${
        isOwnMessage ? 'ml-auto' : 'mr-auto'
      }`}
    >
      <div
        className={`relative p-4 rounded-2xl shadow-lg ${
          isOwnMessage
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        {/* Message content */}
        <div className="mb-2">
          <p className="text-sm font-medium mb-1">
            {message.username}
          </p>
          <p className="text-base leading-relaxed break-words">
            {message.text}
          </p>
        </div>

        {/* Timestamp and time remaining */}
        <div className={`flex items-center justify-between text-xs ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{formatTime(message.timestamp)}</span>
          </div>
          <span className="font-medium">
            {timeRemaining}s
          </span>
        </div>

        {/* Progress bar */}
        <div className={`mt-2 h-1 rounded-full ${
          isOwnMessage ? 'bg-blue-400' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full rounded-full transition-all duration-100 ease-linear ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
} 
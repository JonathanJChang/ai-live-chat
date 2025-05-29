import React, { useState, useEffect, useRef } from 'react';
import { Send, Clock, Zap, Shield } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  lastMessageTime?: number;
}

export function MessageInput({ onSendMessage, disabled = false, lastMessageTime = 0 }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rateLimitIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check rate limit status
  useEffect(() => {
    if (lastMessageTime > 0) {
      const now = Date.now();
      const timeSinceLastMessage = now - lastMessageTime;
      const rateLimitTime = 2000; // 2 seconds
      
      if (timeSinceLastMessage < rateLimitTime) {
        setIsRateLimited(true);
        setRateLimitRemaining(Math.ceil((rateLimitTime - timeSinceLastMessage) / 1000));
        
        rateLimitIntervalRef.current = setInterval(() => {
          const currentTime = Date.now();
          const currentTimeSince = currentTime - lastMessageTime;
          
          if (currentTimeSince >= rateLimitTime) {
            setIsRateLimited(false);
            setRateLimitRemaining(0);
            if (rateLimitIntervalRef.current) {
              clearInterval(rateLimitIntervalRef.current);
              rateLimitIntervalRef.current = null;
            }
          } else {
            setRateLimitRemaining(Math.ceil((rateLimitTime - currentTimeSince) / 1000));
          }
        }, 100);
      }
    }

    return () => {
      if (rateLimitIntervalRef.current) {
        clearInterval(rateLimitIntervalRef.current);
      }
    };
  }, [lastMessageTime]);

  const startTimer = () => {
    if (!isActive) {
      setIsActive(true);
      setTimeRemaining(20);
      
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleReset();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(20);
    setMessage('');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isRateLimited) {
      onSendMessage(message);
      handleReset();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.trim() && !isActive) {
      startTimer();
    } else if (!value.trim() && isActive) {
      handleReset();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (rateLimitIntervalRef.current) {
        clearInterval(rateLimitIntervalRef.current);
      }
    };
  }, []);

  const getTimerColor = () => {
    if (timeRemaining > 10) return 'text-emerald-500';
    if (timeRemaining > 5) return 'text-amber-500';
    return 'text-rose-500 animate-pulse';
  };

  const getInputBorderColor = () => {
    if (isRateLimited) return 'border-rose-300 focus:border-rose-400';
    if (timeRemaining > 10) return 'border-emerald-300 focus:border-emerald-400';
    if (timeRemaining > 5) return 'border-amber-300 focus:border-amber-400';
    return 'border-rose-300 focus:border-rose-400';
  };

  const getBackgroundGlow = () => {
    if (isRateLimited) return 'shadow-rose-200/50';
    if (timeRemaining <= 5) return 'shadow-rose-200/50';
    if (timeRemaining <= 10) return 'shadow-amber-200/50';
    return 'shadow-emerald-200/50';
  };

  return (
    <div className="p-6">
      {/* Rate limit warning */}
      {isRateLimited && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-rose-100 border-2 border-rose-300 animate-pulse">
            <Shield size={24} className="text-rose-500" />
            <span className="text-xl font-bold text-rose-600">
              Wait {rateLimitRemaining}s before sending another message! 🛡️
            </span>
          </div>
        </div>
      )}

      {/* Timer display */}
      {isActive && !isRateLimited && (
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border-2 ${
            timeRemaining <= 5 ? 'border-rose-300 animate-bounce' : 
            timeRemaining <= 10 ? 'border-amber-300' : 'border-emerald-300'
          }`}>
            {timeRemaining <= 5 ? (
              <Zap size={24} className="text-rose-500 animate-pulse" />
            ) : (
              <Clock size={24} className={getTimerColor()} />
            )}
            <span className={`text-2xl font-bold ${getTimerColor()}`}>
              {timeRemaining}s
            </span>
            {timeRemaining <= 5 && <span className="text-2xl animate-bounce">⚡</span>}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-4 items-end">
        <div className="flex-1">
          <div className={`relative bg-white rounded-3xl shadow-lg border-2 ${getInputBorderColor()} ${getBackgroundGlow()} transition-all duration-300`}>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              disabled={disabled || isRateLimited}
              placeholder={
                disabled ? "🔄 Connecting..." : 
                isRateLimited ? "⏳ Rate limited - please wait..." :
                "🎭 Type your magical message here... ✨"
              }
              className="w-full px-6 py-4 text-xl font-medium bg-transparent rounded-3xl focus:outline-none placeholder-indigo-300 text-gray-700"
              maxLength={500}
            />
            
            {/* Character count */}
            <div className="absolute right-4 bottom-1 text-sm text-indigo-400 font-medium">
              {message.length}/500
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || disabled || isRateLimited}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 transform ${
            !message.trim() || disabled || isRateLimited
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-300 to-purple-300 text-indigo-700 hover:from-indigo-400 hover:to-purple-400 hover:scale-110 shadow-indigo-200/50'
          }`}
        >
          <Send size={24} />
        </button>
      </form>

      {/* Fun hint */}
      {!isActive && !disabled && !isRateLimited && (
        <div className="text-center mt-4">
          <p className="text-indigo-500/80 text-lg font-medium flex items-center justify-center gap-2">
            <span className="text-xl">💡</span>
            Start typing to begin the 20-second countdown!
            <span className="text-xl">🚀</span>
          </p>
        </div>
      )}
    </div>
  );
} 
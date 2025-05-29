import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const TYPING_TIMEOUT = 20000; // 20 seconds
const WARNING_THRESHOLD = 5000; // Show warning at 5 seconds remaining

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTypingTimer = () => {
    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsTyping(true);
    setTimeRemaining(TYPING_TIMEOUT / 1000);
    setShowWarning(false);

    // Update countdown every second
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= WARNING_THRESHOLD / 1000) {
          setShowWarning(true);
        }
        return newTime;
      });
    }, 1000);

    // Clear message after timeout
    timeoutRef.current = setTimeout(() => {
      setMessage('');
      setIsTyping(false);
      setTimeRemaining(0);
      setShowWarning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      inputRef.current?.focus();
    }, TYPING_TIMEOUT);
  };

  const stopTypingTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsTyping(false);
    setTimeRemaining(0);
    setShowWarning(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (value.length > 0 && !isTyping) {
      startTypingTimer();
    } else if (value.length === 0 && isTyping) {
      stopTypingTimer();
    }
    
    setMessage(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      stopTypingTimer();
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const progressPercent = isTyping ? (timeRemaining / (TYPING_TIMEOUT / 1000)) * 100 : 100;

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Typing timer bar */}
      {isTyping && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-sm font-medium ${
              showWarning ? 'text-red-600' : 'text-blue-600'
            }`}>
              {showWarning && <AlertTriangle size={16} />}
              <span>
                {showWarning ? 'Time running out!' : 'Typing timer:'} {timeRemaining}s
              </span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                showWarning ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (20s timer starts when you begin typing)"
            disabled={disabled}
            className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'
            } ${showWarning ? 'border-red-300 ring-red-200' : 'border-gray-300'}`}
            rows={2}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {message.length}/500 characters
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            message.trim() && !disabled
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
} 
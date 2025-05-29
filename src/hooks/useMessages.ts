import { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, off, remove, query, orderByChild, startAt, onDisconnect, serverTimestamp, set } from 'firebase/database';
import { database } from '../firebase/config';
import { Message } from '../types/message';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const userPresenceRef = useRef<any>(null);

  useEffect(() => {
    const messagesRef = ref(database, 'messages');
    const presenceRef = ref(database, 'presence');
    
    // Generate a unique session ID for this user
    const sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    userPresenceRef.current = ref(database, `presence/${sessionId}`);
    
    // Set user as online
    set(userPresenceRef.current, {
      online: true,
      timestamp: serverTimestamp()
    });
    
    // Remove user when they disconnect
    onDisconnect(userPresenceRef.current).remove();
    
    // Listen for online users count
    onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const onlineUsers = Object.keys(data).length;
        setOnlineCount(onlineUsers);
      } else {
        setOnlineCount(1);
      }
    });
    
    // Listen for new messages
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList: Message[] = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        
        // Filter out expired messages
        const now = Date.now();
        const activeMessages = messageList.filter(msg => msg.expiresAt > now);
        
        // Sort by timestamp
        activeMessages.sort((a, b) => a.timestamp - b.timestamp);
        
        setMessages(activeMessages);
      } else {
        setMessages([]);
      }
      setIsConnected(true);
    }, (error) => {
      console.error('Error listening to messages:', error);
      setIsConnected(false);
    });

    // Clean up expired messages every 5 seconds
    cleanupIntervalRef.current = setInterval(() => {
      cleanupExpiredMessages();
    }, 5000);

    return () => {
      off(messagesRef);
      off(presenceRef);
      if (userPresenceRef.current) {
        remove(userPresenceRef.current).catch(console.error);
      }
      if (cleanupIntervalRef.current) {
        clearInterval(cleanupIntervalRef.current);
      }
    };
  }, []);

  const cleanupExpiredMessages = async () => {
    try {
      const messagesRef = ref(database, 'messages');
      const now = Date.now();
      
      // Query for expired messages
      const expiredQuery = query(messagesRef, orderByChild('expiresAt'), startAt(0));
      
      onValue(expiredQuery, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          Object.entries(data).forEach(([key, value]: [string, any]) => {
            if (value.expiresAt <= now) {
              const messageRef = ref(database, `messages/${key}`);
              remove(messageRef).catch(console.error);
            }
          });
        }
      }, { onlyOnce: true });
    } catch (error) {
      console.error('Error cleaning up expired messages:', error);
    }
  };

  const sendMessage = async (text: string, username: string, userId: string) => {
    if (!text.trim()) return;

    const now = Date.now();
    const message: Omit<Message, 'id'> = {
      text: text.trim(),
      username,
      userId,
      timestamp: now,
      expiresAt: now + 10000, // 10 seconds from now
    };

    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
    onlineCount,
  };
} 
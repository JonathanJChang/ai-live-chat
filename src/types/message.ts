export interface Message {
  id: string;
  text: string;
  username: string;
  userId: string;
  timestamp: number;
  expiresAt: number;
}

export interface UserData {
  id: string;
  username: string;
} 
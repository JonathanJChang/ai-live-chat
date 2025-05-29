import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC668OqV4_9lfXt527RTfDLLlLQGPjt4cQ",
  authDomain: "ai-live-chat-cc866.firebaseapp.com",
  databaseURL: "https://ai-live-chat-cc866-default-rtdb.firebaseio.com",
  projectId: "ai-live-chat-cc866",
  storageBucket: "ai-live-chat-cc866.firebasestorage.app",
  messagingSenderId: "897892510077",
  appId: "1:897892510077:web:2d7fd29619f3ef721b0414"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export default app; 
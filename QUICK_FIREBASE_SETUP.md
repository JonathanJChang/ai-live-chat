# ⚡ Quick Firebase Setup (5 minutes)

## 🔥 Essential Steps Only

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click "Create a project" → Name it → Disable Analytics → Create

### 2. Enable Realtime Database  
- Left sidebar → "Realtime Database" → "Create Database"
- Choose region → "Start in test mode" → Done

### 3. Get Your Config
- Click gear icon ⚙️ → "Project settings"
- Scroll to "Your apps" → Click web icon `</>`
- App name: `ai-live-chat-web` → Register app
- **Copy the firebaseConfig object**

### 4. Update Your Code
Replace the config in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com", 
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### 5. Test It
- Save file → App reloads automatically
- Open two browser windows of your app
- Send message → Should appear in both windows! ✅

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Demo Mode Active" warning | Double-check your Firebase config is correct |
| Permission denied | Ensure database rules allow read/write |
| Module not found | Run `npm install` |
| Messages don't sync | Check if Realtime Database is enabled |

---

**Need detailed help?** See `FIREBASE_SETUP.md` for full instructions! 
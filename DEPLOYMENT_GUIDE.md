# 🚀 GitHub Pages Deployment Guide

## 📋 Quick Deployment Steps

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click **"New repository"** (+ icon in top right)
3. **Repository name**: `ai-live-chat`
4. **Description**: `Real-time anonymous chat with disappearing messages`
5. **Visibility**: Public (required for free GitHub Pages)
6. **DON'T** check any initialization options
7. Click **"Create repository"**

### Step 2: Connect Local Repository
Replace `YOURUSERNAME` with your actual GitHub username:

```bash
# Add GitHub repository as remote
git remote add origin https://github.com/YOURUSERNAME/ai-live-chat.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to GitHub Pages

**Option A: Using gh-pages package (Recommended)**
```bash
# Deploy using the npm script
npm run deploy
```

**Option B: Manual deployment**
```bash
# Run the deployment script
./deploy.sh

# Then follow the printed instructions
```

### Step 4: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **"Settings"** tab
3. Scroll to **"Pages"** section (left sidebar)
4. **Source**: Deploy from a branch
5. **Branch**: Select `gh-pages` 
6. **Folder**: `/ (root)`
7. Click **"Save"**

### Step 5: Access Your Site
Your site will be available at:
```
https://YOURUSERNAME.github.io/ai-live-chat/
```

⏱️ **Note**: It may take 5-10 minutes for the site to be available after first deployment.

---

## 🔧 Troubleshooting

### Problem: 404 Page Not Found
**Solution**: 
- Check that the `base` URL in `vite.config.ts` matches your repository name
- Ensure GitHub Pages is enabled on the `gh-pages` branch

### Problem: Blank page or assets not loading
**Solution**:
- Verify the base path in `vite.config.ts` is `/ai-live-chat/`
- Check that all assets are loading with the correct path

### Problem: Firebase not working on GitHub Pages
**Solution**:
- Firebase should work the same on GitHub Pages
- Check browser console for any CORS errors
- Verify your Firebase configuration is correct

---

## 🔄 Updating Your Deployment

Whenever you make changes:

```bash
# 1. Commit your changes
git add .
git commit -m "Your commit message"
git push origin main

# 2. Deploy to GitHub Pages
npm run deploy
```

---

## 🌟 What's Deployed

Your deployed app includes:
- ✅ Real-time Firebase chat functionality
- ✅ 10-second message expiration
- ✅ 20-second typing timer
- ✅ Creative animal usernames
- ✅ Beautiful responsive UI
- ✅ Connection status indicators

---

## 📞 Need Help?

If deployment fails:
1. Check your GitHub repository exists and is public
2. Verify your username in the remote URL is correct
3. Ensure you have push permissions to the repository
4. Check the GitHub Actions tab for any deployment errors

Happy deploying! 🎉 
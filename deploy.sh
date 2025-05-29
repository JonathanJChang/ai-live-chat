#!/bin/bash

# AI Live Chat - GitHub Pages Deployment Script
echo "🚀 Deploying AI Live Chat to GitHub Pages..."

# Build the application
echo "📦 Building application..."
npm run build

# Navigate to dist directory
cd dist

# Initialize git in dist folder
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Add the GitHub repository as origin
# Replace with your actual repository URL
echo "🔗 Please run this command with your GitHub repository URL:"
echo "git remote add origin https://github.com/YOURUSERNAME/ai-live-chat.git"
echo "git push -f origin master:gh-pages"

echo "✅ Build complete! Follow the instructions above to deploy." 
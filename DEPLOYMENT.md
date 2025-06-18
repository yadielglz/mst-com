# 🚀 GitHub Pages Deployment Guide

## Quick Deployment Steps

### 1. **Update Your GitHub Username**
Replace `marco` in `package.json` with your actual GitHub username:
```json
"homepage": "https://YOUR_USERNAME.github.io/mst-com"
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Deploy to GitHub Pages**
```bash
npm run deploy
```

### 4. **Configure GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Set **Source** to "Deploy from a branch"
4. Select **gh-pages** branch
5. Click **Save**

## 📁 File Structure for GitHub Pages

Your app is already properly structured for GitHub Pages:

```
mst-com/
├── public/
│   └── index.html          ← Main HTML file for GitHub Pages
├── src/
│   ├── index.js            ← React entry point
│   ├── App.js              ← Main React component
│   └── components/         ← React components
├── package.json            ← Contains homepage URL
└── README.md
```

## 🔧 Manual Deployment Steps

### Option 1: Using npm scripts (Recommended)
```bash
# Install dependencies
npm install

# Build and deploy
npm run deploy
```

### Option 2: Manual build and upload
```bash
# Build the app
npm run build

# The build folder contains your deployable files
# Upload contents of build/ folder to GitHub Pages
```

## 🌐 GitHub Pages Configuration

### Repository Settings:
1. **Repository Name**: `mst-com`
2. **Branch**: `gh-pages` (created automatically by npm run deploy)
3. **Folder**: `/ (root)`
4. **Custom Domain**: Optional

### URL Structure:
- **Development**: `http://localhost:3000`
- **Production**: `https://YOUR_USERNAME.github.io/mst-com`

## 🛠️ Troubleshooting

### Common Issues:

1. **404 Error on GitHub Pages**
   - Ensure `homepage` in `package.json` is correct
   - Check that `gh-pages` branch exists
   - Verify GitHub Pages is enabled in repository settings

2. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

3. **Assets Not Loading**
   - Check that all paths are relative
   - Verify `public/index.html` has correct paths

### Debug Commands:
```bash
# Check if gh-pages is installed
npm list gh-pages

# Test build locally
npm run build
npx serve -s build

# Check homepage URL
cat package.json | grep homepage
```

## 📱 Testing Your Deployment

1. **Local Testing**:
   ```bash
   npm start
   # Visit http://localhost:3000
   ```

2. **Production Testing**:
   ```bash
   npm run build
   npx serve -s build
   # Visit http://localhost:3000
   ```

3. **GitHub Pages Testing**:
   - Visit `https://YOUR_USERNAME.github.io/mst-com`
   - Test all features work correctly

## 🔄 Updating Your App

To update your deployed app:

1. **Make your changes**
2. **Commit to git**:
   ```bash
   git add .
   git commit -m "Update app"
   git push origin main
   ```

3. **Deploy updates**:
   ```bash
   npm run deploy
   ```

## 📊 Deployment Checklist

- [ ] Updated `homepage` in `package.json`
- [ ] Installed dependencies (`npm install`)
- [ ] Built successfully (`npm run build`)
- [ ] Deployed to GitHub Pages (`npm run deploy`)
- [ ] Enabled GitHub Pages in repository settings
- [ ] Tested all features on live site
- [ ] Verified mobile responsiveness
- [ ] Checked dark mode functionality

## 🎯 Your App URL

Once deployed, your app will be available at:
**`https://YOUR_USERNAME.github.io/mst-com`**

Replace `YOUR_USERNAME` with your actual GitHub username! 
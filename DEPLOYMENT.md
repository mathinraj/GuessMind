# 🚀 GuessMind Deployment Guide

This guide will walk you through deploying GuessMind with:
- **Frontend**: Vercel (React app)
- **Backend**: PythonAnywhere (FastAPI server)

## 📋 Prerequisites

Before deploying, ensure you have:
- **GitHub account** (for code hosting)
- **Vercel account** (free tier available)
- **PythonAnywhere account** (free tier available)
- **Git** installed locally

## 🎯 Deployment Overview

```
┌─────────────────┐    API calls    ┌──────────────────────┐
│   Vercel        │ ───────────────> │  PythonAnywhere      │
│   (Frontend)    │                  │  (Backend API)       │
│   React App     │ <─────────────── │  FastAPI Server      │
└─────────────────┘    responses     └──────────────────────┘
```

## 🔧 Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# Initialize git (if not already done)
cd /path/to/GuessMind
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - ready for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/GuessMind.git
git branch -M main
git push -u origin main
```

### 1.2 Update Configuration Files

The following files have been prepared for deployment:
- `backend/wsgi.py` - WSGI configuration for PythonAnywhere
- `frontend/vercel.json` - Vercel deployment configuration
- `backend/app/main.py` - Updated with production CORS settings

## 🐍 Step 2: Deploy Backend to PythonAnywhere

### 2.1 Create PythonAnywhere Account

1. Go to [PythonAnywhere.com](https://www.pythonanywhere.com/)
2. Sign up for a free account
3. Verify your email address

### 2.2 Upload Your Code

#### Option A: Using Git (Recommended)
```bash
# In PythonAnywhere Bash console
git clone https://github.com/yourusername/GuessMind.git
cd GuessMind/backend
```

#### Option B: Upload Files
1. Go to **Files** tab in PythonAnywhere dashboard
2. Create folder: `/home/yourusername/GuessMind/`
3. Upload your backend files

### 2.3 Set Up Virtual Environment

```bash
# In PythonAnywhere Bash console
cd /home/yourusername/GuessMind/backend

# Create virtual environment
python3.10 -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2.4 Configure Web App

1. Go to **Web** tab in PythonAnywhere dashboard
2. Click **"Add a new web app"**
3. Choose **"Manual configuration"**
4. Select **Python 3.10**

#### 2.4.1 Configure WSGI File
1. Click on **WSGI configuration file** link
2. Replace the content with:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/yourusername/GuessMind/backend'  # Update 'yourusername'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Activate virtual environment
activate_this = '/home/yourusername/GuessMind/backend/.venv/bin/activate_this.py'
if os.path.exists(activate_this):
    with open(activate_this) as file_:
        exec(file_.read(), dict(__file__=activate_this))

# Set environment variables
os.environ.setdefault('ENVIRONMENT', 'production')

# Import your FastAPI application
from app.main import app

# Create WSGI application  
application = app
```

#### 2.4.2 Configure Virtual Environment
1. In **Web** tab, find **"Virtualenv"** section
2. Enter: `/home/yourusername/GuessMind/backend/.venv`

#### 2.4.3 Set Environment Variables
1. Go to **Files** tab
2. Edit `/home/yourusername/.bashrc`
3. Add at the end:

```bash
# GuessMind Environment Variables
export ALLOWED_ORIGINS="https://your-app-name.vercel.app"
```

### 2.5 Test Backend Deployment

1. Click **"Reload"** button in Web tab
2. Visit: `https://yourusername.pythonanywhere.com/health`
3. You should see: `{"status": "ok"}`
4. Test API: `https://yourusername.pythonanywhere.com/docs`

## ⚡ Step 3: Deploy Frontend to Vercel

### 3.1 Update Configuration

1. Edit `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://yourusername.pythonanywhere.com"
  }
}
```

2. Update `backend/app/main.py` CORS origins:
```python
allowed_origins = [
    "http://localhost:5173",  # Local development
    "http://127.0.0.1:5173",  # Local development
    "https://your-app-name.vercel.app",  # Your actual Vercel URL
]
```

### 3.2 Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts:
# - Link to existing project? N
# - Project name: guessmind (or your preferred name)
# - Directory: ./
# - Override settings? N
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com/)
2. Sign up/login with GitHub
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Configure Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://yourusername.pythonanywhere.com`
   - **Environment**: Production

### 3.4 Update CORS Settings

1. Update your PythonAnywhere environment variables:
```bash
# In PythonAnywhere Bash console
echo 'export ALLOWED_ORIGINS="https://your-actual-vercel-url.vercel.app"' >> ~/.bashrc
source ~/.bashrc
```

2. Reload your PythonAnywhere web app

## 🔗 Step 4: Connect Frontend and Backend

### 4.1 Update CORS Configuration

1. Get your Vercel deployment URL (e.g., `https://guessmind-xyz123.vercel.app`)
2. Update `backend/app/main.py`:

```python
allowed_origins = [
    "http://localhost:5173",  # Local development
    "http://127.0.0.1:5173",  # Local development
    "https://guessmind-xyz123.vercel.app",  # Your actual Vercel URL
]
```

3. Set environment variable in PythonAnywhere:
```bash
export ALLOWED_ORIGINS="https://guessmind-xyz123.vercel.app"
```

### 4.2 Test the Connection

1. Visit your Vercel app URL
2. Click **"Start Game"**
3. Verify questions load properly
4. Test the complete game flow

## ✅ Step 5: Verification Checklist

### Backend (PythonAnywhere)
- [ ] `https://yourusername.pythonanywhere.com/health` returns `{"status": "ok"}`
- [ ] `https://yourusername.pythonanywhere.com/docs` shows API documentation
- [ ] CORS headers include your Vercel domain
- [ ] All dependencies installed in virtual environment

### Frontend (Vercel)
- [ ] App loads at your Vercel URL
- [ ] "Start Game" button works
- [ ] Questions load from backend
- [ ] Game flow works end-to-end
- [ ] No CORS errors in browser console

## 🐛 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**:
```python
# In backend/app/main.py, ensure your Vercel URL is in allowed_origins
allowed_origins = [
    "https://your-exact-vercel-url.vercel.app",  # Must match exactly
]
```

#### 2. Module Not Found (PythonAnywhere)
**Error**: `ModuleNotFoundError: No module named 'app'`

**Solution**:
```python
# In WSGI file, check the path is correct
project_home = '/home/yourusername/GuessMind/backend'  # Update username
```

#### 3. API Not Found (Frontend)
**Error**: `Failed to fetch` or `404` errors

**Solution**:
```json
// In frontend/vercel.json, ensure correct backend URL
{
  "env": {
    "VITE_API_BASE_URL": "https://yourusername.pythonanywhere.com"
  }
}
```

#### 4. Build Errors (Vercel)
**Error**: Build fails during deployment

**Solution**:
```bash
# Test build locally first
cd frontend
npm run build

# Check for any errors and fix them
```

### Debug Commands

#### PythonAnywhere Debugging
```bash
# Check if virtual environment is working
source /home/yourusername/GuessMind/backend/.venv/bin/activate
python -c "import fastapi; print('FastAPI installed')"

# Check WSGI file syntax
python /var/www/yourusername_pythonanywhere_com_wsgi.py

# View error logs
tail -f /var/log/yourusername.pythonanywhere.com.error.log
```

#### Vercel Debugging
```bash
# Check build locally
cd frontend
npm run build
npm run preview

# Check environment variables
vercel env ls
```

## 🔒 Security Considerations

### Production Security
1. **Environment Variables**: Store sensitive data in environment variables
2. **CORS**: Restrict origins to your actual domains only
3. **HTTPS**: Both Vercel and PythonAnywhere provide HTTPS by default
4. **Rate Limiting**: Consider adding rate limiting for production use

### Recommended Improvements
```python
# Add to backend/app/main.py for production
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add rate limiting to endpoints
@app.post("/api/start")
@limiter.limit("10/minute")  # Limit to 10 requests per minute
def start_game(request: Request, req: StartRequest):
    # ... existing code
```

## 📊 Monitoring & Maintenance

### PythonAnywhere Monitoring
- Check **Tasks** tab for any scheduled maintenance
- Monitor **CPU seconds** usage (free tier has limits)
- View error logs in **Files** → **var/log/**

### Vercel Monitoring
- Check **Deployments** tab for build status
- Monitor **Usage** for bandwidth and function invocations
- View **Functions** logs for runtime errors

## 🚀 Going Live

### Final Steps
1. **Custom Domain** (optional): Add your own domain in Vercel
2. **SSL Certificate**: Automatic with both platforms
3. **Analytics**: Add Vercel Analytics if needed
4. **Error Tracking**: Consider adding Sentry for error monitoring

### Launch Checklist
- [ ] All features tested in production
- [ ] Error handling works properly
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Monitoring setup complete

## 🎉 Congratulations!

Your GuessMind application is now live! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://yourusername.pythonanywhere.com`

Share your amazing mind-reading game with the world! 🧞‍♂️✨

---

**Need help?** Check the troubleshooting section or create an issue in your GitHub repository.

# 🧞‍♂️ GuessMind - A Mind-Reading Game

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.x-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow.svg)](https://python.org/)
[![Akinator](https://img.shields.io/badge/Akinator-API-purple.svg)](https://pypi.org/project/akinator/)

GuessMind is a web-based mind-reading game inspired by Akinator, where you think of any real or fictional character, and the AI tries to guess who it is by asking a series of intelligent yes/no questions. Built with a modern React frontend and Python FastAPI backend, it provides an interactive and engaging gaming experience.

## 🎯 Features

### Core Gameplay
- **🧠 AI-Powered Guessing**: Uses the real Akinator API to intelligently guess characters
- **❓ Dynamic Questions**: Asks contextual yes/no questions based on your answers
- **📊 Progress Tracking**: Visual progress bar showing how close the AI is to guessing
- **🎭 Character Reveal**: Displays character image, name, and description when guessing
- **✅ Feedback System**: Confirm if the guess is correct or continue playing if wrong
- **🔄 Multiple Attempts**: AI can make multiple guesses if the first one is wrong

### User Experience
- **🎨 Modern UI**: Clean, fullscreen interface with smooth animations
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎉 Interactive Feedback**: Winning popups and visual celebrations
- **⚡ Real-time Updates**: Instant responses and seamless gameplay flow
- **🛡️ Error Recovery**: Graceful handling of network issues and server restarts

### Technical Features
- **🚀 Fast Performance**: Optimized React frontend with efficient state management
- **🔌 RESTful API**: Clean API design with proper error handling
- **💾 Session Management**: Maintains game state across multiple questions
- **🔄 Auto-recovery**: Automatically restarts games when sessions are lost
- **🐛 Robust Error Handling**: Comprehensive error management and user feedback

## 🏗️ Architecture

```
GuessMind/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── App.jsx       # Main application logic
│   │   └── main.jsx      # Application entry point
│   ├── public/           # Static assets
│   └── package.json      # Node.js dependencies
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── main.py       # API endpoints and game logic
│   │   └── __init__.py   # Package initialization
│   ├── requirements.txt  # Python dependencies
│   └── .venv/           # Virtual environment
└── README.md         # This file
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Styled Components** - CSS-in-JS styling solution
- **Axios/Fetch** - HTTP client for API communication

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Uvicorn** - ASGI server for running the application
- **Pydantic** - Data validation and serialization
- **Akinator** - Python library for Akinator API integration


## 📋 Prerequisites

Before installing GuessMind, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
  
- **Python** (version 3.8 or higher)
  - Download from [python.org](https://www.python.org/)
  - Verify installation: `python --version` or `python3 --version`
  
- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify installation: `git --version`

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/GuessMind.git
cd GuessMind
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Create Virtual Environment
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Verify Backend Installation
```bash
# Check if all packages are installed correctly
pip list
```

You should see packages like:
- `fastapi`
- `uvicorn[standard]`
- `akinator==2.0.1`
- `python-dotenv`
- `aiofiles`
- `requests`

### 3. Frontend Setup

#### Navigate to Frontend Directory
```bash
# From the root directory
cd frontend
```

#### Install Node.js Dependencies
```bash
npm install
```

#### Verify Frontend Installation
```bash
# Check if packages are installed
npm list --depth=0
```

You should see packages like:
- `react`
- `vite`
- `styled-components`
- `@vitejs/plugin-react`

## 🏃‍♂️ Running the Application

### Method 1: Manual Start (Recommended for Development)

#### Terminal 1: Start Backend Server
```bash
cd backend
source .venv/bin/activate  # Activate virtual environment
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx]
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

#### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

### Method 2: Quick Start Script

Create a start script for easier launching:

#### For macOS/Linux:
```bash
# Create start.sh in the root directory
cat > start.sh << 'EOF'
#!/bin/bash
echo "Starting GuessMind..."

# Start backend in background
echo "Starting backend server..."
cd backend
source .venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend running on: http://127.0.0.1:8000"
echo "Frontend running on: http://localhost:5173"
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait
EOF

chmod +x start.sh
./start.sh
```

#### For Windows:
```batch
# Create start.bat in the root directory
@echo off
echo Starting GuessMind...

echo Starting backend server...
cd backend
call .venv\Scripts\activate
start /B uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

timeout /t 3 /nobreak > nul

echo Starting frontend server...
cd ..\frontend
start /B npm run dev

echo Backend running on: http://127.0.0.1:8000
echo Frontend running on: http://localhost:5173
echo Press Ctrl+C to stop servers

pause
```

## 🌐 Accessing the Application

Once both servers are running:

1. **Open your web browser**
2. **Navigate to**: `http://localhost:5173`
3. **You should see the GuessMind welcome screen**

## 🎮 How to Play

1. **Start Game**: Click the "Start Game" button on the welcome screen
2. **Think of a Character**: Think of any real or fictional character
3. **Answer Questions**: Answer the AI's questions with:
   - ✅ **Yes** - Definitely true
   - ❌ **No** - Definitely false  
   - 🤔 **Probably** - Likely true
   - 😐 **Probably Not** - Likely false
   - ❓ **Don't Know** - Uncertain
4. **Watch Progress**: Monitor the progress bar as the AI gets closer to guessing
5. **Character Reveal**: When the AI makes a guess, you'll see the character's image and details
6. **Provide Feedback**: 
   - Click "✅ Yes, Correct!" if the guess is right
   - Click "❌ No, Wrong" to continue with more questions
7. **Celebrate or Continue**: Enjoy the victory celebration or keep playing!

## 🤝 Contributing

We welcome contributions to GuessMind! 

## 🚀 Future Enhancements

Planned features for future releases:
- **🎯 Categories**: Choose specific character categories (movies, books, etc.)
- **🏆 Leaderboard**: Track wins and challenging characters
- **🎨 Themes**: Multiple UI themes and customization options
- **🔊 Sound Effects**: Audio feedback for interactions
- **📱 PWA**: Progressive Web App for mobile installation
- **🌐 Multiplayer**: Challenge friends to guess characters
- **📊 Statistics**: Detailed gameplay analytics and insights

---

**Happy mind-reading! 🧞‍♂️✨**

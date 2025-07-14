#!/bin/bash

# Start both frontend and backend servers for the Slow Sonic Mood Tracker

echo "🚀 Starting Slow Sonic Mood Tracker servers..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use. Please stop the service using port $1 first."
        exit 1
    fi
}

# Check if ports are available
check_port 3001
check_port 5173

# Start backend server
echo "📧 Starting email notification server (backend)..."
cd backend
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found in backend directory."
    echo "   Please copy env.example to .env and configure your Gmail credentials."
    echo "   See EMAIL_SETUP.md for detailed instructions."
fi

# Start backend in background
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:3001"
else
    echo "❌ Backend server failed to start. Check the logs above."
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Go back to root directory and start frontend
cd ..
echo "🎵 Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo "✅ Frontend server is running on http://localhost:5173"
echo ""
echo "🎉 Both servers are now running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 
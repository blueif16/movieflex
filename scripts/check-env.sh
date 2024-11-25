#!/bin/bash

echo "Checking environment..."

# Check if Flask is installed
if ! command -v flask &> /dev/null; then
    echo "Flask is not installed. Installing..."
    pip install flask flask-cors pandas
fi

# Check if the database file exists
if [ ! -f "backend/imdb_movies-1.csv" ]; then
    echo "Database file not found!"
    exit 1
fi

# Check if the posters directory exists
if [ ! -d "backend/posters" ]; then
    echo "Creating posters directory..."
    mkdir -p backend/posters
fi

# Try to start the Flask server
echo "Starting Flask server..."
cd backend
python3 app.py &
FLASK_PID=$!

# Wait for server to start
sleep 2

# Test the connection
curl -s http://localhost:5000/api/health

# If the curl command fails
if [ $? -ne 0 ]; then
    echo "Failed to connect to Flask server"
    kill $FLASK_PID
    exit 1
fi

echo "Environment check complete!" 
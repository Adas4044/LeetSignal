#!/bin/bash

# LeetCode Horse Racing Game Launcher
# This script will start the racing game server

echo "🏇 LeetCode Horse Racing Game Launcher"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "go.mod" ] || [ ! -d "web" ]; then
    echo "❌ Error: Please run this script from the LeetSignal project root directory"
    echo "   Expected files: go.mod, web/ directory"
    exit 1
fi

# Check for Go installation
if command -v go >/dev/null 2>&1; then
    echo "✅ Go found - using Go server"
    echo "🚀 Starting Go-based racing server..."
    echo "🌐 Open your browser to: http://localhost:8080"
    echo ""
    go run cmd/web/main.go
elif command -v python3 >/dev/null 2>&1; then
    echo "✅ Python 3 found - using Python server"  
    echo "🚀 Starting Python-based racing server..."
    echo "🌐 Open your browser to: http://localhost:8080"
    echo ""
    python3 scripts/racing_server.py
else
    echo "❌ Error: Neither Go nor Python 3 found"
    echo "   Please install one of the following:"
    echo "   - Go: https://golang.org/dl/"
    echo "   - Python 3: https://www.python.org/downloads/"
    exit 1
fi
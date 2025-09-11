#!/bin/bash

# Living Twin Simulation - Docker Startup Script

set -e

echo "🚀 Starting Living Twin Simulation..."

# Wait for Ollama to be ready
echo "⏳ Waiting for Ollama to be ready..."
until curl -s http://ollama:11434/api/tags > /dev/null; do
    echo "Waiting for Ollama..."
    sleep 5
done
echo "✅ Ollama is ready"

# Download model if not present
echo "📥 Checking for model: $OLLAMA_MODEL"
if ! curl -s http://ollama:11434/api/tags | grep -q "$OLLAMA_MODEL"; then
    echo "📥 Downloading model: $OLLAMA_MODEL"
    curl -X POST http://ollama:11434/api/pull -d "{\"name\": \"$OLLAMA_MODEL\"}"
    echo "✅ Model downloaded"
else
    echo "✅ Model already available"
fi

# Add the src directory to Python path
export PYTHONPATH="/app/src:$PYTHONPATH"

# Start the simulation API server
echo "🌐 Starting simulation API server..."
exec python -m uvicorn living_twin_simulation.api.simple_main:app --host 0.0.0.0 --port 8000 --reload

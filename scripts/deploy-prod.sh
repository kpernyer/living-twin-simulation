#!/bin/bash

# Production deployment script for dev.aprio.one
# This script deploys the Aprio Living Twin platform to production

set -e

echo "🚀 Deploying Aprio Living Twin to dev.aprio.one..."

# Check if required environment variables are set
if [ -z "$ELEVENLABS_API_KEY" ]; then
    echo "❌ Error: ELEVENLABS_API_KEY environment variable is not set"
    echo "Please set your ElevenLabs API key:"
    echo "export ELEVENLABS_API_KEY=your-key-here"
    exit 1
fi

# Create external network if it doesn't exist
echo "📡 Setting up Docker networks..."
docker network create web 2>/dev/null || true

# Create directories for persistent data
echo "📁 Creating data directories..."
mkdir -p ./letsencrypt
mkdir -p ./data
mkdir -p ./logs

# Set proper permissions
chmod 600 ./letsencrypt 2>/dev/null || true

# Build and deploy services
echo "🔧 Building and starting services..."
docker-compose -f docker/compose/docker-compose.yml -f docker/compose/docker-compose.prod.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker/compose/docker-compose.yml -f docker/compose/docker-compose.prod.yml ps

# Show logs for verification
echo "📋 Checking recent logs..."
docker-compose -f docker/compose/docker-compose.yml -f docker/compose/docker-compose.prod.yml logs --tail=10 web-interface
docker-compose -f docker/compose/docker-compose.yml -f docker/compose/docker-compose.prod.yml logs --tail=10 simulation

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application is now available at:"
echo "   Web App:      https://dev.aprio.one"
echo "   API:          https://dev.aprio.one/api" 
echo "   Health Check: https://dev.aprio.one/api/healthz"
echo "   API Docs:     https://dev.aprio.one/api/docs"
echo "   Traefik:      https://traefik.aprio.one"
echo ""
echo "📊 To monitor logs:"
echo "   docker-compose -f docker/compose/docker-compose.yml -f docker/compose/docker-compose.prod.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f docker/compose/docker-compose.yml -f docker/compose/docker-compose.prod.yml down"
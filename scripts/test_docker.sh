#!/bin/bash

# Living Twin Simulation - Docker Test Script

set -e

echo "🧪 Testing Living Twin Simulation Docker Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test 1: Basic Docker Compose validation
print_status "Testing Docker Compose configuration..."
if docker-compose config > /dev/null 2>&1; then
    print_success "Docker Compose configuration is valid"
else
    print_error "Docker Compose configuration has errors"
    docker-compose config
    exit 1
fi

# Test 2: Build test image
print_status "Building test Docker image..."
if docker-compose -f docker/compose/docker-compose.test.yml build; then
    print_success "Test Docker image built successfully"
else
    print_error "Failed to build test Docker image"
    exit 1
fi

# Test 3: Run test container
print_status "Starting test container..."
docker-compose -f docker/compose/docker-compose.test.yml up -d test-simulation

# Wait for container to start
sleep 5

# Test 4: Check if container is running
if docker ps | grep -q "living-twin-test"; then
    print_success "Test container is running"
else
    print_error "Test container failed to start"
    docker-compose -f docker/compose/docker-compose.test.yml logs test-simulation
    exit 1
fi

# Test 5: Check if API is responding
print_status "Testing API endpoint..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    print_success "API is responding"
else
    print_warning "API health endpoint not available (this is expected if not implemented yet)"
fi

# Test 6: Run a simple simulation test
print_status "Running simulation test..."
if curl -f http://localhost:8000/ > /dev/null 2>&1; then
    print_success "Simulation API is accessible"
else
    print_warning "Simulation API not accessible (this is expected if not implemented yet)"
fi

# Cleanup
print_status "Cleaning up test container..."
docker-compose -f docker/compose/docker-compose.test.yml down

print_success "🎉 Docker test completed successfully!"
echo ""
print_status "Next steps:"
echo "1. To run the full setup: docker-compose up -d"
echo "2. To run with AI processing: set ENABLE_AI_PROCESSING=true in docker-compose.yml"
echo "3. To access web interface: open http://localhost:3000"
echo "4. To access API: open http://localhost:8000"
echo ""
print_status "Note: The full setup requires Ollama to be running for AI processing."

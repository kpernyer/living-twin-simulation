#!/bin/bash

# Living Twin Simulation - Docker Issue Resolution Script

set -e

echo "🔧 Fixing Docker Build Issues..."

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

# Step 1: Clean up Docker
print_status "Cleaning up Docker cache and containers..."
docker system prune -f || true
docker builder prune -f || true

# Step 2: Check Docker daemon
print_status "Checking Docker daemon status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

# Step 3: Test network connectivity
print_status "Testing Docker registry connectivity..."
if ! docker pull hello-world:latest > /dev/null 2>&1; then
    print_warning "Cannot pull from Docker registry. This might be a network issue."
    print_warning "Try the following:"
    echo "  1. Check your internet connection"
    echo "  2. Restart Docker Desktop"
    echo "  3. Try using a VPN if you're behind a corporate firewall"
    echo "  4. Use the simple test setup: docker-compose -f docker-compose.simple.yml up"
fi

# Step 4: Try building with different base images
print_status "Testing alternative base images..."

# Test with different Python base image
print_status "Testing Python base image..."
if docker build -f Dockerfile.test -t living-twin-test .; then
    print_success "Test Dockerfile builds successfully"
else
    print_warning "Test Dockerfile failed. Trying with different base image..."
    
    # Create a backup Dockerfile with different base
    cat > Dockerfile.test.backup << 'EOF'
FROM python:3.11-slim-bullseye

# Set working directory
WORKDIR /app

# Install minimal dependencies
RUN pip install --no-cache-dir uv

# Copy dependency files
COPY pyproject.toml uv.lock README.md ./

# Install Python dependencies
RUN uv pip install --system -e ".[dev,cli,api]"

# Copy application code
COPY src/ ./src/
COPY cli/ ./cli/
COPY config/ ./config/

# Create necessary directories
RUN mkdir -p /app/data /app/logs

# Expose port
EXPOSE 8000

# Start the application
CMD ["python", "-m", "uvicorn", "living_twin_simulation.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

    if docker build -f Dockerfile.test.backup -t living-twin-test-backup .; then
        print_success "Backup Dockerfile builds successfully"
        print_status "You can use: docker-compose -f docker-compose.simple.yml up"
    else
        print_error "All Docker builds failed. This might be a network or Docker configuration issue."
    fi
fi

# Step 5: Provide alternative solutions
print_status "Alternative solutions if Docker builds fail:"

echo ""
print_warning "Option 1: Use local development (no Docker)"
echo "  cd web && pnpm install && pnpm run dev"
echo "  uv run python -m uvicorn living_twin_simulation.api.main:app --reload"

echo ""
print_warning "Option 2: Use simple Docker setup"
echo "  docker-compose -f docker-compose.simple.yml up"

echo ""
print_warning "Option 3: Manual Docker build with retry"
echo "  docker build --no-cache -f Dockerfile.test ."

echo ""
print_success "Docker issue resolution complete!"

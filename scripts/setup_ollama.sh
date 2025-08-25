#!/bin/bash

# Living Twin Simulation - Ollama Setup Script
# This script installs Ollama and downloads the required LLM model

set -e

echo "🚀 Setting up Ollama for Living Twin Simulation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Ollama is already installed
if command -v ollama &> /dev/null; then
    print_success "Ollama is already installed"
    OLLAMA_VERSION=$(ollama --version)
    print_status "Ollama version: $OLLAMA_VERSION"
else
    print_status "Installing Ollama..."
    
    # Detect OS and install Ollama
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        print_status "Detected macOS, installing via Homebrew..."
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            print_error "Homebrew not found. Please install Homebrew first: https://brew.sh/"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        print_status "Detected Linux, installing via curl..."
        curl -fsSL https://ollama.ai/install.sh | sh
    else
        print_error "Unsupported OS: $OSTYPE"
        print_status "Please install Ollama manually from: https://ollama.ai/"
        exit 1
    fi
    
    print_success "Ollama installed successfully"
fi

# Start Ollama service
print_status "Starting Ollama service..."
if ! pgrep -x "ollama" > /dev/null; then
    ollama serve &
    sleep 3
    print_success "Ollama service started"
else
    print_success "Ollama service is already running"
fi

# Check if Ollama is responding
print_status "Testing Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    print_success "Ollama is responding correctly"
else
    print_error "Ollama is not responding. Please check if the service is running."
    exit 1
fi

# Model configuration
DEFAULT_MODEL="mistral:7b-instruct"
ALTERNATIVE_MODELS=(
    "llama2:7b-chat"
    "codellama:7b-instruct"
    "openhermes:7b-mistral"
    "neural-chat:7b"
    "qwen:7b-chat"
    "phi:2.7b"
)

# Check if default model is already downloaded
print_status "Checking for existing models..."
EXISTING_MODELS=$(ollama list | grep -E "^(mistral|llama2|codellama|openhermes|neural-chat|qwen|phi)" || true)

if [[ -n "$EXISTING_MODELS" ]]; then
    print_success "Found existing models:"
    echo "$EXISTING_MODELS"
fi

# Download default model if not present
if ! ollama list | grep -q "$DEFAULT_MODEL"; then
    print_status "Downloading default model: $DEFAULT_MODEL"
    print_warning "This may take several minutes depending on your internet connection..."
    
    ollama pull "$DEFAULT_MODEL"
    print_success "Model $DEFAULT_MODEL downloaded successfully"
else
    print_success "Model $DEFAULT_MODEL is already available"
fi

# Test the model
print_status "Testing model with a simple prompt..."
TEST_RESPONSE=$(ollama run "$DEFAULT_MODEL" "Hello, this is a test." 2>/dev/null || echo "Test failed")

if [[ "$TEST_RESPONSE" != "Test failed" ]]; then
    print_success "Model test successful"
else
    print_warning "Model test failed, but this might be normal for some models"
fi

# Create configuration file
print_status "Creating configuration files..."

# Create .env file from example if it doesn't exist
if [[ ! -f .env ]]; then
    if [[ -f .env.example ]]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        print_warning ".env.example not found, creating basic .env file..."
        cat > .env << EOF
# Living Twin Simulation - Environment Configuration

# MCP Configuration
MCP_SERVER_HOST=localhost
MCP_SERVER_PORT=3000
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=$DEFAULT_MODEL

# Simulation Configuration
DEFAULT_TIME_ACCELERATION=144
DEFAULT_SIMULATION_DURATION_DAYS=30
ENABLE_AI_PROCESSING=false

# Logging
LOG_LEVEL=INFO
DEBUG=false
EOF
        print_success "Created basic .env file"
    fi
else
    print_status ".env file already exists"
fi

# Display next steps
echo ""
print_success "🎉 Ollama setup completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Review and edit .env file if needed"
echo "2. Set ENABLE_AI_PROCESSING=true in .env to use AI-powered responses"
echo "3. Run: uv run python cli/simulation_cli.py example"
echo "4. Run: uv run python cli/simulation_cli.py run --org-id test --employees example_employees.json"
echo ""
print_status "Available models:"
ollama list | grep -E "^(mistral|llama2|codellama|openhermes|neural-chat|qwen|phi)" || echo "No models found"
echo ""
print_status "To download additional models:"
for model in "${ALTERNATIVE_MODELS[@]}"; do
    echo "  ollama pull $model"
done
echo ""
print_status "To test a model:"
echo "  ollama run $DEFAULT_MODEL 'Your test prompt here'"

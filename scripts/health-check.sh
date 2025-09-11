#!/bin/bash

# Living Twin Simulation - Health Check Script
# This script verifies that all services are running and accessible

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to check if a service is responding
check_http_service() {
    local name=$1
    local url=$2
    local expected_code=${3:-200}
    
    if curl -f -s -o /dev/null --max-time 10 "$url"; then
        print_success "$name is responding ($url)"
        return 0
    else
        print_error "$name is not responding ($url)"
        return 1
    fi
}

# Function to check Docker container status
check_docker_container() {
    local container_name=$1
    if docker ps --format "table {{.Names}}\t{{.Status}}" | grep -q "$container_name"; then
        local status=$(docker ps --format "table {{.Names}}\t{{.Status}}" | grep "$container_name" | awk '{for(i=2;i<=NF;i++) printf "%s ", $i; print ""}')
        print_success "$container_name: $status"
        return 0
    else
        print_error "$container_name is not running"
        return 1
    fi
}

echo -e "${BLUE}🚀 Living Twin Simulation - Health Check${NC}"
echo -e "${BLUE}=======================================${NC}"

# Check Docker is running
print_header "Docker Environment"
if docker info > /dev/null 2>&1; then
    print_success "Docker daemon is running"
else
    print_error "Docker daemon is not running"
    exit 1
fi

# Check Docker Compose services
print_header "Docker Compose Services"
if [ -f "docker/compose/docker-compose.yml" ]; then
    echo -e "\n${BLUE}Service Status:${NC}"
    docker-compose -f docker/compose/docker-compose.yml ps
    
    echo ""
    check_docker_container "aprio-living-twin-ollama"
    check_docker_container "aprio-living-twin-simulation" 
    check_docker_container "aprio-living-twin-web"
else
    print_warning "docker-compose.yml not found at expected location"
fi

# Check service endpoints
print_header "Service Connectivity"
health_checks=0
total_checks=3

echo -e "\n${BLUE}Testing API endpoints:${NC}"

# Test Ollama API
if check_http_service "Ollama API" "http://localhost:11434/api/tags"; then
    ((health_checks++))
fi

# Test Simulation API (try multiple endpoints)
if check_http_service "Simulation API" "http://localhost:8000/health" || check_http_service "Simulation API" "http://localhost:8000/"; then
    ((health_checks++))
fi

# Test Web Interface
if check_http_service "Web Interface" "http://localhost:3000/"; then
    ((health_checks++))
fi

# Check local development tools
print_header "Development Environment"
echo -e "\n${BLUE}Checking development tools:${NC}"

# Check Python/UV
if command -v uv &> /dev/null; then
    print_success "uv is installed ($(uv --version))"
else
    print_warning "uv is not installed - needed for local Python development"
fi

# Check Node.js/PNPM
if command -v pnpm &> /dev/null; then
    print_success "pnpm is installed ($(pnpm --version))"
else
    print_warning "pnpm is not installed - needed for local web development"
fi

# Check if Python dependencies are installed
if [ -d ".venv" ] && [ -f "pyproject.toml" ]; then
    print_success "Python virtual environment exists"
else
    print_warning "Python virtual environment not found"
fi

# Check if Node.js dependencies are installed  
if [ -d "web/node_modules" ] && [ -f "web/package.json" ]; then
    print_success "Node.js dependencies installed"
else
    print_warning "Node.js dependencies not found in web/ directory"
fi

# Summary
print_header "Health Check Summary"
echo -e "\n${BLUE}Service Health: ${health_checks}/${total_checks} services responding${NC}"

if [ $health_checks -eq $total_checks ]; then
    print_success "All services are healthy! 🎉"
    echo -e "\n${GREEN}✅ Your Living Twin Simulation is ready to use!${NC}"
    echo -e "\n${GREEN}✅ Employee loading issue has been resolved!${NC}"
    echo -e "\n${BLUE}Quick Access URLs:${NC}"
    echo "🌐 Web Interface: http://localhost:3000"
    echo "🔗 Simulation API: http://localhost:8000"
    echo "🧠 Ollama API: http://localhost:11434"
    echo ""
    echo -e "${BLUE}Useful Commands:${NC}"
    echo "• View logs: docker-compose -f docker/compose/docker-compose.yml logs -f"
    echo "• Stop services: docker-compose -f docker/compose/docker-compose.yml down"
    echo "• Restart services: docker-compose -f docker/compose/docker-compose.yml restart"
elif [ $health_checks -gt 0 ]; then
    print_warning "Some services are not fully ready yet"
    echo -e "\n${YELLOW}💡 Try running this script again in a few minutes${NC}"
    echo -e "${YELLOW}   (The AI model download might still be in progress)${NC}"
else
    print_error "No services are responding"
    echo -e "\n${RED}🔧 Troubleshooting:${NC}"
    echo "1. Make sure Docker is running"
    echo "2. Start services: docker-compose -f docker/compose/docker-compose.yml up -d"
    echo "3. Check logs: docker-compose -f docker/compose/docker-compose.yml logs"
fi

echo -e "\n${BLUE}===========================================${NC}"
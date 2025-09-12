# =========================
# Living Twin Simulation - Makefile
# =========================
# 
# Multi-agent simulation system with web visualization
# Python backend + Next.js frontend
# =========================

.PHONY: help install dev test lint format clean docker-build docker-up docker-down uml docs

# Default target
help:
	@echo "🤖 Living Twin Simulation Commands"
	@echo "=================================="
	@echo ""
	@echo "📊 System Documentation:"
	@echo "  uml                                    Generate PlantUML system diagrams"
	@echo "  docs                                   Generate all documentation"
	@echo ""
	@echo "🚀 Development:"
	@echo "  dev                                    Start simulation with web interface"
	@echo "  dev-simulation                         Run simulation backend only"
	@echo "  dev-web                               Run web interface only (port 3000)"
	@echo "  simulation-run                        Run single simulation"
	@echo ""
	@echo "🔧 Environment:"
	@echo "  install                               Install all dependencies"
	@echo "  setup                                 Complete environment setup"
	@echo "  venv                                  Create virtual environment"
	@echo ""
	@echo "🐳 Docker Development:"
	@echo "  docker-build                          Build simulation containers"
	@echo "  docker-up                             Start containerized environment"
	@echo "  docker-down                           Stop containers"
	@echo "  docker-logs                           View container logs"
	@echo ""
	@echo "🧪 Testing & Quality:"
	@echo "  test                                  Run all tests"
	@echo "  test-agents                           Test agent behaviors"
	@echo "  test-simulation                       Test simulation engines"
	@echo "  lint                                  Run code linters"
	@echo "  format                                Format code"
	@echo "  type-check                            Run type checking"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  clean                                 Clean build artifacts"
	@echo "  clean-cache                           Clean Python cache"
	@echo "  update-deps                           Update dependencies"

# =========================
# Environment Setup
# =========================

venv:
	@echo "🐍 Creating virtual environment..."
	python3 -m venv .venv
	@echo "✅ Virtual environment created!"
	@echo "📋 Activate with: source .venv/bin/activate"

install: venv
	@echo "📦 Installing Python dependencies..."
	uv pip install -e .
	@echo "📦 Installing web dependencies..."
	cd web && npm install
	@echo "✅ Dependencies installed!"

setup: install
	@echo "🔧 Setting up development environment..."
	@if [ ! -f ".env" ]; then \
		echo "📝 Creating .env from example..."; \
		cp .env.example .env; \
	fi
	@echo "✅ Environment setup complete!"
	@echo "🚀 Run 'make dev' to start development!"

# =========================
# Development
# =========================

dev:
	@echo "🚀 Starting Living Twin Simulation..."
	@echo "🤖 Backend: http://localhost:8000"
	@echo "🌐 Frontend: http://localhost:3000"
	@echo ""
	@echo "Starting both backend and frontend..."
	(cd web && npm run dev) &
	python -m living_twin_simulation.cli.main --dev

dev-simulation:
	@echo "🤖 Starting simulation backend only..."
	python -m living_twin_simulation.cli.main --dev --no-web

dev-web:
	@echo "🌐 Starting web interface..."
	cd web && npm run dev

simulation-run:
	@echo "⚡ Running single simulation..."
	python -m living_twin_simulation.cli.main --run

# =========================
# Docker Development
# =========================

docker-build:
	@echo "🐳 Building simulation containers..."
	docker-compose -f docker/docker-compose.yml build

docker-up:
	@echo "🐳 Starting containerized simulation..."
	docker-compose -f docker/docker-compose.yml up -d
	@echo "✅ Simulation running!"
	@echo "🤖 Backend: http://localhost:8000"
	@echo "🌐 Frontend: http://localhost:3000"

docker-down:
	@echo "🐳 Stopping containers..."
	docker-compose -f docker/docker-compose.yml down

docker-logs:
	@echo "📋 Viewing container logs..."
	docker-compose -f docker/docker-compose.yml logs -f

# =========================
# Testing & Quality
# =========================

test:
	@echo "🧪 Running all tests..."
	python -m pytest tests/ -v

test-agents:
	@echo "🧪 Testing agent behaviors..."
	python -m pytest tests/test_agents/ -v

test-simulation:
	@echo "🧪 Testing simulation engines..."
	python -m pytest tests/test_simulation/ -v

lint:
	@echo "🔍 Running linters..."
	python -m flake8 src/ tests/
	python -m black --check src/ tests/
	python -m isort --check-only src/ tests/

format:
	@echo "✨ Formatting code..."
	python -m black src/ tests/
	python -m isort src/ tests/
	@echo "✅ Code formatted!"

type-check:
	@echo "🔍 Running type checks..."
	python -m mypy src/living_twin_simulation

# =========================
# System Documentation
# =========================

uml:
	@echo "📊 Generating PlantUML system diagrams..."
	@echo "🔍 Analyzing simulation codebase and generating UML..."
	python3 tools/generate_uml.py
	@echo "✅ System documentation generated!"
	@echo "📖 View: docs/system/SYSTEM.md"

docs: uml
	@echo "📚 Generating all documentation..."
	@if [ -f "docs/README.md" ]; then \
		echo "📝 Documentation index already exists"; \
	else \
		echo "📝 Creating documentation index..."; \
		mkdir -p docs; \
		echo "# Living Twin Simulation Documentation" > docs/README.md; \
		echo "" >> docs/README.md; \
		echo "## System Documentation" >> docs/README.md; \
		echo "- [System Overview](system/SYSTEM.md) - Auto-generated system architecture" >> docs/README.md; \
		echo "- [Agent Architecture](system/agent_architecture.png) - Multi-agent system design" >> docs/README.md; \
		echo "- [Simulation Flow](system/simulation_flow.png) - Execution flow diagrams" >> docs/README.md; \
		echo "" >> docs/README.md; \
		echo "## Development" >> docs/README.md; \
		echo "- See [README.md](../README.md) for getting started" >> docs/README.md; \
		echo "- See [Makefile](../Makefile) for available commands" >> docs/README.md; \
	fi
	@echo "✅ Documentation complete!"

# =========================
# Maintenance
# =========================

clean:
	@echo "🧹 Cleaning build artifacts..."
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.pyc" -delete
	find . -name "*.egg-info" -type d -exec rm -rf {} + 2>/dev/null || true
	rm -rf build/ dist/
	cd web && rm -rf .next/

clean-cache: clean
	@echo "🧹 Deep cleaning Python cache..."
	find . -type d -name ".pytest_cache" -delete
	find . -type d -name ".mypy_cache" -delete
	rm -rf .coverage htmlcov/

update-deps:
	@echo "📦 Updating Python dependencies..."
	uv pip compile pyproject.toml -o requirements.txt
	uv pip install -r requirements.txt
	@echo "📦 Updating web dependencies..."
	cd web && npm update
	@echo "✅ Dependencies updated!"
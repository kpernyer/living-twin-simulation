# MCP (Model Context Protocol) Setup Guide

This guide explains how to set up the MCP integration with local LLMs using Ollama for AI-powered agent responses in the Living Twin Simulation.

## Overview

The simulation can use AI-powered responses through the MCP Agent Engine, which connects to local LLMs via Ollama. This provides more realistic and contextual agent responses while keeping all processing local.

## Quick Setup

### 1. Automated Setup (Recommended)

```bash
# Run the automated setup script
./scripts/setup_ollama.sh
```

This script will:
- Install Ollama if not present
- Download the default model (Mistral 7B)
- Create configuration files
- Test the setup

### 2. Manual Setup

#### Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from https://ollama.ai/

#### Start Ollama Service

```bash
ollama serve
```

#### Download a Model

```bash
# Default model (recommended)
ollama pull mistral:7b-instruct

# Alternative models
ollama pull llama2:7b-chat
ollama pull codellama:7b-instruct
ollama pull openhermes:7b-mistral
ollama pull neural-chat:7b
ollama pull qwen:7b-chat
ollama pull phi:2.7b
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Key settings:

```env
# MCP Configuration
MCP_SERVER_HOST=localhost
MCP_SERVER_PORT=3000
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=mistral:7b-instruct

# Enable AI processing
ENABLE_AI_PROCESSING=true

# LLM parameters
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=500
```

### YAML Configuration

Edit `config/mcp_config.yaml` for advanced settings:

```yaml
mcp:
  ollama:
    model: mistral:7b-instruct
    temperature: 0.7
    max_tokens: 500
    
  ai_processing:
    enabled: true
    context_window_size: 10
    personality_weight: 0.8
```

## Available Models

### Recommended Models

| Model | Size | Quality | Speed | Use Case |
|-------|------|---------|-------|----------|
| `mistral:7b-instruct` | 4.1GB | High | Fast | General purpose |
| `llama2:7b-chat` | 3.8GB | High | Fast | General purpose |
| `codellama:7b-instruct` | 3.8GB | High | Fast | Code-focused |
| `openhermes:7b-mistral` | 4.1GB | High | Fast | Instruction following |

### Performance Models

| Model | Size | Quality | Speed | Use Case |
|-------|------|---------|-------|----------|
| `phi:2.7b` | 1.7GB | Good | Very Fast | Resource-constrained |
| `qwen:7b-chat` | 4.1GB | High | Fast | Multilingual |

## Testing the Setup

### Test Ollama Connection

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test a model
ollama run mistral:7b-instruct "Hello, this is a test."
```

### Test MCP Integration

```bash
# Run simulation with AI enabled
ENABLE_AI_PROCESSING=true uv run python cli/simulation_cli.py run \
  --org-id test \
  --employees example_employees.json \
  --duration 1
```

## Troubleshooting

### Common Issues

#### Ollama Not Responding

```bash
# Check if service is running
pgrep ollama

# Restart service
pkill ollama
ollama serve
```

#### Model Not Found

```bash
# List available models
ollama list

# Download missing model
ollama pull mistral:7b-instruct
```

#### Memory Issues

If you encounter memory issues:

1. Use a smaller model: `phi:2.7b`
2. Reduce `max_tokens` in configuration
3. Close other applications to free memory

#### Performance Issues

1. Use a faster model (phi:2.7b)
2. Reduce `context_window_size`
3. Set `fallback_to_rules: true` for faster fallback

### Logs and Debugging

Enable debug logging:

```env
DEBUG=true
LOG_LEVEL=DEBUG
```

Check logs:

```bash
tail -f simulation.log
```

## Advanced Configuration

### Custom Model Parameters

```yaml
mcp:
  ollama:
    model: mistral:7b-instruct
    temperature: 0.5  # Lower = more consistent
    max_tokens: 300   # Shorter responses
    top_p: 0.8        # More focused responses
```

### Response Customization

```yaml
simulation:
  ai_enhanced:
    response_style:
      include_reasoning: true
      include_workload_context: true
      include_relationship_context: true
      include_expertise_insights: true
```

### Fallback Configuration

```yaml
mcp:
  ai_processing:
    response_generation:
      fallback_to_rules: true
      confidence_threshold: 0.6
      max_attempts: 3
```

## Integration with Main System

The MCP integration can be extended to connect with your main Living Twin system:

1. **Company Knowledge**: Connect to your knowledge base
2. **Employee Data**: Use real employee profiles
3. **Communication History**: Include actual communication patterns
4. **Organizational Context**: Add company-specific rules and policies

## Performance Considerations

### Hardware Requirements

| Model Size | RAM | GPU | CPU |
|------------|-----|-----|-----|
| 2.7B | 4GB | Optional | 4 cores |
| 7B | 8GB | Recommended | 8 cores |
| 13B | 16GB | Required | 16 cores |

### Optimization Tips

1. **Model Selection**: Choose the right model for your hardware
2. **Batch Processing**: Process multiple communications together
3. **Caching**: Cache common responses
4. **Fallback**: Use rule-based responses for simple cases

## Security and Privacy

Since all processing is local:

- ✅ No data sent to external services
- ✅ Full control over model and data
- ✅ No internet connection required
- ✅ No usage costs or rate limits

## Next Steps

1. Test the basic setup with the example simulation
2. Customize the configuration for your needs
3. Integrate with your main Living Twin system
4. Monitor performance and adjust settings
5. Train custom models if needed

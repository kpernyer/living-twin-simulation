# Aprio Living Twin Simulation Engine

A sophisticated organizational intelligence platform that creates a "Living Twin" of your company's strategic operations. Deploy at **dev.aprio.one** for executive-grade AI-assisted decision making.

## 🌐 Production Deployment

**Live at**: https://dev.aprio.one  
**API**: https://api.aprio.one  
**Domain**: aprio.one

## 🎯 Overview

The Living Twin Simulation Engine models realistic organizational behavior using AI agents with personality-based responses. It simulates:

- **Communication Patterns**: Nudges, recommendations, escalations
- **Agent Behaviors**: Personality-driven responses to organizational communications
- **Time Acceleration**: Run months of simulation in minutes (144x speed by default)
- **Organizational Metrics**: Friction, compliance, stress levels, collaboration scores

## 🔄 **Complete Workflow & System Overview**

### **Main Purpose**

The Living Twin Simulation Engine is a sophisticated organizational behavior simulation system that models strategic alignment and how strategic goals cascade through departments using AI agents with personality-based behaviors. It simulates:

- **Strategic Communication**: How CEOs communicate business goals, market priorities, and organizational objectives
- **Departmental Interpretation**: How different departments translate strategic goals into their own priorities
- **Organizational Alignment**: How strategic directives flow from executive level to operational teams
- **Cross-Department Dynamics**: How departments coordinate on shared strategic objectives
- **Time-Accelerated Simulation**: Run months of strategic alignment in minutes (144x speed by default)

### **Strategic Alignment Examples**

The simulation focuses on how strategic goals cascade through departments, not operational decisions:

#### **CEO Strategic Communication → Departmental Interpretation**

**Example 1: Growth Target Cascade**
```
CEO: "We need 15% organic growth this quarter"
├── CFO: "We need to optimize budget allocation for growth initiatives"
├── VP Sales: "We need to increase pipeline by 25% to hit growth targets"
├── VP Engineering: "We need to accelerate product releases to support sales"
└── HR: "We need to hire more sales and engineering talent"
```

**Example 2: Employee Satisfaction Priority**
```
CEO: "Employee satisfaction scores must improve by 20%"
├── CHRO: "This is our highest priority - retention and engagement programs"
├── Engineering Managers: "We need to reduce burnout and improve work-life balance"
├── Sales Managers: "We need to address compensation and career development"
└── Finance: "We need to allocate budget for employee programs"
```

**Example 3: Market Expansion Strategy**
```
CEO: "We're entering the European market in Q1"
├── VP Product: "We need to localize our product for European markets"
├── VP Sales: "We need to build European sales team and partnerships"
├── Engineering: "We need to support European data regulations and localization"
└── Marketing: "We need to adapt messaging for European audience"
```

#### **What Gets Simulated**

✅ **Strategic Goals**: Business objectives, market priorities, organizational targets
✅ **Departmental Translation**: How each department interprets strategic goals
✅ **Cross-Department Coordination**: How departments work together on shared objectives
✅ **Priority Conflicts**: How departments handle competing strategic priorities
✅ **Escalation Patterns**: When strategic goals need executive intervention
✅ **Wisdom of the Crowd**: Collective insights from department responses and feedback patterns
✅ **Catchball Communication**: Two-way strategic communication with feedback loops and consensus building

❌ **Operational Decisions**: How to implement specific tasks or processes
❌ **Technical Details**: Code reviews, specific workflows, or technical implementations
❌ **Day-to-Day Management**: Routine operational decisions or task assignments

### **Transaction Flow Through the System**

#### **1. Traditional Communication Flow**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   NUDGE         │───▶│  Agent Response  │───▶│  Escalation?    │
│ (Gentle prompt) │    │  (Ignore/Action) │    │  (Yes/No)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ RECOMMENDATION  │───▶│  Agent Response  │───▶│  Escalation?    │
│ (Suggestive)    │    │  (Ignore/Action) │    │  (Yes/No)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ DIRECT_ORDER    │───▶│  Agent Response  │───▶│  Compliance     │
│ (Mandatory)     │    │  (Action/Clarify)│    │  Tracking       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### **2. Catchball Communication Flow (Two-Way)**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Strategic Goal  │───▶│ Department       │───▶│ Wisdom of       │
│ (CEO)           │    │ Feedback         │    │ the Crowd       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Priority        │◄───│ Consensus        │◄───│ Conflict         │
│ Conflicts       │    │ Building         │    │ Detection        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Refined         │───▶│ Aligned          │───▶│ Implementation   │
│ Strategy        │    │ Execution        │    │ Success          │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### **2. Agent Response Types**

- **IGNORE**: Agent doesn't respond or take action
- **TAKE_ACTION**: Agent acknowledges and performs the requested action
- **SEEK_CLARIFICATION**: Agent asks for more details
- **PROVIDE_FEEDBACK**: Agent gives feedback on the request
- **ESCALATE**: Agent escalates to their manager
- **DELEGATE**: Agent delegates to someone else

#### **3. Wisdom of the Crowd Indicators**

The system analyzes collective responses to detect patterns:

- **Response Delays**: How long departments take to respond (hesitation indicator)
- **Hesitation Patterns**: "I'll need to think about this", "This conflicts with our priorities"
- **Confidence Levels**: How certain departments are about their ability to execute
- **Priority Conflicts**: Competing priorities mentioned in responses
- **Resource Constraints**: Budget, headcount, or capacity limitations
- **Cross-Department Conflicts**: When departments have conflicting approaches

#### **4. Catchball Communication Resolution**

Priority conflicts are resolved through iterative feedback:

1. **Initial Strategic Goal**: CEO communicates strategic objective
2. **Department Feedback**: Each department responds with their interpretation and constraints
3. **Conflict Detection**: System identifies competing priorities and resource conflicts
4. **Consensus Building**: CEO refines strategy based on collective feedback
5. **Aligned Execution**: Departments execute with shared understanding and commitment

#### **3. Escalation Logic**

```
NUDGE (5 times) → RECOMMENDATION (3 times) → DIRECT_ORDER
     │                    │                        │
     ▼                    ▼                        ▼
  Ignored              Ignored                Mandatory
  Responses            Responses               Compliance
```

#### **4. Personality-Driven Behavior**

Each agent has personality traits that influence responses:

- **AUTHORITY_RESPONSE**: 0.0 (questioning) to 1.0 (compliant)
- **WORKLOAD_SENSITIVITY**: 0.0 (resilient) to 1.0 (overwhelmed)
- **COMMUNICATION_STYLE**: 0.0 (diplomatic) to 1.0 (direct)
- **RISK_TOLERANCE**: 0.0 (conservative) to 1.0 (risk-taking)

#### **5. Time Acceleration System**

- **Default**: 144x speed (1 real second = 24 simulated minutes)
- **Scheduled Events**: Daily maintenance at 9 AM, end-of-day processing at 5 PM
- **Response Timing**: 5 minutes to 1 hour for communications, 30 minutes to 2 hours for consultations

### **Key Metrics & Outputs**

#### **Organizational Health Metrics**
- **Response Rate**: Percentage of communications receiving responses
- **Escalation Rate**: How often nudges escalate to direct orders
- **Compliance Rate**: Following of direct orders
- **Collaboration Score**: Cross-department interaction level
- **Stress Level Average**: Organizational stress indicators
- **Friction Score**: Overall communication efficiency

#### **Use Cases & Applications**

1. **Strategic Alignment Testing**: Test how strategic goals cascade through departments
2. **Organizational Change**: Model how strategic changes affect different departments
3. **Leadership Communication**: Understand how different communication styles affect strategic alignment
4. **Department Coordination**: Identify how departments interpret and act on strategic priorities
5. **Executive Decision Making**: Test strategic communication approaches before implementation

### **How Free Text is Interpreted**

The simulation handles free text content in two different ways:

#### **Current Approach: Rule-Based Processing**

The main simulation uses a **rule-based behavior engine** that:

- **Does NOT use LLMs** for text interpretation
- Uses **predefined response templates** based on personality traits
- **Focuses on communication metadata** rather than content:
  - Communication type (NUDGE, RECOMMENDATION, DIRECT_ORDER)
  - Priority level (1-5)
  - Sender's role/department
  - Agent's personality traits

**Example:**
```python
# When you send: "Please prioritize code reviews this week"
# The system only considers:
# - Type: NUDGE
# - Priority: 3 (default)
# - Sender: CEO
# - Recipient: Engineer

# It generates responses like:
"Thank you for bringing this to my attention. I'll address this promptly."
"Will handle this immediately."
"On it. Expected completion by end of day."
```

#### **Available Approach: AI-Powered Processing**

The system also includes an **MCP Agent Engine** that:

- **Uses GPT-4** for intelligent text interpretation
- **Actually reads and understands** the content of communications
- Can search company knowledge bases for context
- Generates personalized, contextual responses

**Example:**
```python
# The AI would understand the actual content:
"Please prioritize code reviews this week"

# And generate contextual responses like:
"I understand the importance of code quality. I'll reschedule my current 
tasks to focus on code reviews. Given my current workload, I can review 
about 3-4 PRs per day this week."
```

#### **Why Rule-Based is Default**

The rule-based approach is used by default because:

- **Predictability**: Consistent, reproducible results
- **Speed**: No API calls to external LLM services  
- **Cost**: No LLM usage costs
- **Focus**: Emphasizes organizational dynamics over natural language understanding

#### **Enabling AI-Powered Processing**

To use the AI-powered approach with local LLMs:

1. **Quick Setup** (Recommended):
   ```bash
   ./scripts/setup_ollama.sh
   ```

2. **Manual Setup**:
   - Install Ollama: `brew install ollama` (macOS) or `curl -fsSL https://ollama.ai/install.sh | sh` (Linux)
   - Download a model: `ollama pull mistral:7b-instruct`
   - Configure environment: Copy `.env.example` to `.env` and set `ENABLE_AI_PROCESSING=true`

3. **Configuration**:
   - Edit `.env` file to enable AI processing
   - Configure model parameters in `config/mcp_config.yaml`
   - Choose from available models: Mistral 7B, Llama2 7B, CodeLlama, etc.

See [MCP Setup Guide](docs/MCP_SETUP.md) for detailed instructions.

## 🐳 Docker Setup (Recommended)

For a complete containerized setup with interactive web interface:

### Quick Start with Docker

```bash
# Clone and setup
git clone https://github.com/kpernyer/living-twin-simulation.git
cd living-twin-simulation

# Start all services (uses uv for Python, pnpm for TypeScript)
docker-compose up -d

# Access the web interface
open http://localhost:3000

# Access the API documentation
open http://localhost:8000/docs
```

### What's Included

The Docker setup includes three services:

1. **Ollama Container** (`ollama:latest`)
   - Runs local LLM inference
   - Automatically downloads Mistral 7B model
   - Exposed on port 11434

2. **Simulation Engine** (`living-twin-simulation`)
   - Python FastAPI server
   - Connects to Ollama for AI processing
   - Exposed on port 8000

3. **Web Interface** (`living-twin-web`)
   - React/Next.js dashboard
   - Interactive CEO interface
   - Exposed on port 3000

### Features of the Web Interface

- **Strategic Recipient Selection**: Choose departments and roles to target with strategic communications
- **Strategic Communication Types**: Send strategic nudges, recommendations, or directives
- **Strategic Templates**: Pre-built templates for common strategic communications
- **Real-time Updates**: See how strategic goals cascade through departments
- **Simulation Control**: Start/stop simulation from the web interface
- **Strategic Response Tracking**: Monitor how departments interpret and act on strategic priorities

### Development Mode

For development with hot reloading:

```bash
# Use development overrides
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

### Production Deployment

```bash
# Build and run in production mode
docker-compose -f docker-compose.yml up -d --build
```

## 🚀 Production Deployment

### Deploy to GCP + Firebase (dev.aprio.one)

```bash
# Clone and setup
git clone https://github.com/kpernyer/living-twin-simulation.git
cd living-twin-simulation

# Set your ElevenLabs API key
export ELEVENLABS_API_KEY=your-key-here

# Deploy to GCP + Firebase
./scripts/deploy-gcp.sh
```

**Your platform will be available at:**
- **Web App**: https://dev.aprio.one
- **API**: https://dev.aprio.one/api
- **Health Check**: https://dev.aprio.one/api/healthz
- **API Docs**: https://dev.aprio.one/api/docs

### GCP + Firebase Architecture

The platform uses **Google Cloud Platform** with:
- **Firebase Hosting** - Static Next.js web app with CDN
- **Google Cloud Run** - Containerized Python API backend  
- **Path-based routing** - Firebase rewrites `/api/*` to Cloud Run
- **Automatic SSL** - Managed by Google Cloud
- **Global CDN** - Firebase Hosting edge locations

### Alternative Docker Deployment

For self-hosted deployment without GCP:

```bash
# Deploy with Docker (no Traefik)
./scripts/deploy-prod.sh
```

## 🚀 Local Development

### Installation

```bash
# Using uv (recommended) for Python
uv venv
uv pip install living-twin-simulation

# Using pnpm for TypeScript/JavaScript web interface
cd web
pnpm install

# Or using pip
pip install living-twin-simulation
```

### CLI Usage

```bash
# Generate example employee data
uv run simulation example

# Run simulation
uv run python cli/simulation_cli.py run --org-id acme_corp --employees example_employees.json --duration 30

# Validate employee data format
uv run simulation validate example_employees.json
```

**Note**: When working in the development environment, use `uv run` before CLI commands to ensure they run in the correct virtual environment. This keeps you in the same shell session with your git setup and virtual environment.

### Python API Usage

```python
import asyncio
from living_twin_simulation import SimulationEngine, CommunicationType

async def main():
    # Employee data structure with strategic roles
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "cfo@company.com": {"department": "Finance", "role": "CFO"},
        "cto@company.com": {"department": "Technology", "role": "CTO"},
        "vp.engineering@company.com": {"department": "Engineering", "role": "VP Engineering"},
        "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"}
    }
    
    # Create and start simulation
    engine = SimulationEngine("acme_corp")
    await engine.start_simulation(employee_data)
    
    # Send strategic communication
    agent_ids = list(engine.state.agents.keys())
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs and C-level
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Q4 Growth Targets: 15% Organic Growth",
        content="We need to achieve 15% organic growth this quarter to meet investor expectations. This requires coordinated effort across all departments."
    )
    
    # Let simulation run
    await asyncio.sleep(10)
    
    # Get results
    metrics = engine.calculate_organizational_metrics()
    print(f"Strategic Alignment Score: {metrics.collaboration_score:.1f}%")
    print(f"Department Response Rate: {metrics.response_rate:.1f}%")
    print(f"Escalation Rate: {metrics.escalation_rate:.1f}%")
    
    await engine.stop_simulation()

asyncio.run(main())
```

## 🏗️ Type-Safe Architecture

### Modern Development Stack
- **Python Backend**: `uv` for dependency management, FastAPI with Pydantic for type-safe APIs
- **TypeScript Frontend**: `pnpm` for package management, React with strict TypeScript
- **OpenAPI/Swagger**: Auto-generated API documentation with type validation
- **Docker**: Containerized development and deployment

### Type Safety Benefits
- **API Contracts**: Pydantic models ensure request/response validation
- **Frontend Types**: TypeScript interfaces match backend models exactly
- **Development Experience**: IntelliSense, compile-time error checking
- **Documentation**: Auto-generated OpenAPI docs with examples

## 📊 Key Features
- **Personality Profiles**: Risk tolerance, authority response, communication style
- **Professional Context**: Department, role, seniority, expertise areas
- **Memory & Relationships**: Interaction history, stress levels, colleague relationships

### Communication Simulation
- **Communication Types**: Direct orders, recommendations, nudges, consultations
- **Response Modeling**: Ignore, take action, seek clarification, escalate
- **Escalation Chains**: Automatic escalation from nudges to orders

### Organizational Metrics
- **Response Rate**: Percentage of communications receiving responses
- **Escalation Rate**: How often nudges escalate to direct orders
- **Compliance Rate**: Following of direct orders
- **Stress Levels**: Individual and organizational stress indicators
- **Friction Score**: Overall organizational communication efficiency

## 🔧 Employee Data Format

Simple JSON structure required:

```json
{
  "employee@company.com": {
    "department": "Engineering",
    "role": "Senior Engineer"
  },
  "manager@company.com": {
    "department": "Engineering", 
    "role": "Engineering Manager"
  }
}
```

## 📈 Simulation Results

### Metrics Output
- **Communication Effectiveness**: Response rates, escalation patterns
- **Organizational Health**: Stress levels, friction indicators
- **Department Analysis**: Per-department performance metrics
- **Behavioral Insights**: Personality-driven response patterns

### Use Cases
- **Policy Testing**: Test new communication policies before implementation
- **Change Management**: Model organizational responses to changes
- **Structure Optimization**: Evaluate organizational structure effectiveness
- **Training Design**: Identify communication training needs

## 🛠️ Development

### Setup
```bash
# Clone repository
git clone https://github.com/kpernyer/living-twin-simulation.git
cd living-twin-simulation

# Create virtual environment and install dependencies with uv (recommended)
uv venv
uv pip install -e ".[dev,cli]"

# Or using pip
pip install -e ".[dev,cli]"

# Run tests
uv run pytest
```

### Architecture

```
src/living_twin_simulation/
├── domain/models.py           # Core data models
├── agents/
│   ├── agent_factory.py       # Create agents from employee data  
│   └── behavior_engine.py     # Personality-based response modeling
├── simulation/
│   ├── simulation_engine.py   # Main orchestration engine
│   ├── time_engine.py         # Accelerated time simulation
│   └── escalation_manager.py  # Communication escalation logic
└── communication/
    ├── distribution_engine.py  # Communication routing
    └── tracking_engine.py      # Response tracking
```

## 📋 CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `run` | Execute simulation | `uv run python cli/simulation_cli.py run --org-id acme --employees data.json` |
| `validate` | Validate employee data | `uv run python cli/simulation_cli.py validate employees.json` |
| `example` | Generate example data | `uv run python cli/simulation_cli.py example` |

## 🧪 Testing & Documentation

### **Test Scenarios**

Run comprehensive communication pattern tests:

```bash
# Run all communication pattern tests
uv run python scripts/test_communication_patterns.py

# Generate enhanced test data
uv run python cli/simulation_cli.py example
```

### **Available Test Scenarios**

1. **Traditional Communication**: NUDGE → Response → Escalation patterns
2. **Catchball Communication**: Two-way strategic alignment with feedback loops
3. **Wisdom of the Crowd**: Collective intelligence analysis from department responses
4. **Priority Conflict Resolution**: How competing strategic priorities are handled

### **Documentation**

- **[Communication Patterns Guide](docs/COMMUNICATION_PATTERNS.md)**: Detailed examples and test scenarios
- **[MCP Setup Guide](docs/MCP_SETUP.md)**: Local LLM integration with Ollama
- **[Migration History](docs/MIGRATION_HISTORY.md)**: Development history and changes

## 🎉 Integration with Living Twin

### Data Export from Main System
Export employee roster in the required format:

```python
# In your main Living Twin system
def export_employees_for_simulation(tenant_id: str) -> dict:
    # Query your user database
    users = get_users_for_tenant(tenant_id)
    
    return {
        user.email: {
            "department": user.department,
            "role": user.role
        }
        for user in users
    }
```

### Importing Results Back
```python
# Optional: Import simulation results back to main system
simulation_results = run_simulation(employee_data)
store_simulation_metrics(tenant_id, simulation_results)
```

## 📞 Support

- **Repository**: https://github.com/kpernyer/living-twin-simulation
- **Issues**: https://github.com/kpernyer/living-twin-simulation/issues
- **Documentation**: https://github.com/kpernyer/living-twin-simulation#readme

## 📄 License

MIT License - see LICENSE file for details.

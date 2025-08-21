# Living Twin Simulation Engine

A sophisticated organizational behavior simulation system for testing communication patterns, decision-making processes, and organizational dynamics.

## 🎯 Overview

The Living Twin Simulation Engine models realistic organizational behavior using AI agents with personality-based responses. It simulates:

- **Communication Patterns**: Nudges, recommendations, escalations
- **Agent Behaviors**: Personality-driven responses to organizational communications
- **Time Acceleration**: Run months of simulation in minutes (144x speed by default)
- **Organizational Metrics**: Friction, compliance, stress levels, collaboration scores

## 🚀 Quick Start

### Installation

```bash
pip install living-twin-simulation
```

### CLI Usage

```bash
# Generate example employee data
simulation example

# Run simulation
simulation run --org-id acme_corp --employees example_employees.json --duration 30

# Validate employee data format
simulation validate example_employees.json
```

### Python API Usage

```python
import asyncio
from living_twin_simulation import SimulationEngine, CommunicationType

async def main():
    # Employee data structure
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "john@company.com": {"department": "Engineering", "role": "Engineer"}
    }
    
    # Create and start simulation
    engine = SimulationEngine("acme_corp")
    await engine.start_simulation(employee_data)
    
    # Send test communication
    agent_ids = list(engine.state.agents.keys())
    await engine.send_communication(
        sender_id=agent_ids[0],
        recipient_ids=[agent_ids[1]],
        communication_type=CommunicationType.NUDGE,
        subject="Code Review Priority",
        content="Please prioritize code reviews this week"
    )
    
    # Let simulation run
    await asyncio.sleep(10)
    
    # Get results
    metrics = engine.calculate_organizational_metrics()
    print(f"Response Rate: {metrics.response_rate:.1f}%")
    print(f"Average Stress: {metrics.stress_level_average:.2f}")
    
    await engine.stop_simulation()

asyncio.run(main())
```

## 📊 Key Features

### Agent-Based Modeling
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
git clone https://github.com/living-twin/living-twin-simulation.git
cd living-twin-simulation

# Install in development mode
pip install -e ".[dev,cli]"

# Run tests
pytest
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
| `run` | Execute simulation | `simulation run --org-id acme --employees data.json` |
| `validate` | Validate employee data | `simulation validate employees.json` |
| `example` | Generate example data | `simulation example` |

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

- **Repository**: https://github.com/living-twin/living-twin-simulation
- **Issues**: https://github.com/living-twin/living-twin-simulation/issues
- **Documentation**: https://living-twin-simulation.readthedocs.io/

## 📄 License

MIT License - see LICENSE file for details.

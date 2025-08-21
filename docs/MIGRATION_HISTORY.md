# Living Twin Simulation Engine - Migration Plan

## 🎯 Migration Overview

The simulation engine can be **easily refactored** into a separate repository with minimal changes. It's already well-decoupled from the main Living Twin system.

## 📋 Migration Steps

### Phase 1: Repository Setup (30 minutes)
- [ ] Create new repository `living-twin-simulation`
- [ ] Set up Python package structure
- [ ] Copy simulation code from `apps/simulation/`
- [ ] Create packaging configuration

### Phase 2: Standalone Package (1 hour)
- [ ] Add CLI interface for running simulations
- [ ] Create configuration management
- [ ] Add proper logging and error handling
- [ ] Create installation scripts

### Phase 3: Integration Interface (1 hour)
- [ ] Define employee data export format
- [ ] Create simulation result schemas
- [ ] Add optional API endpoints
- [ ] Document integration patterns

## 🔧 Technical Details

### Current Structure
```
apps/simulation/
├── __init__.py
├── agents/
│   ├── agent_factory.py      # Creates agents from employee data
│   ├── behavior_engine.py    # Personality-based responses
│   └── mcp_agent_engine.py   # MCP integration
├── communication/
│   ├── distribution_engine.py # Communication routing
│   └── tracking_engine.py     # Response tracking
├── domain/
│   └── models.py             # All data models
└── simulation/
    ├── escalation_manager.py  # Communication escalation
    ├── simulation_engine.py   # Main orchestrator
    └── time_engine.py         # Accelerated time simulation
```

### New Repository Structure
```
living-twin-simulation/
├── src/
│   └── living_twin_simulation/
│       ├── __init__.py
│       ├── agents/
│       ├── communication/
│       ├── domain/
│       └── simulation/
├── cli/
│   └── simulation_cli.py
├── config/
│   └── scenarios/
├── examples/
├── tests/
├── docs/
├── pyproject.toml
├── README.md
└── LICENSE
```

## 🔗 Integration Points

### Data Export Format
```python
# Simple employee data structure needed
employee_data = {
    "email@company.com": {
        "department": "Engineering",
        "role": "Senior Engineer",
        "manager_email": "manager@company.com"  # Optional
    }
}
```

### No Complex Dependencies
- ✅ No Neo4j database required
- ✅ No Firebase authentication needed
- ✅ No FastAPI dependencies
- ✅ Pure Python with standard libraries

### Optional Integration APIs
```python
# POST /simulations/start
{
    "organization_id": "acme_corp",
    "employee_data": {...},
    "scenario": "communication_test",
    "duration_days": 30
}

# GET /simulations/{id}/results
{
    "metrics": {...},
    "events": [...],
    "recommendations": [...]
}
```

## 📦 Packaging Configuration

### Dependencies
- Standard library only (asyncio, logging, datetime, random)
- Optional: FastAPI (for API mode)
- Optional: Click (for CLI)

### Installation
```bash
pip install living-twin-simulation
```

### Usage
```python
from living_twin_simulation import SimulationEngine

# Create simulation
engine = SimulationEngine("acme_corp")
await engine.start_simulation(employee_data)

# Run for 30 simulated days
await engine.run_for_days(30)

# Get results
metrics = engine.calculate_organizational_metrics()
```

## 🚀 Benefits of Separation

### For Main Repository
- ✅ Reduced complexity and dependencies
- ✅ Faster build and test times
- ✅ Cleaner architecture focus
- ✅ Independent release cycles

### For Simulation Engine
- ✅ Dedicated development focus
- ✅ Specialized testing scenarios
- ✅ Independent versioning
- ✅ Easier external adoption

### For Teams
- ✅ Clear ownership boundaries
- ✅ Specialized expertise development
- ✅ Independent deployment schedules
- ✅ Reduced merge conflicts

## ⚠️ Migration Considerations

### Minimal Breaking Changes
- No changes to main Living Twin system required
- Simulation engine already operates independently
- Data export is simple dictionary format

### Optional Enhancements
- Add REST API for remote simulation execution
- Create web dashboard for simulation monitoring
- Add more sophisticated employee data import
- Implement simulation result persistence

## 📊 Timeline Estimate

| Phase | Duration | Complexity |
|-------|----------|------------|
| Repository Setup | 30 min | Easy |
| Standalone Package | 1 hour | Medium |
| Integration Interface | 1 hour | Medium |
| Documentation | 30 min | Easy |
| **Total** | **3 hours** | **Low Risk** |

## 🎉 Next Steps

1. **Immediate**: Create new repository structure
2. **Week 1**: Extract and package simulation code
3. **Week 2**: Add CLI and configuration management
4. **Week 3**: Document integration patterns
5. **Week 4**: Optional API endpoints for remote execution

The migration is **low-risk** and **high-value** - the simulation engine is already well-architected for independence!

# Communication Patterns & Test Scenarios

This document outlines all communication patterns supported by the Living Twin Simulation and provides test scenarios to demonstrate them in action.

## Overview

The simulation supports multiple communication patterns that reflect real organizational dynamics:

1. **Traditional One-Way Communication**: Direct orders, recommendations, nudges
2. **Catchball Communication**: Two-way strategic alignment with feedback loops
3. **Wisdom of the Crowd**: Collective intelligence from department responses
4. **Priority Conflict Resolution**: How competing priorities are handled

## Communication Patterns

### 1. Traditional Communication Flow

#### **NUDGE → Response → Escalation**
```
CEO: "We're targeting 15% growth this quarter"
├── Engineering: "I'll need to think about this" (hesitation)
├── Sales: "We can do this with current resources" (positive)
└── Finance: "This conflicts with our budget constraints" (conflict)
    → System detects low consensus → Escalation triggered
```

#### **RECOMMENDATION → Departmental Interpretation**
```
CEO: "I recommend prioritizing customer retention"
├── Sales: "We'll focus on existing customer expansion"
├── Marketing: "We'll develop retention campaigns"
├── Product: "We'll prioritize features for existing users"
└── Support: "We'll enhance customer success programs"
    → High consensus → Strategy aligned
```

#### **DIRECT_ORDER → Compliance Tracking**
```
CEO: "Employee satisfaction must improve by 20% within 90 days"
├── HR: "We'll implement retention programs immediately"
├── Engineering: "We'll reduce workload and improve work-life balance"
├── Sales: "We'll address compensation concerns"
└── Finance: "We'll allocate budget for employee programs"
    → High compliance → Direct action taken
```

### 2. Catchball Communication Flow

#### **Round 1: Initial Strategic Goal**
```
CEO: "We're entering the European market in Q1"
├── Product: "We need 6 months for localization"
├── Sales: "We need European partnerships and team"
├── Engineering: "We need GDPR compliance and localization"
└── Finance: "We need significant budget for expansion"
    → Wisdom Engine: "Detected timeline conflict, resource constraints"
```

#### **Round 2: Refined Strategy**
```
CEO: "Let's phase the expansion: Q1 preparation, Q2 launch"
├── Product: "We can complete localization by Q2"
├── Sales: "We can build partnerships in Q1, launch Q2"
├── Engineering: "We can implement compliance by Q2"
└── Finance: "We can allocate budget across two quarters"
    → Wisdom Engine: "High consensus, aligned timeline"
```

#### **Round 3: Final Alignment**
```
CEO: "Confirmed: Q1 preparation, Q2 European launch"
├── All departments: "Aligned and committed to timeline"
    → Consensus reached → Implementation begins
```

### 3. Wisdom of the Crowd Indicators

#### **Response Timing Analysis**
- **Immediate Response** (< 2 hours): High confidence, clear alignment
- **Delayed Response** (2-24 hours): Hesitation, uncertainty, conflicts
- **Very Delayed Response** (> 24 hours): Major concerns, resource constraints

#### **Hesitation Pattern Detection**
```
"I'll need to think about this" → Uncertainty
"This conflicts with our priorities" → Priority conflict
"We're already at capacity" → Resource constraint
"This doesn't align with our strategy" → Strategic misalignment
"Let me consult with my team" → Need for consensus building
```

#### **Confidence Level Analysis**
- **High Confidence** (> 0.7): Clear commitment, resources available
- **Medium Confidence** (0.4-0.7): Some concerns, needs support
- **Low Confidence** (< 0.4): Major obstacles, needs intervention

### 4. Priority Conflict Resolution

#### **Resource Conflicts**
```
Priority A: "Launch new product in Q1"
Priority B: "Maintain 15% profit margins"
Conflict: "New product requires additional budget"
Resolution: "Phase the launch to maintain margins"
```

#### **Timeline Conflicts**
```
Priority A: "Enter European market in Q1"
Priority B: "Complete product localization"
Conflict: "Localization takes 6 months"
Resolution: "Delay market entry to Q2"
```

#### **Approach Conflicts**
```
Priority A: "Focus on enterprise customers"
Priority B: "Expand to SMB market"
Conflict: "Different sales strategies required"
Resolution: "Create separate teams for each market"
```

## Test Scenarios

### Scenario 1: Growth Target Cascade

**Objective**: Test how growth targets cascade through departments

**Setup**:
```json
{
  "ceo@company.com": {"department": "Executive", "role": "CEO"},
  "cfo@company.com": {"department": "Finance", "role": "CFO"},
  "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"},
  "vp.engineering@company.com": {"department": "Engineering", "role": "VP Engineering"},
  "vp.product@company.com": {"department": "Product", "role": "VP Product"}
}
```

**Test Sequence**:
1. CEO sends: "We need 15% organic growth this quarter"
2. Monitor department responses and timing
3. Analyze priority conflicts and resource constraints
4. Test catchball communication for alignment
5. Measure consensus level and commitment

**Expected Outcomes**:
- Finance: Budget allocation concerns
- Sales: Pipeline and headcount needs
- Engineering: Product velocity and feature priorities
- Product: Feature roadmap adjustments
- Cross-department conflicts: Resource allocation

### Scenario 2: Employee Satisfaction Priority

**Objective**: Test how employee satisfaction goals affect different departments

**Setup**:
```json
{
  "ceo@company.com": {"department": "Executive", "role": "CEO"},
  "chro@company.com": {"department": "Human Resources", "role": "CHRO"},
  "hr.manager@company.com": {"department": "Human Resources", "role": "HR Manager"},
  "engineering.manager@company.com": {"department": "Engineering", "role": "Engineering Manager"},
  "sales.manager@company.com": {"department": "Sales", "role": "Sales Manager"}
}
```

**Test Sequence**:
1. CEO sends: "Employee satisfaction scores must improve by 20%"
2. Monitor HR prioritization and manager responses
3. Analyze resource constraints and competing priorities
4. Test catchball communication for program alignment
5. Measure commitment levels across departments

**Expected Outcomes**:
- HR: Highest priority, retention programs
- Engineering: Workload and work-life balance focus
- Sales: Compensation and career development focus
- Cross-department: Budget allocation for programs

### Scenario 3: Market Expansion Strategy

**Objective**: Test complex strategic alignment across multiple departments

**Setup**:
```json
{
  "ceo@company.com": {"department": "Executive", "role": "CEO"},
  "cmo@company.com": {"department": "Marketing", "role": "CMO"},
  "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"},
  "vp.product@company.com": {"department": "Product", "role": "VP Product"},
  "cto@company.com": {"department": "Technology", "role": "CTO"},
  "cfo@company.com": {"department": "Finance", "role": "CFO"}
}
```

**Test Sequence**:
1. CEO sends: "We're entering the European market in Q1"
2. Monitor complex cross-department dependencies
3. Analyze timeline conflicts and resource requirements
4. Test multi-round catchball communication
5. Measure consensus building and final alignment

**Expected Outcomes**:
- Product: Localization timeline conflicts
- Sales: Partnership and team building needs
- Engineering: Compliance and technical requirements
- Marketing: Messaging and brand adaptation
- Finance: Budget allocation across quarters
- Cross-department: Timeline and resource coordination

### Scenario 4: Innovation vs. Stability

**Objective**: Test competing strategic priorities

**Setup**:
```json
{
  "ceo@company.com": {"department": "Executive", "role": "CEO"},
  "cto@company.com": {"department": "Technology", "role": "CTO"},
  "vp.engineering@company.com": {"department": "Engineering", "role": "VP Engineering"},
  "cfo@company.com": {"department": "Finance", "role": "CFO"},
  "vp.product@company.com": {"department": "Product", "role": "VP Product"}
}
```

**Test Sequence**:
1. CEO sends: "We need to invest 20% of budget in emerging technologies"
2. Monitor competing priorities and risk tolerance
3. Analyze approach conflicts and resource allocation
4. Test catchball communication for balance
5. Measure consensus on innovation strategy

**Expected Outcomes**:
- Technology: High enthusiasm for innovation
- Engineering: Concern about stability and reliability
- Finance: Risk assessment and budget constraints
- Product: Balance between innovation and user needs
- Cross-department: Innovation vs. stability trade-offs

## Running Test Scenarios

### Using the CLI

```bash
# Generate enhanced test data
uv run python cli/simulation_cli.py example

# Run specific scenario
uv run python cli/simulation_cli.py run \
  --org-id test_scenario_1 \
  --employees example_employees.json \
  --duration 7 \
  --acceleration 144
```

### Using the Web Interface

1. Start the simulation
2. Select appropriate employees for the scenario
3. Send strategic communications
4. Monitor responses and wisdom insights
5. Use catchball communication for alignment
6. Track consensus building and conflict resolution

### Using the Python API

```python
import asyncio
from living_twin_simulation import SimulationEngine, CommunicationType

async def run_test_scenario():
    # Setup simulation with test data
    engine = SimulationEngine("test_scenario")
    
    # Load enhanced employee data
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "cfo@company.com": {"department": "Finance", "role": "CFO"},
        "vp.sales@company.com": {"department": "Sales", "role": "VP Sales"},
        # ... more employees
    }
    
    await engine.start_simulation(employee_data)
    
    # Send strategic communication
    agent_ids = list(engine.state.agents.keys())
    await engine.send_communication(
        sender_id=agent_ids[0],  # CEO
        recipient_ids=agent_ids[1:],  # All VPs
        communication_type=CommunicationType.RECOMMENDATION,
        subject="Q4 Growth Targets: 15% Organic Growth",
        content="We need to achieve 15% organic growth this quarter to meet investor expectations."
    )
    
    # Let simulation process responses
    await asyncio.sleep(10)
    
    # Get wisdom insights
    wisdom = engine.get_wisdom_insights()
    print(f"Consensus Level: {wisdom.consensus_level:.1f}")
    print(f"Priority Conflicts: {wisdom.priority_conflicts_detected}")
    print(f"CEO Recommendations: {wisdom.ceo_recommendations}")
    
    await engine.stop_simulation()

asyncio.run(run_test_scenario())
```

## Expected Metrics

### Traditional Communication Metrics
- **Response Rate**: Percentage of communications receiving responses
- **Escalation Rate**: How often nudges escalate to direct orders
- **Compliance Rate**: Following of direct orders
- **Average Response Time**: How long departments take to respond

### Wisdom of the Crowd Metrics
- **Consensus Level**: How aligned departments are (0.0-1.0)
- **Hesitation Patterns**: Types and frequency of hesitation indicators
- **Confidence Distribution**: Spread of confidence levels across departments
- **Priority Conflict Count**: Number of competing priorities detected

### Catchball Communication Metrics
- **Rounds to Consensus**: How many rounds needed for alignment
- **Conflict Resolution Rate**: Percentage of conflicts resolved
- **Cross-Department Coordination**: Level of inter-departmental alignment
- **Strategic Alignment Score**: Overall alignment on strategic goals

## Analysis and Insights

### Key Patterns to Look For

1. **Department-Specific Responses**: How different departments interpret the same strategic goal
2. **Resource Constraint Patterns**: Which departments consistently mention resource limitations
3. **Timeline Conflict Patterns**: How departments handle competing deadlines
4. **Escalation Triggers**: What causes communications to escalate
5. **Consensus Building**: How catchball communication improves alignment

### Success Indicators

- **High Consensus Level** (> 0.7): Departments are well-aligned
- **Low Escalation Rate** (< 20%): Communications are effective
- **Fast Response Times** (< 4 hours): High engagement and clarity
- **High Compliance Rate** (> 80%): Clear strategic direction
- **Resolved Conflicts**: Priority conflicts are addressed and resolved

### Warning Signs

- **Low Consensus Level** (< 0.4): Strategic misalignment
- **High Hesitation Patterns**: Uncertainty or resistance
- **Frequent Escalations**: Communication breakdown
- **Long Response Times**: Engagement or clarity issues
- **Unresolved Conflicts**: Strategic priorities not aligned

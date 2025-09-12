# Living Twin Simulation - System Overview

*Auto-generated system documentation*

Generated on: 2025-09-12T12:15:45.358041

## System Architecture

![System Architecture](./system_architecture.png)

## Agent Architecture

![Agent Architecture](./agent_architecture.png)

### Discovered Agent Types (3 types)
- **AgentFactory**: Autonomous simulation agent
- **BehaviorEngine**: Autonomous simulation agent
- **MCPAgentEngine**: Autonomous simulation agent

## Simulation Flow

![Simulation Flow](./simulation_flow.png)

## Agent Interactions

![Agent Interactions](./agent_interactions.png)

### System Components (51 total)

#### Simulation Engines (11 engines)
- **__init__**: 0 classes, 0 functions
  - Path: `src/living_twin_simulation/domain/__init__.py`
- **loader**: 1 classes, 8 functions
  - Path: `src/living_twin_simulation/config/loader.py`
  - Classes: ConfigurationLoader
- **escalation_manager**: 1 classes, 11 functions
  - Path: `src/living_twin_simulation/simulation/escalation_manager.py`
  - Classes: EscalationManager
- **wisdom_engine**: 1 classes, 11 functions
  - Path: `src/living_twin_simulation/simulation/wisdom_engine.py`
  - Classes: WisdomEngine
- **time_engine**: 2 classes, 15 functions
  - Path: `src/living_twin_simulation/simulation/time_engine.py`
  - Classes: TimeEngine, SimulationScheduler
- **simulation_engine**: 1 classes, 11 functions
  - Path: `src/living_twin_simulation/simulation/simulation_engine.py`
  - Classes: SimulationEngine
- **simple_main**: 6 classes, 1 functions
  - Path: `src/living_twin_simulation/api/simple_main.py`
  - Classes: Employee, Organization, HealthResponse, SimulationStatus, SimulationStartRequest, SimulationStartResponse
- **main**: 19 classes, 0 functions
  - Path: `src/living_twin_simulation/api/main.py`
  - Classes: OrganizationalMemberResponse, IntelligenceAgentResponse, MarketIntelligenceResponse, CatchballAgentResponse, WisdomAgentResponse, TruthAgentResponse, GossipAgentResponse, OrganizationalTwinResponse, StrategicCommunicationRequest, CommunicationResponse, SimulationStatus, WisdomAnalysis, SimulationParameters, OrganizationInfo, Config, Config, Config, Config, Config
- **tracking_engine**: 3 classes, 2 functions
  - Path: `src/living_twin_simulation/communication/tracking_engine.py`
  - Classes: DeliveryStatus, ActionStatus, CommunicationTracker
- **distribution_engine**: 2 classes, 5 functions
  - Path: `src/living_twin_simulation/communication/distribution_engine.py`
  - Classes: DistributionChannel, CommunicationDistributor
- **models**: 28 classes, 3 functions
  - Path: `src/living_twin_simulation/domain/models.py`
  - Classes: PersonalityTrait, CommunicationType, ResponseType, OrganizationalMemberState, IntelligenceAgentType, StrategicPriority, PersonalityProfile, ProfessionalProfile, OrganizationalMemberMemory, OrganizationalMember, StrategicCommunication, AgentResponse, ConsultationRequest, ConsultationFeedback, SimulationState, SimulationEvent, OrganizationalMetrics, CatchballCommunication, CatchballFeedback, WisdomOfTheCrowd, PriorityConflict, IntelligenceAgent, MarketIntelligenceAgent, CatchballAgent, WisdomAgent, TruthAgent, GossipAgent, OrganizationalTwin

#### Agent Components (4 components)
- **agent_factory**: 1 classes
  - Path: `src/living_twin_simulation/agents/agent_factory.py`
- **__init__**: 0 classes
  - Path: `src/living_twin_simulation/agents/__init__.py`
- **behavior_engine**: 1 classes
  - Path: `src/living_twin_simulation/agents/behavior_engine.py`
- **mcp_agent_engine**: 1 classes
  - Path: `src/living_twin_simulation/agents/mcp_agent_engine.py`

#### Web Interface (28 components)
- **SimulationContext**: 5 React components
  - Path: `web/context/SimulationContext.tsx`
- **iPhoneDemo**: 1 React components
  - Path: `web/components/iPhoneDemo.tsx`
- **ViewSlider**: 4 React components
  - Path: `web/components/ViewSlider.tsx`
- **ContextBar**: 3 React components
  - Path: `web/components/ContextBar.tsx`
- **index**: 1 React components
  - Path: `web/pages/index.tsx`
- **dashboard**: 6 React components
  - Path: `web/pages/dashboard.tsx`
- **vp-sales-demo**: 1 React components
  - Path: `web/pages/vp-sales-demo.tsx`
- **living-twin-v2**: 3 React components
  - Path: `web/pages/living-twin-v2.tsx`
- **_document**: 0 React components
  - Path: `web/pages/_document.tsx`
- **mobile-demo-v1**: 7 React components
  - Path: `web/pages/mobile-demo-v1.tsx`
- **simulation-setup**: 4 React components
  - Path: `web/pages/simulation-setup.tsx`
- **dashboard-enhanced**: 5 React components
  - Path: `web/pages/dashboard-enhanced.tsx`
- **context-setup**: 6 React components
  - Path: `web/pages/context-setup.tsx`
- **simple-test**: 2 React components
  - Path: `web/pages/simple-test.tsx`
- **test-css**: 0 React components
  - Path: `web/pages/test-css.tsx`
- **vp-sales-demo-v1**: 1 React components
  - Path: `web/pages/vp-sales-demo-v1.tsx`
- **test-workflow**: 1 React components
  - Path: `web/pages/test-workflow.tsx`
- **_app**: 0 React components
  - Path: `web/pages/_app.tsx`
- **mobile-demo**: 7 React components
  - Path: `web/pages/mobile-demo.tsx`
- **Card**: 0 React components
  - Path: `web/components/ui/Card.tsx`
- **Badge**: 0 React components
  - Path: `web/components/ui/Badge.tsx`
- **Button**: 0 React components
  - Path: `web/components/ui/Button.tsx`
- **VPSalesView**: 1 React components
  - Path: `web/components/views/VPSalesView.tsx`
- **VPSalesViewSimple**: 1 React components
  - Path: `web/components/views/VPSalesViewSimple.tsx`
- **CEODemoView**: 1 React components
  - Path: `web/components/views/CEODemoView.tsx`
- **VPEngineeringView**: 1 React components
  - Path: `web/components/views/VPEngineeringView.tsx`
- **LiveDemoView**: 1 React components
  - Path: `web/components/views/LiveDemoView.tsx`
- **CEOView**: 1 React components
  - Path: `web/components/views/CEOView.tsx`

#### CLI Interface (1 components)
- **simulation_cli**: 7 functions
  - Path: `cli/simulation_cli.py`

## Technology Stack

### Python Technologies
- **AsyncIO**
- **FastAPI**
- **PyTest**
- **Pydantic**
- **Uvicorn**

### Frontend Technologies
- **Next.js**
- **React**
- **React Types**
- **Tailwind CSS**
- **TypeScript**

## Simulation Patterns

- **Async Processing**: Detected in codebase
- **Time-based Simulation**: Detected in codebase
- **Concurrent Execution**: Detected in codebase

## Architecture Insights

- **Multi-Agent System**: 3 different agent types
- **Asynchronous Architecture**: Non-blocking simulation execution
- **Web Visualization**: Next.js frontend for simulation monitoring
- **CLI Interface**: Command-line simulation control

## PlantUML Source Files

- [System Architecture](./system_architecture.puml)
- [Agent Architecture](./agent_architecture.puml)
- [Simulation Flow](./simulation_flow.puml)
- [Agent Interactions](./agent_interactions.puml)

---
*This documentation is automatically generated. To update, run: `make uml`*
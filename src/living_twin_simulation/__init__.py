"""
Living Twin Simulation Engine

A sophisticated organizational behavior simulation system for testing
communication patterns, decision-making processes, and organizational dynamics.

Key Features:
- AI agents with personality-based behaviors
- Realistic organizational communication simulation
- Time-accelerated simulation (144x default speed)
- Escalation and consultation management
- Organizational friction and stress modeling

Example Usage:
    from living_twin_simulation import SimulationEngine
    
    # Create simulation
    engine = SimulationEngine("acme_corp")
    
    # Load employee data
    employee_data = {
        "ceo@company.com": {"department": "Executive", "role": "CEO"},
        "john@company.com": {"department": "Engineering", "role": "Engineer"}
    }
    
    # Start simulation
    await engine.start_simulation(employee_data)
    
    # Send test communication
    await engine.send_communication(
        sender_id="ceo_agent_id",
        recipient_ids=["john_agent_id"],
        communication_type=CommunicationType.NUDGE,
        subject="Code Review Priority",
        content="Please prioritize code reviews this week"
    )
    
    # Run for 30 simulated days
    await engine.run_for_days(30)
    
    # Get results
    metrics = engine.calculate_organizational_metrics()
"""

from .domain.models import (
    OrganizationalMember,
    StrategicCommunication,
    AgentResponse,
    ConsultationRequest,
    ConsultationFeedback,
    SimulationState,
    SimulationEvent,
    OrganizationalMetrics,
    PersonalityProfile,
    ProfessionalProfile,
    OrganizationalMemberMemory,
    PersonalityTrait,
    CommunicationType,
    ResponseType,
    OrganizationalMemberState,
    IntelligenceAgentType,
    StrategicPriority,
    TruthAgent,
    GossipAgent,
    MarketIntelligenceAgent,
    CatchballAgent,
    WisdomAgent,
    OrganizationalTwin,
)

from .simulation.simulation_engine import SimulationEngine
from .agents.agent_factory import AgentFactory
from .agents.behavior_engine import BehaviorEngine

__version__ = "0.1.0"
__author__ = "Living Twin Team"

__all__ = [
    # Main engine
    "SimulationEngine",
    
    # Core models
    "OrganizationalMember",
    "StrategicCommunication", 
    "AgentResponse",
    "ConsultationRequest",
    "ConsultationFeedback",
    "SimulationState",
    "SimulationEvent",
    "OrganizationalMetrics",
    
    # Profile models
    "PersonalityProfile",
    "ProfessionalProfile", 
    "OrganizationalMemberMemory",
    
    # Intelligence Agents
    "TruthAgent",
    "GossipAgent", 
    "MarketIntelligenceAgent",
    "CatchballAgent",
    "WisdomAgent",
    "OrganizationalTwin",
    
    # Enums
    "PersonalityTrait",
    "CommunicationType",
    "ResponseType",
    "OrganizationalMemberState",
    "IntelligenceAgentType",
    "StrategicPriority",
    
    # Factories and engines
    "AgentFactory",
    "BehaviorEngine",
]

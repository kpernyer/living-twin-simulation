"""
Domain models for the Living Twin organizational intelligence system.

Terminology:
- Living Twin: The AI-powered organizational intelligence system
- Organizational Twin: The AI entity that represents the organization's collective intelligence
- Strategic Communications: NUDGE → RECOMMENDATION → ORDER hierarchy
- Intelligence Agents: Market (M##), Catchball (C##), Wisdom (W##)
- Organizational Members: People within the organization (formerly 'agents')
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any
from uuid import uuid4


class PersonalityTrait(Enum):
    """Core personality traits that influence agent behavior."""
    RISK_TOLERANCE = "risk_tolerance"  # 0.0 (conservative) to 1.0 (risk-taking)
    AUTHORITY_RESPONSE = "authority_response"  # 0.0 (questioning) to 1.0 (compliant)
    COMMUNICATION_STYLE = "communication_style"  # 0.0 (diplomatic) to 1.0 (direct)
    CHANGE_ADAPTABILITY = "change_adaptability"  # 0.0 (resistant) to 1.0 (embracing)
    WORKLOAD_SENSITIVITY = "workload_sensitivity"  # 0.0 (resilient) to 1.0 (overwhelmed)
    COLLABORATION_PREFERENCE = "collaboration_preference"  # 0.0 (individual) to 1.0 (team)


class CommunicationType(Enum):
    """Types of strategic communications in Living Twin system."""
    ORDER = "order"  # Renamed from DIRECT_ORDER - mandatory strategic directive
    RECOMMENDATION = "recommendation"  # Strategic suggestion with context
    NUDGE = "nudge"  # Gentle strategic prompt, voluntary response
    CATCHBALL = "catchball"  # Two-way strategic alignment communication
    WISDOM_REQUEST = "wisdom_request"  # Request for crowd intelligence


class ResponseType(Enum):
    """Types of organizational member responses to strategic communications."""
    IGNORE = "ignore"
    TAKE_ACTION = "take_action"
    SEEK_CLARIFICATION = "seek_clarification"
    PROVIDE_WISDOM = "provide_wisdom"  # Renamed for wisdom of crowd concept
    ESCALATE = "escalate"
    DELEGATE = "delegate"


class OrganizationalMemberState(Enum):
    """Current state of an organizational member in the Living Twin system."""
    AVAILABLE = "available"
    BUSY = "busy"
    OVERWHELMED = "overwhelmed"
    ON_LEAVE = "on_leave"
    IN_MEETING = "in_meeting"


class IntelligenceAgentType(Enum):
    """Types of AI intelligence agents in the Living Twin system."""
    MARKET = "market"  # M## - Market Intelligence Agents (competition, trends, M&A, news)
    CATCHBALL = "catchball"  # C## - Catchball Response Agents (two-way strategic feedback)
    WISDOM = "wisdom"  # W## - Wisdom of Crowd Agents (collective intelligence patterns)
    TRUTH = "truth"  # T## - Verified Truth Agents (facts, metrics, confirmed intelligence)
    GOSSIP = "gossip"  # G## - Gossip Intelligence Agents (unverified patterns, informal signals)
    ORGANIZATIONAL = "organizational"  # The main Organizational Twin


class StrategicPriority(Enum):
    """Priority levels for strategic communications and intelligence."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class PersonalityProfile:
    """Personality profile defining agent behavior patterns."""
    traits: Dict[PersonalityTrait, float] = field(default_factory=dict)
    
    def __post_init__(self):
        # Ensure all traits have values between 0.0 and 1.0
        for trait in PersonalityTrait:
            if trait not in self.traits:
                self.traits[trait] = 0.5  # Default to neutral
            else:
                self.traits[trait] = max(0.0, min(1.0, self.traits[trait]))
    
    def get_trait(self, trait: PersonalityTrait) -> float:
        """Get a personality trait value."""
        return self.traits.get(trait, 0.5)


@dataclass
class ProfessionalProfile:
    """Professional characteristics and context."""
    department: str
    role: str
    seniority_level: int  # 1 (junior) to 5 (executive)
    expertise_areas: List[str] = field(default_factory=list)
    direct_reports: List[str] = field(default_factory=list)  # Agent IDs
    manager_id: Optional[str] = None
    workload_capacity: float = 1.0  # Base capacity multiplier
    current_workload: float = 0.5  # Current workload as fraction of capacity


@dataclass
class OrganizationalMemberMemory:
    """Organizational member's memory of past interactions and experiences in Living Twin."""
    interaction_history: List[Dict[str, Any]] = field(default_factory=list)
    priority_responses: Dict[str, List[str]] = field(default_factory=dict)  # priority_id -> response_ids
    relationship_scores: Dict[str, float] = field(default_factory=dict)  # agent_id -> relationship_strength
    stress_level: float = 0.0  # 0.0 (calm) to 1.0 (highly stressed)
    last_updated: datetime = field(default_factory=datetime.now)


@dataclass
class OrganizationalMember:
    """Represents a person within the organization in the Living Twin system."""
    id: str = field(default_factory=lambda: str(uuid4()))
    email: str = ""
    name: str = ""
    personality: PersonalityProfile = field(default_factory=PersonalityProfile)
    professional: ProfessionalProfile = field(default_factory=ProfessionalProfile)
    memory: OrganizationalMemberMemory = field(default_factory=OrganizationalMemberMemory)
    current_state: OrganizationalMemberState = OrganizationalMemberState.AVAILABLE
    organization_id: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    
    def calculate_response_probability(self, communication: 'StrategicCommunication') -> Dict[ResponseType, float]:
        """Calculate probability of different response types based on personality and context."""
        probabilities = {}
        
        # Base probabilities influenced by personality traits
        authority_response = self.personality.get_trait(PersonalityTrait.AUTHORITY_RESPONSE)
        workload_sensitivity = self.personality.get_trait(PersonalityTrait.WORKLOAD_SENSITIVITY)
        
        # Adjust based on communication type
        if communication.type == CommunicationType.DIRECT_ORDER:
            probabilities[ResponseType.TAKE_ACTION] = 0.7 + (authority_response * 0.25)
            probabilities[ResponseType.SEEK_CLARIFICATION] = 0.2 - (authority_response * 0.1)
            probabilities[ResponseType.IGNORE] = 0.1 - (authority_response * 0.05)
        elif communication.type == CommunicationType.NUDGE:
            probabilities[ResponseType.IGNORE] = 0.4 + (workload_sensitivity * 0.3)
            probabilities[ResponseType.TAKE_ACTION] = 0.3 + (authority_response * 0.2)
            probabilities[ResponseType.SEEK_CLARIFICATION] = 0.3
        else:  # RECOMMENDATION
            probabilities[ResponseType.TAKE_ACTION] = 0.5 + (authority_response * 0.2)
            probabilities[ResponseType.SEEK_CLARIFICATION] = 0.3
            probabilities[ResponseType.IGNORE] = 0.2 + (workload_sensitivity * 0.2)
        
        # Normalize probabilities
        total = sum(probabilities.values())
        return {k: v / total for k, v in probabilities.items()}


@dataclass
class StrategicCommunication:
    """A strategic communication in the Living Twin system."""
    id: str = field(default_factory=lambda: str(uuid4()))
    type: CommunicationType = CommunicationType.NUDGE
    sender_id: str = ""
    recipient_ids: List[str] = field(default_factory=list)
    subject: str = ""
    content: str = ""
    priority: StrategicPriority = StrategicPriority.MEDIUM
    deadline: Optional[datetime] = None
    created_at: datetime = field(default_factory=datetime.now)
    organization_id: str = ""
    
    # Tracking fields
    nudge_count: int = 0  # How many times this has been sent as a nudge
    escalation_threshold: int = 5  # Nudges before auto-escalation
    responses: List['AgentResponse'] = field(default_factory=list)


@dataclass
class AgentResponse:
    """An agent's response to a priority communication."""
    id: str = field(default_factory=lambda: str(uuid4()))
    agent_id: str = ""
    communication_id: str = ""
    response_type: ResponseType = ResponseType.IGNORE
    content: str = ""  # Response message/reasoning
    sentiment: float = 0.0  # -1.0 (negative) to 1.0 (positive)
    confidence: float = 0.5  # Agent's confidence in their response
    created_at: datetime = field(default_factory=datetime.now)
    
    # Action tracking
    action_taken: bool = False
    estimated_completion_time: Optional[datetime] = None
    actual_completion_time: Optional[datetime] = None


@dataclass
class ConsultationRequest:
    """Request for crowd wisdom/feedback on a proposed change."""
    id: str = field(default_factory=lambda: str(uuid4()))
    requester_id: str = ""
    title: str = ""
    description: str = ""
    proposed_change: str = ""
    target_audience: List[str] = field(default_factory=list)  # Agent IDs or department names
    deadline: datetime = field(default_factory=lambda: datetime.now())
    organization_id: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    
    # Responses
    feedback_responses: List['ConsultationFeedback'] = field(default_factory=list)
    is_closed: bool = False


@dataclass
class ConsultationFeedback:
    """Feedback provided by an agent on a consultation request."""
    id: str = field(default_factory=lambda: str(uuid4()))
    consultation_id: str = ""
    agent_id: str = ""
    feedback: str = ""
    sentiment: float = 0.0  # -1.0 (negative) to 1.0 (positive)
    confidence: float = 0.5
    concerns: List[str] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)


@dataclass
class SimulationState:
    """Current state of the organizational simulation."""
    id: str = field(default_factory=lambda: str(uuid4()))
    organization_id: str = ""
    simulation_time: datetime = field(default_factory=datetime.now)
    real_start_time: datetime = field(default_factory=datetime.now)
    time_acceleration_factor: int = 144  # 10 seconds = 1 day (86400/600)
    is_running: bool = False
    
    # Active elements
    active_communications: List[StrategicCommunication] = field(default_factory=list)
    active_consultations: List[ConsultationRequest] = field(default_factory=list)
    agents: Dict[str, OrganizationalMember] = field(default_factory=dict)
    
    # Metrics
    total_communications_sent: int = 0
    total_responses_received: int = 0
    escalations_triggered: int = 0
    average_response_time: float = 0.0
    organizational_friction_score: float = 0.0  # 0.0 (smooth) to 1.0 (high friction)


@dataclass
class SimulationEvent:
    """An event that occurred during simulation."""
    id: str = field(default_factory=lambda: str(uuid4()))
    simulation_id: str = ""
    event_type: str = ""  # "communication_sent", "response_received", "escalation", etc.
    timestamp: datetime = field(default_factory=datetime.now)
    simulation_timestamp: datetime = field(default_factory=datetime.now)
    agent_id: Optional[str] = None
    data: Dict[str, Any] = field(default_factory=dict)
    description: str = ""


@dataclass
class OrganizationalMetrics:
    """Metrics calculated from simulation data."""
    organization_id: str = ""
    simulation_id: str = ""
    time_period_start: datetime = field(default_factory=datetime.now)
    time_period_end: datetime = field(default_factory=datetime.now)
    
    # Communication metrics
    total_communications: int = 0
    response_rate: float = 0.0  # Percentage of communications that received responses
    average_response_time_hours: float = 0.0
    escalation_rate: float = 0.0  # Percentage of nudges that escalated to orders
    
    # Behavioral metrics
    compliance_rate: float = 0.0  # Percentage of direct orders followed
    collaboration_score: float = 0.0  # How much cross-department interaction
    stress_level_average: float = 0.0  # Average stress across all agents
    
    # Department-specific metrics
    department_metrics: Dict[str, Dict[str, float]] = field(default_factory=dict)
    
    # Friction points
    high_friction_communications: List[str] = field(default_factory=list)  # Communication IDs
    bottleneck_agents: List[str] = field(default_factory=list)  # Agent IDs causing delays


@dataclass
class CatchballCommunication:
    """Two-way strategic communication with feedback loops."""
    id: str = field(default_factory=lambda: str(uuid4()))
    original_communication_id: str = ""
    sender_id: str = ""
    recipient_ids: List[str] = field(default_factory=list)
    subject: str = ""
    content: str = ""
    communication_type: CommunicationType = CommunicationType.NUDGE
    created_at: datetime = field(default_factory=datetime.now)
    
    # Catchball-specific fields
    round_number: int = 1  # Which round of catchball communication
    max_rounds: int = 3  # Maximum rounds before escalation
    feedback_received: List['CatchballFeedback'] = field(default_factory=list)
    consensus_reached: bool = False
    priority_conflicts: List[str] = field(default_factory=list)  # List of conflicting priorities
    wisdom_insights: List[str] = field(default_factory=list)  # Collective insights from crowd


@dataclass
class CatchballFeedback:
    """Feedback from recipients in catchball communication."""
    id: str = field(default_factory=lambda: str(uuid4()))
    catchball_id: str = ""
    agent_id: str = ""
    department: str = ""
    role: str = ""
    
    # Response content
    feedback_content: str = ""
    response_type: ResponseType = ResponseType.TAKE_ACTION
    
    # Wisdom of the Crowd indicators
    response_delay_hours: float = 0.0  # How long it took to respond
    hesitation_indicators: List[str] = field(default_factory=list)  # "delayed", "uncertain", "conflicted"
    confidence_level: float = 0.5  # 0.0 (very uncertain) to 1.0 (very confident)
    
    # Priority conflict detection
    priority_conflicts_mentioned: List[str] = field(default_factory=list)
    competing_priorities: List[str] = field(default_factory=list)
    resource_constraints: List[str] = field(default_factory=list)
    
    # Sentiment and tone analysis
    sentiment: float = 0.0  # -1.0 (negative) to 1.0 (positive)
    urgency_level: float = 0.5  # 0.0 (low urgency) to 1.0 (high urgency)
    commitment_level: float = 0.5  # 0.0 (low commitment) to 1.0 (high commitment)
    
    created_at: datetime = field(default_factory=datetime.now)


@dataclass
class WisdomOfTheCrowd:
    """Aggregated insights from collective responses."""
    id: str = field(default_factory=lambda: str(uuid4()))
    catchball_id: str = ""
    communication_id: str = ""
    
    # Collective insights
    consensus_level: float = 0.0  # 0.0 (no consensus) to 1.0 (full consensus)
    priority_conflicts_detected: List[str] = field(default_factory=list)
    resource_bottlenecks: List[str] = field(default_factory=list)
    hidden_risks: List[str] = field(default_factory=list)
    opportunities_identified: List[str] = field(default_factory=list)
    
    # Response patterns
    average_response_delay: float = 0.0
    hesitation_patterns: Dict[str, int] = field(default_factory=dict)  # Pattern -> count
    confidence_distribution: Dict[str, int] = field(default_factory=dict)  # Confidence level -> count
    
    # Department-specific insights
    department_insights: Dict[str, Dict] = field(default_factory=dict)  # Department -> insights
    cross_department_conflicts: List[Dict] = field(default_factory=list)
    
    # Recommendations for CEO
    ceo_recommendations: List[str] = field(default_factory=list)
    escalation_triggers: List[str] = field(default_factory=list)
    consensus_building_suggestions: List[str] = field(default_factory=list)
    
    created_at: datetime = field(default_factory=datetime.now)


@dataclass
class PriorityConflict:
    """A conflict between competing strategic priorities."""
    id: str = field(default_factory=lambda: str(uuid4()))
    conflict_type: str = ""  # "resource", "timeline", "approach", "values"
    priority_a: str = ""
    priority_b: str = ""
    affected_departments: List[str] = field(default_factory=list)
    severity: float = 0.5  # 0.0 (minor) to 1.0 (critical)
    resolution_status: str = "unresolved"  # "unresolved", "in_progress", "resolved"
    
    # Conflict details
    description: str = ""
    impact_assessment: str = ""
    proposed_resolutions: List[str] = field(default_factory=list)
    
    # Stakeholder positions
    stakeholder_positions: Dict[str, str] = field(default_factory=dict)  # Agent ID -> position
    escalation_level: int = 1  # How many levels up this has been escalated
    
    created_at: datetime = field(default_factory=datetime.now)
    resolved_at: Optional[datetime] = None


@dataclass
class IntelligenceAgent:
    """Base class for AI intelligence agents in the Living Twin system."""
    id: str = field(default_factory=lambda: str(uuid4()))
    tag: str = ""  # e.g., "M07", "C12", "W03"
    agent_type: IntelligenceAgentType = IntelligenceAgentType.MARKET
    title: str = ""
    description: str = ""
    priority: StrategicPriority = StrategicPriority.MEDIUM
    organization_id: str = ""
    created_at: datetime = field(default_factory=datetime.now)
    is_active: bool = True
    
    # Intelligence content
    content: str = ""
    source: str = ""  # Where the intelligence comes from
    confidence_level: float = 0.8  # AI confidence in this intelligence
    
    # CEO interaction tracking
    viewed_by_ceo: bool = False
    ceo_action_taken: Optional[str] = None  # "commented", "targeted", "requested_info"
    ceo_notes: str = ""


@dataclass
class MarketIntelligenceAgent(IntelligenceAgent):
    """Market Intelligence Agent (M##) for competitive and market insights."""
    agent_type: IntelligenceAgentType = IntelligenceAgentType.MARKET
    
    # Market-specific fields
    market_category: str = ""  # "competition", "trends", "ma", "regulations", "news"
    impact_assessment: str = ""  # "high", "medium", "low"
    competitive_threat_level: float = 0.0  # 0.0 to 1.0
    market_opportunity_score: float = 0.0  # 0.0 to 1.0
    
    # Related companies/competitors
    related_companies: List[str] = field(default_factory=list)
    affected_business_units: List[str] = field(default_factory=list)


@dataclass
class CatchballAgent(IntelligenceAgent):
    """Catchball Agent (C##) for two-way strategic feedback and alignment."""
    agent_type: IntelligenceAgentType = IntelligenceAgentType.CATCHBALL
    
    # Catchball-specific fields
    originating_member_id: str = ""  # Who initiated this catchball
    round_number: int = 1
    consensus_level: float = 0.0  # 0.0 (no consensus) to 1.0 (full consensus)
    
    # Strategic alignment tracking
    priority_conflicts: List[str] = field(default_factory=list)
    resource_constraints: List[str] = field(default_factory=list)
    department_positions: Dict[str, str] = field(default_factory=dict)  # dept -> position


@dataclass
class WisdomAgent(IntelligenceAgent):
    """Wisdom of Crowd Agent (W##) for collective intelligence patterns."""
    agent_type: IntelligenceAgentType = IntelligenceAgentType.WISDOM
    
    # Wisdom-specific fields
    pattern_type: str = ""  # "hesitation", "conflict", "consensus", "concern"
    affected_percentage: float = 0.0  # What % of organization is affected
    department_breakdown: Dict[str, float] = field(default_factory=dict)  # dept -> impact score
    
    # Crowd intelligence metrics
    response_velocity: float = 0.0  # How quickly people are responding
    sentiment_score: float = 0.0  # Overall sentiment (-1.0 to 1.0)
    confidence_distribution: Dict[str, int] = field(default_factory=dict)  # confidence -> count


@dataclass
class TruthAgent(IntelligenceAgent):
    """Truth Agent (T##) for verified facts and confirmed intelligence."""
    agent_type: IntelligenceAgentType = IntelligenceAgentType.TRUTH
    
    # Truth-specific fields
    verification_status: str = "verified"  # "verified", "cross_referenced", "system_confirmed"
    data_sources: List[str] = field(default_factory=list)  # Source systems/channels
    verification_timestamp: datetime = field(default_factory=datetime.now)
    truth_category: str = ""  # "metric", "event", "decision", "change"
    
    # Impact assessment
    immediate_action_required: bool = False
    business_impact_score: float = 0.0  # 0.0 to 1.0
    urgency_level: float = 0.0  # 0.0 to 1.0
    
    # Validation chain
    originally_gossip_id: Optional[str] = None  # If this truth started as gossip
    correlation_strength: float = 1.0  # How strongly correlated with other truths


@dataclass
class GossipAgent(IntelligenceAgent):
    """Gossip Agent (G##) for unverified patterns and informal organizational signals."""
    agent_type: IntelligenceAgentType = IntelligenceAgentType.GOSSIP
    
    # Gossip-specific fields
    report_count: int = 1  # How many similar reports received
    first_reported: datetime = field(default_factory=datetime.now)
    last_reported: datetime = field(default_factory=datetime.now)
    validation_threshold: int = 3  # Reports needed to escalate for validation
    
    # Pattern detection
    similar_reports: List[str] = field(default_factory=list)  # IDs of similar gossip
    gossip_category: str = ""  # "concern", "excitement", "frustration", "rumor", "insight"
    emotional_tone: float = 0.0  # -1.0 (negative) to 1.0 (positive)
    
    # Anonymization and privacy
    source_departments: List[str] = field(default_factory=list)  # Departments (not individuals)
    source_levels: List[str] = field(default_factory=list)  # Seniority levels (not names)
    geographic_regions: List[str] = field(default_factory=list)  # If applicable
    
    # Validation pathway
    validation_requested: bool = False
    validation_method: Optional[str] = None  # "catchball", "survey", "metric_check"
    promoted_to_truth: bool = False
    promoted_truth_id: Optional[str] = None
    
    # Strategic relevance scoring
    strategic_relevance_score: float = 0.0  # 0.0 to 1.0
    escalation_urgency: float = 0.0  # 0.0 to 1.0
    potential_business_impact: float = 0.0  # 0.0 to 1.0


@dataclass
class OrganizationalTwin:
    """The main Organizational Twin AI that manages all intelligence and CEO interactions."""
    id: str = field(default_factory=lambda: str(uuid4()))
    organization_id: str = ""
    
    # Morning queue management
    morning_queue: List[str] = field(default_factory=list)  # Intelligence Agent IDs
    max_queue_size: int = 5  # 5-5-5 rule
    queue_priority_weights: Dict[IntelligenceAgentType, float] = field(
        default_factory=lambda: {
            IntelligenceAgentType.TRUTH: 0.35,      # Verified facts get high priority
            IntelligenceAgentType.MARKET: 0.25,     # Market intelligence
            IntelligenceAgentType.CATCHBALL: 0.20,  # Strategic feedback
            IntelligenceAgentType.WISDOM: 0.15,     # Crowd patterns
            IntelligenceAgentType.GOSSIP: 0.05      # Only high-confidence gossip makes it
        }
    )
    
    # Truth and Gossip intelligence management
    active_gossip_patterns: List[str] = field(default_factory=list)  # Gossip Agent IDs being tracked
    gossip_to_truth_promotions: Dict[str, str] = field(default_factory=dict)  # gossip_id -> truth_id
    truth_verification_queue: List[str] = field(default_factory=list)  # Gossip pending validation
    
    # Pattern correlation engine
    gossip_correlation_threshold: float = 0.7  # Similarity threshold for grouping gossip
    automatic_validation_threshold: int = 5    # Auto-validate gossip with this many reports
    strategic_gossip_threshold: float = 0.6    # Gossip relevance needed for CEO queue
    
    # CEO interaction state
    current_conversation_hooks: List[str] = field(default_factory=list)  # Max 5 hooks
    last_ceo_interaction: Optional[datetime] = None
    daily_interaction_count: int = 0
    average_interaction_duration_minutes: float = 5.0  # Target 5 minutes
    
    # Learning and adaptation
    ceo_preferences: Dict[str, float] = field(default_factory=dict)  # preference -> weight
    successful_communication_patterns: List[str] = field(default_factory=list)
    organizational_context: Dict[str, Any] = field(default_factory=dict)
    
    created_at: datetime = field(default_factory=datetime.now)
    last_updated: datetime = field(default_factory=datetime.now)


# Backward compatibility aliases for existing code
SimulationAgent = OrganizationalMember
AgentState = OrganizationalMemberState
PriorityCommunication = StrategicCommunication
AgentMemory = OrganizationalMemberMemory

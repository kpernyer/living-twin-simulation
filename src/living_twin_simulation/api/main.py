"""
Living Twin Organizational Intelligence API

FastAPI application providing access to the Living Twin system:
- Organizational Twin management
- Strategic communications (NUDGE → RECOMMENDATION → ORDER)
- Intelligence agents (Market M##, Catchball C##, Wisdom W##)
- CEO morning ritual and 5-5-5 constraint conversations
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import asyncio
import logging
from datetime import datetime, timedelta

from ..simulation.simulation_engine import SimulationEngine
from ..domain.models import (
    OrganizationalMember, CommunicationType, ResponseType, StrategicPriority,
    IntelligenceAgentType, MarketIntelligenceAgent, CatchballAgent, 
    WisdomAgent, TruthAgent, GossipAgent, OrganizationalTwin
)
from ..config.loader import ConfigurationLoader, create_agent_from_config, convert_employee_list_to_dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app with OpenAPI metadata
app = FastAPI(
    title="Living Twin Organizational Intelligence API",
    description="""
    The Living Twin API enables organizational intelligence and strategic alignment.
    
    ## Core Concepts
    
    **Organizational Twin**: AI entity representing collective organizational intelligence
    **Strategic Communications**: NUDGE → RECOMMENDATION → ORDER hierarchy
    **Intelligence Agents**:
    - Market Agents (M##): Competition, trends, M&A, regulatory news
    - Catchball Agents (C##): Two-way strategic feedback and alignment
    - Wisdom Agents (W##): Collective intelligence patterns and crowd wisdom
    
    ## CEO Morning Ritual (5-5-5 Rule)
    
    - **5 minutes**: Daily interaction duration
    - **5 strategic items**: Maximum in morning queue
    - **5 conversation hooks**: Capture strategic intent and decisions
    
    ## Strategic Boundary
    
    This system operates at the strategic level - translating business objectives
    into organizational alignment. It stops before operational details and daily tasks.
    """,
    version="1.0.0",
    contact={
        "name": "Living Twin Simulation",
        "url": "https://github.com/kpernyer/living-twin-simulation",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class OrganizationalMemberResponse(BaseModel):
    """Response model for organizational members in the Living Twin system."""
    id: str
    name: str
    role: str
    department: str
    level: str
    personality_traits: List[str]
    workload: float = Field(ge=0.0, le=1.0, description="Current workload as fraction of capacity")
    satisfaction: float = Field(ge=0.0, le=1.0, description="Satisfaction level (derived from stress)")
    strategic_alignment_score: float = Field(ge=0.0, le=1.0, description="How aligned with current strategic priorities")
    
    class Config:
        from_attributes = True


class IntelligenceAgentResponse(BaseModel):
    """Response model for intelligence agents (M##, C##, W##)."""
    id: str
    tag: str = Field(description="Agent identifier (e.g., M07, C12, W03)")
    agent_type: IntelligenceAgentType
    title: str
    description: str = Field(description="Brief description of the intelligence")
    content: str = Field(description="Detailed intelligence content")
    priority: StrategicPriority
    confidence_level: float = Field(ge=0.0, le=1.0, description="AI confidence in this intelligence")
    viewed_by_ceo: bool = Field(description="Whether CEO has seen this intelligence")
    ceo_action_taken: Optional[str] = Field(description="CEO action: commented, targeted, requested_info")
    created_at: datetime
    
    class Config:
        from_attributes = True


class MarketIntelligenceResponse(IntelligenceAgentResponse):
    """Market Intelligence Agent (M##) response with market-specific data."""
    market_category: str = Field(description="Category: competition, trends, ma, regulations, news")
    impact_assessment: str = Field(description="Impact level: high, medium, low")
    competitive_threat_level: float = Field(ge=0.0, le=1.0)
    market_opportunity_score: float = Field(ge=0.0, le=1.0)
    related_companies: List[str] = Field(default_factory=list)
    affected_business_units: List[str] = Field(default_factory=list)


class CatchballAgentResponse(IntelligenceAgentResponse):
    """Catchball Agent (C##) response for strategic feedback."""
    originating_member_id: str = Field(description="Who initiated this catchball")
    round_number: int = Field(description="Current round of catchball communication")
    consensus_level: float = Field(ge=0.0, le=1.0, description="Level of consensus achieved")
    priority_conflicts: List[str] = Field(default_factory=list)
    resource_constraints: List[str] = Field(default_factory=list)


class WisdomAgentResponse(IntelligenceAgentResponse):
    """Wisdom of Crowd Agent (W##) response for collective intelligence."""
    pattern_type: str = Field(description="Pattern: hesitation, conflict, consensus, concern")
    affected_percentage: float = Field(ge=0.0, le=1.0, description="Percentage of organization affected")
    response_velocity: float = Field(description="How quickly people are responding")
    sentiment_score: float = Field(ge=-1.0, le=1.0, description="Overall sentiment")


class TruthAgentResponse(IntelligenceAgentResponse):
    """Truth Agent (T##) response for verified facts and confirmed intelligence."""
    verification_status: str = Field(description="Status: verified, cross_referenced, system_confirmed")
    data_sources: List[str] = Field(description="Source systems or channels that verified this truth")
    truth_category: str = Field(description="Category: metric, event, decision, change")
    immediate_action_required: bool = Field(description="Whether this truth requires immediate CEO action")
    business_impact_score: float = Field(ge=0.0, le=1.0, description="Assessed business impact")
    urgency_level: float = Field(ge=0.0, le=1.0, description="Urgency level for strategic response")
    originally_gossip_id: Optional[str] = Field(None, description="If this truth originated from gossip")


class GossipAgentResponse(IntelligenceAgentResponse):
    """Gossip Agent (G##) response for unverified patterns and organizational signals."""
    report_count: int = Field(description="Number of similar reports received")
    validation_threshold: int = Field(description="Reports needed to escalate for validation")
    gossip_category: str = Field(description="Category: concern, excitement, frustration, rumor, insight")
    emotional_tone: float = Field(ge=-1.0, le=1.0, description="Emotional tone of gossip")
    source_departments: List[str] = Field(description="Departments where gossip originated (anonymized)")
    source_levels: List[str] = Field(description="Seniority levels reporting (anonymized)")
    validation_requested: bool = Field(description="Whether validation has been requested")
    promoted_to_truth: bool = Field(description="Whether this gossip has been verified as truth")
    strategic_relevance_score: float = Field(ge=0.0, le=1.0, description="Strategic relevance assessment")
    escalation_urgency: float = Field(ge=0.0, le=1.0, description="Urgency for CEO attention")


class OrganizationalTwinResponse(BaseModel):
    """The main Organizational Twin status and morning queue."""
    id: str
    organization_id: str
    morning_queue: List[IntelligenceAgentResponse] = Field(description="Current morning queue (max 5 items)")
    current_conversation_hooks: List[str] = Field(description="Active conversation hooks (max 5)")
    last_ceo_interaction: Optional[datetime]
    daily_interaction_count: int
    average_interaction_duration_minutes: float
    
    class Config:
        from_attributes = True


class StrategicCommunicationRequest(BaseModel):
    """Request model for sending strategic communications in Living Twin system."""
    sender_id: str = Field(description="ID of the sender (usually CEO)")
    recipient_ids: List[str] = Field(description="List of organizational member IDs to receive communication")
    communication_type: CommunicationType = Field(description="NUDGE → RECOMMENDATION → ORDER hierarchy")
    content: str = Field(description="Strategic communication content - stays at strategic level")
    priority: StrategicPriority = Field(default=StrategicPriority.MEDIUM)
    strategic_goal: Optional[str] = Field(None, description="Related strategic objective")
    enable_catchball: bool = Field(default=False, description="Enable two-way strategic feedback")
    request_wisdom: bool = Field(default=False, description="Request crowd intelligence analysis")
    
    class Config:
        json_schema_extra = {
            "example": {
                "sender_id": "ceo_001",
                "recipient_ids": ["cto_001", "cmo_001", "cfo_001"],
                "communication_type": "NUDGE",
                "content": "We need to accelerate our AI-first product strategy to compete with recent market developments",
                "priority": "HIGH",
                "strategic_goal": "AI-First Product Strategy",
                "enable_catchball": True,
                "request_wisdom": True
            }
        }

class CommunicationResponse(BaseModel):
    id: str
    sender_id: str
    recipient_ids: List[str]
    communication_type: CommunicationType
    content: str
    timestamp: datetime
    responses: List[Dict[str, Any]] = []
    status: str
    
    class Config:
        from_attributes = True

class SimulationStatus(BaseModel):
    organization_id: str
    is_running: bool
    current_time: datetime
    acceleration_factor: int
    total_employees: int
    active_communications: int
    pending_responses: int

class WisdomAnalysis(BaseModel):
    consensus_level: float = Field(ge=0.0, le=1.0)
    detected_conflicts: List[str] = []
    hesitation_indicators: List[str] = []
    confidence_metrics: Dict[str, float] = {}
    ceo_recommendations: List[str] = []

class SimulationParameters(BaseModel):
    time_acceleration_factor: int = 144
    communication_frequency: float = 0.3
    response_delay_range: List[int] = [1, 24]
    stress_threshold: float = 0.8
    collaboration_bonus: float = 0.2

class OrganizationInfo(BaseModel):
    id: str
    name: str
    industry: str
    size: str
    description: str
    employee_count: int
    strategic_goals: List[Dict[str, Any]] = []

# Global simulation engine and configuration instances
simulation_engine: Optional[SimulationEngine] = None
config_loader = ConfigurationLoader()
current_organization = None

@app.on_event("startup")
async def startup_event():
    """Initialize the simulation engine on startup."""
    global simulation_engine, config_loader
    try:
        # Load default organization (acme_corp)
        config = config_loader.load_organization("acme_corp")
        employees_list = config_loader.load_employees_from_config(config)
        
        # Create agents directly from configuration
        agents = {}
        for employee_data in employees_list:
            agent = create_agent_from_config(employee_data)
            agents[agent.id] = agent
        
        # Create simulation engine with organization data
        simulation_engine = SimulationEngine("acme_corp")
        
        # Set agents directly in simulation state
        simulation_engine.state.agents = agents
        simulation_engine.state.is_running = True
        simulation_engine.state.real_start_time = datetime.now()
        simulation_engine.state.simulation_time = simulation_engine.time_engine.get_current_simulation_time()
        
        logger.info(f"Simulation engine initialized with {len(agents)} employees")
    except Exception as e:
        logger.error(f"Failed to initialize simulation engine: {e}")
        # Continue without simulation engine for now

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Living Twin Simulation API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for Docker health checks."""
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "simulation_engine": simulation_engine is not None
    }

@app.get("/organizational-members", response_model=List[OrganizationalMemberResponse], tags=["Organizational Members"])
async def get_organizational_members(organization_id: Optional[str] = None):
    """
    Get all organizational members in the Living Twin system.
    
    Args:
        organization_id: Optional organization ID to filter members. If not provided, returns members from current organization.
    
    Returns a list of all organizational members with their roles, departments, and strategic alignment status.
    """
    if not simulation_engine:
        raise HTTPException(status_code=503, detail="Simulation engine not initialized")
    
    try:
        # If organization_id is provided, load that organization's employees
        if organization_id:
            try:
                config = config_loader.load_organization(organization_id)
                employees_list = config_loader.load_employees_from_config(config)
                
                employees = []
                for employee_data in employees_list:
                    try:
                        # Convert employee data to response format
                        employee = EmployeeResponse(
                            id=employee_data['id'],
                            name=employee_data['name'],
                            role=employee_data['role'],
                            department=employee_data['department'],
                            level=employee_data['level'],
                            personality_traits=list(employee_data.get('personality_traits', {}).keys()),
                            workload=employee_data.get('professional_profile', {}).get('current_workload', 0.5),
                            satisfaction=0.8  # Default satisfaction for non-simulation employees
                        )
                        employees.append(employee)
                    except Exception as emp_error:
                        logger.error(f"Error processing employee {employee_data.get('id', 'unknown')}: {emp_error}")
                        continue
                
                logger.info(f"Returning {len(employees)} employees from organization {organization_id}")
                return employees
                
            except FileNotFoundError:
                raise HTTPException(status_code=404, detail=f"Organization {organization_id} not found")
        
        # Otherwise, return employees from current simulation
        agents = simulation_engine.state.agents
        
        # Debug logging
        logger.info(f"Number of agents: {len(agents)}")
        logger.info(f"Agent IDs: {list(agents.keys())}")
        
        employees = []
        for agent_id, agent in agents.items():
            try:
                # Convert agent to employee response format
                employee = EmployeeResponse(
                    id=agent.id,
                    name=agent.name,
                    role=agent.professional.role,
                    department=agent.professional.department,
                    level=f"Level {agent.professional.seniority_level}",
                    personality_traits=list(agent.personality.traits.keys()),
                    workload=agent.professional.current_workload,
                    satisfaction=1.0 - agent.memory.stress_level  # Convert stress to satisfaction
                )
                employees.append(employee)
            except Exception as agent_error:
                logger.error(f"Error processing agent {agent_id}: {agent_error}")
                continue
        
        logger.info(f"Returning {len(employees)} employees from current simulation")
        return employees
    except Exception as e:
        logger.error(f"Error fetching employees: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Failed to fetch employees")

@app.get("/organizations", response_model=List[str], tags=["Organizations"])
async def get_available_organizations():
    """
    Get list of available organization configurations.
    
    Returns a list of organization IDs that can be loaded.
    """
    try:
        return config_loader.get_available_organizations()
    except Exception as e:
        logger.error(f"Error fetching organizations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch organizations")

@app.get("/organizations/{org_id}", response_model=OrganizationInfo, tags=["Organizations"])
async def get_organization_info(org_id: str):
    """
    Get organization information and configuration.
    
    Args:
        org_id: Organization ID (e.g., "acme_corp")
    
    Returns organization details including employee count and strategic goals.
    """
    try:
        config = config_loader.load_organization(org_id)
        employees = config_loader.load_employees_from_config(config)
        strategic_goals = config_loader.load_strategic_goals(config)
        
        return OrganizationInfo(
            id=config['organization']['id'],
            name=config['organization']['name'],
            industry=config['organization']['industry'],
            size=config['organization']['size'],
            description=config['organization']['description'],
            employee_count=len(employees),
            strategic_goals=strategic_goals
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Organization {org_id} not found")
    except Exception as e:
        logger.error(f"Error fetching organization info: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch organization info")

@app.get("/organizations/{org_id}/members", response_model=List[OrganizationalMemberResponse], tags=["Organizational Members"])
async def get_members_by_organization(org_id: str):
    """
    Get all organizational members for a specific organization.
    
    Args:
        org_id: Organization ID (e.g., "acme_corp", "tech_innovators")
    
    Returns a list of all organizational members in the specified organization.
    """
    try:
        config = config_loader.load_organization(org_id)
        employees_list = config_loader.load_employees_from_config(config)
        
        employees = []
        for employee_data in employees_list:
            try:
                # Convert employee data to response format
                employee = EmployeeResponse(
                    id=employee_data['id'],
                    name=employee_data['name'],
                    role=employee_data['role'],
                    department=employee_data['department'],
                    level=employee_data['level'],
                    personality_traits=list(employee_data.get('personality_traits', {}).keys()),
                    workload=employee_data.get('professional_profile', {}).get('current_workload', 0.5),
                    satisfaction=0.8  # Default satisfaction for non-simulation employees
                )
                employees.append(employee)
            except Exception as emp_error:
                logger.error(f"Error processing employee {employee_data.get('id', 'unknown')}: {emp_error}")
                continue
        
        return employees
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Organization {org_id} not found")
    except Exception as e:
        logger.error(f"Error fetching employees for organization {org_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch employees")

@app.get("/organizational-members/department/{department}", response_model=List[OrganizationalMemberResponse], tags=["Organizational Members"])
async def get_members_by_department(department: str):
    """
    Get organizational members by department.
    
    Args:
        department: Department name (e.g., "Technology", "Sales", "Marketing")
    
    Returns filtered list of organizational members in the specified department.
    """
    if not simulation_engine:
        raise HTTPException(status_code=503, detail="Simulation engine not initialized")
    
    try:
        # Return mock data filtered by department
        all_employees = [
            EmployeeResponse(
                id="ceo_001",
                name="CEO",
                role="Chief Executive Officer",
                department="Executive",
                level="C-Level",
                personality_traits=["risk_tolerance", "authority_response"],
                workload=0.8,
                satisfaction=0.9
            ),
            EmployeeResponse(
                id="cto_001",
                name="CTO",
                role="Chief Technology Officer",
                department="Technology",
                level="C-Level",
                personality_traits=["change_adaptability", "communication_style"],
                workload=0.7,
                satisfaction=0.8
            )
        ]
        filtered_employees = [emp for emp in all_employees if emp.department.lower() == department.lower()]
        return filtered_employees
    except Exception as e:
        logger.error(f"Error fetching employees by department: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch employees")

@app.post("/communications", response_model=CommunicationResponse, tags=["Communications"])
async def send_communication(communication: CommunicationRequest):
    """
    Send a strategic communication to employees.
    
    Supports traditional communication types (NUDGE, RECOMMENDATION, DIRECT_ORDER)
    with strategic alignment focus.
    """
    if not simulation_engine:
        raise HTTPException(status_code=503, detail="Simulation engine not initialized")
    
    try:
        # Mock communication response
        return CommunicationResponse(
            id="comm_001",
            sender_id=communication.sender_id,
            recipient_ids=communication.recipient_ids,
            communication_type=communication.communication_type,
            content=communication.content,
            timestamp=datetime.now(),
            responses=[],
            status="sent"
        )
    except Exception as e:
        logger.error(f"Error sending communication: {e}")
        raise HTTPException(status_code=500, detail="Failed to send communication")

@app.get("/wisdom", response_model=WisdomAnalysis, tags=["Wisdom of the Crowd"])
async def analyze_wisdom():
    """
    Analyze collective responses for Wisdom of the Crowd insights.
    
    Detects patterns, hesitation, confidence levels, and provides CEO recommendations
    based on aggregated employee responses.
    """
    if not simulation_engine:
        raise HTTPException(status_code=503, detail="Simulation engine not initialized")
    
    try:
        # Mock wisdom analysis
        return WisdomAnalysis(
            consensus_level=0.75,
            detected_conflicts=["Growth vs. Profitability", "Innovation vs. Stability"],
            hesitation_indicators=["Delayed responses from Engineering", "Seeking clarification from Sales"],
            confidence_metrics={"Technology": 0.8, "Sales": 0.6, "Marketing": 0.9},
            ceo_recommendations=[
                "Consider phased approach to market expansion",
                "Address Engineering concerns about technical debt",
                "Align Sales and Marketing on customer acquisition strategy"
            ]
        )
    except Exception as e:
        logger.error(f"Error analyzing wisdom: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze wisdom")

@app.get("/status", response_model=SimulationStatus, tags=["Simulation"])
async def get_simulation_status():
    """
    Get current simulation status and metrics.
    
    Returns information about the running simulation including time,
    employee count, and communication activity.
    """
    if not simulation_engine:
        raise HTTPException(status_code=503, detail="Simulation engine not initialized")
    
    try:
        # Get real status from simulation engine
        state = simulation_engine.state
        
        return SimulationStatus(
            organization_id=state.organization_id,
            is_running=state.is_running,
            current_time=state.simulation_time or datetime.now(),
            acceleration_factor=state.time_acceleration_factor,
            total_employees=len(state.agents),
            active_communications=len(getattr(state, 'priority_communications', [])),
            pending_responses=0  # Simplified for now
        )
    except Exception as e:
        logger.error(f"Error getting simulation status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get simulation status")

@app.post("/simulation/start", tags=["Simulation"])
async def start_simulation(org_id: str, parameters: Optional[SimulationParameters] = None):
    """
    Start a new simulation with the specified organization.
    
    Args:
        org_id: Organization ID to load
        parameters: Optional simulation parameters to override defaults
    
    Returns confirmation that simulation has started.
    """
    global simulation_engine, current_organization
    
    try:
        # Load organization configuration
        config = config_loader.load_organization(org_id)
        employees_list = config_loader.load_employees_from_config(config)
        employees_data = convert_employee_list_to_dict(employees_list)
        
        # Use provided parameters or defaults
        sim_params = parameters.dict() if parameters else config.get('simulation_parameters', {})
        
        # Create and start simulation engine
        simulation_engine = SimulationEngine(org_id, sim_params.get('time_acceleration_factor', 144))
        await simulation_engine.start_simulation({"employees": employees_data})
        
        current_organization = org_id
        
        return {
            "message": f"Simulation started for {org_id}",
            "organization": org_id,
            "employee_count": len(employees_data),
            "parameters": sim_params
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Organization {org_id} not found")
    except Exception as e:
        logger.error(f"Error starting simulation: {e}")
        raise HTTPException(status_code=500, detail="Failed to start simulation")

@app.post("/simulation/stop", tags=["Simulation"])
async def stop_simulation():
    """
    Stop the current simulation.
    
    Returns confirmation that simulation has stopped.
    """
    global simulation_engine, current_organization
    
    if not simulation_engine:
        raise HTTPException(status_code=400, detail="No simulation running")
    
    try:
        await simulation_engine.stop_simulation()
        simulation_engine = None
        current_organization = None
        
        return {"message": "Simulation stopped successfully"}
    except Exception as e:
        logger.error(f"Error stopping simulation: {e}")
        raise HTTPException(status_code=500, detail="Failed to stop simulation")


# ==========================================
# LIVING TWIN SPECIFIC ENDPOINTS
# ==========================================

@app.get("/organizational-twin", response_model=OrganizationalTwinResponse, tags=["Organizational Twin"])
async def get_organizational_twin():
    """
    Get the current Organizational Twin status and morning queue.
    
    Returns the main AI entity with its morning queue (max 5 items) and conversation hooks.
    This is the primary interface for CEO morning ritual interactions.
    """
    try:
        # Mock response for demonstration
        mock_intelligence_agents = [
            IntelligenceAgentResponse(
                id="market_001",
                tag="M07",
                agent_type=IntelligenceAgentType.MARKET,
                title="TechFlow Acquisition by Salesforce",
                description="Competitor acquisition impacts our market position",
                content="TechFlow acquired by Salesforce for $2.1B creates competitive pressure in our core CRM integration space. Recommended strategic response needed.",
                priority=StrategicPriority.HIGH,
                confidence_level=0.9,
                viewed_by_ceo=False,
                ceo_action_taken=None,
                created_at=datetime.now()
            ),
            IntelligenceAgentResponse(
                id="catchball_001", 
                tag="C12",
                agent_type=IntelligenceAgentType.CATCHBALL,
                title="Nordic Expansion Resource Constraints",
                description="Sarah Chen escalated resource needs via catchball",
                content="VP Sales Sarah Chen reports Nordic expansion needs additional headcount and budget allocation. Seeking strategic guidance on prioritization.",
                priority=StrategicPriority.MEDIUM,
                confidence_level=0.8,
                viewed_by_ceo=False,
                ceo_action_taken=None,
                created_at=datetime.now()
            )
        ]
        
        return OrganizationalTwinResponse(
            id="org_twin_001",
            organization_id="acme_corp",
            morning_queue=mock_intelligence_agents,
            current_conversation_hooks=["TechFlow acquisition", "Nordic expansion", "Resource constraints"],
            last_ceo_interaction=None,
            daily_interaction_count=0,
            average_interaction_duration_minutes=5.0
        )
    except Exception as e:
        logger.error(f"Error fetching organizational twin: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch organizational twin")


@app.get("/intelligence-agents", response_model=List[IntelligenceAgentResponse], tags=["Intelligence Agents"])
async def get_intelligence_agents(
    agent_type: Optional[IntelligenceAgentType] = None,
    viewed_by_ceo: Optional[bool] = None,
    limit: int = Field(default=10, le=50)
):
    """
    Get intelligence agents (M##, C##, W##) with optional filtering.
    
    Args:
        agent_type: Filter by agent type (MARKET, CATCHBALL, WISDOM)
        viewed_by_ceo: Filter by whether CEO has viewed
        limit: Maximum number of agents to return
    
    Returns list of intelligence agents with their strategic insights.
    """
    try:
        # Mock intelligence agents for demonstration
        mock_agents = [
            IntelligenceAgentResponse(
                id="market_001", tag="M07", agent_type=IntelligenceAgentType.MARKET,
                title="TechFlow Acquisition", description="Competitive threat analysis",
                content="Detailed market analysis...", priority=StrategicPriority.HIGH,
                confidence_level=0.9, viewed_by_ceo=False, ceo_action_taken=None,
                created_at=datetime.now()
            ),
            IntelligenceAgentResponse(
                id="wisdom_001", tag="W03", agent_type=IntelligenceAgentType.WISDOM,
                title="85% Teams Report Resource Concerns", description="Collective wisdom pattern",
                content="Cross-department analysis shows resource constraints affecting Q3 goals...",
                priority=StrategicPriority.MEDIUM, confidence_level=0.7,
                viewed_by_ceo=False, ceo_action_taken=None, created_at=datetime.now()
            )
        ]
        
        # Apply filters
        filtered_agents = mock_agents
        if agent_type:
            filtered_agents = [a for a in filtered_agents if a.agent_type == agent_type]
        if viewed_by_ceo is not None:
            filtered_agents = [a for a in filtered_agents if a.viewed_by_ceo == viewed_by_ceo]
            
        return filtered_agents[:limit]
    except Exception as e:
        logger.error(f"Error fetching intelligence agents: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch intelligence agents")


@app.post("/intelligence-agents/{agent_id}/ceo-action", tags=["Intelligence Agents"])
async def record_ceo_action(
    agent_id: str,
    action: str = Field(description="CEO action: commented, targeted, requested_info"),
    notes: Optional[str] = Field(None, description="CEO notes or comments"),
    target_members: Optional[List[str]] = Field(None, description="If targeted, list of member IDs")
):
    """
    Record CEO action on an intelligence agent.
    
    This endpoint captures CEO interactions with intelligence agents for the 5-5-5 morning ritual.
    Actions include commenting, targeting specific people, or requesting more information.
    """
    try:
        # In real implementation, this would update the intelligence agent record
        result = {
            "agent_id": agent_id,
            "action_recorded": action,
            "notes": notes,
            "target_members": target_members or [],
            "timestamp": datetime.now(),
            "message": f"CEO action '{action}' recorded for intelligence agent {agent_id}"
        }
        
        if action == "targeted" and target_members:
            result["followup"] = f"Strategic communication will be sent to {len(target_members)} organizational members"
        elif action == "requested_info":
            result["followup"] = "Additional intelligence gathering initiated"
            
        return result
    except Exception as e:
        logger.error(f"Error recording CEO action: {e}")
        raise HTTPException(status_code=500, detail="Failed to record CEO action")


@app.get("/morning-queue", response_model=List[IntelligenceAgentResponse], tags=["CEO Morning Ritual"])
async def get_morning_queue():
    """
    Get the CEO morning queue - prioritized strategic intelligence for daily 5-minute ritual.
    
    Returns maximum 5 items following the 5-5-5 rule:
    - 5 minutes interaction time
    - 5 strategic items maximum  
    - 5 conversation hooks to capture decisions
    """
    try:
        # Mock morning queue with Truth/Gossip intelligence showcase
        mock_queue = [
            IntelligenceAgentResponse(
                id="truth_004", tag="T04", agent_type=IntelligenceAgentType.TRUTH,
                title="Q3 Revenue Missed Target by 8%",
                description="Verified truth from financial systems",
                content="Q3 revenue came in at $4.2M vs $4.57M target (8.1% miss). Confirmed across multiple financial systems. Immediate strategic response required for Q4 recovery.",
                priority=StrategicPriority.HIGH, confidence_level=1.0,
                viewed_by_ceo=False, ceo_action_taken=None, created_at=datetime.now()
            ),
            IntelligenceAgentResponse(
                id="gossip_023", tag="G23", agent_type=IntelligenceAgentType.GOSSIP,
                title="Sales Team Confidence Dropping on Q4 Targets",
                description="4 similar reports, confidence 0.7 - correlates with T04",
                content="Anonymous reports from Sales, Marketing, and Customer Success expressing concerns about Q4 targets being 'unrealistic given market conditions'. Pattern suggests broader confidence issue.",
                priority=StrategicPriority.MEDIUM, confidence_level=0.7,
                viewed_by_ceo=False, ceo_action_taken=None, created_at=datetime.now()
            ),
            IntelligenceAgentResponse(
                id="market_007", tag="M07", agent_type=IntelligenceAgentType.MARKET,
                title="TechFlow Acquisition Creates Competitive Pressure",
                description="Salesforce $2.1B acquisition impacts our market position",
                content="TechFlow's acquisition by Salesforce strengthens their CRM integration offerings, directly competing with our strategic initiatives. Market analysis suggests 15-20% competitive pressure increase.",
                priority=StrategicPriority.HIGH, confidence_level=0.9,
                viewed_by_ceo=False, ceo_action_taken=None, created_at=datetime.now()
            ),
            IntelligenceAgentResponse(
                id="wisdom_003", tag="W03", agent_type=IntelligenceAgentType.WISDOM,
                title="85% Teams Report Q3 Feasibility Concerns",
                description="Wisdom validates gossip G23 - broader pattern confirmed",
                content="Cross-departmental analysis confirms resource constraints affecting goal achievement. This wisdom pattern strongly correlates with gossip G23, suggesting systemic confidence issues.",
                priority=StrategicPriority.MEDIUM, confidence_level=0.8,
                viewed_by_ceo=False, ceo_action_taken=None, created_at=datetime.now()
            ),
            IntelligenceAgentResponse(
                id="catchball_012", tag="C12", agent_type=IntelligenceAgentType.CATCHBALL,
                title="Nordic Expansion Resource Discussion",
                description="Sarah Chen initiated strategic alignment catchball",
                content="VP Sales Sarah Chen requests strategic guidance on Nordic expansion resource allocation in light of Q3 performance and Q4 concerns.",
                priority=StrategicPriority.MEDIUM, confidence_level=0.8,
                viewed_by_ceo=False, ceo_action_taken=None, created_at=datetime.now()
            )
        ]
        
        return mock_queue
    except Exception as e:
        logger.error(f"Error fetching morning queue: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch morning queue")


@app.post("/gossip/{gossip_id}/validate", tags=["Truth & Gossip Intelligence"])
async def request_gossip_validation(
    gossip_id: str,
    validation_method: str = Field(description="Method: catchball, survey, metric_check, direct_inquiry"),
    target_departments: Optional[List[str]] = Field(None, description="Specific departments to validate with"),
    urgency: str = Field(default="medium", description="Validation urgency: low, medium, high")
):
    """
    Request validation of a gossip pattern to potentially promote it to verified truth.
    
    This is a key part of the Truth/Gossip intelligence pipeline - when gossip reaches
    certain thresholds or strategic relevance, the CEO can initiate validation.
    """
    try:
        result = {
            "gossip_id": gossip_id,
            "validation_initiated": True,
            "method": validation_method,
            "target_departments": target_departments or [],
            "urgency": urgency,
            "estimated_completion": "2-5 business days",
            "timestamp": datetime.now()
        }
        
        if validation_method == "catchball":
            result["action"] = f"Catchball communications will be sent to {len(target_departments or [])} departments"
            result["expected_outcome"] = "Strategic alignment discussion with department heads"
        elif validation_method == "survey":
            result["action"] = "Anonymous survey will be distributed to relevant organizational members"
            result["expected_outcome"] = "Quantified sentiment and concern validation"
        elif validation_method == "metric_check":
            result["action"] = "System metrics and KPIs will be analyzed for correlation"
            result["expected_outcome"] = "Data-driven validation of gossip patterns"
        elif validation_method == "direct_inquiry":
            result["action"] = "Direct conversations will be initiated with key stakeholders"
            result["expected_outcome"] = "Immediate clarification and resolution path"
            
        # In real system, this would trigger the validation workflow
        result["next_steps"] = [
            "Validation workflow initiated",
            "Progress updates in daily morning queue",
            "Results will appear as Truth agent if validated",
            "CEO will be notified of validation outcome"
        ]
        
        return result
    except Exception as e:
        logger.error(f"Error requesting gossip validation: {e}")
        raise HTTPException(status_code=500, detail="Failed to initiate gossip validation")


@app.get("/truth-gossip-correlation", tags=["Truth & Gossip Intelligence"])
async def get_truth_gossip_correlations():
    """
    Get correlations between Truth and Gossip intelligence for strategic insights.
    
    This endpoint shows how the Living Twin connects verified facts with organizational
    sentiment to provide deeper strategic understanding.
    """
    try:
        correlations = [
            {
                "truth_id": "truth_004",
                "truth_title": "Q3 Revenue Missed Target by 8%",
                "correlated_gossip": [
                    {
                        "gossip_id": "gossip_023",
                        "gossip_title": "Sales team confidence dropping",
                        "correlation_strength": 0.85,
                        "correlation_type": "validates_truth"
                    }
                ],
                "strategic_insight": "Revenue miss correlates with grassroots confidence issues - suggests systemic rather than isolated problem",
                "recommended_action": "Address confidence through strategic communication and Q4 plan adjustment"
            },
            {
                "truth_id": "truth_011", 
                "truth_title": "Employee satisfaction scores up 12%",
                "correlated_gossip": [
                    {
                        "gossip_id": "gossip_017",
                        "gossip_title": "People worried about job security",
                        "correlation_strength": -0.7,
                        "correlation_type": "contradicts_gossip"
                    }
                ],
                "strategic_insight": "Positive satisfaction metrics conflict with security concerns - may indicate pockets of anxiety despite overall improvement",
                "recommended_action": "Investigate specific departments or roles where security concerns persist"
            }
        ]
        
        return {
            "correlations": correlations,
            "analysis_summary": "Truth/Gossip correlation analysis reveals 2 significant patterns requiring CEO attention",
            "strategic_recommendations": [
                "Use gossip validation to understand root causes behind verified truths",
                "Address contradictions between official metrics and informal sentiment",
                "Leverage correlations for proactive strategic communications"
            ]
        }
    except Exception as e:
        logger.error(f"Error fetching truth-gossip correlations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch correlations")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

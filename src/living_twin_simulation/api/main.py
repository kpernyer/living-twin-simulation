"""
Living Twin Simulation API

FastAPI application with OpenAPI/Swagger documentation and Pydantic models
for type-safe API interactions.
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
    SimulationAgent, CommunicationType, ResponseType
)
from ..config.loader import ConfigurationLoader, create_agent_from_config, convert_employee_list_to_dict

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app with OpenAPI metadata
app = FastAPI(
    title="Living Twin Simulation API",
    description="""
    Interactive API for the Living Twin Simulation Engine.
    
    This API provides endpoints for:
    - Managing organizational simulations
    - Sending strategic communications
    - Analyzing collective responses (Wisdom of the Crowd)
    - Resolving priority conflicts through Catchball Communication
    
    ## Strategic Alignment Focus
    
    The simulation focuses on strategic alignment rather than operational decisions:
    - Business goals and market priorities
    - Employee satisfaction and retention
    - Department-specific strategic interpretations
    - Priority conflict resolution
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
class EmployeeResponse(BaseModel):
    id: str
    name: str
    role: str
    department: str
    level: str
    personality_traits: List[str]
    workload: float = Field(ge=0.0, le=1.0)
    satisfaction: float = Field(ge=0.0, le=1.0)
    
    class Config:
        from_attributes = True

class CommunicationRequest(BaseModel):
    sender_id: str
    recipient_ids: List[str]
    communication_type: CommunicationType
    content: str
    priority: str = Field(default="medium", pattern="^(low|medium|high|critical)$")
    strategic_goal: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "sender_id": "ceo_001",
                "recipient_ids": ["vp_tech_001", "vp_sales_001"],
                "communication_type": "NUDGE",
                "content": "Focus on organic growth targets for Q4",
                "priority": "high",
                "strategic_goal": "Market expansion"
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

@app.get("/employees", response_model=List[EmployeeResponse], tags=["Employees"])
async def get_employees(organization_id: Optional[str] = None):
    """
    Get all employees in the simulation.
    
    Args:
        organization_id: Optional organization ID to filter employees. If not provided, returns employees from current simulation.
    
    Returns a list of all employees with their roles, departments, and current status.
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

@app.get("/organizations/{org_id}/employees", response_model=List[EmployeeResponse], tags=["Employees"])
async def get_employees_by_organization(org_id: str):
    """
    Get all employees for a specific organization.
    
    Args:
        org_id: Organization ID (e.g., "acme_corp")
    
    Returns a list of all employees in the specified organization.
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

@app.get("/employees/{department}", response_model=List[EmployeeResponse], tags=["Employees"])
async def get_employees_by_department(department: str):
    """
    Get employees by department.
    
    Args:
        department: Department name (e.g., "Technology", "Sales", "Marketing")
    
    Returns filtered list of employees in the specified department.
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

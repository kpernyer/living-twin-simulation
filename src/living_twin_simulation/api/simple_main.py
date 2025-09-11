"""
Simple Living Twin API - Minimal working version
Provides basic endpoints needed by the web interface
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from pathlib import Path
from datetime import datetime

# Create FastAPI app
app = FastAPI(
    title="Living Twin Simulation API",
    description="Organizational behavior simulation engine",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class Employee(BaseModel):
    id: str
    name: str
    role: str
    department: str
    email: Optional[str] = None
    seniority_level: Optional[str] = None

class Organization(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    size: Optional[str] = "Medium"
    employee_count: Optional[int] = 8
    strategic_goals: Optional[list] = []

class HealthResponse(BaseModel):
    status: str
    message: str

class SimulationStatus(BaseModel):
    is_running: bool
    organization_id: Optional[str] = None
    status: str
    current_step: Optional[int] = None
    total_steps: Optional[int] = None

class SimulationStartRequest(BaseModel):
    org_id: str
    parameters: dict

class SimulationStartResponse(BaseModel):
    status: str
    organization: str
    simulation_id: str

# Sample data
SAMPLE_EMPLOYEES = [
    Employee(
        id="ceo-001",
        name="Sarah Chen", 
        role="CEO",
        department="Executive",
        email="sarah.chen@company.com",
        seniority_level="C-Level"
    ),
    Employee(
        id="cfo-001",
        name="Michael Rodriguez",
        role="CFO", 
        department="Finance",
        email="michael.rodriguez@company.com",
        seniority_level="C-Level"
    ),
    Employee(
        id="cto-001",
        name="Emily Johnson",
        role="CTO",
        department="Engineering",
        email="emily.johnson@company.com", 
        seniority_level="C-Level"
    ),
    Employee(
        id="vp-sales-001",
        name="David Kim",
        role="VP Sales",
        department="Sales",
        email="david.kim@company.com",
        seniority_level="VP"
    ),
    Employee(
        id="vp-marketing-001", 
        name="Lisa Thompson",
        role="VP Marketing",
        department="Marketing",
        email="lisa.thompson@company.com",
        seniority_level="VP"
    ),
    Employee(
        id="dir-eng-001",
        name="James Wilson",
        role="Engineering Director",
        department="Engineering", 
        email="james.wilson@company.com",
        seniority_level="Director"
    ),
    Employee(
        id="mgr-sales-001",
        name="Amanda Brown",
        role="Sales Manager",
        department="Sales",
        email="amanda.brown@company.com",
        seniority_level="Manager"
    ),
    Employee(
        id="mgr-hr-001",
        name="Robert Davis",
        role="HR Manager", 
        department="HR",
        email="robert.davis@company.com",
        seniority_level="Manager"
    )
]

SAMPLE_ORGANIZATION = Organization(
    id="org-001",
    name="TechCorp Industries",
    description="Leading technology and innovation company",
    size="Large",
    employee_count=8,
    strategic_goals=[
        {
            "id": "goal-001",
            "title": "Market Leadership",
            "description": "Become the leading technology provider in our sector",
            "target_completion": "2024-12-31",
            "success_metrics": ["Market share increase by 15%", "Customer satisfaction > 90%"]
        },
        {
            "id": "goal-002", 
            "title": "Innovation Excellence",
            "description": "Drive innovation in AI and automation solutions",
            "target_completion": "2024-10-31",
            "success_metrics": ["Launch 3 new products", "Patent applications filed: 10+"]
        }
    ]
)

def load_employees_from_file():
    """Try to load employees from example file, fallback to sample data"""
    try:
        example_file = Path("/app/example_employees.json")
        if example_file.exists():
            with open(example_file, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return [Employee(**emp) for emp in data if isinstance(emp, dict)]
    except Exception:
        pass
    return SAMPLE_EMPLOYEES

# API Routes
@app.get("/", response_model=dict)
async def root():
    """Root endpoint - basic API info"""
    return {
        "message": "Living Twin Simulation API",
        "version": "0.1.0",
        "status": "running"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        message="Living Twin Simulation API is running"
    )

@app.get("/employees", response_model=List[Employee])
async def get_employees():
    """Get all employees"""
    try:
        employees = load_employees_from_file()
        return employees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load employees: {str(e)}")

@app.get("/organizations/{org_id}/employees", response_model=List[Employee]) 
async def get_organization_employees(org_id: str):
    """Get employees for a specific organization"""
    try:
        employees = load_employees_from_file()
        # For now, return all employees regardless of org_id
        return employees
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load employees: {str(e)}")

@app.get("/organizations/{org_id}", response_model=Organization)
async def get_organization(org_id: str):
    """Get organization details"""
    # For now, return the sample organization
    return SAMPLE_ORGANIZATION

@app.get("/organizations", response_model=List[str])
async def get_organizations():
    """Get all organization IDs"""
    return [SAMPLE_ORGANIZATION.id]

@app.get("/organizations/list", response_model=List[Organization])
async def get_organizations_list():
    """Get all organizations with full details"""
    return [SAMPLE_ORGANIZATION]

@app.get("/status", response_model=SimulationStatus)
async def get_simulation_status():
    """Get simulation status"""
    return SimulationStatus(
        is_running=False,  # For now, always return not running
        organization_id=SAMPLE_ORGANIZATION.id,
        status="ready",
        current_step=0,
        total_steps=100
    )

@app.post("/simulation/start", response_model=SimulationStartResponse)
async def start_simulation(request: SimulationStartRequest):
    """Start a simulation"""
    try:
        return SimulationStartResponse(
            status="started",
            organization=SAMPLE_ORGANIZATION.name,
            simulation_id=f"sim-{request.org_id}-001"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start simulation: {str(e)}")

@app.post("/simulation/stop")
async def stop_simulation():
    """Stop the current simulation"""
    return {"status": "stopped", "message": "Simulation stopped successfully"}

@app.get("/test")
async def test_endpoint():
    """Simple test endpoint for debugging"""
    return {"message": "API is working", "timestamp": str(datetime.now())}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
"""
Configuration loader for organization data and simulation parameters.
"""

import yaml
import os
from typing import Dict, Any, List
from pathlib import Path

from ..domain.models import SimulationAgent, PersonalityProfile, ProfessionalProfile


class ConfigurationLoader:
    """Loads organization configurations from YAML files."""
    
    def __init__(self, config_dir: str = "config/organizations"):
        self.config_dir = Path(config_dir)
    
    def load_organization(self, org_id: str) -> Dict[str, Any]:
        """Load organization configuration from YAML file."""
        config_file = self.config_dir / f"{org_id}.yaml"
        
        if not config_file.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_file}")
        
        with open(config_file, 'r') as f:
            config = yaml.safe_load(f)
        
        return config
    
    def get_available_organizations(self) -> List[str]:
        """Get list of available organization configurations."""
        orgs = []
        for file in self.config_dir.glob("*.yaml"):
            orgs.append(file.stem)
        return orgs
    
    def load_employees_from_config(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract employee data from configuration."""
        return config.get('employees', [])
    
    def load_simulation_parameters(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Extract simulation parameters from configuration."""
        return config.get('simulation_parameters', {})
    
    def load_strategic_goals(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract strategic goals from configuration."""
        return config.get('strategic_goals', [])


def create_agent_from_config(employee_data: Dict[str, Any]) -> SimulationAgent:
    """Create a SimulationAgent from configuration data."""
    
    # Create personality profile
    personality_traits = employee_data.get('personality_traits', {})
    personality = PersonalityProfile(traits=personality_traits)
    
    # Create professional profile
    prof_data = employee_data.get('professional_profile', {})
    professional = ProfessionalProfile(
        department=prof_data.get('department', ''),
        role=prof_data.get('role', ''),
        seniority_level=prof_data.get('seniority_level', 1),
        expertise_areas=prof_data.get('expertise_areas', []),
        direct_reports=prof_data.get('direct_reports', []),
        manager_id=prof_data.get('manager_id'),
        workload_capacity=prof_data.get('workload_capacity', 1.0),
        current_workload=prof_data.get('current_workload', 0.5)
    )
    
    # Create agent
    agent = SimulationAgent(
        id=employee_data['id'],
        email=employee_data.get('email', ''),
        name=employee_data.get('name', ''),
        personality=personality,
        professional=professional
    )
    
    return agent

def convert_employee_list_to_dict(employees: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Convert list of employees to dictionary format expected by AgentFactory."""
    employee_dict = {}
    
    for employee in employees:
        email = employee.get('email', f"{employee['id']}@company.com")
        employee_dict[email] = {
            'id': employee['id'],
            'name': employee['name'],
            'role': employee['role'],
            'department': employee['department'],
            'level': employee['level'],
            'personality_traits': employee.get('personality_traits', {}),
            'professional_profile': employee.get('professional_profile', {}),
            'email': email,
            'organization_id': 'acme_corp'  # Add organization_id
        }
    
    return employee_dict

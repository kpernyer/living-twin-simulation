import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  description: string;
  employee_count: number;
  strategic_goals: any[];
}

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  level: string;
  personality_traits: string[];
  workload: number;
  satisfaction: number;
}

interface SimulationContextType {
  organization: Organization | null;
  actingAs: Employee | null;
  employees: Employee[];
  isSimulationRunning: boolean;
  setOrganization: (org: Organization | null) => void;
  setActingAs: (employee: Employee | null) => void;
  setEmployees: (employees: Employee[]) => void;
  setSimulationRunning: (running: boolean) => void;
  switchRole: (employee: Employee) => void;
  loadContext: () => Promise<void>;
  clearContext: () => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
};

interface SimulationProviderProps {
  children: ReactNode;
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({ children }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [actingAs, setActingAs] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  // Load context from localStorage on mount
  useEffect(() => {
    try {
      loadStoredContext();
    } catch (error) {
      console.error('Error loading stored context:', error);
    }
  }, []);

  const loadStoredContext = () => {
    try {
      console.log('Loading stored context...');
      const storedOrg = localStorage.getItem('simulation_organization');
      const storedEmployee = localStorage.getItem('simulation_acting_as');
      const storedEmployees = localStorage.getItem('simulation_employees');
      const storedRunning = localStorage.getItem('simulation_running');

      console.log('Stored data:', { storedOrg, storedEmployee, storedEmployees, storedRunning });

      if (storedOrg) {
        const parsedOrg = JSON.parse(storedOrg);
        console.log('Parsed organization:', parsedOrg);
        setOrganization(parsedOrg);
      }
      if (storedEmployee) {
        const parsedEmployee = JSON.parse(storedEmployee);
        console.log('Parsed employee:', parsedEmployee);
        setActingAs(parsedEmployee);
      }
      if (storedEmployees) {
        const parsedEmployees = JSON.parse(storedEmployees);
        console.log('Parsed employees:', parsedEmployees);
        setEmployees(parsedEmployees);
      }
      if (storedRunning) {
        const parsedRunning = JSON.parse(storedRunning);
        console.log('Parsed running:', parsedRunning);
        setIsSimulationRunning(parsedRunning);
      }
    } catch (error) {
      console.error('Error loading stored context:', error);
    }
  };

  const saveContextToStorage = (org: Organization | null, employee: Employee | null, employeesList: Employee[], running: boolean) => {
    try {
      if (org) {
        localStorage.setItem('simulation_organization', JSON.stringify(org));
      } else {
        localStorage.removeItem('simulation_organization');
      }
      
      if (employee) {
        localStorage.setItem('simulation_acting_as', JSON.stringify(employee));
      } else {
        localStorage.removeItem('simulation_acting_as');
      }
      
      if (employeesList.length > 0) {
        localStorage.setItem('simulation_employees', JSON.stringify(employeesList));
      } else {
        localStorage.removeItem('simulation_employees');
      }
      
      localStorage.setItem('simulation_running', JSON.stringify(running));
    } catch (error) {
      console.error('Error saving context to storage:', error);
    }
  };

  const setOrganizationWithStorage = (org: Organization | null) => {
    console.log('Setting organization:', org);
    setOrganization(org);
    saveContextToStorage(org, actingAs, employees, isSimulationRunning);
  };

  const setActingAsWithStorage = (employee: Employee | null) => {
    console.log('Setting acting as:', employee);
    setActingAs(employee);
    saveContextToStorage(organization, employee, employees, isSimulationRunning);
  };

  const setEmployeesWithStorage = (employeesList: Employee[]) => {
    console.log('Setting employees:', employeesList);
    setEmployees(employeesList);
    saveContextToStorage(organization, actingAs, employeesList, isSimulationRunning);
  };

  const setSimulationRunningWithStorage = (running: boolean) => {
    setIsSimulationRunning(running);
    saveContextToStorage(organization, actingAs, employees, running);
  };

  const switchRole = (employee: Employee) => {
    setActingAsWithStorage(employee);
  };

  const loadContext = async () => {
    try {
      const response = await axios.get(`${API_BASE}/status`);
      const isRunning = response.data.is_running;
      setIsSimulationRunningWithStorage(isRunning);

      if (isRunning && response.data.organization_id) {
        // Load organization info
        const orgResponse = await axios.get(`${API_BASE}/organizations/${response.data.organization_id}`);
        const org = orgResponse.data;
        setOrganizationWithStorage(org);

        // Load employees and set CEO as default if no role is selected
        if (!actingAs) {
          const employeesResponse = await axios.get(`${API_BASE}/organizations/${response.data.organization_id}/employees`);
          const ceo = employeesResponse.data.find((emp: Employee) => emp.role.toLowerCase().includes('ceo'));
          if (ceo) {
            setActingAsWithStorage(ceo);
          }
        }
      }
    } catch (error) {
      console.error('Error loading context:', error);
    }
  };

  const clearContext = () => {
    setOrganizationWithStorage(null);
    setActingAsWithStorage(null);
    setEmployeesWithStorage([]);
    setIsSimulationRunningWithStorage(false);
  };

  const value: SimulationContextType = {
    organization,
    actingAs,
    employees,
    isSimulationRunning,
    setOrganization: setOrganizationWithStorage,
    setActingAs: setActingAsWithStorage,
    setEmployees: setEmployeesWithStorage,
    setSimulationRunning: setSimulationRunningWithStorage,
    switchRole,
    loadContext,
    clearContext,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

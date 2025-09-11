import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  BuildingOfficeIcon,
  UserIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useSimulationContext } from '../context/SimulationContext';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';
const OLLAMA_BASE = process.env.NEXT_PUBLIC_OLLAMA_URL || 'http://localhost:11434';

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

interface GeneratedEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  level: string;
  email: string;
  personality_traits: {
    risk_tolerance: number;
    authority_response: number;
    communication_style: number;
    change_adaptability: number;
    workload_sensitivity: number;
    collaboration_preference: number;
  };
  professional_profile: {
    department: string;
    role: string;
    seniority_level: number;
    expertise_areas: string[];
    direct_reports: string[];
    workload_capacity: number;
    current_workload: number;
  };
  workload: number;
  satisfaction: number;
}

interface GeneratedOrganization {
  organization: Organization;
  employees: GeneratedEmployee[];
  strategic_goals: any[];
  simulation_parameters: any;
}

export default function ContextSetup() {
  const {
    organization,
    actingAs,
    employees: contextEmployees,
    isSimulationRunning,
    setOrganization,
    setActingAs,
    setEmployees: setContextEmployees,
    setSimulationRunning
  } = useSimulationContext();

  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [orgInfo, setOrgInfo] = useState<Organization | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // AI Generation state
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOrg, setGeneratedOrg] = useState<GeneratedOrganization | null>(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        await loadOrganizations();
        await checkSimulationStatus();
        
        // Load existing context if available
        if (organization) {
          setSelectedOrg(organization.id);
          setOrgInfo(organization);
        }
        if (actingAs) {
          setSelectedEmployee(actingAs.id);
        }
      } catch (error) {
        console.error('Error initializing page:', error);
      }
    };

    initializePage();
  }, [organization, actingAs]);

  useEffect(() => {
    if (selectedOrg && selectedOrg !== 'generated') {
      loadOrganizationInfo(selectedOrg);
      loadEmployees(selectedOrg);
    }
  }, [selectedOrg]);

  useEffect(() => {
    if (selectedEmployee && employees.length > 0) {
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (employee) {
        setActingAs(employee);
      }
    }
  }, [selectedEmployee, employees, setActingAs]);

  const loadOrganizations = async () => {
    try {
      console.log('Loading organizations from:', `${API_BASE}/organizations`);
      const response = await axios.get<string[]>(`${API_BASE}/organizations`);
      console.log('Organizations loaded:', response.data);
      setOrganizations(response.data);
      toast.success(`Loaded ${response.data.length} organizations`);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    }
  };

  const loadOrganizationInfo = async (orgId: string) => {
    try {
      console.log('Loading organization info for:', orgId);
      
      // If it's a generated organization, we already have the data
      if (orgId === 'generated' && generatedOrg) {
        console.log('Using generated organization data');
        setOrgInfo(generatedOrg.organization);
        setOrganization(generatedOrg.organization);
        toast.success(`Loaded ${generatedOrg.organization.name}`);
        return;
      }
      
      // Otherwise, fetch from API
      const response = await axios.get<Organization>(`${API_BASE}/organizations/${orgId}`);
      console.log('Organization info:', response.data);
      setOrgInfo(response.data);
      setOrganization(response.data);
      toast.success(`Loaded ${response.data.name}`);
    } catch (error) {
      console.error('Error loading organization info:', error);
      toast.error('Failed to load organization info');
    }
  };

  const loadEmployees = async (orgId: string) => {
    try {
      console.log('Loading employees for:', orgId);
      
      // If it's a generated organization, we already have the data
      if (orgId === 'generated' && generatedOrg) {
        console.log('Using generated employees data');
        // Convert GeneratedEmployee to Employee format
        const convertedEmployees: Employee[] = generatedOrg.employees.map(emp => ({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          department: emp.department,
          level: emp.seniority_level,
          personality_traits: [
            'risk_tolerance',
            'authority_response', 
            'communication_style',
            'change_adaptability',
            'workload_sensitivity',
            'collaboration_preference'
          ],
          workload: emp.workload,
          satisfaction: emp.satisfaction
        }));
        setEmployees(convertedEmployees);
        setContextEmployees(convertedEmployees);
        toast.success(`Loaded ${convertedEmployees.length} employees`);
        return;
      }
      
      // Otherwise, fetch from API
      const response = await axios.get<Employee[]>(`${API_BASE}/organizations/${orgId}/employees`);
      console.log('Employees loaded:', response.data);
      setEmployees(response.data);
      setContextEmployees(response.data);
      toast.success(`Loaded ${response.data.length} employees`);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const checkSimulationStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE}/status`);
      setSimulationRunning(response.data.is_running);
    } catch (error) {
      // Simulation might not be running, which is fine
      setSimulationRunning(false);
    }
  };

  const generateOrganization = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description for the organization');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating organization with prompt:', aiPrompt);
      console.log('Using Ollama at:', OLLAMA_BASE);
      const enhancedPrompt = `Generate a complete organization configuration in YAML format based on this description: "${aiPrompt}"

Requirements:
- Depth: 3 levels (C-Level, VP/Director, Manager/Individual Contributors)
- Include realistic departments based on the industry
- Create 15-25 employees with diverse roles
- Include personality traits and professional profiles
- Add 3-5 strategic goals
- Include simulation parameters

IMPORTANT: Ensure all employees have complete data including:
- Unique IDs (emp_001, emp_002, etc.)
- Full names
- Roles and departments
- Email addresses
- Personality traits (all 6 values between 0.0 and 1.0)
- Professional profiles with expertise areas and direct reports
- Workload and satisfaction values

Format the response as a valid YAML object with this exact structure:

organization:
  id: "generated_org"
  name: "Company Name"
  industry: "Industry"
  size: "Medium"
  description: "Description"

employees:
  - id: "emp_001"
    name: "John Smith"
    role: "Chief Executive Officer"
    department: "Executive"
    level: "C-Level"
    email: "john.smith@company.com"
    personality_traits:
      risk_tolerance: 0.7
      authority_response: 0.9
      communication_style: 0.8
      change_adaptability: 0.8
      workload_sensitivity: 0.4
      collaboration_preference: 0.7
    professional_profile:
      department: "Executive"
      role: "Chief Executive Officer"
      seniority_level: 5
      expertise_areas: ["Leadership", "Strategy"]
      direct_reports: ["emp_002", "emp_003"]
      workload_capacity: 1.0
      current_workload: 0.8
    workload: 0.8
    satisfaction: 0.9

strategic_goals:
  - id: "sg_001"
    title: "Market Expansion"
    description: "Expand into new markets"
    priority: "high"
    target_date: "2025-12-31"
    success_metrics:
      - "Revenue growth of 25%"
      - "Market share increase"

simulation_parameters:
  time_acceleration_factor: 144
  communication_frequency: 0.4
  response_delay_range: [2, 48]
  stress_threshold: 0.7
  collaboration_bonus: 0.25

Make it realistic and ensure ALL fields are properly filled.`;

      const response = await axios.post(`${OLLAMA_BASE}/api/generate`, {
        model: 'llama3:latest',
        prompt: enhancedPrompt,
        stream: false
      });

      console.log('Ollama response:', response.data);
      const yamlContent = response.data.response;
      console.log('YAML content:', yamlContent);
      
      // Parse the YAML response
      const parsedOrg = parseGeneratedYAML(yamlContent);
      console.log('Parsed organization:', parsedOrg);
      
      if (parsedOrg) {
        setGeneratedOrg(parsedOrg);
        toast.success('Organization generated successfully!');
      } else {
        toast.error('Failed to parse generated organization');
      }
    } catch (error) {
      console.error('Error generating organization:', error);
      toast.error('Failed to generate organization. Make sure Ollama is running.');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseGeneratedYAML = (yamlContent: string): GeneratedOrganization | null => {
    try {
      // Clean up the response and extract YAML
      const yamlMatch = yamlContent.match(/```yaml\n([\s\S]*?)\n```/);
      const yamlText = yamlMatch ? yamlMatch[1] : yamlContent;
      
      console.log('Raw YAML content:', yamlText);
      
      // Simple YAML parsing with better structure handling
      const lines = yamlText.split('\n');
      const result: any = {};
      let currentSection = '';
      let currentEmployee: any = {};
      let employees: any[] = [];
      let strategicGoals: any[] = [];
      let simulationParams: any = {};
      let currentGoal: any = {};
      let inPersonalityTraits = false;
      let inProfessionalProfile = false;
      let inSuccessMetrics = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const indentLevel = line.length - line.trimStart().length;

        if (trimmed.startsWith('organization:')) {
          currentSection = 'organization';
          result.organization = {};
          inPersonalityTraits = false;
          inProfessionalProfile = false;
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('employees:')) {
          currentSection = 'employees';
          employees = [];
          inPersonalityTraits = false;
          inProfessionalProfile = false;
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('strategic_goals:')) {
          currentSection = 'strategic_goals';
          strategicGoals = [];
          inPersonalityTraits = false;
          inProfessionalProfile = false;
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('simulation_parameters:')) {
          currentSection = 'simulation_parameters';
          simulationParams = {};
          inPersonalityTraits = false;
          inProfessionalProfile = false;
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('- id:') && currentSection === 'employees') {
          // Save previous employee
          if (Object.keys(currentEmployee).length > 0) {
            employees.push(currentEmployee);
          }
          currentEmployee = { 
            id: trimmed.split(':')[1].trim().replace(/"/g, ''),
            personality_traits: {},
            professional_profile: {}
          };
          inPersonalityTraits = false;
          inProfessionalProfile = false;
        } else if (trimmed.startsWith('- id:') && currentSection === 'strategic_goals') {
          // Save previous goal
          if (Object.keys(currentGoal).length > 0) {
            strategicGoals.push(currentGoal);
          }
          currentGoal = { 
            id: trimmed.split(':')[1].trim().replace(/"/g, ''),
            success_metrics: []
          };
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('personality_traits:')) {
          inPersonalityTraits = true;
          inProfessionalProfile = false;
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('professional_profile:')) {
          inPersonalityTraits = false;
          inProfessionalProfile = true;
          inSuccessMetrics = false;
        } else if (trimmed.startsWith('success_metrics:')) {
          inPersonalityTraits = false;
          inProfessionalProfile = false;
          inSuccessMetrics = true;
        } else if (trimmed.includes(':')) {
          const [key, value] = trimmed.split(':', 2);
          const cleanKey = key.trim();
          const cleanValue = value.trim().replace(/"/g, '');

          if (currentSection === 'organization') {
            result.organization[cleanKey] = cleanValue;
          } else if (currentSection === 'employees' && currentEmployee) {
            if (inPersonalityTraits) {
              currentEmployee.personality_traits[cleanKey] = parseFloat(cleanValue) || 0.5;
            } else if (inProfessionalProfile) {
              if (cleanKey === 'expertise_areas' || cleanKey === 'direct_reports') {
                // Handle arrays
                const arrayMatch = value.match(/\[(.*)\]/);
                if (arrayMatch) {
                  currentEmployee.professional_profile[cleanKey] = arrayMatch[1].split(',').map(s => s.trim().replace(/"/g, ''));
                } else {
                  currentEmployee.professional_profile[cleanKey] = [];
                }
              } else if (cleanKey === 'seniority_level') {
                currentEmployee.professional_profile[cleanKey] = parseInt(cleanValue) || 1;
              } else if (cleanKey === 'workload_capacity' || cleanKey === 'current_workload') {
                currentEmployee.professional_profile[cleanKey] = parseFloat(cleanValue) || 0.5;
              } else {
                currentEmployee.professional_profile[cleanKey] = cleanValue;
              }
            } else {
              if (cleanKey === 'level') {
                currentEmployee.level = cleanValue;
              } else if (cleanKey === 'workload') {
                currentEmployee.workload = parseFloat(cleanValue) || 0.5;
              } else if (cleanKey === 'satisfaction') {
                currentEmployee.satisfaction = parseFloat(cleanValue) || 0.8;
              } else {
                currentEmployee[cleanKey] = cleanValue;
              }
            }
          } else if (currentSection === 'strategic_goals' && currentGoal) {
            if (inSuccessMetrics) {
              if (trimmed.startsWith('- ')) {
                const metric = trimmed.substring(2).replace(/"/g, '');
                currentGoal.success_metrics.push(metric);
              }
            } else {
              currentGoal[cleanKey] = cleanValue;
            }
          } else if (currentSection === 'simulation_parameters') {
            if (cleanKey === 'time_acceleration_factor') {
              simulationParams[cleanKey] = parseInt(cleanValue) || 144;
            } else if (cleanKey === 'communication_frequency' || cleanKey === 'stress_threshold' || cleanKey === 'collaboration_bonus') {
              simulationParams[cleanKey] = parseFloat(cleanValue) || 0.5;
            } else if (cleanKey === 'response_delay_range') {
              const arrayMatch = value.match(/\[(.*)\]/);
              if (arrayMatch) {
                simulationParams[cleanKey] = arrayMatch[1].split(',').map(s => parseInt(s.trim()) || 1);
              } else {
                simulationParams[cleanKey] = [1, 24];
              }
            }
          }
        }
      }

      // Add the last employee and goal
      if (Object.keys(currentEmployee).length > 0) {
        employees.push(currentEmployee);
      }
      if (Object.keys(currentGoal).length > 0) {
        strategicGoals.push(currentGoal);
      }

      // Validate and fix the generated organization
      const validatedOrg = validateAndFixOrganization(result.organization, employees, strategicGoals, simulationParams);
      
      console.log('Parsed organization:', validatedOrg);
      
      return validatedOrg;
    } catch (error) {
      console.error('Error parsing YAML:', error);
      return null;
    }
  };

  const validateAndFixOrganization = (
    org: any, 
    employees: any[], 
    goals: any[], 
    params: any
  ): GeneratedOrganization => {
    // Ensure organization has required fields
    const validatedOrg = {
      id: org.id || 'generated_org',
      name: org.name || 'Generated Organization',
      industry: org.industry || 'Technology',
      size: org.size || 'Medium',
      description: org.description || 'AI-generated organization',
      employee_count: employees.length,
      strategic_goals: goals
    };

    // Ensure employees have required fields
    const validatedEmployees = employees.map((emp, index) => ({
      id: emp.id || `emp_${String(index + 1).padStart(3, '0')}`,
      name: emp.name || `Employee ${index + 1}`,
      role: emp.role || 'Employee',
      department: emp.department || 'General',
      level: emp.seniority_level || 'Mid',
      email: emp.email || `${emp.name?.toLowerCase().replace(/\s+/g, '.')}@${validatedOrg.id}.com`,
      personality_traits: {
        risk_tolerance: emp.personality_traits?.risk_tolerance || 0.5,
        authority_response: emp.personality_traits?.authority_response || 0.7,
        communication_style: emp.personality_traits?.communication_style || 0.6,
        change_adaptability: emp.personality_traits?.change_adaptability || 0.7,
        workload_sensitivity: emp.personality_traits?.workload_sensitivity || 0.5,
        collaboration_preference: emp.personality_traits?.collaboration_preference || 0.7
      },
      professional_profile: {
        department: emp.professional_profile?.department || emp.department || 'General',
        role: emp.professional_profile?.role || emp.role || 'Employee',
        seniority_level: emp.professional_profile?.seniority_level || 1,
        expertise_areas: emp.professional_profile?.expertise_areas || ['General'],
        direct_reports: emp.professional_profile?.direct_reports || [],
        workload_capacity: emp.professional_profile?.workload_capacity || 0.8,
        current_workload: emp.professional_profile?.current_workload || 0.5
      },
      workload: emp.workload || 0.5,
      satisfaction: emp.satisfaction || 0.8
    }));

    // Ensure strategic goals have required fields
    const validatedGoals = goals.map((goal, index) => ({
      id: goal.id || `sg_${String(index + 1).padStart(3, '0')}`,
      title: goal.title || `Goal ${index + 1}`,
      description: goal.description || 'Strategic goal description',
      priority: goal.priority || 'medium',
      target_date: goal.target_date || '2025-12-31',
      success_metrics: goal.success_metrics || [`Metric ${index + 1}`]
    }));

    // Ensure simulation parameters have required fields
    const validatedParams = {
      time_acceleration_factor: params.time_acceleration_factor || 144,
      communication_frequency: params.communication_frequency || 0.4,
      response_delay_range: params.response_delay_range || [2, 48],
      stress_threshold: params.stress_threshold || 0.7,
      collaboration_bonus: params.collaboration_bonus || 0.25
    };

    return {
      organization: validatedOrg,
      employees: validatedEmployees,
      strategic_goals: validatedGoals,
      simulation_parameters: validatedParams
    };
  };

  const useGeneratedOrganization = () => {
    try {
      console.log('=== useGeneratedOrganization START ===');
      
      if (!generatedOrg) {
        console.error('No generated organization to use');
        toast.error('No generated organization available');
        return;
      }

      console.log('Generated org structure:', {
        hasOrg: !!generatedOrg.organization,
        hasEmployees: !!generatedOrg.employees,
        employeeCount: generatedOrg.employees?.length,
        orgName: generatedOrg.organization?.name
      });

      // Convert GeneratedEmployee to Employee format
      const convertedEmployees: Employee[] = generatedOrg.employees.map((emp, index) => {
        console.log(`Converting employee ${index}:`, emp.name, emp.role);
        return {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          department: emp.department,
          level: emp.seniority_level,
          personality_traits: [
            'risk_tolerance',
            'authority_response', 
            'communication_style',
            'change_adaptability',
            'workload_sensitivity',
            'collaboration_preference'
          ],
          workload: emp.workload,
          satisfaction: emp.satisfaction
        };
      });

      console.log('Converted employees:', convertedEmployees);

      // Set the generated organization as the current context
      // Override the ID to be 'generated' to avoid API calls
      const orgWithGeneratedId = {
        ...generatedOrg.organization,
        id: 'generated'
      };
      
      console.log('Setting organization info:', orgWithGeneratedId);
      setOrgInfo(orgWithGeneratedId);
      
      console.log('Setting organization in context');
      setOrganization(orgWithGeneratedId);
      
      console.log('Setting employees:', convertedEmployees.length);
      setEmployees(convertedEmployees);
      setContextEmployees(convertedEmployees);
      
      // Set the CEO as default acting role
      const ceo = convertedEmployees.find(emp => emp.role.toLowerCase().includes('ceo'));
      if (ceo) {
        console.log('Found CEO, setting as default:', ceo);
        setSelectedEmployee(ceo.id);
        setActingAs(ceo);
      } else {
        console.log('No CEO found, using first employee');
        if (convertedEmployees.length > 0) {
          const firstEmp = convertedEmployees[0];
          console.log('Setting first employee as default:', firstEmp);
          setSelectedEmployee(firstEmp.id);
          setActingAs(firstEmp);
        }
      }

      // Set selected org last to avoid triggering useEffect
      console.log('Setting selected org to "generated"');
      setSelectedOrg('generated');

      console.log('=== useGeneratedOrganization SUCCESS ===');
      toast.success(`Using generated organization: ${generatedOrg.organization.name}`);
      
    } catch (error) {
      console.error('=== useGeneratedOrganization ERROR ===', error);
      toast.error('Failed to use generated organization');
    }
  };

  const startSimulation = async () => {
    if (!selectedOrg) {
      toast.error('Please select an organization');
      return;
    }

    if (!selectedEmployee) {
      toast.error('Please select a role to act as');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/simulation/start`, {
        org_id: selectedOrg,
        parameters: {
          time_acceleration_factor: 144,
          communication_frequency: 0.4,
          response_delay_range: [2, 48],
          stress_threshold: 0.7,
          collaboration_bonus: 0.25
        }
      });
      
      toast.success(`Simulation started for ${response.data.organization}`);
      setSimulationRunning(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error: any) {
      console.error('Error starting simulation:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to start simulation';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: string | undefined) => {
    // Handle undefined level values safely - Updated for seniority_level fix
    if (!level) {
      return 'bg-gray-100 text-gray-800';
    }
    switch (level.toLowerCase()) {
      case 'c-level':
        return 'bg-purple-100 text-purple-800';
      case 'vp':
        return 'bg-blue-100 text-blue-800';
      case 'director':
        return 'bg-green-100 text-green-800';
      case 'manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'senior':
        return 'bg-orange-100 text-orange-800';
      case 'mid':
        return 'bg-indigo-100 text-indigo-800';
      case 'junior':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string | undefined) => {
    if (!department) {
      return 'bg-gray-100 text-gray-800';
    }
    switch (department.toLowerCase()) {
      case 'technology':
        return 'bg-blue-50 border-blue-200';
      case 'finance':
        return 'bg-green-50 border-green-200';
      case 'marketing':
        return 'bg-purple-50 border-purple-200';
      case 'human resources':
        return 'bg-pink-50 border-pink-200';
      case 'customer success':
        return 'bg-orange-50 border-orange-200';
      case 'executive':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 safari-fix">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simulation Context Setup
          </h1>
          <p className="text-lg text-gray-600">
            Select your organization and choose which role you'll be acting as
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organization Selection */}
          <div className="card safari-render">
            <div className="flex items-center gap-2 mb-6">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Organization</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Organization
                </label>
                <select
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                  className="input-field"
                >
                  <option value="">Choose an organization...</option>
                  {organizations.map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>

              {/* AI Organization Generator */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowAIGenerator(!showAIGenerator)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <SparklesIcon className="h-4 w-4" />
                  {showAIGenerator ? 'Hide AI Generator' : 'Generate Custom Organization'}
                </button>
                
                {showAIGenerator && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your organization
                      </label>
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Generate an organization around sports equipment with strong presence in France and Germany, and manufacturing in Turkey and China"
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    
                    <button
                      onClick={generateOrganization}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="h-4 w-4" />
                          Generate with AI
                        </>
                      )}
                    </button>

                                  {generatedOrg && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">
                    Generated: {generatedOrg.organization.name}
                  </h4>
                  <p className="text-sm text-green-700 mb-3">
                    {generatedOrg.organization.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-600">
                      {generatedOrg.employees.length} employees
                    </span>
                    <span className="text-green-600">
                      {generatedOrg.strategic_goals.length} strategic goals
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <button
                      onClick={useGeneratedOrganization}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      <PlusIcon className="h-3 w-3" />
                      Use This Organization
                    </button>
                    <button
                      onClick={() => {
                        console.log('Generated org debug:', generatedOrg);
                        console.log('Current employees state:', employees);
                        console.log('Current selectedOrg:', selectedOrg);
                      }}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Debug Info
                    </button>
                    <button
                      onClick={() => {
                        // Test with a simple predefined organization
                        const testOrg = {
                          id: 'test_org',
                          name: 'Test Organization',
                          industry: 'Technology',
                          size: 'Small',
                          description: 'Test organization for debugging',
                          employee_count: 3,
                          strategic_goals: []
                        };
                        const testEmployees = [
                          {
                            id: 'test_001',
                            name: 'Test CEO',
                            role: 'Chief Executive Officer',
                            department: 'Executive',
                            level: 'C-Level',
                            personality_traits: ['risk_tolerance', 'authority_response', 'communication_style', 'change_adaptability', 'workload_sensitivity', 'collaboration_preference'],
                            workload: 0.8,
                            satisfaction: 0.9
                          }
                        ];
                        setOrgInfo(testOrg);
                        setOrganization(testOrg);
                        setEmployees(testEmployees);
                        setSelectedOrg('test');
                        setSelectedEmployee('test_001');
                        setActingAs(testEmployees[0]);
                        toast.success('Test organization loaded');
                      }}
                      className="flex items-center gap-2 px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                    >
                      Load Test Org
                    </button>
                  </div>
                </div>
              )}
                  </div>
                )}
              </div>

              {orgInfo && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{orgInfo.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{orgInfo.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Industry:</span> {orgInfo.industry}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span> {orgInfo.size}
                    </div>
                    <div>
                      <span className="font-medium">Employees:</span> {orgInfo.employee_count}
                    </div>
                    <div>
                      <span className="font-medium">Goals:</span> {orgInfo.strategic_goals?.length || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div className="card safari-render">
            <div className="flex items-center gap-2 mb-6">
              <UserIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Acting As</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Role
                </label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="input-field"
                  disabled={!selectedOrg}
                >
                  <option value="">Choose a role...</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </option>
                  ))}
                </select>
              </div>

              {actingAs && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{actingAs.name}</h3>
                      <p className="text-sm text-gray-600">{actingAs.role}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(actingAs.seniority_level)}`}>
                      {actingAs.seniority_level}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg border ${getDepartmentColor(actingAs.department)}`}>
                    <span className="text-sm font-medium text-gray-700">{actingAs.department}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Workload:</span> {Math.round(actingAs.workload * 100)}%
                    </div>
                    <div>
                      <span className="font-medium">Satisfaction:</span> {Math.round(actingAs.satisfaction * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employee List Preview */}
        {selectedOrg && employees.length > 0 && (
          <div className="mt-8 card safari-render">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Roles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {employees.map(employee => (
                <div
                  key={employee.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedEmployee === employee.id 
                      ? 'border-blue-300 bg-blue-50' 
                      : getDepartmentColor(employee.department)
                  }`}
                  onClick={() => setSelectedEmployee(employee.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{employee.name}</h4>
                      <p className="text-xs text-gray-600">{employee.role}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(employee.seniority_level)}`}>
                      {employee.seniority_level}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{employee.department}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={startSimulation}
            disabled={isLoading || !selectedOrg || !selectedEmployee}
            className="btn-primary flex items-center gap-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Starting...
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5" />
                Start Simulation
              </>
            )}
          </button>

          {isSimulationRunning && (
            <a
              href="/"
              className="btn-secondary flex items-center gap-2 px-8 py-3 text-lg"
            >
              <ArrowRightIcon className="h-5 w-5" />
              Go to Dashboard
            </a>
          )}
        </div>

        {/* Context Summary */}
        {organization && actingAs && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-lg shadow-md">
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  {organization.name}
                </span>
              </div>
              <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Acting as {actingAs.name} ({actingAs.role})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

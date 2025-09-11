import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  BuildingOfficeIcon,
  UserIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { useSimulationContext } from '../context/SimulationContext';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

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

export default function ContextBar() {
  const {
    organization,
    actingAs,
    employees,
    isSimulationRunning,
    setOrganization,
    setActingAs,
    setSimulationRunning,
    switchRole,
    loadContext
  } = useSimulationContext();

  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ContextBar doesn't need to load employees - they're already in context
  // useEffect(() => {
  //   if (organization) {
  //     loadEmployees();
  //   }
  // }, [organization]);

  // const loadEmployees = async () => {
  //   if (!organization) return;
  //   
  //   try {
  //     const response = await axios.get<Employee[]>(`${API_BASE}/organizations/${organization.id}/employees`);
  //     setEmployees(response.data);
  //   } catch (error) {
  //     console.error('Error loading employees:', error);
  //   }
  // };

  const startSimulation = async () => {
    if (!organization || !actingAs) {
      toast.error('Please select organization and role first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/simulation/start`, {
        org_id: organization.id,
        parameters: {
          time_acceleration_factor: 144,
          communication_frequency: 0.4,
          response_delay_range: [2, 48],
          stress_threshold: 0.7,
          collaboration_bonus: 0.25
        }
      });
      
      setSimulationRunning(true);
      toast.success(`Simulation started for ${organization.name}`);
    } catch (error: any) {
      console.error('Error starting simulation:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to start simulation';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSimulation = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/simulation/stop`);
      setSimulationRunning(false);
      toast.success('Simulation stopped');
    } catch (error) {
      console.error('Error stopping simulation:', error);
      toast.error('Failed to stop simulation');
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: string | undefined) => {
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
      return 'bg-gray-50 border-gray-200';
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

  // Don't show context bar if no organization is selected
  if (!organization || !actingAs) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Organization and Role Info */}
          <div className="flex items-center gap-6">
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
                Acting as: {actingAs.name} ({actingAs.role})
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(actingAs.level)}`}>
                {actingAs.level}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSelector(!showRoleSelector)}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span>Switch Role</span>
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              
              {/* Role Selector Dropdown */}
              {showRoleSelector && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Select a different role:</h4>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {employees.map(employee => (
                        <button
                          key={employee.id}
                          onClick={() => {
                            switchRole(employee);
                            setShowRoleSelector(false);
                            toast.success(`Now acting as ${employee.name} (${employee.role})`);
                          }}
                          className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                            actingAs?.id === employee.id
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-xs text-gray-500">{employee.role}</div>
                              <div className="text-xs text-gray-400">{employee.department}</div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(employee.level)}`}>
                              {employee.level}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center gap-2">
              {isSimulationRunning ? (
                <button
                  onClick={stopSimulation}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                >
                  <StopIcon className="h-4 w-4" />
                  Stop
                </button>
              ) : (
                <button
                  onClick={startSimulation}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors disabled:opacity-50"
                >
                  <PlayIcon className="h-4 w-4" />
                  Start
                </button>
              )}
            </div>

            {/* Simulation Status */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
              {isSimulationRunning ? (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Running</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Stopped</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

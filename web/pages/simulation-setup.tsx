import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { 
  PlayIcon, 
  StopIcon, 
  CogIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

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

interface SimulationParameters {
  time_acceleration_factor: number;
  communication_frequency: number;
  response_delay_range: [number, number];
  stress_threshold: number;
  collaboration_bonus: number;
}

export default function SimulationSetup() {
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [orgInfo, setOrgInfo] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [parameters, setParameters] = useState<SimulationParameters>({
    time_acceleration_factor: 144,
    communication_frequency: 0.3,
    response_delay_range: [1, 24],
    stress_threshold: 0.8,
    collaboration_bonus: 0.2
  });

  useEffect(() => {
    loadOrganizations();
    checkSimulationStatus();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      loadOrganizationInfo(selectedOrg);
    }
  }, [selectedOrg]);

  const loadOrganizations = async () => {
    try {
      const response = await axios.get<string[]>(`${API_BASE}/organizations`);
      setOrganizations(response.data);
      if (response.data.length > 0) {
        setSelectedOrg(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast.error('Failed to load organizations');
    }
  };

  const loadOrganizationInfo = async (orgId: string) => {
    try {
      const response = await axios.get<Organization>(`${API_BASE}/organizations/${orgId}`);
      setOrgInfo(response.data);
    } catch (error) {
      console.error('Error loading organization info:', error);
      toast.error('Failed to load organization info');
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

  const startSimulation = async () => {
    if (!selectedOrg) {
      toast.error('Please select an organization');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/simulation/start`, {
        org_id: selectedOrg,
        parameters: parameters
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

  const stopSimulation = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_BASE}/simulation/stop`);
      toast.success('Simulation stopped successfully');
      setSimulationRunning(false);
    } catch (error: any) {
      console.error('Error stopping simulation:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to stop simulation';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 safari-fix">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simulation Setup
          </h1>
          <p className="text-lg text-gray-600">
            Configure and start your organizational behavior simulation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Organization Selection */}
          <div className="card safari-render">
            <div className="flex items-center gap-2 mb-6">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
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
                  {organizations.map(org => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
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
                      <span className="font-medium">Goals:</span> {orgInfo.strategic_goals.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Simulation Parameters */}
          <div className="card safari-render">
            <div className="flex items-center gap-2 mb-6">
              <CogIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Simulation Parameters</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Acceleration Factor
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="1440"
                    value={parameters.time_acceleration_factor}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      time_acceleration_factor: parseInt(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {parameters.time_acceleration_factor}x
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {parameters.time_acceleration_factor} real minutes = 1 simulation day
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Frequency
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={parameters.communication_frequency}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      communication_frequency: parseFloat(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {Math.round(parameters.communication_frequency * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Threshold
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={parameters.stress_threshold}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      stress_threshold: parseFloat(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {Math.round(parameters.stress_threshold * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collaboration Bonus
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.1"
                    value={parameters.collaboration_bonus}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      collaboration_bonus: parseFloat(e.target.value)
                    }))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    +{Math.round(parameters.collaboration_bonus * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          {!simulationRunning ? (
            <button
              onClick={startSimulation}
              disabled={isLoading || !selectedOrg}
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
          ) : (
            <button
              onClick={stopSimulation}
              disabled={isLoading}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Stopping...
                </>
              ) : (
                <>
                  <StopIcon className="h-5 w-5" />
                  Stop Simulation
                </>
              )}
            </button>
          )}

          {simulationRunning && (
            <a
              href="/"
              className="btn-secondary flex items-center gap-2 px-8 py-3 text-lg"
            >
              <ChartBarIcon className="h-5 w-5" />
              Go to Dashboard
            </a>
          )}
        </div>

        {/* Status Indicator */}
        {simulationRunning && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">
                Simulation is running
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

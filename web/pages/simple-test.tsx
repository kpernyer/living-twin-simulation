import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

export default function SimpleTest() {
  const [organizations, setOrganizations] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [orgInfo, setOrgInfo] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      console.log('Loading organizations...');
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
      const response = await axios.get(`${API_BASE}/organizations/${orgId}`);
      console.log('Organization info:', response.data);
      setOrgInfo(response.data);
      toast.success(`Loaded ${response.data.name}`);
    } catch (error) {
      console.error('Error loading organization info:', error);
      toast.error('Failed to load organization info');
    }
  };

  const loadEmployees = async (orgId: string) => {
    try {
      console.log('Loading employees for:', orgId);
      const response = await axios.get(`${API_BASE}/organizations/${orgId}/employees`);
      console.log('Employees loaded:', response.data);
      setEmployees(response.data);
      toast.success(`Loaded ${response.data.length} employees`);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const handleOrgSelect = async (orgId: string) => {
    setSelectedOrg(orgId);
    await loadOrganizationInfo(orgId);
    await loadEmployees(orgId);
  };

  const testSimulationStart = async () => {
    if (!selectedOrg) {
      toast.error('Please select an organization first');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting simulation for:', selectedOrg);
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
      console.log('Simulation started:', response.data);
      toast.success(`Simulation started for ${response.data.organization}`);
    } catch (error: any) {
      console.error('Error starting simulation:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to start simulation';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Simple Test Page</h1>
        
        <div className="space-y-6">
          {/* Organization Selection */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Organization Selection</h2>
            <select
              value={selectedOrg}
              onChange={(e) => handleOrgSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            >
              <option value="">Choose an organization...</option>
              {organizations.map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>

          {/* Organization Info */}
          {orgInfo && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Organization Info</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><strong>Name:</strong> {orgInfo.name}</div>
                <div><strong>Industry:</strong> {orgInfo.industry}</div>
                <div><strong>Size:</strong> {orgInfo.size}</div>
                <div><strong>Employees:</strong> {orgInfo.employee_count}</div>
              </div>
              <p className="mt-4 text-gray-600">{orgInfo.description}</p>
            </div>
          )}

          {/* Employees */}
          {employees.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Employees ({employees.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.slice(0, 6).map(emp => (
                  <div key={emp.id} className="border rounded p-3">
                    <div className="font-medium">{emp.name}</div>
                    <div className="text-sm text-gray-600">{emp.role}</div>
                    <div className="text-xs text-gray-500">{emp.department}</div>
                  </div>
                ))}
              </div>
              {employees.length > 6 && (
                <p className="mt-4 text-sm text-gray-500">... and {employees.length - 6} more</p>
              )}
            </div>
          )}

          {/* Test Buttons */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-3">
              <button
                onClick={loadOrganizations}
                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reload Organizations
              </button>
              
              <button
                onClick={testSimulationStart}
                disabled={isLoading || !selectedOrg}
                className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Start Simulation'}
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
            <div className="text-sm space-y-2">
              <div><strong>Selected Org:</strong> {selectedOrg || 'None'}</div>
              <div><strong>Organizations Loaded:</strong> {organizations.length}</div>
              <div><strong>Employees Loaded:</strong> {employees.length}</div>
              <div><strong>API Base:</strong> {API_BASE}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

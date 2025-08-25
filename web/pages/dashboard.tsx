import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import type { 
  Employee, 
  Communication, 
  SimulationStatus, 
  WisdomAnalysis,
  CommunicationRequest,
  CatchballRequest 
} from '../types/api';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [communicationType, setCommunicationType] = useState<'NUDGE' | 'RECOMMENDATION' | 'DIRECT_ORDER'>('NUDGE');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);
  const [wisdomAnalysis, setWisdomAnalysis] = useState<WisdomAnalysis | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Strategic communication templates
  const strategicTemplates = {
    NUDGE: [
      {
        content: "We're targeting 15% organic growth this quarter. How is your department positioned to contribute to this goal?"
      },
      {
        content: "Employee satisfaction scores are trending down. This should be a key focus area for all managers."
      },
      {
        content: "We're exploring entry into the European market. Consider how this might impact your team's priorities."
      }
    ],
    RECOMMENDATION: [
      {
        content: "Customer churn is at 8%. I recommend making customer retention a top priority across all customer-facing teams."
      },
      {
        content: "We should allocate 10% of R&D budget to emerging technologies. This could give us competitive advantage."
      },
      {
        content: "I recommend prioritizing leadership development programs to prepare for our expansion plans."
      }
    ],
    DIRECT_ORDER: [
      {
        content: "Achieve 15% organic growth this quarter. This is non-negotiable for our market position and investor expectations."
      },
      {
        content: "Employee satisfaction scores must improve by 20% within 90 days. This is critical for retention and hiring."
      },
      {
        content: "The new product must launch in Q1. This is essential for our competitive positioning and revenue targets."
      }
    ]
  };

  useEffect(() => {
    loadEmployees();
    loadCommunications();
    checkSimulationStatus();
    loadWisdomAnalysis();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await axios.get<Employee[]>(`${API_BASE}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast.error('Failed to load employees');
    }
  };

  const loadCommunications = async () => {
    try {
      // This would be implemented when the API endpoint is available
      setCommunications([]);
    } catch (error) {
      console.error('Error loading communications:', error);
      toast.error('Failed to load communications');
    }
  };

  const checkSimulationStatus = async () => {
    try {
      const response = await axios.get<SimulationStatus>(`${API_BASE}/status`);
      setSimulationStatus(response.data);
    } catch (error) {
      console.error('Error checking simulation status:', error);
      // Don't show error toast as this might be expected during development
    }
  };

  const loadWisdomAnalysis = async () => {
    try {
      const response = await axios.get<WisdomAnalysis>(`${API_BASE}/wisdom`);
      setWisdomAnalysis(response.data);
    } catch (error) {
      console.error('Error loading wisdom analysis:', error);
      // Don't show error toast as this might be expected during development
    }
  };

  const sendCommunication = async () => {
    if (!content.trim() || selectedEmployees.length === 0) {
      toast.error('Please select recipients and enter content');
      return;
    }

    setIsLoading(true);
    try {
      const communication: CommunicationRequest = {
        sender_id: 'ceo_001', // Hardcoded for demo
        recipient_ids: selectedEmployees,
        communication_type: communicationType,
        content: content.trim(),
        priority: 'high',
        strategic_goal: 'Strategic alignment'
      };

      const response = await axios.post<Communication>(`${API_BASE}/communications`, communication);
      
      setCommunications(prev => [response.data, ...prev]);
      setContent('');
      setSelectedEmployees([]);
      toast.success('Communication sent successfully');
    } catch (error) {
      console.error('Error sending communication:', error);
      toast.error('Failed to send communication');
    } finally {
      setIsLoading(false);
    }
  };

  const initiateCatchball = async () => {
    if (!content.trim()) {
      toast.error('Please enter a topic for catchball communication');
      return;
    }

    setIsLoading(true);
    try {
      const catchballRequest: CatchballRequest = {
        initiator_id: 'ceo_001',
        topic: content.trim(),
        strategic_context: 'Strategic alignment and conflict resolution',
        target_departments: ['Technology', 'Sales', 'Marketing'],
        rounds: 3
      };

      await axios.post(`${API_BASE}/catchball`, catchballRequest);
      setContent('');
      toast.success('Catchball communication initiated');
    } catch (error) {
      console.error('Error initiating catchball:', error);
      toast.error('Failed to initiate catchball communication');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const applyTemplate = (template: { content: string }) => {
    setContent(template.content);
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department.toLowerCase() === selectedDepartment.toLowerCase());

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Living Twin Simulation - CEO Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Strategic alignment and organizational behavior simulation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Recipients</h2>
              
              {/* Department Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Employee List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedEmployees.includes(employee.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleEmployeeSelection(employee.id)}
                  >
                    <div className="font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-600">{employee.role}</div>
                    <div className="text-xs text-gray-500">{employee.department}</div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Workload: {Math.round(employee.workload * 100)}%</span>
                      <span>Satisfaction: {Math.round(employee.satisfaction * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Communication Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategic Communication</h2>
              
              {/* Communication Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Type
                </label>
                <div className="flex space-x-4">
                  {(['NUDGE', 'RECOMMENDATION', 'DIRECT_ORDER'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setCommunicationType(type)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        communicationType === type
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strategic Templates */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strategic Templates
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {strategicTemplates[communicationType].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(template)}
                      className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="text-sm text-gray-900">{template.content}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your strategic communication..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={sendCommunication}
                  disabled={isLoading || !content.trim() || selectedEmployees.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Communication'}
                </button>
                <button
                  onClick={initiateCatchball}
                  disabled={isLoading || !content.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Initiating...' : 'Start Catchball'}
                </button>
              </div>
            </div>

            {/* Wisdom of the Crowd */}
            {wisdomAnalysis && (
              <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Wisdom of the Crowd</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Consensus Level</h3>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(wisdomAnalysis.consensus_level * 100)}%
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Detected Conflicts</h3>
                    <ul className="text-sm text-gray-600">
                      {wisdomAnalysis.detected_conflicts.map((conflict, index) => (
                        <li key={index}>• {conflict}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {wisdomAnalysis.ceo_recommendations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">CEO Recommendations</h3>
                    <ul className="text-sm text-gray-600">
                      {wisdomAnalysis.ceo_recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

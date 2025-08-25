import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useSimulationContext } from '../context/SimulationContext';
import type { 
  Employee, 
  Communication, 
  SimulationStatus, 
  WisdomAnalysis,
  CommunicationRequest
} from '../types/api';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

export default function EnhancedDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [communicationType, setCommunicationType] = useState<'nudge' | 'recommendation' | 'direct_order'>('nudge');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus | null>(null);
  const [wisdomAnalysis, setWisdomAnalysis] = useState<WisdomAnalysis | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'communication' | 'wisdom' | 'analytics'>('communication');
  
  // Use simulation context
  const { organization, actingAs, isSimulationRunning } = useSimulationContext();

  // Enhanced strategic communication templates with icons and descriptions
  const strategicTemplates = {
    nudge: [
      {
        icon: '📈',
        title: 'Growth Target Alignment',
        content: "We're targeting 15% organic growth this quarter. How is your department positioned to contribute to this goal?",
        category: 'Business Goals'
      },
      {
        icon: '😊',
        title: 'Employee Satisfaction Focus',
        content: "Employee satisfaction scores are trending down. This should be a key focus area for all managers.",
        category: 'People & Culture'
      },
      {
        icon: '🌍',
        title: 'Market Expansion Strategy',
        content: "We're exploring entry into the European market. Consider how this might impact your team's priorities.",
        category: 'Strategic Planning'
      }
    ],
    recommendation: [
      {
        icon: '💡',
        title: 'Customer Retention Priority',
        content: "Customer churn is at 8%. I recommend making customer retention a top priority across all customer-facing teams.",
        category: 'Customer Success'
      },
      {
        icon: '🚀',
        title: 'Innovation Investment',
        content: "We should allocate 10% of R&D budget to emerging technologies. This could give us competitive advantage.",
        category: 'Innovation'
      },
      {
        icon: '👥',
        title: 'Leadership Development',
        content: "I recommend prioritizing leadership development programs to prepare for our expansion plans.",
        category: 'Talent Development'
      }
    ],
    direct_order: [
      {
        icon: '🎯',
        title: 'Q4 Revenue Target',
        content: "Achieve 15% organic growth this quarter. This is non-negotiable for our market position and investor expectations.",
        category: 'Critical Business'
      },
      {
        icon: '⚡',
        title: 'Employee Satisfaction Action',
        content: "Employee satisfaction scores must improve by 20% within 90 days. This is critical for retention and hiring.",
        category: 'Urgent People'
      },
      {
        icon: '🚀',
        title: 'Product Launch Deadline',
        content: "The new product must launch in Q1. This is essential for our competitive positioning and revenue targets.",
        category: 'Product Strategy'
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
    }
  };

  const loadWisdomAnalysis = async () => {
    try {
      const response = await axios.get<WisdomAnalysis>(`${API_BASE}/wisdom`);
      setWisdomAnalysis(response.data);
    } catch (error) {
      console.error('Error loading wisdom analysis:', error);
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
        sender_id: 'ceo_001',
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
      toast.success('Strategic communication sent successfully! 🎯');
    } catch (error) {
      console.error('Error sending communication:', error);
      toast.error('Failed to send communication');
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
    toast.success('Template applied! ✨');
  };

  const getCommunicationTypeColor = (type: string) => {
    switch (type) {
      case 'NUDGE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RECOMMENDATION': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DIRECT_ORDER': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCommunicationTypeIcon = (type: string) => {
    switch (type) {
      case 'nudge': return '🤝';
      case 'recommendation': return '💡';
      case 'direct_order': return '⚡';
      default: return '📝';
    }
  };

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(emp => emp.department.toLowerCase() === selectedDepartment.toLowerCase());

  const departments = Array.from(new Set(employees.map(emp => emp.department)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 safari-fix">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 safari-render">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                Living Twin Simulation
              </h1>
              <p className="mt-1 text-sm text-gray-600">Strategic alignment and organizational behavior simulation</p>
            </div>
            
            {/* Simulation Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-800">Simulation Active</span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              {organization && actingAs && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <span className="text-gray-600">Acting as:</span>
                  <span className="font-medium text-gray-800">{actingAs.name}</span>
                </div>
              )}
              <a 
                href="/context-setup" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Context Setup
              </a>
            </div>
          </div>
        </div>
      </div>

      

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'communication', name: 'Strategic Communication', icon: ChatBubbleLeftRightIcon },
              { id: 'wisdom', name: 'Wisdom of the Crowd', icon: LightBulbIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'communication' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employee Selection */}
            <div className="lg:col-span-1">
              <div className="card safari-render">
                <div className="flex items-center gap-2 mb-4">
                  <UserGroupIcon className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Select Recipients</h2>
                  {selectedEmployees.length > 0 && (
                    <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {selectedEmployees.length} selected
                    </span>
                  )}
                </div>
                
                {/* Department Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="input-field"
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
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedEmployees.includes(employee.id)
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleEmployeeSelection(employee.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.role}</div>
                          <div className="text-xs text-gray-500">{employee.department}</div>
                        </div>
                        {selectedEmployees.includes(employee.id) && (
                          <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span>Workload: {Math.round(employee.workload * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                          <span>Satisfaction: {Math.round(employee.satisfaction * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Communication Form */}
            <div className="lg:col-span-2">
              <div className="card safari-render">
                <div className="flex items-center gap-2 mb-6">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Strategic Communication</h2>
                </div>
                
                {/* Communication Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Communication Type
                  </label>
                  <div className="flex space-x-3">
                    {(['nudge', 'recommendation', 'direct_order'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setCommunicationType(type)}
                        className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          communicationType === type
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">{getCommunicationTypeIcon(type)}</span>
                          <span>{type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategic Templates */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Strategic Templates
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {strategicTemplates[communicationType].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => applyTemplate(template)}
                        className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{template.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                              {template.title}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{template.content}</div>
                            <div className="text-xs text-gray-400 mt-2">{template.category}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Enter your strategic communication..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={sendCommunication}
                    disabled={isLoading || !content.trim() || selectedEmployees.length === 0}
                    className="btn-primary flex-1 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-105 disabled:transform-none safari-fix"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        Send Communication
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wisdom' && wisdomAnalysis && (
          <div className="card safari-render">
            <div className="flex items-center gap-2 mb-6">
              <LightBulbIcon className="h-5 w-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">Wisdom of the Crowd</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Consensus Level */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <ChartBarIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Consensus Level</h3>
                </div>
                <div className="text-3xl font-bold text-blue-700">
                  {Math.round(wisdomAnalysis.consensus_level * 100)}%
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  {wisdomAnalysis.consensus_level > 0.7 ? 'Strong alignment' : 'Needs attention'}
                </div>
              </div>

              {/* Confidence Metrics */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <h3 className="font-semibold text-green-900">Department Confidence</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(wisdomAnalysis.confidence_metrics).map(([dept, confidence]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span className="text-sm text-green-700">{dept}</span>
                      <span className="text-sm font-medium text-green-800">{Math.round(confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Conflicts */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  <h3 className="font-semibold text-red-900">Detected Conflicts</h3>
                </div>
                <div className="space-y-2">
                  {wisdomAnalysis.detected_conflicts.map((conflict, index) => (
                    <div key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>{conflict}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hesitation Indicators */}
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-3 mb-3">
                  <InformationCircleIcon className="h-6 w-6 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-900">Hesitation Indicators</h3>
                </div>
                <div className="space-y-2">
                  {wisdomAnalysis.hesitation_indicators.map((indicator, index) => (
                    <div key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CEO Recommendations */}
            {wisdomAnalysis.ceo_recommendations.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <LightBulbIcon className="h-6 w-6 text-purple-600" />
                  <h3 className="font-semibold text-purple-900">CEO Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wisdomAnalysis.ceo_recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100">
                      <span className="text-purple-500 text-lg">💡</span>
                      <span className="text-sm text-purple-800">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card safari-render">
            <div className="flex items-center gap-2 mb-6">
              <ChartBarIcon className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">Total Communications</h3>
                <div className="text-3xl font-bold text-blue-700">{communications.length}</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">Active Employees</h3>
                <div className="text-3xl font-bold text-green-700">{employees.length}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">Response Rate</h3>
                <div className="text-3xl font-bold text-purple-700">85%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

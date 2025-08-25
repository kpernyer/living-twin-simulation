import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

export default function TestWorkflow() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Health check
      addResult('Testing API health...');
      const healthResponse = await axios.get(`${API_BASE}/health`);
      addResult(`✅ Health check passed: ${healthResponse.data.status}`);
      
      // Test 2: Get employees
      addResult('Testing employees endpoint...');
      const employeesResponse = await axios.get(`${API_BASE}/employees`);
      addResult(`✅ Employees loaded: ${employeesResponse.data.length} employees`);
      
      // Test 3: Send communication
      addResult('Testing communication endpoint...');
      const communicationData = {
        sender_id: 'ceo_001',
        recipient_ids: ['cto_001'],
        communication_type: 'nudge',
        content: 'Test communication from workflow test',
        priority: 'high',
        strategic_goal: 'Workflow testing'
      };
      
      const commResponse = await axios.post(`${API_BASE}/communications`, communicationData);
      addResult(`✅ Communication sent: ${commResponse.data.id}`);
      
      // Test 4: Get wisdom analysis
      addResult('Testing wisdom endpoint...');
      const wisdomResponse = await axios.get(`${API_BASE}/wisdom`);
      addResult(`✅ Wisdom analysis loaded: consensus level ${Math.round(wisdomResponse.data.consensus_level * 100)}%`);
      
      // Test 5: Get simulation status
      addResult('Testing status endpoint...');
      const statusResponse = await axios.get(`${API_BASE}/status`);
      addResult(`✅ Simulation status: ${statusResponse.data.is_running ? 'Running' : 'Stopped'}`);
      
      addResult('🎉 All tests passed! Workflow is working correctly.');
      toast.success('All workflow tests passed!');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      addResult(`❌ Test failed: ${errorMessage}`);
      toast.error(`Workflow test failed: ${errorMessage}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 safari-fix p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Workflow Test
        </h1>
        
        <div className="card safari-render mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoint Tests</h2>
          <p className="text-gray-600 mb-4">
            This page tests all the API endpoints to ensure the communication workflow is working correctly.
          </p>
          
          <button
            onClick={runTests}
            disabled={isRunning}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </button>
        </div>
        
        <div className="card safari-render">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No tests run yet. Click "Run All Tests" to start.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

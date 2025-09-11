import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import EnhancedDashboard from './dashboard-enhanced';
import ContextSetup from './context-setup';

const API_BASE = process.env.NEXT_PUBLIC_SIMULATION_API_URL || 'http://localhost:8000';

export default function LivingTwinInterface() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSimulation, setHasSimulation] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE}/status`);
        setHasSimulation(response.data.is_running);
      } catch (error) {
        console.error('Failed to fetch status:', error);
        setHasSimulation(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking simulation status...</p>
          <button 
            onClick={() => {setIsLoading(false); setHasSimulation(false);}} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Skip to Setup
          </button>
        </div>
      </div>
    );
  }

  // If no simulation is running, show context setup
  if (!hasSimulation) {
    return <ContextSetup />;
  }

  // If simulation is running, show dashboard
  return <EnhancedDashboard />;
}

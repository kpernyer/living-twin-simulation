// TypeScript type definitions for Living Twin Simulation API

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  level: string;
  personality_traits: string[];
  workload: number;
  satisfaction: number;
}

export interface Communication {
  id: string;
  sender_id: string;
  recipient_ids: string[];
  communication_type: 'nudge' | 'recommendation' | 'direct_order';
  content: string;
  timestamp: string;
  responses: any[];
  status: string;
}

export interface SimulationStatus {
  organization_id: string;
  is_running: boolean;
  current_time: string;
  acceleration_factor: number;
  total_employees: number;
  active_communications: number;
  pending_responses: number;
}

export interface WisdomAnalysis {
  consensus_level: number;
  detected_conflicts: string[];
  hesitation_indicators: string[];
  confidence_metrics: Record<string, number>;
  ceo_recommendations: string[];
}

export interface CommunicationRequest {
  sender_id: string;
  recipient_ids: string[];
  communication_type: 'nudge' | 'recommendation' | 'direct_order';
  content: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  strategic_goal?: string;
}

export interface CatchballRequest {
  initiator_id: string;
  topic: string;
  strategic_context: string;
  target_departments: string[];
  rounds?: number;
}

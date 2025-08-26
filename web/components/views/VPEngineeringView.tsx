import React, { useState } from 'react';
import { Code2, GitBranch, AlertCircle, CheckCircle2, Clock, Zap, Settings } from 'lucide-react';

interface VPEngineeringViewProps {
  ceoActions?: Array<{id: string, decision: string, icon: string}>;
}

export const VPEngineeringView: React.FC<VPEngineeringViewProps> = ({ ceoActions = [] }) => {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
  // High-priority engineering tasks cascaded from CEO decisions
  const engineeringPriorities = [
    {
      id: 'G23-ENG',
      title: 'Architecture Review & Roadmap Realignment',
      description: 'Address technical debt vs market velocity trade-off',
      fromCEO: 'TECH-MARKET ALIGNMENT',
      urgency: 'immediate',
      impact: 'critical',
      assignedTo: 'Architecture Team',
      dueDate: 'End of Week',
      context: 'Engineering velocity declining while feature requests accelerating',
      technicalScope: [
        'Audit current technical debt backlog',
        'Assess microservices architecture bottlenecks', 
        'Evaluate deployment pipeline efficiency',
        'Review API performance and scalability'
      ],
      deliverables: [
        'Technical debt prioritization matrix',
        'Architecture modernization roadmap',
        'Resource allocation recommendations',
        'Timeline for critical improvements'
      ]
    },
    {
      id: 'M07-ENG',
      title: 'AI Integration Strategy Implementation',
      description: 'Fast-track AI capabilities in response to competitive pressure',
      fromCEO: 'COMPETITIVE RESPONSE',
      urgency: 'high',
      impact: 'high',
      assignedTo: 'AI/ML Team',
      dueDate: '2 Weeks',
      context: 'TechFlow acquisition requires accelerated AI positioning',
      technicalScope: [
        'Evaluate current ML infrastructure readiness',
        'Design AI feature integration architecture',
        'Assess third-party AI service options',
        'Plan data pipeline enhancements'
      ],
      deliverables: [
        'AI integration technical specification',
        'Infrastructure scaling plan',
        'Development timeline with milestones',
        'Risk assessment and mitigation plan'
      ]
    }
  ];

  // Engineering team insights and technical signals
  const engineeringInsights = [
    {
      id: 'E01',
      type: 'performance',
      title: 'API response times degrading in peak hours',
      description: '95th percentile response time increased 23% over past month',
      severity: 'medium',
      confidence: 94,
      source: 'APM Monitoring',
      technicalDetail: 'Database connection pooling and cache hit ratios declining',
      recommendation: 'Implement connection pool optimization and Redis cluster upgrade'
    },
    {
      id: 'E02',
      type: 'security',
      title: 'Dependency vulnerabilities require attention', 
      description: '12 high-severity vulnerabilities detected in npm packages',
      severity: 'high',
      confidence: 100,
      source: 'Security Scanner',
      technicalDetail: 'React, Express, and Lodash versions have known exploits',
      recommendation: 'Emergency security patch deployment scheduled'
    },
    {
      id: 'E03',
      type: 'scalability',
      title: 'Database queries showing inefficient patterns',
      description: 'N+1 queries increasing, slow query count up 40%',
      severity: 'medium', 
      confidence: 89,
      source: 'Database Profiler',
      technicalDetail: 'User analytics and reporting modules causing load',
      recommendation: 'Implement query optimization and database indexing strategy'
    },
    {
      id: 'E04',
      type: 'innovation',
      title: 'Team proposing GraphQL migration for better API performance',
      description: 'Engineering team suggests GraphQL could reduce API calls by 60%',
      severity: 'low',
      confidence: 78,
      source: 'Tech Proposal',
      technicalDetail: 'RESTful API over-fetching causing mobile app performance issues',
      recommendation: 'Pilot GraphQL implementation for mobile endpoints'
    }
  ];

  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => 
      prev.includes(id) 
        ? prev.filter(t => t !== id)
        : [...prev, id]
    );
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'immediate': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'performance': return <Zap className="text-yellow-500" size={16} />;
      case 'security': return <AlertCircle className="text-red-500" size={16} />;
      case 'scalability': return <Settings className="text-blue-500" size={16} />;
      case 'innovation': return <Code2 className="text-purple-500" size={16} />;
      default: return <GitBranch className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="vp-engineering-view max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
            VE
          </div>
          <div>
            <h1 className="text-lg font-semibold">VP Engineering Dashboard</h1>
            <p className="text-purple-100 text-sm">Post-CEO Briefing • Technical Actions</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* CEO-Cascaded Engineering Priorities */}
        <div>
          <h2 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
            <Clock size={16} className="mr-2 text-red-500" />
            Technical Priorities
            <span className="ml-2 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
              From CEO Brief
            </span>
          </h2>
          
          <div className="space-y-4">
            {engineeringPriorities.map((priority) => (
              <div 
                key={priority.id}
                className={`border rounded-lg p-4 ${getUrgencyColor(priority.urgency)} ${
                  completedTasks.includes(priority.id) ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-slate-800">{priority.title}</h3>
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">
                        {priority.fromCEO}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{priority.description}</p>
                    <p className="text-xs text-slate-500 italic mb-3">"{priority.context}"</p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span>👥 {priority.assignedTo}</span>
                      <span>📅 {priority.dueDate}</span>
                    </div>
                    
                    {/* Technical Scope */}
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-slate-700 mb-2">Technical Scope:</h4>
                      <div className="space-y-1">
                        {priority.technicalScope.map((scope, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs">
                            <Code2 size={12} className="text-blue-500" />
                            <span className="text-slate-600">{scope}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Deliverables */}
                    <div>
                      <h4 className="text-xs font-medium text-slate-700 mb-2">Deliverables:</h4>
                      <div className="space-y-1">
                        {priority.deliverables.map((deliverable, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                            <span className="text-slate-600">{deliverable}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleTask(priority.id)}
                    className={`ml-3 p-1 rounded ${
                      completedTasks.includes(priority.id)
                        ? 'text-green-600'
                        : 'text-slate-400 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering Insights */}
        <div>
          <h2 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
            <GitBranch size={16} className="mr-2 text-purple-500" />
            Technical Insights
            <span className="ml-2 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
              From Systems
            </span>
          </h2>
          
          <div className="space-y-3">
            {engineeringInsights.map((insight) => (
              <div 
                key={insight.id}
                className="border border-slate-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setExpandedInsight(
                  expandedInsight === insight.id ? null : insight.id
                )}
              >
                <div className="flex items-start space-x-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-slate-800">{insight.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(insight.severity)}`}>
                          {insight.severity}
                        </span>
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-2">{insight.description}</p>
                    
                    {expandedInsight === insight.id && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-xs text-slate-500">
                          <strong>Source:</strong> {insight.source}
                        </p>
                        <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded">
                          <strong>Technical Detail:</strong> {insight.technicalDetail}
                        </p>
                        <p className="text-xs text-purple-700 bg-purple-50 p-2 rounded">
                          <strong>Recommendation:</strong> {insight.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-slate-800">2/2</div>
            <div className="text-xs text-slate-600">CEO Tasks</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-600">1</div>
            <div className="text-xs text-slate-600">High Severity</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-600">89%</div>
            <div className="text-xs text-slate-600">Avg Confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, TrendingUp, Clock, CheckCircle2, Users, Target } from 'lucide-react';
import { getVoiceService, switchToPreRecorded, switchToTTS, VoiceConfig } from '../lib/voiceService';

// Add custom CSS for animations
const customStyles = `
  @keyframes bounce-in {
    0% {
      transform: scale(0) rotate(180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(90deg);
      opacity: 0.7;
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
  .animate-bounce-in {
    animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
`;

const VPSalesDemo = () => {
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // VP Sales specific state
  const [completedPriorities, setCompletedPriorities] = useState<string[]>([]);
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  const [usePreRecordedVoice, setUsePreRecordedVoice] = useState(true);

  // Initialize voice service
  useEffect(() => {
    switchToPreRecorded(language);
  }, []);

  // Update voice service when language changes
  useEffect(() => {
    if (usePreRecordedVoice) {
      switchToPreRecorded(language);
    }
  }, [language, usePreRecordedVoice]);

  const togglePriority = (id: string) => {
    setCompletedPriorities(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  // VP Sales priorities cascaded from CEO
  const salesPriorities = [
    {
      id: 'revenue-review',
      title: 'Strategic Revenue Review',
      description: 'Lead enterprise segment value proposition analysis',
      context: 'Q3 revenue miss - 8% below target in enterprise segment',
      urgency: 'immediate',
      assignedTo: 'Sales Leadership',
      dueDate: 'Today 4PM',
      fromCEO: 'STRATEGIC REVENUE REVIEW'
    },
    {
      id: 'competitive-response',
      title: 'Competitive Response Strategy', 
      description: 'Develop counter-positioning to TechFlow acquisition',
      context: 'TechFlow $2.1B acquisition signals AI-first positioning shift',
      urgency: 'high',
      assignedTo: 'Sales & Marketing',
      dueDate: 'Tomorrow EOD',
      fromCEO: 'COMPETITIVE RESPONSE'
    }
  ];

  // Sales team insights bubbling up
  const salesInsights = [
    {
      id: 'ai-roadmap',
      title: 'Enterprise customers requesting AI roadmap clarity',
      description: '73% of enterprise prospects asking about AI strategy in Q3',
      type: 'customer-feedback',
      confidence: 87,
      source: 'Sales Team Weekly Survey'
    },
    {
      id: 'techflow-poaching',
      title: 'TechFlow poaching attempts increasing',
      description: '3 key accounts received TechFlow proposals this week',
      type: 'competitive-intel',
      confidence: 95,
      source: 'Account Manager Reports'
    },
    {
      id: 'pricing-pressure',
      title: 'Pricing pressure in mid-market segment',
      description: 'Average deal size down 12% vs Q2, longer sales cycles',
      type: 'market-signal',
      confidence: 91,
      source: 'CRM Analytics'
    }
  ];

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'customer-feedback': return <Users className="text-blue-400" size={16} />;
      case 'competitive-intel': return <Target className="text-red-400" size={16} />;
      case 'market-signal': return <TrendingUp className="text-green-400" size={16} />;
      default: return <TrendingUp className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Demo Description */}
      <div className="bg-slate-950 px-4 py-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-3">VP Sales - Living Twin Dashboard</h1>
          <p className="text-slate-300 text-sm mb-4">
            Experience how VP Sales receives cascaded priorities from CEO briefings and shares field insights 
            back to the organization. Same Living Twin technology, different role perspective.
          </p>
          
          {/* Navigation */}
          <div className="flex space-x-4">
            <button 
              onClick={() => window.location.href = '/mobile-demo'}
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-2 rounded-lg transition-all"
            >
              ← CEO Demo
            </button>
            <button 
              onClick={() => window.location.href = '/vp-engineering-demo'}
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-2 rounded-lg transition-all"
            >
              VP Engineering Demo →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Demo Frame */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="relative flex items-center space-x-8">
          {/* iPhone-style Frame */}
          <div className="bg-slate-900 rounded-[3rem] p-2 shadow-2xl border-8 border-slate-800">
            <div className="bg-black rounded-[2.5rem] overflow-hidden" style={{ width: '375px', height: '667px' }}>
              {/* Status Bar */}
              <div className="bg-black text-white px-6 py-2 flex justify-between items-center text-sm">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm opacity-60"></div>
                    <div className="w-4 h-2 bg-white rounded-sm opacity-30"></div>
                  </div>
                  <span className="text-xs ml-1">Living Twin</span>
                </div>
                <div className="text-xs">9:41 AM</div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs">100%</span>
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-full h-full bg-emerald-400 rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* VP Sales Interface */}
              <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden" style={{ height: '635px' }}>
                {/* Header */}
                <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                      VS
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-white">VP Sales Dashboard</h1>
                      <p className="text-slate-400 text-xs">Post-CEO Briefing • Priority Actions</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-5">
                    {/* High Priority Actions from CEO */}
                    <div>
                      <h2 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <Clock size={14} className="mr-2 text-red-400" />
                        High-Priority Actions
                        <span className="ml-2 bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full">
                          From CEO
                        </span>
                      </h2>
                      
                      <div className="space-y-3">
                        {salesPriorities.map((priority) => (
                          <div key={priority.id} className="border border-red-600 bg-red-900/20 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h3 className="font-medium text-white text-sm">{priority.title}</h3>
                                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                    {priority.fromCEO}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 mb-2">{priority.description}</p>
                                <p className="text-xs text-slate-400 mb-2 italic">"{priority.context}"</p>
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                  <span>👤 {priority.assignedTo}</span>
                                  <span>📅 {priority.dueDate}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => togglePriority(priority.id)}
                                className={`ml-3 p-1 rounded ${
                                  completedPriorities.includes(priority.id)
                                    ? 'text-green-400'
                                    : 'text-slate-400 hover:text-green-400'
                                }`}
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sales Team Insights */}
                    <div>
                      <h2 className="text-sm font-semibold text-white mb-3 flex items-center">
                        <TrendingUp size={14} className="mr-2 text-green-400" />
                        Sales Team Insights
                        <span className="ml-2 bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full">
                          From Field
                        </span>
                      </h2>
                      
                      <div className="space-y-2">
                        {salesInsights.map((insight) => (
                          <div key={insight.id} className="border border-slate-600 bg-slate-800/50 rounded p-3">
                            <div className="flex items-start space-x-3">
                              {getInsightIcon(insight.type)}
                              <div className="flex-1">
                                <h3 className="text-xs font-medium text-white">{insight.title}</h3>
                                <p className="text-xs text-slate-400 mt-1">{insight.description}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-slate-500">{insight.source}</span>
                                  <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">
                                    {insight.confidence}% conf.
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-orange-400">2</div>
                        <div className="text-xs text-slate-400">CEO Priorities</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-400">3</div>
                        <div className="text-xs text-slate-400">Field Insights</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation Info */}
          <div className="flex flex-col space-y-3">
            <div className="bg-slate-800 p-4 rounded-lg max-w-xs">
              <h3 className="text-md font-semibold text-orange-400 mb-2">VP Sales Perspective</h3>
              <div className="text-xs text-slate-300 space-y-2">
                <p>• Receives high-priority actions from CEO briefing</p>
                <p>• Shares customer feedback and competitive intelligence</p>
                <p>• Same Living Twin tech, sales-focused content</p>
                <p>• Real-time field insights bubble up to leadership</p>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 text-center max-w-xs">
              This shows how the same organizational intelligence system serves different roles with role-specific priorities and insights.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPSalesDemo;
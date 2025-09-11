import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, MicOff, Play, Pause, TrendingUp, AlertTriangle, Clock, Users, Target, ChevronRight } from 'lucide-react';
import { getVoiceService, switchToPreRecorded, switchToTTS } from '../lib/voiceService';

const customStyles = `
  @keyframes pulse-ring {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
  .animate-pulse-ring {
    animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes voice-wave {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(1.5); }
  }
  .voice-wave {
    animation: voice-wave 0.6s ease-in-out infinite;
  }
  .voice-wave:nth-child(2) { animation-delay: 0.1s; }
  .voice-wave:nth-child(3) { animation-delay: 0.2s; }
  .voice-wave:nth-child(4) { animation-delay: 0.3s; }
`;

const LivingTwinV2 = () => {
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // State management
  const [currentMode, setCurrentMode] = useState<'dashboard' | 'conversation'>('dashboard');
  const [selectedRole, setSelectedRole] = useState<'ceo' | 'vp-sales' | 'vp-engineering'>('ceo');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    speaker: 'user' | 'twin';
    text: string;
    timestamp: number;
  }>>([]);
  const [language, setLanguage] = useState<'en' | 'sv'>('en');

  // Voice service initialization
  useEffect(() => {
    switchToPreRecorded(language);
  }, [language]);

  // Mock data for dashboard - role-specific
  const getDashboardData = (role: string) => {
    const commonInsights = [
      {
        id: 'market-shift',
        type: 'competitive-intel',
        title: 'TechFlow acquisition reshaping AI market',
        impact: 'high',
        confidence: 95,
        trend: 'increasing'
      },
      {
        id: 'customer-feedback',
        type: 'customer-signal',
        title: 'Enterprise customers requesting AI roadmap',
        impact: 'medium',
        confidence: 87,
        trend: 'stable'
      },
      {
        id: 'revenue-miss',
        type: 'performance',
        title: 'Q3 enterprise segment 8% below target',
        impact: 'high',
        confidence: 98,
        trend: 'declining'
      }
    ];

    const roleSpecific = {
      ceo: {
        priorities: [
          { id: 'strategic-review', title: 'Strategic Revenue Review', urgency: 'immediate', owner: 'Leadership Team' },
          { id: 'competitive-response', title: 'Competitive Positioning', urgency: 'high', owner: 'Sales & Marketing' },
          { id: 'tech-alignment', title: 'Technology Roadmap Alignment', urgency: 'medium', owner: 'Engineering' }
        ],
        metrics: [
          { label: 'Strategic Alignment', value: 72, change: -8 },
          { label: 'Decision Velocity', value: 84, change: +12 },
          { label: 'Cross-func Clarity', value: 67, change: -3 }
        ]
      },
      'vp-sales': {
        priorities: [
          { id: 'retention-strategy', title: 'Enterprise Retention Initiative', urgency: 'immediate', owner: 'Sales Team' },
          { id: 'competitive-response', title: 'TechFlow Counter-Positioning', urgency: 'high', owner: 'Sales & Marketing' },
          { id: 'pricing-strategy', title: 'Mid-Market Pricing Review', urgency: 'medium', owner: 'Revenue Ops' }
        ],
        metrics: [
          { label: 'Pipeline Health', value: 78, change: -12 },
          { label: 'Win Rate', value: 65, change: -8 },
          { label: 'Customer Satisfaction', value: 89, change: +2 }
        ]
      },
      'vp-engineering': {
        priorities: [
          { id: 'tech-debt', title: 'Architecture Review & Roadmap', urgency: 'high', owner: 'Engineering' },
          { id: 'ai-capabilities', title: 'AI Feature Development', urgency: 'high', owner: 'AI Team' },
          { id: 'velocity-improvement', title: 'Development Velocity Initiative', urgency: 'medium', owner: 'Dev Teams' }
        ],
        metrics: [
          { label: 'Development Velocity', value: 73, change: -15 },
          { label: 'Code Quality', value: 82, change: +3 },
          { label: 'Feature Delivery', value: 68, change: -7 }
        ]
      }
    };

    return {
      insights: commonInsights,
      ...roleSpecific[role as keyof typeof roleSpecific]
    };
  };

  const startConversation = () => {
    setCurrentMode('conversation');
    // Add an initial greeting from the twin
    setConversationHistory([{
      speaker: 'twin',
      text: `Good morning! I'm your Living Twin. I've prepared insights from your ${selectedRole} dashboard. What would you like to discuss first?`,
      timestamp: Date.now()
    }]);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      // Simulate user input and twin response
      setTimeout(() => {
        setConversationHistory(prev => [
          ...prev,
          {
            speaker: 'user',
            text: "Tell me more about the revenue situation and what actions we should take.",
            timestamp: Date.now()
          }
        ]);
        
        setTimeout(() => {
          setIsSpeaking(true);
          setConversationHistory(prev => [
            ...prev,
            {
              speaker: 'twin',
              text: "The Q3 enterprise segment is 8% below target, suggesting a value proposition misalignment. I recommend a strategic revenue review including product and marketing teams. Would you like me to coordinate this review?",
              timestamp: Date.now()
            }
          ]);
          
          setTimeout(() => {
            setIsSpeaking(false);
          }, 4000);
        }, 1000);
      }, 2000);
    } else {
      setIsListening(true);
    }
  };

  const dashboardData = getDashboardData(selectedRole);

  const getInsightIcon = (type: string) => {
    switch(type) {
      case 'competitive-intel': return <Target className="text-red-400" size={16} />;
      case 'customer-signal': return <Users className="text-blue-400" size={16} />;
      case 'performance': return <TrendingUp className="text-orange-400" size={16} />;
      default: return <AlertTriangle className="text-gray-400" size={16} />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch(urgency) {
      case 'immediate': return 'border-red-500 bg-red-900/20';
      case 'high': return 'border-orange-500 bg-orange-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      default: return 'border-slate-600 bg-slate-800/50';
    }
  };

  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
        {/* Header */}
        <div className="bg-slate-950 px-4 py-6 border-b border-slate-800">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-3">Living Twin Intelligence</h1>
            <p className="text-slate-300 text-sm mb-4">
              Visual dashboard overview, then voice-first conversation with your organizational twin
            </p>
            
            {/* Role Selector */}
            <div className="flex space-x-2">
              {(['ceo', 'vp-sales', 'vp-engineering'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedRole === role
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {role.toUpperCase().replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {dashboardData.metrics.map((metric: any, idx: number) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-300">{metric.label}</h3>
                    <span className={`text-sm font-bold ${
                      metric.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-white">{metric.value}%</div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Priorities */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Current Priorities</h2>
                {dashboardData.priorities.map((priority: any) => (
                  <div key={priority.id} className={`p-4 rounded-lg border ${getUrgencyColor(priority.urgency)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{priority.title}</h3>
                        <p className="text-sm text-slate-300 mt-1">Assigned to: {priority.owner}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                          priority.urgency === 'immediate' ? 'bg-red-600 text-white' :
                          priority.urgency === 'high' ? 'bg-orange-600 text-white' :
                          'bg-yellow-600 text-black'
                        }`}>
                          {priority.urgency.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Organizational Insights */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Key Insights</h2>
                {dashboardData.insights.map((insight: any) => (
                  <div key={insight.id} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-start space-x-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-white">{insight.title}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            insight.impact === 'high' ? 'bg-red-900 text-red-200' :
                            insight.impact === 'medium' ? 'bg-orange-900 text-orange-200' :
                            'bg-green-900 text-green-200'
                          }`}>
                            {insight.impact.toUpperCase()} IMPACT
                          </span>
                          <span className="text-xs text-green-400">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start Conversation Button */}
            <div className="mt-12 text-center">
              <button
                onClick={startConversation}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare size={24} />
                  <span>Start Conversation with Living Twin</span>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <p className="text-slate-400 text-sm mt-3">
                Voice-first conversation mode • Ask questions • Request analysis • Iterate on decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Conversation Mode
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentMode('dashboard')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Dashboard
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">Living Twin Conversation</h1>
            <p className="text-slate-400 text-sm">{selectedRole.replace('-', ' ').toUpperCase()} Mode</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'sv')}
            className="bg-slate-700 text-white px-3 py-1 rounded text-sm border border-slate-600"
          >
            <option value="en">English</option>
            <option value="sv">Svenska</option>
          </select>
        </div>
      </div>

      {/* iPhone-style Conversation Interface */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
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

            {/* Conversation Area */}
            <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden" style={{ height: '635px' }}>
              {/* Header */}
              <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                    LT
                  </div>
                  <div>
                    <h1 className="text-md font-semibold text-white">Living Twin</h1>
                    <p className="text-slate-400 text-xs">Voice-First Intelligence</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationHistory.map((message, idx) => (
                  <div key={idx} className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${
                      message.speaker === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-700 text-white'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
                
                {/* Speaking Indicator */}
                {isSpeaking && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-blue-400 voice-wave"></div>
                          <div className="w-1 h-4 bg-blue-400 voice-wave"></div>
                          <div className="w-1 h-4 bg-blue-400 voice-wave"></div>
                          <div className="w-1 h-4 bg-blue-400 voice-wave"></div>
                        </div>
                        <span className="text-xs text-slate-300">Speaking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Controls */}
              <div className="p-4 border-t border-slate-700">
                <div className="flex items-center justify-center">
                  <button
                    onClick={handleVoiceToggle}
                    className={`relative w-16 h-16 rounded-full transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    
                    {isListening && (
                      <div className="absolute inset-0 rounded-full bg-red-400 opacity-50 animate-pulse-ring"></div>
                    )}
                  </button>
                </div>
                
                <div className="text-center mt-3">
                  <p className="text-slate-400 text-xs">
                    {isListening ? 'Listening...' : 'Tap to speak with your Living Twin'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivingTwinV2;
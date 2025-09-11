import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic } from 'lucide-react';
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

const LivingTwinMobile = () => {
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // All state declarations in one place
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceActivity, setVoiceActivity] = useState(0);
  // Shorter 2-3 minute conversation for demo impact
  const conversationScript = [
    { time: 0, speaker: 'twin', text: 'Good morning. Three strategic operational adjustments need your attention.', highlight: [], eventId: 'twin_001' },
    { time: 6, speaker: 'twin', text: 'First, Q3 revenue miss signals market positioning disconnect - eight percent below target across enterprise segment.', highlight: ['T04'], eventId: 'twin_002' },
    { time: 15, speaker: 'ceo', text: 'That suggests our value proposition alignment is off. Convene strategic revenue review - include product and marketing.', highlight: ['T04'], action: { id: 'T04', decision: 'STRATEGIC REVENUE REVIEW', icon: '🎯' }, eventId: 'ceo_001' },
    { time: 25, speaker: 'twin', text: 'Second, engineering velocity declining while customer feature requests accelerating - creating strategic debt.', highlight: ['G23'], eventId: 'twin_003' },
    { time: 35, speaker: 'ceo', text: 'Classic technical debt versus market velocity trade-off. Initiate architecture review with roadmap realignment.', highlight: ['G23'], action: { id: 'G23', decision: 'TECH-MARKET ALIGNMENT', icon: '⚖️' }, eventId: 'ceo_002' },
    { time: 45, speaker: 'twin', text: 'Third, competitor TechFlow acquisition shifts industry dynamics - two point one billion signals AI-first positioning.', highlight: ['M07'], eventId: 'twin_004' },
    { time: 55, speaker: 'ceo', text: 'Our competitive moat needs reinforcement. Fast-track AI integration strategy and adjust market messaging.', highlight: ['M07'], action: { id: 'M07', decision: 'COMPETITIVE RESPONSE', icon: '🛡️' }, eventId: 'ceo_003' },
    { time: 65, speaker: 'twin', text: 'All strategic adjustments captured. Should I coordinate cross-functional alignment?', highlight: [], eventId: 'twin_005' },
    { time: 72, speaker: 'ceo', text: 'Yes, but cascade through department leads first. Excellent strategic synthesis.', highlight: [], final: true, eventId: 'ceo_004' }
  ];
  
  const [currentScriptIndex, setCurrentScriptIndex] = useState(0);
  const [conversationTime, setConversationTime] = useState(0);
  const [isConversationActive, setIsConversationActive] = useState(false);
  const [conversationStartTime, setConversationStartTime] = useState<Date | null>(null);
  const [pauseEvents, setPauseEvents] = useState<Array<{time: number, type: 'pause' | 'resume' | 'restart'}>>([]);
  const [showCatchUp, setShowCatchUp] = useState(false);
  const [lastPauseTime, setLastPauseTime] = useState(0);
  const [highlightedTopics, setHighlightedTopics] = useState<string[]>([]);
  const [conversationHooks, setConversationHooks] = useState<Array<{text: string, timestamp: Date, color?: string, id?: string, action?: string, actionIcon?: string}>>([]);
  const [inputText, setInputText] = useState('');
  // Strategic KPIs with trends
  const [strategicAlignment, setStrategicAlignment] = useState(72); // 0-100
  const [alignmentTrend, setAlignmentTrend] = useState([68, 69, 70, 71, 72]); // Last 5 days
  const [decisionVelocity, setDecisionVelocity] = useState(3.2); // Average days
  const [velocityTrend, setVelocityTrend] = useState([3.8, 3.6, 3.4, 3.3, 3.2]); // Last 5 days
  const [strategicClarity, setStrategicClarity] = useState(85); // 0-100
  const [clarityTrend, setClarityTrend] = useState([80, 81, 83, 84, 85]); // Last 5 days
  const [twinAccuracy, setTwinAccuracy] = useState(89); // 0-100
  const [accuracyTrend, setAccuracyTrend] = useState([85, 86, 87, 88, 89]); // Last 5 days
  const [showMorePopup, setShowMorePopup] = useState(false);
  const [showDemoScript, setShowDemoScript] = useState(false);
  const [kpiState, setKpiState] = useState<'normal' | 'collapsed' | 'expanded'>('normal');
  const [showSummaryScreen, setShowSummaryScreen] = useState(false);
  const [completedActions, setCompletedActions] = useState<Array<{id: string, decision: string, icon: string, confirmed: boolean}>>([]);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'truth' | 'gossip' | 'market' | 'wisdom'>('all');
  const [usePreRecordedVoice, setUsePreRecordedVoice] = useState(true);
  const [language, setLanguage] = useState<'en' | 'sv'>('en');
  
  // Initialize voice service to pre-recorded on component mount
  useEffect(() => {
    switchToPreRecorded(language); // Uses default version from config
  }, []);
  
  // Update voice service when language changes
  useEffect(() => {
    if (usePreRecordedVoice) {
      switchToPreRecorded(language); // Uses default version from config
    }
  }, [language, usePreRecordedVoice]);
  
  // Strategic Operations Priorities - the critical middle layer between strategy and execution
  const prioritizedItems = [
    // Truth/Data Signals (T-series)
    { 
      id: 'T04', 
      type: 'truth', 
      title: 'Market positioning disconnect - revenue miss across enterprise', 
      status: 'strategic-urgent', 
      color: 'bg-red-500',
      actionType: 'REALIGN',
      actionIcon: '🎯',
      actionColor: 'text-red-400 bg-red-500/20',
      urgency: 'Strategic Impact: High',
      explanation: 'Revenue disconnect suggests value proposition misalignment. Cross-functional review needed to realign market positioning.'
    },
    { 
      id: 'T12', 
      type: 'truth', 
      title: 'Competitor patent filings reveal AI infrastructure strategy - verified across 3 sources', 
      status: 'strategic-intelligence', 
      color: 'bg-red-400',
      actionType: 'ANALYZE',
      actionIcon: '🔍',
      actionColor: 'text-red-400 bg-red-500/20',
      urgency: 'Competitive Intel',
      explanation: '24/7 AI monitoring detected patent cluster indicating competitor\'s AI-first pivot. Cross-verified through USPTO filings, industry reports, and hiring patterns.'
    },
    { 
      id: 'T08', 
      type: 'truth', 
      title: 'Employee retention down 15% in critical engineering roles', 
      status: 'talent-risk', 
      color: 'bg-yellow-500',
      actionType: 'RETAIN',
      actionIcon: '👥',
      actionColor: 'text-yellow-400 bg-yellow-500/20',
      urgency: 'Talent Strategy',
      explanation: 'Key talent attrition threatens product roadmap execution. Compensation and culture review needed immediately.'
    },
    
    // Gossip/Internal Signals (G-series)
    { 
      id: 'G23', 
      type: 'gossip', 
      title: 'Engineering velocity vs customer demands creating strategic debt', 
      status: 'balance-needed', 
      color: 'bg-purple-500',
      actionType: 'BALANCE',
      actionIcon: '⚖️',
      actionColor: 'text-yellow-400 bg-yellow-500/20',
      urgency: 'Resource Allocation',
      explanation: 'Technical debt accumulating while customer demands accelerate. Architecture review required to balance velocity vs. sustainability.'
    },
    { 
      id: 'G15', 
      type: 'gossip', 
      title: 'Sales team confidence eroding on Q4 targets - leadership disconnect', 
      status: 'morale-risk', 
      color: 'bg-purple-400',
      actionType: 'ALIGN',
      actionIcon: '🎪',
      actionColor: 'text-purple-400 bg-purple-500/20',
      urgency: 'Team Alignment',
      explanation: 'Sales confidence dropping correlates with unrealistic targets. Leadership calibration needed to restore momentum.'
    },
    { 
      id: 'G31', 
      type: 'gossip', 
      title: 'Cross-department blame patterns emerging - collaboration breakdown', 
      status: 'culture-alert', 
      color: 'bg-purple-600',
      actionType: 'UNITE',
      actionIcon: '🤝',
      actionColor: 'text-purple-400 bg-purple-500/20',
      urgency: 'Cultural Health',
      explanation: 'Silos forming between Product and Engineering. Cross-functional workshop required to restore collaboration.'
    },

    // Market Intelligence (M-series)
    { 
      id: 'M07', 
      type: 'market', 
      title: 'Industry AI-first positioning shift - TechFlow acquisition signals', 
      status: 'competitive-pressure', 
      color: 'bg-orange-500',
      actionType: 'RESPOND',
      actionIcon: '🛡️',
      actionColor: 'text-cyan-400 bg-cyan-500/20',
      urgency: 'Competitive Window',
      explanation: 'Industry shift to AI-first positioning accelerating. Competitive response strategy needed to maintain market position.'
    },
    { 
      id: 'M19', 
      type: 'market', 
      title: 'European privacy regulations tightening - compliance window closing', 
      status: 'regulatory-pressure', 
      color: 'bg-orange-400',
      actionType: 'COMPLY',
      actionIcon: '⚖️',
      actionColor: 'text-orange-400 bg-orange-500/20',
      urgency: 'Regulatory Timeline',
      explanation: 'GDPR enforcement intensifying with new data processing restrictions. Legal and technical compliance strategy needed.'
    },
    { 
      id: 'M25', 
      type: 'market', 
      title: '24/7 monitoring detected: Enterprise RFP language shift toward platform requirements', 
      status: 'market-evolution', 
      color: 'bg-orange-300',
      actionType: 'ADAPT',
      actionIcon: '🔄',
      actionColor: 'text-orange-400 bg-orange-500/20',
      urgency: 'Market Timing',
      explanation: 'AI agents scanning 200+ enterprise RFPs detected 67% increase in platform integration requirements. Product strategy pivot needed to capture emerging demand.'
    },

    // Wisdom of the Crowd (W-series)
    { 
      id: 'W14', 
      type: 'wisdom', 
      title: 'Collective input requested: Nordic expansion vs domestic market focus', 
      status: 'wisdom-gathering', 
      color: 'bg-blue-500',
      actionType: 'GATHER',
      actionIcon: '🧠',
      actionColor: 'text-blue-400 bg-blue-500/20',
      urgency: 'Strategic Choice',
      explanation: 'Cross-functional teams providing input on resource allocation strategy. 73% recommend domestic focus citing market opportunity depth.'
    },
    { 
      id: 'W22', 
      type: 'wisdom', 
      title: 'Organization-wide feasibility assessment: Q4 ambitious targets', 
      status: 'collective-insight', 
      color: 'bg-blue-400',
      actionType: 'VALIDATE',
      actionIcon: '✓',
      actionColor: 'text-blue-400 bg-blue-500/20',
      urgency: 'Reality Check',
      explanation: '85% of teams report concerns about Q4 feasibility. Crowd wisdom suggests 20% target adjustment for realistic achievement.'
    },

    // Additional items for depth
    { 
      id: 'C12', 
      type: 'market', 
      title: 'Nordic expansion vs core market focus - strategic resource allocation', 
      status: 'strategic-choice', 
      color: 'bg-cyan-500',
      actionType: 'PRIORITIZE',
      actionIcon: '📋',
      actionColor: 'text-blue-400 bg-blue-500/20',
      urgency: 'Resource Focus',
      explanation: 'International expansion competing with domestic growth investments. Strategic prioritization required to maximize ROI.'
    },
    { 
      id: 'W03', 
      type: 'wisdom', 
      title: '85% teams report Q3 feasibility concerns', 
      status: 'medium', 
      color: 'bg-yellow-500',
      actionType: 'VALIDATE',
      actionIcon: '✓',
      actionColor: 'text-green-400 bg-green-500/20'
    }
  ];
  
  const maxHooks = 5;
  const sessionStartTime = new Date();
  
  // Generate catch-up summary
  const generateCatchUpSummary = () => {
    const completedActions = conversationHooks.length;
    const currentTopic = highlightedTopics[0] || 'starting point';
    const timeElapsed = Math.floor(lastPauseTime);
    
    return {
      timeElapsed,
      completedActions,
      currentTopic,
      currentMode: isVoiceMode ? 'voice' : 'text',
      summary: `Mötet pausades efter ${timeElapsed}s i ${isVoiceMode ? 'voice' : 'text'}-mode. ${completedActions} strategiska beslut är fattade. Nästa: ${currentTopic}.`
    };
  };
  
  // Add mode switching notification
  const notifyModeSwitch = (newMode: boolean) => {
    if ('speechSynthesis' in window && isConversationActive) {
      const mode = newMode ? 'voice mode' : 'text mode';
      const utterance = new SpeechSynthesisUtterance(`Switched to ${mode}`);
      utterance.rate = 1.5;
      utterance.volume = 0.5;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // Render trend indicator
  const renderTrendIndicator = (trend: number[]) => {
    const points = trend.map((value, index) => {
      const x = (index / (trend.length - 1)) * 20;
      const maxVal = Math.max(...trend);
      const minVal = Math.min(...trend);
      const y = 10 - ((value - minVal) / (maxVal - minVal || 1)) * 8;
      return `${x},${y}`;
    }).join(' ');
    
    const isUpTrend = trend[trend.length - 1] > trend[0];
    return (
      <svg width="24" height="12" className="inline-block ml-1">
        <polyline 
          points={points} 
          fill="none" 
          stroke={isUpTrend ? '#10b981' : '#ef4444'} 
          strokeWidth="1.5"
        />
        <text x="22" y="8" fontSize="8" fill={isUpTrend ? '#10b981' : '#ef4444'}>●</text>
      </svg>
    );
  };

  // Auto-start conversation on app load
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsConversationActive(true);
      setConversationStartTime(new Date());
    }, 1000);
    
    return () => clearTimeout(startDelay);
  }, []);
  
  // Main conversation timeline controller
  useEffect(() => {
    if (isConversationActive) {
      const interval = setInterval(() => {
        setConversationTime(prev => {
          const newTime = prev + 0.1;
          
          // Check for next script event
          const nextEvent = conversationScript.find(event => 
            event.time <= newTime && event.time > prev
          );
          
          if (nextEvent) {
            // More precise timing for highlight animations - coordinate with speech
            const highlightDelay = isVoiceMode ? 800 : 100; // Delay for voice mode to sync with speech
            
            setTimeout(() => {
              setHighlightedTopics(nextEvent.highlight);
            }, highlightDelay);
            
            // Add action package if CEO makes decision
            if (nextEvent.action) {
              const actionTime = conversationStartTime ? 
                new Date(conversationStartTime.getTime() + nextEvent.time * 1000) : new Date();
              
              setConversationHooks(prev => {
                if (!prev.some(hook => hook.id === nextEvent.action!.id)) {
                  return [...prev, {
                    text: getActionText(nextEvent.action!.id),
                    color: getActionColor(nextEvent.action!.id),
                    id: nextEvent.action!.id,
                    action: nextEvent.action!.decision,
                    actionIcon: nextEvent.action!.icon,
                    timestamp: actionTime
                  }];
                }
                return prev;
              });
            }
            
            // Voice synthesis using voice service
            if (isVoiceMode) {
              const voiceService = getVoiceService();
              voiceService.cancel();
              
              const voiceConfig: VoiceConfig = {
                speaker: nextEvent.speaker as 'twin' | 'ceo',
                text: nextEvent.text,
                eventId: nextEvent.eventId
              };
              
              voiceService.speak(voiceConfig).catch(error => {
                console.error('Voice synthesis error:', error);
              });
            }
            
            setCurrentScriptIndex(conversationScript.indexOf(nextEvent));
          }
          
          // End conversation after script completes (shorter demo)
          if (newTime >= 80) {
            setIsConversationActive(false);
            setHighlightedTopics([]);
            return 80;
          }
          
          return newTime;
        });
      }, 100); // Update every 100ms for smooth progress
      
      return () => clearInterval(interval);
    }
  }, [isConversationActive, conversationStartTime]);
  
  // Helper functions for action packages
  const getActionText = (id: string) => {
    const actions: Record<string, string> = {
      'T04': 'Call emergency finance meeting',
      'G23': 'Weekly sales pulse checks', 
      'M07': 'Competitive response strategy',
      'C12': 'Sarah Chen deep dive review',
      'W03': 'Leadership validation rounds'
    };
    return actions[id] || 'Strategic action';
  };
  
  const getActionColor = (id: string) => {
    const colors: Record<string, string> = {
      'T04': 'bg-red-500',
      'G23': 'bg-purple-500',
      'M07': 'bg-orange-500', 
      'C12': 'bg-cyan-500',
      'W03': 'bg-yellow-500'
    };
    return colors[id] || 'bg-slate-500';
  };
  
  // Voice simulation effect
  useEffect(() => {
    if (isVoiceMode) {
      const interval = setInterval(() => {
        const activity = Math.random() * 100;
        setVoiceActivity(activity);
        
        if (activity > 75) {
          const topics = ['T04', 'G23', 'M07', 'C12', 'W03'];
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          setHighlightedTopics([randomTopic]);
          
          // Voice activity simulation - removed as we now use scripted conversation
        }
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isVoiceMode, conversationHooks]);

  // Mode toggle is now handled directly in the buttons above

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const text = inputText.toLowerCase();
    if (text.includes('m07')) {
      setHighlightedTopics(['M07']);
      if (!conversationHooks.some(hook => hook.text === 'TechFlow acquisition')) {
        const now = new Date();
        setConversationHooks(prev => [...prev, { text: 'TechFlow acquisition', timestamp: now }]);
      }
    }
    
    setInputText('');
  };

  const getPulseColor = (pulse: string) => {
    switch(pulse) {
      case 'low': return 'bg-emerald-400';
      case 'medium': return 'bg-yellow-400';  
      case 'high': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Filter prioritized items based on selected filter
  const getFilteredItems = () => {
    if (priorityFilter === 'all') return prioritizedItems;
    return prioritizedItems.filter(item => item.type === priorityFilter);
  };

  // Summary Screen
  if (showSummaryScreen) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
        {/* Demo Description */}
        <div className="bg-slate-950 px-4 py-6 border-b border-slate-800">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-3">Strategic Operations Intelligence - Meeting Summary</h1>
            <p className="text-slate-300 text-sm mb-4">
              Review strategic operational decisions and adjust organizational priorities based on insights.
            </p>
            <button
              onClick={() => setShowSummaryScreen(false)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              ← Back to Demo
            </button>
          </div>
        </div>

        {/* iPhone Frame Container */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative">
            {/* iPhone Frame */}
            <div className="relative bg-black rounded-[2.5rem] p-2 shadow-xl" style={{ width: '375px', height: '667px' }}>
              {/* iPhone Screen */}
              <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden" style={{ width: '359px', height: '651px' }}>
                {/* Status Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-white text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center font-medium">
                    <span className="text-xs ml-1">Meeting Summary</span>
                  </div>
                  <div className="text-xs">9:42 AM</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-6 h-3 border border-white rounded-sm">
                      <div className="w-4 h-1 bg-green-500 rounded-sm m-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Summary Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ height: '600px' }}>
                  {/* Decisions Made */}
                  <div className="bg-slate-800 rounded-lg p-3">
                    <h2 className="text-sm font-semibold text-white mb-3">Strategic Decisions Made</h2>
                    <div className="space-y-2">
                      {completedActions.map((action, index) => (
                        <div key={action.id} className="bg-slate-700 p-3 rounded">
                          <div className="flex items-start space-x-2 mb-2">
                            <span className="text-lg flex-shrink-0">{action.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-white text-xs mb-1">{action.decision}</div>
                              <div className="text-xs text-slate-400 mb-2">Topic: {action.id}</div>
                              {/* Communication Type & Affected Parties */}
                              <div className="flex flex-wrap gap-1 mb-2">
                                {action.id === 'T04' && (
                                  <>
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">#RECOMMENDATION</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#PRODUCT</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#MARKETING</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#SALES</span>
                                  </>
                                )}
                                {action.id === 'G23' && (
                                  <>
                                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">#DIRECT_ORDER</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#ENGINEERING</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#PRODUCT</span>
                                  </>
                                )}
                                {action.id === 'M07' && (
                                  <>
                                    <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded">#CATCHBALL</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#STRATEGY</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#R&D</span>
                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">#MARKETING</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                const updated = [...completedActions];
                                updated[index].confirmed = !updated[index].confirmed;
                                setCompletedActions(updated);
                              }}
                              className={`px-2 py-1 rounded text-xs transition-all flex-1 ${
                                action.confirmed 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                              }`}
                            >
                              {action.confirmed ? '✓ Confirmed' : 'Confirm'}
                            </button>
                            <button className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-xs">
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                      {completedActions.length === 0 && (
                        <div className="text-slate-400 text-center py-4 text-xs">No decisions were made during this meeting.</div>
                      )}
                    </div>
                  </div>

                  {/* Current Priority Queue */}
                  <div className="bg-slate-800 rounded-lg p-3">
                    <h2 className="text-sm font-semibold text-white mb-3">Priority Queue</h2>
                    <div className="space-y-2">
                      {prioritizedItems.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="bg-slate-700 p-3 rounded">
                          <div className="flex items-start space-x-2 mb-2">
                            <span className={`px-1 py-0.5 text-xs font-medium rounded ${item.color} flex-shrink-0`}>
                              {item.id}
                            </span>
                            <div className="flex-1">
                              <div className="text-xs text-white mb-1">{item.title}</div>
                              <div className="text-xs text-slate-400 leading-relaxed">
                                {item.explanation}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <button 
                              className="text-green-400 hover:text-green-300 text-xs px-2 py-1 bg-slate-600 rounded"
                              onClick={() => {
                                console.log('Increase priority for', item.id);
                              }}
                            >
                              Prioritize
                            </button>
                            <span className="text-slate-400 text-xs">{item.urgency}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Backlog Explorer */}
                  <div className="bg-slate-800 rounded-lg p-3">
                    <h2 className="text-sm font-semibold text-white mb-3">Strategic Backlog Explorer</h2>
                    
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      <button
                        onClick={() => setPriorityFilter('all')}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          priorityFilter === 'all' 
                            ? 'bg-slate-600 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        All ({prioritizedItems.length})
                      </button>
                      <button
                        onClick={() => setPriorityFilter('truth')}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          priorityFilter === 'truth' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        Truth ({prioritizedItems.filter(i => i.type === 'truth').length})
                      </button>
                      <button
                        onClick={() => setPriorityFilter('gossip')}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          priorityFilter === 'gossip' 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        Gossip ({prioritizedItems.filter(i => i.type === 'gossip').length})
                      </button>
                      <button
                        onClick={() => setPriorityFilter('market')}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          priorityFilter === 'market' 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        Market ({prioritizedItems.filter(i => i.type === 'market').length})
                      </button>
                      <button
                        onClick={() => setPriorityFilter('wisdom')}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          priorityFilter === 'wisdom' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        Wisdom ({prioritizedItems.filter(i => i.type === 'wisdom').length})
                      </button>
                    </div>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {getFilteredItems().map((item, index) => (
                        <div key={item.id} className="bg-slate-700 p-3 rounded">
                          <div className="flex items-start space-x-2 mb-2">
                            <span className={`px-1 py-0.5 text-xs font-medium rounded ${item.color} flex-shrink-0`}>
                              {item.id}
                            </span>
                            <div className="flex-1">
                              <div className="text-xs text-white mb-1">{item.title}</div>
                              <div className="text-xs text-slate-400 leading-relaxed mb-2">
                                {item.explanation}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-0.5 text-xs rounded ${item.actionColor}`}>
                                    {item.actionIcon} {item.actionType}
                                  </span>
                                  <span className="text-slate-500 text-xs">{item.urgency}</span>
                                </div>
                                <button 
                                  className="text-orange-400 hover:text-orange-300 text-xs px-2 py-1 bg-slate-600 rounded"
                                  onClick={() => {
                                    console.log('Promote to priority queue:', item.id);
                                  }}
                                >
                                  Promote
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {getFilteredItems().length === 0 && (
                        <div className="text-slate-400 text-center py-8 text-xs">
                          No items found for selected filter.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-slate-800 rounded-lg p-3">
                    <h2 className="text-sm font-semibold text-white mb-3">Strategic AI Insights</h2>
                    <div className="space-y-2">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="flex items-start space-x-2">
                          <span className="text-blue-400 text-sm">🤖</span>
                          <div>
                            <div className="font-medium text-white mb-1 text-xs">Priority Logic</div>
                            <div className="text-xs text-slate-300">
                              Market positioning disconnect (T04) drives competitive disadvantage - highest strategic impact.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="flex items-start space-x-2">
                          <span className="text-yellow-400 text-sm">⚡</span>
                          <div>
                            <div className="font-medium text-white mb-1 text-xs">Timing Window</div>
                            <div className="text-xs text-slate-300">
                              Competitive response window for M07 closing - AI integration signals accelerating across industry.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Demo Description */}
      <div className="bg-slate-950 px-4 py-6 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-3">Strategic Operations Intelligence - Living Twin</h1>
          <p className="text-slate-300 text-sm mb-4">
            The critical middle layer between strategy and execution. Living Twin helps CEOs make strategic operational 
            decisions by translating market signals into organizational adjustments while maintaining strategic alignment.
          </p>
          
          {/* Voice Mode Toggle */}
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm text-slate-400">Voice Engine:</label>
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => {
                  setUsePreRecordedVoice(false);
                  switchToTTS();
                }}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  !usePreRecordedVoice
                    ? 'bg-slate-600 text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Browser TTS
              </button>
              <button
                onClick={() => {
                  setUsePreRecordedVoice(true);
                  switchToPreRecorded(language); // Uses default version from config
                }}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  usePreRecordedVoice
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                Pre-recorded
              </button>
            </div>
            {usePreRecordedVoice && (
              <div className="flex items-center gap-4">
                <span className="text-xs text-orange-400">🎙️ Professional voices active</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">Language:</span>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      language === 'en'
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    🇺🇸 EN
                  </button>
                  <button
                    onClick={() => setLanguage('sv')}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      language === 'sv'
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    🇸🇪 SV
                  </button>
                </div>
              </div>
            )}
          </div>
          <p className="text-slate-400 text-xs mb-4">
            <strong>Session Labels:</strong> Strategic items are labeled (T04, G23, M07, etc.) for easy reference during your morning conversation. Labels are session-specific and reset daily.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <h3 className="text-red-400 font-semibold mb-2">Truth & Gossip Intelligence:</h3>
              <ul className="text-slate-400 space-y-1">
                <li>• <strong className="text-red-400">T04</strong>: Truth Agent - Q3 revenue truth from systems</li>
                <li>• <strong className="text-purple-400">G23</strong>: Gossip Agent - Sales confidence patterns (4 reports)</li>
                <li>• Real-time correlation between verified facts and organizational sentiment</li>
                <li>• Anonymous gossip patterns that predict official problems</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">Strategic Intelligence Agents:</h3>
              <ul className="text-slate-400 space-y-1">
                <li>• <strong className="text-orange-400">M07</strong>: Market Intelligence - TechFlow acquisition impact</li>
                <li>• <strong className="text-cyan-400">C12</strong>: Catchball - Strategic feedback loops</li>
                <li>• <strong className="text-yellow-400">W03</strong>: Wisdom - 85% teams validate gossip patterns</li>
                <li>• CEO morning ritual: 5 minutes, 5 items, 5 conversation hooks</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-8">
            <button
              onClick={() => setShowMorePopup(true)}
              className="text-cyan-400 hover:text-cyan-300 text-sm underline transition-colors"
            >
              More: Organizational Vibe Coding & Strategic Intelligence →
            </button>
            <button
              onClick={() => setShowDemoScript(true)}
              className="text-orange-400 hover:text-orange-300 text-sm underline transition-colors"
            >
              Demo Script: Interactive Flow Examples →
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-slate-800 rounded-lg border-l-4 border-emerald-400">
            <p className="text-emerald-200 text-xs">
              <strong>Privacy-by-Design:</strong> This system processes voice locally, extracts strategic insights as text objects, 
              and never transmits raw audio. Executives get strategic intelligence without compromising privacy.
            </p>
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
              
              {/* Demo Interface */}
              <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden" style={{ height: '635px' }}>
        {/* Header */}
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        {/* Strategic KPIs - Three State System */}
        <div className="mb-4">
          {/* KPI State Toggle */}
          <div className="flex justify-center mb-3">
            <div className="flex bg-slate-700 rounded-full p-1">
              <button
                onClick={() => setKpiState('collapsed')}
                className={`w-3 h-3 rounded-full transition-all ${
                  kpiState === 'collapsed' ? 'bg-orange-500' : 'bg-slate-500'
                }`}
              />
              <button
                onClick={() => setKpiState('normal')}
                className={`w-3 h-3 rounded-full mx-2 transition-all ${
                  kpiState === 'normal' ? 'bg-orange-500' : 'bg-slate-500'
                }`}
              />
              <button
                onClick={() => setKpiState('expanded')}
                className={`w-3 h-3 rounded-full transition-all ${
                  kpiState === 'expanded' ? 'bg-orange-500' : 'bg-slate-500'
                }`}
              />
            </div>
          </div>

          {/* KPI Content Based on State */}
          <div className="transition-all duration-500 ease-in-out">
            {kpiState === 'collapsed' && (
              <div className="flex justify-between items-center px-4 py-2 bg-slate-800 rounded-lg animate-in fade-in duration-300">
                <span className="text-orange-400 font-bold">{strategicAlignment}%</span>
                <span className="text-cyan-400 font-bold">{decisionVelocity}d</span>
                <span className="text-green-400 font-bold">{strategicClarity}%</span>
                <span className="text-purple-400 font-bold">{twinAccuracy}%</span>
              </div>
            )}

            {kpiState === 'normal' && (
              <div className="grid grid-cols-4 gap-3 animate-in fade-in duration-300">
          <div className="text-center group relative">
            <div className="cursor-pointer">
              <span className="text-lg font-bold text-orange-400">{strategicAlignment}%</span>
              {/* Trend on hover */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs z-10">
                {renderTrendIndicator(alignmentTrend)}
                <span className="ml-1 text-slate-300">5d trend</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">Strategic Alignment</div>
          </div>
          <div className="text-center group relative">
            <div className="cursor-pointer">
              <span className="text-lg font-bold text-cyan-400">{decisionVelocity}d</span>
              {/* Trend on hover */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs z-10">
                {renderTrendIndicator(velocityTrend)}
                <span className="ml-1 text-slate-300">5d trend</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">Decision Velocity</div>
          </div>
          <div className="text-center group relative">
            <div className="cursor-pointer">
              <span className="text-lg font-bold text-green-400">{strategicClarity}%</span>
              {/* Trend on hover */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs z-10">
                {renderTrendIndicator(clarityTrend)}
                <span className="ml-1 text-slate-300">5d trend</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">Strategic Clarity</div>
          </div>
          <div className="text-center group relative">
            <div className="cursor-pointer">
              <span className="text-lg font-bold text-purple-400">{twinAccuracy}%</span>
              {/* Trend on hover */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded text-xs z-10">
                {renderTrendIndicator(accuracyTrend)}
                <span className="ml-1 text-slate-300">5d trend</span>
              </div>
            </div>
            <div className="text-xs text-slate-400">Twin Accuracy</div>
          </div>
              </div>
            )}

            {kpiState === 'expanded' && (
              <div className="space-y-4 animate-in fade-in duration-300">
              {/* KPI Grid with Enhanced Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-400 text-2xl font-bold">{strategicAlignment}%</span>
                    <div className="flex items-center text-xs">
                      {renderTrendIndicator(alignmentTrend)}
                      <span className="ml-1 text-green-400">+4% this week</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 mb-1">Strategic Alignment</div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${strategicAlignment}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Target: 80% • Trend: Improving</div>
                </div>

                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-400 text-2xl font-bold">{decisionVelocity}d</span>
                    <div className="flex items-center text-xs">
                      {renderTrendIndicator(velocityTrend)}
                      <span className="ml-1 text-green-400">-0.6d faster</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 mb-1">Decision Velocity</div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(20, 100 - (decisionVelocity * 20))}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Target: &lt;3d • Trend: Accelerating</div>
                </div>

                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 text-2xl font-bold">{strategicClarity}%</span>
                    <div className="flex items-center text-xs">
                      {renderTrendIndicator(clarityTrend)}
                      <span className="ml-1 text-green-400">+5% this week</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 mb-1">Strategic Clarity</div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${strategicClarity}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Target: 90% • Trend: Strong</div>
                </div>

                <div className="bg-slate-700 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 text-2xl font-bold">{twinAccuracy}%</span>
                    <div className="flex items-center text-xs">
                      {renderTrendIndicator(accuracyTrend)}
                      <span className="ml-1 text-green-400">+4% this week</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 mb-1">Twin Accuracy</div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${twinAccuracy}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Target: 95% • Trend: Excellent</div>
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-slate-700 p-3 rounded-lg">
                <h4 className="text-slate-200 font-medium mb-2 text-sm">AI Insights</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-yellow-400">⚠️</span>
                    <span className="text-slate-300 ml-1">Decision velocity lagging in Q4 planning</span>
                  </div>
                  <div>
                    <span className="text-green-400">✅</span>
                    <span className="text-slate-300 ml-1">Strategic alignment improving across teams</span>
                  </div>
                  <div>
                    <span className="text-blue-400">📊</span>
                    <span className="text-slate-300 ml-1">Twin accuracy peaks during morning briefs</span>
                  </div>
                  <div>
                    <span className="text-purple-400">🎯</span>
                    <span className="text-slate-300 ml-1">Clarity highest in Technology department</span>
                  </div>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Compact Mode Toggle & Conversation Controls */}
        <div className="flex items-center justify-between mb-2">
          {/* Voice/Text Toggle - Left Side */}
          <div className="flex bg-slate-700 rounded-full p-1">
            <button
              onClick={() => {
                setIsVoiceMode(true);
                if (isConversationActive && !isVoiceMode) {
                  const currentEvent = conversationScript[currentScriptIndex];
                  if (currentEvent) {
                    const voiceService = getVoiceService();
                    const voiceConfig: VoiceConfig = {
                      speaker: currentEvent.speaker as 'twin' | 'ceo',
                      text: currentEvent.text,
                      eventId: currentEvent.eventId
                    };
                    voiceService.speak(voiceConfig).catch(error => {
                      console.error('Voice synthesis error:', error);
                    });
                  }
                }
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all ${
                isVoiceMode ? 'bg-orange-500 text-white' : 'text-slate-300'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span className="text-xs">Voice</span>
            </button>
            <button
              onClick={() => {
                setIsVoiceMode(false);
                if (isConversationActive && isVoiceMode) {
                  getVoiceService().cancel();
                }
              }}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all ${
                !isVoiceMode ? 'bg-cyan-600 text-white' : 'text-slate-300'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span className="text-xs">Text</span>
            </button>
          </div>
          
          {/* Conversation Controls - Right Side */}
          <div className="flex bg-slate-700 rounded-full p-1">
            {/* PLAYING STATE: Only show Pause */}
            {isConversationActive && (
              <button
                onClick={() => {
                  setIsConversationActive(false);
                  setLastPauseTime(conversationTime);
                  setPauseEvents(prev => [...prev, { time: conversationTime, type: 'pause' }]);
                  getVoiceService().cancel();
                }}
                className="flex items-center space-x-1 px-2 py-1 rounded-full transition-all bg-coral-500 hover:bg-coral-600 text-white"
                style={{ backgroundColor: '#FF7F7F' } as React.CSSProperties}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF6B6B'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#FF7F7F'}
                title="Pause meeting"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
                <span className="text-xs">Pause</span>
              </button>
            )}
            
            {/* PAUSED STATE: Show Play, Restart, Finish */}
            {!isConversationActive && (
              <>
                {/* Play/Resume Button */}
                <button
                  onClick={() => {
                    if (conversationTime > 0 && conversationTime < 80) {
                      setShowCatchUp(true);
                      return;
                    }
                    setIsConversationActive(true);
                    if (conversationTime >= 80) {
                      setConversationTime(0);
                      setCurrentScriptIndex(0);
                      setConversationHooks([]);
                      setPauseEvents([]);
                      setConversationStartTime(new Date());
                    }
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded-full transition-all bg-green-500 hover:bg-green-600 text-white"
                  title={conversationTime > 0 ? 'Resume meeting' : 'Start meeting'}
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-xs">{conversationTime > 0 ? 'Resume' : 'Start'}</span>
                </button>
                
                {/* Restart Button */}
                <button
                  onClick={() => {
                    setConversationTime(0);
                    setCurrentScriptIndex(0);
                    setConversationHooks([]);
                    setPauseEvents([{ time: 0, type: 'restart' }]);
                    setConversationStartTime(new Date());
                    setHighlightedTopics([]);
                    setIsConversationActive(true);
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded-full transition-all bg-blue-500 hover:bg-blue-600 text-white"
                  title="Restart from beginning"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                  </svg>
                  <span className="text-xs">Restart</span>
                </button>
                
                {/* Finish Button */}
                <button
                  onClick={() => {
                    getVoiceService().cancel();
                    setIsConversationActive(false);
                    setConversationTime(80);
                    setHighlightedTopics([]);
                    
                    // Collect all actions from conversation hooks
                    const actions = conversationHooks
                      .filter(hook => hook.action && hook.id)
                      .map(hook => ({
                        id: hook.id!,
                        decision: hook.action!,
                        icon: hook.actionIcon || '📋',
                        confirmed: false
                      }));
                    setCompletedActions(actions);
                    setShowSummaryScreen(true);
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded-full transition-all bg-gray-500 hover:bg-gray-600 text-white"
                  title="Finish meeting"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8v8H8V8h8m2-2H6v12h12V6z"/>
                  </svg>
                  <span className="text-xs">Finish</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Priority Backlog */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="mb-2">
          <label className="text-xs text-slate-400">Today's Strategic Queue</label>
        </div>
        <div className="space-y-1">
          {prioritizedItems.slice(0, 5).map((item, index) => (
            <div key={item.id} className={`flex items-center space-x-2 px-2 py-1 rounded transition-all ${
              highlightedTopics.includes(item.id) ? 'bg-slate-700 border border-slate-600' : 'bg-slate-800'
            }`}>
              <span className={`px-2 py-0.5 text-xs font-medium text-white rounded ${item.color}`}>
                {item.id}
              </span>
              <span className="text-xs text-slate-300 truncate flex-1">{item.title}</span>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-md border ${item.actionColor} transition-all`}>
                <span className="text-xs">{item.actionIcon}</span>
                <span className="text-xs font-medium">{item.actionType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prominent Conversation Controls */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-850">
        {/* Main status bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConversationActive ? 'bg-orange-400 animate-pulse' : 'bg-slate-600'}`}></div>
            <label className="text-sm text-slate-300 font-medium">
              {isConversationActive ? 
                `${conversationScript[currentScriptIndex]?.speaker === 'twin' ? 'Twin' : 'CEO'} speaking` : 
                conversationTime >= 100 ? 'Meeting complete' : 'Meeting paused'}
            </label>
          </div>
          <span className="text-sm text-slate-400 font-mono">
            {Math.floor(conversationTime)}s / 80s
          </span>
        </div>
        
        
        {/* Compact Status */}
        <div className="text-center mt-1">
          <span className="text-xs text-slate-500">
            {isConversationActive 
              ? `${isVoiceMode ? '🔊' : '📱'} ${conversationScript[currentScriptIndex]?.speaker === 'twin' ? 'Twin' : 'CEO'} speaking` 
              : conversationTime > 0 
                ? 'Paused - Resume, Replay, or Finish'
                : 'Ready for executive briefing'}
          </span>
        </div>
      </div>

      {/* What I Heard You Say - Gift Packages Timeline */}
      <div className="px-4 py-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">What I heard you say</span>
          <span className="text-xs text-slate-500">{conversationHooks.length}/{maxHooks} packages</span>
        </div>
        
        {conversationHooks.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            Gift packages will appear as strategic concepts emerge...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {conversationHooks.map((hook, index) => {
              const absoluteTime = conversationStartTime ? 
                Math.floor((hook.timestamp.getTime() - conversationStartTime.getTime()) / 1000) : 0;
              const timeDisplay = absoluteTime < 60 ? `${absoluteTime}s` : `${Math.floor(absoluteTime / 60)}:${(absoluteTime % 60).toString().padStart(2, '0')}`;
              
              return (
                <div 
                  key={index} 
                  className={`relative group animate-bounce-in`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* CEO Decision Gift Package */}
                  <div className={`w-14 h-12 rounded-lg ${hook.color || 'bg-slate-600'} relative shadow-lg transform transition-all duration-200 hover:scale-110 border-2 border-yellow-300`}>
                    {/* Topic ID at top */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 text-xs font-bold rounded px-1">
                      {hook.id}
                    </div>
                    {/* Action icon in center */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-lg">
                      {hook.actionIcon}
                    </div>
                    {/* Action type at bottom */}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-slate-900 text-yellow-300 text-xs font-medium px-1 rounded text-center whitespace-nowrap">
                      {hook.action}
                    </div>
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-yellow-300 opacity-20 animate-pulse"></div>
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <span className="font-bold">{hook.id}</span>
                        <span>{hook.actionIcon}</span>
                      </div>
                      <div className="font-medium text-yellow-300">{hook.action}</div>
                      <div className="text-slate-300 text-xs mt-1">{hook.text}</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-slate-900"></div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="text-xs text-slate-500 text-center mt-1">{timeDisplay}</div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* YouTube-style Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Conversation Progress</span>
            <span>{Math.floor(conversationTime)}% complete</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 cursor-pointer relative group"
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const clickX = e.clientX - rect.left;
                 const newTime = (clickX / rect.width) * 100;
                 setConversationTime(Math.max(0, Math.min(100, newTime)));
               }}>
            <div 
              className="bg-gradient-to-r from-cyan-500 to-orange-500 h-2 rounded-full transition-all duration-100 relative"
              style={{ width: `${conversationTime}%` }}
            >
              {/* YouTube-style scrubber */}
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
            </div>
            {/* Conversation event markers */}
            {conversationScript.map((event, index) => (
              <div 
                key={`script-${index}`}
                className="absolute top-0 w-0.5 h-2 bg-white opacity-30"
                style={{ left: `${event.time}%` }}
                title={`${event.time}s: ${event.speaker === 'twin' ? 'Twin' : 'CEO'}`}
              />
            ))}
            
            {/* Pause/Resume markers */}
            {pauseEvents.map((event, index) => (
              <div 
                key={`pause-${index}`}
                className={`absolute top-0 w-1 h-2 ${
                  event.type === 'pause' ? 'bg-yellow-400' :
                  event.type === 'resume' ? 'bg-green-400' :
                  'bg-blue-400'
                }`}
                style={{ left: `${event.time}%` }}
                title={`${Math.floor(event.time)}s: ${
                  event.type === 'pause' ? 'Paused' :
                  event.type === 'resume' ? 'Resumed' :
                  'Restarted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Voice Activity (Voice Mode During Meeting) */}
      {isVoiceMode && isConversationActive && (
        <div className="px-4 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Audio Active</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-end space-x-1 h-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-orange-500 transition-all duration-150 animate-pulse"
                    style={{
                      height: `${8 + (i * 2)}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-300">Speaking</span>
            </div>
          </div>
        </div>
      )}

      {/* Flexible space */}
      <div className="flex-1 px-4 py-4">
        {/* Empty space for clean mobile interface */}
      </div>

      {/* Current Conversation Text Display (Text Mode) */}
      {!isVoiceMode && isConversationActive && (
        <div className="px-4 py-3 border-b border-slate-800">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">
                {conversationScript[currentScriptIndex]?.speaker === 'twin' ? 'Organizational Twin' : 'CEO'}
              </span>
              <span className="text-xs text-slate-500">
                {Math.floor(conversationTime)}s
              </span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {conversationScript[currentScriptIndex]?.text || 'Meeting starting...'}
            </p>
          </div>
        </div>
      )}
      
      {/* Text Input (Available when not in active voice conversation) */}
      {!isVoiceMode && (!isConversationActive || conversationTime >= 100) && (
        <div className="px-4 pb-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700">
            <textarea
              value={inputText}
              onChange={(e) => {
                if (e.target.value.length <= 280) {
                  setInputText(e.target.value);
                }
              }}
              placeholder={conversationTime >= 100 ? "Meeting complete - ask follow-up questions..." : "Ask about strategic priorities..."}
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm p-4 resize-none focus:outline-none"
              rows={3}
            />
            <div className="flex items-center justify-between p-4 pt-0">
              <span className="text-xs text-slate-500">{inputText.length}/280</span>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-full"
                disabled={!inputText.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          </div>
          
          {/* Navigation to other role demos */}
          <div className="flex flex-col space-y-3">
            <button className="bg-gradient-to-r from-cyan-600 to-orange-600 hover:from-cyan-700 hover:to-orange-700 text-white text-sm px-4 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              Go to live demo →
            </button>
            
            <button 
              onClick={() => window.location.href = '/vp-sales-demo'}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm px-4 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              VP Sales Demo →
            </button>
            
            <div className="text-xs text-slate-400 text-center">
              See how different roles use Living Twin
            </div>
          </div>
        </div>
      </div>

      {/* More Information Popup */}
    {showMorePopup && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Organizational Vibe Coding & Strategic Intelligence</h2>
              <button
                onClick={() => setShowMorePopup(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="text-orange-400 font-semibold mb-3">🎵 Vibe Coding Your Organization</h3>
                <p className="text-slate-300 mb-3">
                  Think about it like a DJ reading the crowd - but for your organization. You're not managing spreadsheets, 
                  you're <strong>conducting organizational energy</strong> and sensing when something's off before problems compound.
                </p>
                <ul className="text-slate-400 space-y-1 list-disc list-inside">
                  <li><strong>Daily vibe check:</strong> "How's the energy?" - Strategic pulse in 5 minutes</li>
                  <li><strong>Signal translation:</strong> Market signals become organizational adjustments</li>
                  <li><strong>Strategic tempo:</strong> Between quarterly strategy and daily operations</li>
                  <li><strong>Alignment maintenance:</strong> Strategy stays connected to execution reality</li>
                </ul>
              </div>

              <div>
                <h3 className="text-purple-400 font-semibold mb-3">🔄 Communication Challenge & Solution</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-slate-200 font-medium mb-2">Traditional Challenges:</h4>
                    <ul className="text-slate-400 space-y-1 list-disc list-inside text-xs">
                      <li>Quarterly reviews → 90+ day feedback loops</li>
                      <li>Information silos → Departments don't share real concerns</li>
                      <li>Meeting fatigue → Hours of status updates, little insight</li>
                      <li>Strategic blind spots → Leaders miss 70% of organizational reality</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-slate-200 font-medium mb-2">Living Twin Solution:</h4>
                    <ul className="text-slate-400 space-y-1 list-disc list-inside text-xs">
                      <li>Daily insights → 1-7 day feedback loops</li>
                      <li>Cross-correlation → Connect market trends, gossip, and data</li>
                      <li>5-5-5 constraint → 5 minutes, 5 items, 5 conversation hooks</li>
                      <li>Organizational superintelligence → See what leaders typically miss</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-cyan-400 font-semibold mb-3">⚡ Business Acceleration Impact</h3>
                <p className="text-slate-300 mb-3">
                  This isn't just communication improvement - it's <strong>strategic decision-making at the speed of thought</strong>.
                  The feedback loop tightens from months to days, enabling:
                </p>
                <ul className="text-slate-400 space-y-1 list-disc list-inside">
                  <li><strong>Predictive intelligence:</strong> Gossip patterns often predict official problems by weeks</li>
                  <li><strong>Strategic agility:</strong> Adjust direction before small issues become crises</li>
                  <li><strong>Organizational alignment:</strong> Everyone understands the "why" behind strategic shifts</li>
                  <li><strong>Competitive advantage:</strong> React to market changes while competitors are still planning</li>
                </ul>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border-l-4 border-emerald-400">
                <h4 className="text-emerald-400 font-semibold mb-2">🎯 Strategic Operations Metrics</h4>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-orange-400 font-medium">Strategic Alignment:</span>
                    <p className="text-slate-400">How well operational decisions support strategic direction</p>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-medium">Decision Velocity:</span>
                    <p className="text-slate-400">Speed of translating strategic signals into organizational adjustments</p>
                  </div>
                  <div>
                    <span className="text-green-400 font-medium">Strategic Clarity:</span>
                    <p className="text-slate-400">Reduction in clarification requests over time</p>
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium">Twin Accuracy:</span>
                    <p className="text-slate-400">AI prediction success rate for organizational responses</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowMorePopup(false)}
                className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
              >
                Got it - Back to Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Demo Script Popup */}
    {showDemoScript && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Demo Script: Interactive Flow Examples</h2>
              <button
                onClick={() => setShowDemoScript(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="text-orange-400 font-semibold mb-3">📱 How to Interact with the Demo</h3>
                <p className="text-slate-300 mb-3">
                  This is a <strong>live simulation</strong> of the CEO morning ritual. The interface responds to your interactions and demonstrates real organizational intelligence patterns.
                </p>
                <ul className="text-slate-400 space-y-2 list-disc list-inside">
                  <li><strong>Voice/Text Toggle:</strong> Switch between modes to see different interaction patterns</li>
                  <li><strong>Strategic Items:</strong> Watch T04, G23, M07, C12, W03 highlight as the Twin "speaks"</li>
                  <li><strong>Conversation Hooks:</strong> Real-time timeline shows strategic concepts being captured</li>
                  <li><strong>KPI Updates:</strong> Strategic metrics evolve based on interaction patterns</li>
                  <li><strong>5-minute timer:</strong> Progress bar shows constraint conversation in action</li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-cyan-400 font-semibold mb-3">🎯 Simple Interaction Flow</h3>
                  <div className="bg-slate-900 rounded-lg p-4 space-y-3 text-xs">
                    <div className="border-l-4 border-orange-500 pl-3">
                      <strong className="text-orange-300">CEO arrives at 9:41 AM</strong>
                      <p className="text-slate-400 mt-1">Twin: "Good morning. Five strategic items in today's queue..."</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3">
                      <strong className="text-red-300">T04 Truth highlighted</strong>
                      <p className="text-slate-400 mt-1">CEO notices: "Q3 revenue missed by 8%" - immediate attention</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <strong className="text-purple-300">G23 Gossip correlates</strong>
                      <p className="text-slate-400 mt-1">CEO sees pattern: "Sales confidence dropping" - validates the truth</p>
                    </div>
                    <div className="border-l-4 border-cyan-500 pl-3">
                      <strong className="text-cyan-300">CEO takes action</strong>
                      <p className="text-slate-400 mt-1">"Initiate catchball with sales leadership" - strategic response</p>
                    </div>
                    <div className="border-l-4 border-emerald-500 pl-3">
                      <strong className="text-emerald-300">4 minutes elapsed</strong>
                      <p className="text-slate-400 mt-1">Strategic alignment improves, decision velocity accelerates</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-purple-400 font-semibold mb-3">🔮 Gossip-to-Truth Evolution</h3>
                  <div className="bg-slate-900 rounded-lg p-4 space-y-3 text-xs">
                    <div className="border-l-4 border-purple-500 pl-3">
                      <strong className="text-purple-300">Week 1: G15 emerges</strong>
                      <p className="text-slate-400 mt-1">"New system causing more work" - 1 report, confidence 0.3</p>
                    </div>
                    <div className="border-l-4 border-purple-400 pl-3">
                      <strong className="text-purple-300">Week 2: Pattern builds</strong>
                      <p className="text-slate-400 mt-1">3 similar reports across departments, confidence 0.5</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-3">
                      <strong className="text-orange-300">Week 3: Market correlation</strong>
                      <p className="text-slate-400 mt-1">M12: "Industry productivity trends declining" - external validation</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-3">
                      <strong className="text-yellow-300">Week 4: Wisdom confirms</strong>
                      <p className="text-slate-400 mt-1">W08: "80% teams report efficiency concerns" - crowd validation</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-3">
                      <strong className="text-red-300">Week 5: Truth emerges</strong>
                      <p className="text-slate-400 mt-1">T15: "Developer productivity down 25%" - gossip becomes verified truth</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border-l-4 border-orange-400">
                <h4 className="text-orange-400 font-semibold mb-2">💡 Demo Interaction Tips</h4>
                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <strong className="text-slate-200">Visual Cues:</strong>
                    <ul className="text-slate-400 mt-1 space-y-1">
                      <li>• Strategic items pulse when "mentioned"</li>
                      <li>• Hooks appear with real timestamps</li>
                      <li>• KPIs subtly shift based on interactions</li>
                      <li>• Progress bar shows 5-minute constraint</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-slate-200">Interaction Points:</strong>
                    <ul className="text-slate-400 mt-1 space-y-1">
                      <li>• Toggle voice/text to see mode differences</li>
                      <li>• Watch correlation patterns emerge</li>
                      <li>• Notice strategic vs operational boundaries</li>
                      <li>• Experience constraint conversation flow</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setShowDemoScript(false)}
                className="bg-orange-600 hover:bg-orange-700 px-6 py-2 rounded-lg text-white font-medium transition-colors"
              >
                Start Interacting with Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Catch-Up Summary Popup */}
    {showCatchUp && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg max-w-lg w-full border border-slate-600">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center">
                ⏱ Catch-Up Summary
              </h2>
              <button
                onClick={() => setShowCatchUp(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-lg p-4">
                <h3 className="text-orange-400 font-semibold mb-2">📊 Progress så här långt</h3>
                <p className="text-slate-300 text-sm mb-3">
                  {generateCatchUpSummary().summary}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Current mode: {generateCatchUpSummary().currentMode === 'voice' ? '🔊 Voice' : '📱 Text'}</span>
                  <span>You can switch modes anytime</span>
                </div>
                
                {/* Quick action items recap */}
                {conversationHooks.length > 0 && (
                  <div>
                    <h4 className="text-slate-400 text-xs font-medium mb-2">Beslut fattade:</h4>
                    <div className="flex flex-wrap gap-1">
                      {conversationHooks.map((hook, index) => (
                        <div key={index} className="flex items-center space-x-1 bg-slate-700 px-2 py-1 rounded">
                          <span className="text-xs font-bold">{hook.id}</span>
                          <span className="text-xs">{hook.actionIcon}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowCatchUp(false);
                    setIsConversationActive(true);
                    // Continue from where we left off
                    setPauseEvents(prev => [...prev, { time: conversationTime, type: 'resume' }]);
                    
                    // Resume audio if in voice mode
                    if (isVoiceMode) {
                      const currentEvent = conversationScript[currentScriptIndex];
                      if (currentEvent && 'speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(currentEvent.text);
                        utterance.rate = currentEvent.speaker === 'twin' ? 1.0 : 1.2;
                        utterance.pitch = currentEvent.speaker === 'twin' ? 0.9 : 1.1;
                        utterance.volume = 0.7;
                        window.speechSynthesis.speak(utterance);
                      }
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  ▶ Fortsätt i {isVoiceMode ? 'voice' : 'text'}-mode
                </button>
                
                <button
                  onClick={() => {
                    setShowCatchUp(false);
                    setIsConversationActive(true);
                    // Restart with fast summary
                    setConversationTime(0);
                    setCurrentScriptIndex(0);
                    setConversationHooks([]);
                    setPauseEvents([{ time: 0, type: 'restart' }]);
                    setConversationStartTime(new Date());
                    setHighlightedTopics([]);
                    
                    // Quick summary speech (only if voice mode)
                    if (isVoiceMode && 'speechSynthesis' in window) {
                      const summary = `Snabb sammanfattning: ${conversationHooks.length} beslut fattade. Startar om från början.`;
                      const utterance = new SpeechSynthesisUtterance(summary);
                      utterance.rate = 1.3;
                      utterance.pitch = 1.0;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                >
                  🔄 Starta om i {isVoiceMode ? 'voice' : 'text'}-mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default LivingTwinMobile;

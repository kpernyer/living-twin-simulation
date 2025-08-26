import React, { useState } from 'react';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

interface VPSalesViewSimpleProps {
  ceoActions?: Array<{id: string, decision: string, icon: string}>;
}

export const VPSalesViewSimple: React.FC<VPSalesViewSimpleProps> = ({ ceoActions = [] }) => {
  const [completedPriorities, setCompletedPriorities] = useState<string[]>([]);

  const togglePriority = (id: string) => {
    setCompletedPriorities(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="vp-sales-view flex justify-center items-center">
      {/* Same iPhone Frame as CEO view */}
      <div className="bg-slate-900 rounded-[3rem] p-2 shadow-2xl border-8 border-slate-800">
        <div className="bg-black rounded-[2.5rem] overflow-hidden" style={{ width: '375px', height: '667px' }}>
          {/* Status Bar - Same as CEO */}
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
          
          {/* VP Sales Content */}
          <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden" style={{ height: '635px' }}>
            {/* Header */}
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  VS
                </div>
                <div>
                  <h1 className="text-md font-semibold text-white">VP Sales Dashboard</h1>
                  <p className="text-slate-400 text-xs">Post-CEO Briefing • Priority Actions</p>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
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
                    {/* Strategic Revenue Review */}
                    <div className="border border-red-600 bg-red-900/20 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm">Strategic Revenue Review</h3>
                          <p className="text-xs text-slate-300 mt-1">Lead enterprise segment value proposition analysis</p>
                          <p className="text-xs text-slate-400 mt-2 italic">"Q3 revenue miss - 8% below target in enterprise segment"</p>
                          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                            <span>👤 Sales Leadership</span>
                            <span>📅 Today 4PM</span>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePriority('revenue')}
                          className={`ml-3 p-1 rounded ${
                            completedPriorities.includes('revenue')
                              ? 'text-green-400'
                              : 'text-slate-400 hover:text-green-400'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Competitive Response */}
                    <div className="border border-orange-600 bg-orange-900/20 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm">Competitive Response Strategy</h3>
                          <p className="text-xs text-slate-300 mt-1">Develop counter-positioning to TechFlow acquisition</p>
                          <p className="text-xs text-slate-400 mt-2 italic">"TechFlow $2.1B acquisition signals AI-first positioning shift"</p>
                          <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                            <span>👤 Sales & Marketing</span>
                            <span>📅 Tomorrow EOD</span>
                          </div>
                        </div>
                        <button
                          onClick={() => togglePriority('competitive')}
                          className={`ml-3 p-1 rounded ${
                            completedPriorities.includes('competitive')
                              ? 'text-green-400'
                              : 'text-slate-400 hover:text-green-400'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </div>
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
                    <div className="border border-slate-600 bg-slate-800/50 rounded p-3">
                      <h3 className="text-xs font-medium text-white">Enterprise customers requesting AI roadmap clarity</h3>
                      <p className="text-xs text-slate-400 mt-1">73% of enterprise prospects asking about AI strategy in Q3</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-400">👥 Customer Feedback</span>
                        <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">87% conf.</span>
                      </div>
                    </div>
                    
                    <div className="border border-slate-600 bg-slate-800/50 rounded p-3">
                      <h3 className="text-xs font-medium text-white">TechFlow poaching attempts increasing</h3>
                      <p className="text-xs text-slate-400 mt-1">3 key accounts received TechFlow proposals this week</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-red-400">🎯 Competitive Intel</span>
                        <span className="text-xs text-green-400 bg-green-900 px-2 py-1 rounded">95% conf.</span>
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
};
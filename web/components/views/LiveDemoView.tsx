import React from 'react';
import { Play, Sparkles, Users, TrendingUp } from 'lucide-react';

interface LiveDemoViewProps {
  onStartDemo?: () => void;
}

export const LiveDemoView: React.FC<LiveDemoViewProps> = ({ onStartDemo }) => {
  return (
    <div className="live-demo-view max-w-md mx-auto bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <Play className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Interactive Demo</h1>
            <p className="text-green-100 text-sm">Experience Living Twin in Action</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Demo Overview */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="text-green-600" size={32} />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Ready to Experience Living Twin?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              You've seen how strategic decisions cascade through the organization. 
              Now experience the CEO briefing that started it all.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
            <Users className="text-blue-500 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-slate-800">AI-Powered Briefings</h3>
              <p className="text-sm text-slate-600">Experience natural conversations with your Digital Twin assistant</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
            <TrendingUp className="text-green-500 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-slate-800">Strategic Intelligence</h3>
              <p className="text-sm text-slate-600">See how data becomes decisions in real organizational context</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
            <Sparkles className="text-purple-500 mt-1" size={20} />
            <div>
              <h3 className="font-medium text-slate-800">Cascading Actions</h3>
              <p className="text-sm text-slate-600">Watch decisions flow through organizational layers naturally</p>
            </div>
          </div>
        </div>

        {/* Demo Journey Recap */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-3">Your Journey So Far</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700">CEO receives strategic briefing from Digital Twin</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700">VP Sales gets high-priority actions & shares field insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700">VP Engineering receives technical priorities & system wisdom</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700">Now: Experience the interactive CEO briefing</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStartDemo}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3"
        >
          <Play size={24} />
          <span>Start Interactive Demo</span>
        </button>

        {/* Demo Info */}
        <div className="text-center text-xs text-slate-500">
          <p>~3 minutes • Voice-enabled • Professional AI voices</p>
        </div>
      </div>
    </div>
  );
};
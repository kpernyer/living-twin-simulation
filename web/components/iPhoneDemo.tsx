import React from 'react';

interface iPhoneDemoProps {
  // All the props needed for the demo functionality
  kpiState: 'normal' | 'collapsed' | 'expanded';
  setKpiState: (state: 'normal' | 'collapsed' | 'expanded') => void;
  strategicAlignment: number;
  decisionVelocity: number;
  strategicClarity: number;
  twinAccuracy: number;
  alignmentTrend: number[];
  velocityTrend: number[];
  clarityTrend: number[];
  accuracyTrend: number[];
  renderTrendIndicator: (trend: number[]) => React.ReactNode;
  prioritizedItems: any[];
  priorityFilter: string;
  setPriorityFilter: (filter: string) => void;
  highlightedTopics: string[];
  conversationHooks: any[];
  isVoiceMode: boolean;
  setIsVoiceMode: (mode: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  voiceActivity: number;
  isConversationActive: boolean;
  setIsConversationActive: (active: boolean) => void;
  conversationScript: any[];
  currentScriptIndex: number;
  conversationTime: number;
  showCatchUp: boolean;
  setShowCatchUp: (show: boolean) => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleSendMessage: () => void;
  usePreRecordedVoice: boolean;
  setUsePreRecordedVoice: (use: boolean) => void;
  switchToPreRecorded: (language: string) => void;
  switchToTTS: () => void;
  language: 'en' | 'sv';
  setLanguage: (lang: 'en' | 'sv') => void;
}

// For now, let me create a simplified placeholder that shows the basic structure
// We can copy the full content later in smaller chunks
export const IPhoneDemo: React.FC<iPhoneDemoProps> = (props) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white overflow-hidden" style={{ height: '635px' }}>
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-2 text-orange-400">CEO Strategic Briefing</h3>
        <p className="text-sm text-slate-300 mb-4">Complete iPhone demo functionality will be moved here...</p>
        <div className="bg-slate-800 p-3 rounded-lg">
          <div className="text-xs text-slate-400">This is a placeholder - the full demo content needs to be copied from the interactive section</div>
        </div>
        
        {/* Quick test of some props */}
        <div className="mt-4 space-y-2">
          <div className="text-xs bg-slate-700 p-2 rounded">
            Strategic Alignment: {props.strategicAlignment}%
          </div>
          <div className="text-xs bg-slate-700 p-2 rounded">
            KPI State: {props.kpiState}
          </div>
        </div>
      </div>
    </div>
  );
};
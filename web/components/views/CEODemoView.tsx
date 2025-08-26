import React from 'react';

interface CEODemoViewProps {
  children: React.ReactNode; // The complete iPhone demo content
}

export const CEODemoView: React.FC<CEODemoViewProps> = ({ children }) => {
  return (
    <div className="ceo-demo-view flex justify-center items-center">
      {/* iPhone Frame with all existing functionality */}
      <div className="bg-slate-900 rounded-[3rem] p-2 shadow-2xl border-8 border-slate-800">
        {children}
      </div>
    </div>
  );
};
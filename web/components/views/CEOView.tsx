import React from 'react';

interface CEOViewProps {
  // Pass through all the props needed for the existing demo
  children: React.ReactNode;
}

export const CEOView: React.FC<CEOViewProps> = ({ children }) => {
  return (
    <div className="ceo-view">
      {/* This will contain the existing iPhone demo interface */}
      {children}
    </div>
  );
};
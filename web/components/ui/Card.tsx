import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

export default function Card({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'lg'
}: CardProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    sm: 'shadow',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div className={`
      bg-white rounded-xl border border-gray-100 
      ${paddingClasses[padding]} 
      ${shadowClasses[shadow]}
      ${className}
    `}>
      {children}
    </div>
  );
}

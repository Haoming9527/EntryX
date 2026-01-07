import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`
        glass-card rounded-2xl overflow-hidden
        ${hover ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-900/20 hover:border-purple-500/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

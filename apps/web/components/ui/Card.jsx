import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div 
      className={`
        bg-white rounded-2xl border border-gray-200 p-6 
        ${hover ? 'hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

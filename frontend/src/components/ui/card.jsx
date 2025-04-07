import React from 'react';

// Card Wrapper
export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-md ${className || ''}`}>
      {children}
    </div>
  );
};

// Card Content
export const CardContent = ({ children, className }) => {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      {children}
    </div>
  );
};

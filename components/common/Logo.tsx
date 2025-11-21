
import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Passport Booklet Shape */}
      <rect x="10" y="6" width="40" height="52" rx="4" className="fill-indigo-600" />
      
      {/* Spine Detail */}
      <path d="M14 6V58" stroke="white" strokeOpacity="0.2" strokeWidth="2" />
      
      {/* Emblem - stylized circle and star */}
      <circle cx="30" cy="26" r="9" stroke="white" strokeWidth="2.5" />
      <path d="M30 20V32M24 26H36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="26" r="3" className="fill-white" />
      
      {/* Text Lines representing form data */}
      <rect x="20" y="42" width="20" height="3" rx="1.5" className="fill-indigo-200" />
      <rect x="20" y="48" width="14" height="3" rx="1.5" className="fill-indigo-200" />
      
      {/* Badge Background for Pen */}
      <circle cx="50" cy="50" r="12" className="fill-white dark:fill-gray-800" stroke="currentColor" strokeWidth="0" />
      
      {/* Pen Icon */}
      <path 
        d="M44 54H46.5L55.5 45L53 42.5L44 51.5V54Z" 
        className="fill-indigo-600 dark:fill-indigo-400" 
      />
      <path 
        d="M53 42.5L55.5 45" 
        stroke="currentColor" 
        strokeWidth="1" 
        className="text-indigo-800 dark:text-indigo-200" 
      />
    </svg>
  );
};

export default Logo;

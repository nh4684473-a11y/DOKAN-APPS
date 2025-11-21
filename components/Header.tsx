
import React from 'react';
import { Logo } from './common/Logo';

interface HeaderProps {
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
           {onBack && (
             <button 
               onClick={onBack}
               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2 text-gray-600 dark:text-gray-300"
               title="ফিরে যান"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
               </svg>
             </button>
           )}
           <Logo className="h-10 w-10" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
            পাসপোর্ট অফিস আবেদন জেনারেটর
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

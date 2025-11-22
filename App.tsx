
import React, { useState } from 'react';
import PassportApp from './components/PassportApp';
import UndertakingApp from './components/UndertakingApp';
import ChildPermissionApp from './components/ChildPermissionApp';
import PhotoApp from './components/PhotoApp';
import { Logo } from './components/common/Logo';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'passport' | 'undertaking' | 'childPermission' | 'photo'>('home');

  if (currentView === 'passport') {
    return <PassportApp onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'undertaking') {
    return <UndertakingApp onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'childPermission') {
    return <ChildPermissionApp onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'photo') {
    return <PhotoApp onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-600 p-1.5 rounded-lg">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                   </svg>
                </div>
                <div className="text-xl font-bold text-gray-800 dark:text-white">ই-সেবা পোর্টাল</div>
              </div>
              <div className="hidden md:flex space-x-8">
                  <button className="text-indigo-600 dark:text-indigo-400 font-medium">নীড়পাতা</button>
                  <button className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">সেবাসমূহ</button>
                  <button className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white transition-colors">যোগাযোগ</button>
              </div>
           </div>
        </div>
      </nav>

      {/* Features/Services Section */}
      <main className="flex-grow container mx-auto px-6 py-16">
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">জনপ্রিয় সেবাসমূহ</h2>
              <p className="text-gray-600 dark:text-gray-400">আপনার কাঙ্ক্ষিত সেবাটি নির্বাচন করুন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Passport Application Card */}
              <div 
                onClick={() => setCurrentView('passport')}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group transform hover:-translate-y-1"
              >
                  <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                      <Logo className="h-10 w-10 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">পাসপোর্ট আবেদন</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    পাসপোর্টে তথ্য সংশোধন, রি-ইস্যু, নাম পরিবর্তন বা হারানো পাসপোর্টের জন্য অটোমেটেড আবেদন পত্র তৈরি করুন।
                  </p>
                  <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold">
                      <span>শুরু করুন</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                  </div>
              </div>

              {/* Undertaking (Angikarnama) Card */}
              <div 
                onClick={() => setCurrentView('undertaking')}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group transform hover:-translate-y-1"
              >
                  <div className="h-16 w-16 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-green-600 dark:text-green-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">পাসপোর্ট অঙ্গীকারনামা</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    পাসপোর্ট তথ্য পরিবর্তন বা সংশোধনের জন্য প্রয়োজনীয় অঙ্গীকারনামা বা হলফনামা অটোমেটেডভাবে তৈরি করুন।
                  </p>
                  <div className="mt-6 flex items-center text-green-600 dark:text-green-400 font-semibold">
                      <span>তৈরি করুন</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                  </div>
              </div>

              {/* Child Passport Permission Card */}
              <div 
                onClick={() => setCurrentView('childPermission')}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group transform hover:-translate-y-1"
              >
                  <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">অপ্রাপ্তবয়স্ক সন্তানের পাসপোর্ট অনুমতি</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    পিতা/মাতার পক্ষ থেকে সন্তানের পাসপোর্ট ইস্যুর জন্য অনাপত্তি বা সম্মতিপত্র (NOC) তৈরি করুন।
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                      <span>তৈরি করুন</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                  </div>
              </div>

              {/* AI Passport Photo Maker Card - Now Active */}
              <div 
                onClick={() => setCurrentView('photo')}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group transform hover:-translate-y-1"
              >
                  <div className="h-16 w-16 bg-pink-100 dark:bg-pink-900/40 rounded-xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-pink-600 dark:text-pink-400 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">এআই পাসপোর্ট ফটো মেকার</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    স্বয়ংক্রিয়ভাবে ব্যাকগ্রাউন্ড রিমুভ করে পারফেক্ট পাসপোর্ট সাইজ ছবি তৈরি করুন।
                  </p>
                  <div className="mt-6 flex items-center text-pink-600 dark:text-pink-400 font-semibold">
                      <span>তৈরি করুন</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                  </div>
              </div>
          </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">&copy; ২০২৫ ই-সেবা পোর্টাল। সর্বস্বত্ব সংরক্ষিত।</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white">গোপনীয়তা নীতি</a>
                <a href="#" className="text-gray-400 hover:text-white">শর্তাবলী</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

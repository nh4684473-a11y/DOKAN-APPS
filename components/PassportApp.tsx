
import React, { useState } from 'react';
import type { ApplicationData, ApplicationSubmission } from '../types';
import ApplicationForm from './ApplicationForm';
import ApplicationPreview from './ApplicationPreview';
import Header from './Header';

interface PassportAppProps {
  onBack: () => void;
}

const PassportApp: React.FC<PassportAppProps> = ({ onBack }) => {
  const [applicationData, setApplicationData] = useState<ApplicationSubmission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // State to manage mobile view tab (Form vs Preview)
  // On desktop, this state is ignored as we show side-by-side
  const [mobileView, setMobileView] = useState<'form' | 'preview'>('form');
  
  const initialFormData: ApplicationData = {
    name: '',
    father: '',
    mother: '',
    village: '',
    postOffice: '',
    thana: '',
    district: '',
    nid: '',
    subject: '',
    passportNo: '',
  };

  const handleGenerate = (data: ApplicationSubmission) => {
    setIsLoading(true);
    // Simulate API call / processing
    setTimeout(() => {
      setApplicationData(data);
      setIsLoading(false);
      // On mobile, automatically switch to preview after generation
      setMobileView('preview');
      // Scroll to top for better UX on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };
  
  const handleReset = () => {
    setApplicationData(null);
    setMobileView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = () => {
    setMobileView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onBack={onBack} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Desktop Grid Layout / Mobile Toggle Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
          
          {/* Form Column - Visible if in 'form' view OR on large screens */}
          <div className={`${mobileView === 'form' ? 'block' : 'hidden'} lg:block`}>
            <ApplicationForm 
              onGenerate={handleGenerate}
              isLoading={isLoading}
              initialData={initialFormData}
            />
          </div>

          {/* Preview Column - Visible if in 'preview' view OR on large screens */}
          <div className={`${mobileView === 'preview' ? 'block' : 'hidden'} lg:block`}>
            {applicationData ? (
              <ApplicationPreview 
                data={applicationData}
                onReset={handleReset}
                onEdit={handleEdit}
              />
            ) : (
              // Empty state placeholder
              <div className="h-full hidden lg:flex items-center justify-center bg-white dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 min-h-[400px]">
                <div className="text-center text-gray-500 dark:text-gray-400 p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-2 text-lg font-semibold">আবেদনের প্রিভিউ এখানে দেখা যাবে</p>
                  <p className="text-sm">বাম পাশের ফরম থেকে আবেদনের বিষয় নির্বাচন করে তথ্য দিন।</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PassportApp;

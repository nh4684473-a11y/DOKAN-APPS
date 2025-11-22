
import React from 'react';
import Button from './common/Button';

interface ResultScreenProps {
  isLoading: boolean;
  generatedImage: string | null;
  onStartOver: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ isLoading, generatedImage, onStartOver }) => {
  
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'passport-photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Generating your photo...</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs">
          AI is removing the background and adjusting the layout. This may take a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        {generatedImage ? (
          <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-xl border-4 border-white">
            <img src={generatedImage} alt="Generated Passport Photo" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Success!</h3>
        <p className="text-gray-600 dark:text-gray-300">Your passport photo is ready.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={handleDownload} fullWidth>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Photo
        </Button>
        <Button onClick={onStartOver} variant="secondary" fullWidth>Create Another</Button>
      </div>
    </div>
  );
};

export default ResultScreen;

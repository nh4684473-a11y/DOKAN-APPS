
import React, { useState, useCallback } from 'react';
import { AppState, UploadedFile, BackgroundColor } from '../types';
import { generatePassportPhoto } from '../services/geminiService';
import UploadScreen from './UploadScreen';
import PreviewScreen from './PreviewScreen';
import ResultScreen from './ResultScreen';
import Header from './Header';

interface PhotoAppProps {
  onBack: () => void;
}

const PhotoApp: React.FC<PhotoAppProps> = ({ onBack }) => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<BackgroundColor>(BackgroundColor.LIGHT_GRAY);

  const resetApp = useCallback(() => {
    setAppState(AppState.UPLOAD);
    setUploadedFile(null);
    setGeneratedImageUrl(null);
    setIsLoading(false);
    setError(null);
    setBgColor(BackgroundColor.LIGHT_GRAY);
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG).');
      return;
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedFile({
        base64: result.split(',')[1],
        mimeType: file.type,
        dataUrl: result,
      });
      setAppState(AppState.PREVIEW);
    };
    reader.onerror = () => {
      setError('There was an error reading the file.');
      resetApp();
    };
    reader.readAsDataURL(file);
  }, [resetApp]);

  const handleGenerate = useCallback(async () => {
    if (!uploadedFile) return;

    setAppState(AppState.RESULT);
    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generatePassportPhoto(uploadedFile.base64, uploadedFile.mimeType, bgColor);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error('Error generating image:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation Failed: ${errorMessage}`);
      setAppState(AppState.UPLOAD);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, bgColor]);
  
  const renderContent = () => {
    switch (appState) {
      case AppState.PREVIEW:
        return (
          <PreviewScreen
            file={uploadedFile!}
            bgColor={bgColor}
            onBgColorChange={setBgColor}
            onGenerate={handleGenerate}
            onCancel={resetApp}
          />
        );
      case AppState.RESULT:
        return (
          <ResultScreen
            isLoading={isLoading}
            generatedImage={generatedImageUrl}
            onStartOver={resetApp}
          />
        );
      case AppState.UPLOAD:
      default:
        return (
          <UploadScreen onFileSelect={handleFileSelect} error={error} />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onBack={onBack} />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">এআই পাসপোর্ট ফটো মেকার</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">যেকোনো ছবি আপলোড করুন এবং মুহূর্তেই প্রফেশনাল পাসপোর্ট সাইজ ছবি তৈরি করুন।</p>
            </div>
            {renderContent()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default PhotoApp;

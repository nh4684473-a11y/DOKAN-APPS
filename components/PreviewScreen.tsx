
import React from 'react';
import { UploadedFile, BackgroundColor } from '../types';
import Button from './common/Button';

interface PreviewScreenProps {
  file: UploadedFile;
  bgColor: BackgroundColor;
  onBgColorChange: (color: BackgroundColor) => void;
  onGenerate: () => void;
  onCancel: () => void;
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ file, bgColor, onBgColorChange, onGenerate, onCancel }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg border-4 border-white">
          <img src={file.dataUrl} alt="Preview" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 text-center">Select Background Color</h3>
        <div className="flex justify-center gap-4">
          {[
            { color: BackgroundColor.WHITE, label: 'White' },
            { color: BackgroundColor.LIGHT_BLUE, label: 'Blue' },
            { color: BackgroundColor.LIGHT_GRAY, label: 'Gray' },
          ].map((bg) => (
            <label key={bg.color} className="flex flex-col items-center cursor-pointer group">
              <div 
                className={`w-10 h-10 rounded-full border-2 shadow-sm mb-2 flex items-center justify-center transition-all ${bgColor === bg.color ? 'border-indigo-600 ring-2 ring-indigo-300 scale-110' : 'border-gray-300 hover:border-indigo-400'}`}
                style={{ backgroundColor: bg.color }}
                onClick={() => onBgColorChange(bg.color)}
              >
                {bgColor === bg.color && (
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{bg.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onCancel} variant="secondary" fullWidth>Cancel</Button>
        <Button onClick={onGenerate} fullWidth>
           <span className="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
             Generate Photo
           </span>
        </Button>
      </div>
    </div>
  );
};

export default PreviewScreen;

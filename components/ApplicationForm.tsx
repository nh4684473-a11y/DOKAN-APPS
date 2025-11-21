
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { ApplicationData, ApplicationSubmission, CorrectionItem } from '../types';
import { TemplateKey } from '../types';
import { TEMPLATES, ALL_SUBJECT_OPTIONS, getSuggestedSubjects } from '../templates';
import Input from './common/Input';
import Button from './common/Button';
import Select from './common/Select';

interface ApplicationFormProps {
  onGenerate: (data: ApplicationSubmission) => void;
  isLoading: boolean;
  initialData: ApplicationData;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onGenerate, isLoading, initialData }) => {
  // Default to the first option in our master list
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<TemplateKey>(ALL_SUBJECT_OPTIONS[0].template);
  const [form, setForm] = useState<ApplicationData>({
    ...initialData,
    subject: ALL_SUBJECT_OPTIONS[0].value
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationData, string>>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  const selectedTemplate = TEMPLATES[selectedTemplateKey];
  const suggestedSubjects = getSuggestedSubjects(selectedTemplateKey);

  // When the template changes via the subject selection, reset relevant fields
  useEffect(() => {
    setErrors({});
    // We do NOT strictly reset the whole form here because the user might be just switching subjects 
    // within the same template (e.g. Correction -> Correction) and we want to keep their typed data.
    
    setForm(prev => ({
        ...prev,
        // Ensure correction list is initialized if needed
        correctionList: (prev.correctionList && prev.correctionList.length > 0) 
            ? prev.correctionList 
            : [{ wrong: '', correct: '', correctionType: '' }]
    }));
  }, [selectedTemplateKey]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = ALL_SUBJECT_OPTIONS.find(opt => opt.value === selectedValue);

    // If "Other" is selected (value is empty string in our list for 'Other'), default to General
    if (!selectedValue && selectedValue !== '') return; 

    if (selectedOption) {
        setSelectedTemplateKey(selectedOption.template);
        setForm(prev => ({
            ...prev,
            subject: selectedOption.value
        }));
    } else {
        // Fallback if somehow a value is passed that isn't in the list (e.g. empty string for "Other")
        // "Other" option has value=""
        if (selectedValue === "") {
             setSelectedTemplateKey(TemplateKey.PassportGeneral);
             setForm(prev => ({ ...prev, subject: "" }));
        }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if(errors[name as keyof ApplicationData]){
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  // Handle changes for dynamic correction rows
  const handleCorrectionChange = (index: number, field: keyof CorrectionItem, value: string) => {
    const list = [...(form.correctionList || [{ wrong: '', correct: '', correctionType: '' }])];
    if (!list[index]) list[index] = { wrong: '', correct: '', correctionType: '' };
    list[index][field] = value;

    // Sync first item to legacy fields for validation compat
    const firstItem = list[0];
    
    setForm(prev => ({ 
        ...prev, 
        correctionList: list,
        wrongInfo: firstItem.wrong,
        correctInfo: firstItem.correct
    }));

    if (index === 0 && (field === 'wrong' && errors.wrongInfo)) {
        setErrors(prev => ({...prev, wrongInfo: undefined}));
    }
    if (index === 0 && (field === 'correct' && errors.correctInfo)) {
        setErrors(prev => ({...prev, correctInfo: undefined}));
    }
  };

  const addCorrectionRow = () => {
    setForm(prev => ({
        ...prev,
        correctionList: [...(prev.correctionList || []), { wrong: '', correct: '', correctionType: '' }]
    }));
  };

  const removeCorrectionRow = (index: number) => {
    const list = [...(form.correctionList || [])];
    if (list.length > 1) {
        list.splice(index, 1);
        const firstItem = list[0];
        setForm(prev => ({
            ...prev,
            correctionList: list,
            wrongInfo: firstItem.wrong,
            correctInfo: firstItem.correct
        }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationData, string>> = {};
    for (const field of selectedTemplate.requiredFields) {
      const value = form[field];
      if (typeof value === 'string') {
        if (!value.trim()) {
          newErrors[field] = 'এই ঘরটি আবশ্যক';
        }
      } else if (!value) {
        // Handles undefined/null cases
        newErrors[field] = 'এই ঘরটি আবশ্যক';
      }
    }
    
    if (form.nid && selectedTemplate.requiredFields.includes('nid') && !/^\d{10}$|^\d{13}$|^\d{17}$/.test(form.nid)) {
        newErrors.nid = 'সঠিক NID বা জন্মনিবন্ধন নম্বর দিন (10, 13 বা 17 সংখ্যার)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate({ ...form, template: selectedTemplateKey });
    }
  };

  const handleNidUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      const base64Image = base64Data.split(',')[1];
      const mimeType = file.type;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Extract information from this Bangladesh National ID (NID) card image. 
      Return ONLY a JSON object with the following keys. If a field is not found or unclear, use an empty string.
      
      Keys:
      - name: Name in Bengali
      - father: Father's Name in Bengali
      - mother: Mother's Name in Bengali
      - nid: NID Number (English digits)
      - village: Village/Road/House from address (Bengali)
      - postOffice: Post Office name (Bengali)
      - thana: Thana/Upazila (Bengali)
      - district: District (Bengali)

      Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { mimeType, data: base64Image } },
                { text: prompt }
            ]
        },
        config: {
            responseMimeType: 'application/json'
        }
      });

      const responseText = response.text;
      
      if (responseText) {
        const data = JSON.parse(responseText);
        setForm(prev => ({
            ...prev,
            name: data.name || prev.name,
            father: data.father || prev.father,
            mother: data.mother || prev.mother,
            nid: data.nid || prev.nid,
            village: data.village || prev.village,
            postOffice: data.postOffice || prev.postOffice,
            thana: data.thana || prev.thana,
            district: data.district || prev.district
        }));

        // Check specifically for empty fields that are critical to warn the user
        const missing: string[] = [];
        if (!data.name) missing.push('নাম');
        if (!data.father) missing.push('পিতার নাম');
        if (!data.nid) missing.push('NID নম্বর');
        if (!data.district) missing.push('জেলা');

        if (missing.length > 0) {
             alert(`NID স্ক্যান সম্পন্ন হয়েছে, কিন্তু কিছু তথ্য অস্পষ্ট: ${missing.join(', ')}। দয়া করে ফরমটি যাচাই করে ম্যানুয়ালি পূরণ করুন।`);
        }
      }
    } catch (error) {
      console.error("Error processing NID:", error);
      alert("NID কার্ড থেকে তথ্য পড়তে সমস্যা হয়েছে। দয়া করে পরিষ্কার ছবি আপলোড করুন অথবা ম্যানুয়ালি তথ্য পূরণ করুন।");
    } finally {
      setIsAnalyzing(false);
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const correctionTypeOptions = [
    { value: '', label: 'নির্বাচন করুন...' },
    { value: 'নাম', label: 'নাম (Name)' },
    { value: 'পিতার নাম', label: 'পিতার নাম (Father\'s Name)' },
    { value: 'মাতার নাম', label: 'মাতার নাম (Mother\'s Name)' },
    { value: 'স্বামী/স্ত্রীর নাম', label: 'স্বামী/স্ত্রীর নাম (Spouse Name)' },
    { value: 'জন্ম তারিখ', label: 'জন্ম তারিখ (Date of Birth)' },
    { value: 'পেশা', label: 'পেশা (Profession)' },
    { value: 'বর্তমান ঠিকানা', label: 'বর্তমান ঠিকানা (Current Address)' },
    { value: 'স্থায়ী ঠিকানা', label: 'স্থায়ী ঠিকানা (Permanent Address)' },
    { value: 'অন্যান্য', label: 'অন্যান্য (Other)' },
  ];

  const fieldLabelMap: Record<keyof ApplicationData, string> = {
    name: 'নাম',
    father: 'পিতার নাম',
    mother: 'মাতার নাম',
    village: 'গ্রাম',
    postOffice: 'ডাকঘর',
    thana: 'থানা',
    district: 'জেলা',
    nid: 'জাতীয় পরিচয়পত্র (NID) / জন্মনিবন্ধন নম্বর',
    subject: 'বিষয়',
    passportNo: 'পাসপোর্ট নম্বর (যদি থাকে)',
    gdNo: 'জিডি (GD) নম্বর',
    gdDate: 'জিডির তারিখ',
    wrongInfo: 'ভুল তথ্য',
    correctInfo: 'সঠিক তথ্য',
    correctionList: 'সংশোধন তালিকা',
    religion: 'ধর্ম',
    nationality: 'জাতীয়তা',
    passportIssueDate: 'পাসপোর্ট ইস্যুর তারিখ',
    address: 'ঠিকানা',
    childName: 'সন্তানের নাম',
    childDob: 'সন্তানের জন্ম তারিখ',
    childFather: 'সন্তানের পিতার নাম',
    childMother: 'সন্তানের মাতার নাম',
    childBrc: 'সন্তানের জন্ম নিবন্ধন নম্বর',
    childAddress: 'সন্তানের স্থায়ী ঠিকানা',
    parentName: 'পিতা/মাতার নাম (আবেদনকারী)',
    mobile: 'মোবাইল নম্বর'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">আবেদনকারীর তথ্য</h2>
      
      {/* NID Upload Section */}
      <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
        <label className="block text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-2">
            NID বা জন্মনিবন্ধন আপলোড করুন (স্বয়ংক্রিয় পূরণের জন্য)
        </label>
        <div className="flex items-center gap-4">
            <div className="relative flex-grow">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleNidUpload}
                    disabled={isAnalyzing}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 dark:file:bg-indigo-800 dark:file:text-indigo-100 disabled:opacity-50 cursor-pointer"
                />
            </div>
            {isAnalyzing && (
                <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>বিশ্লেষণ...</span>
                </div>
            )}
        </div>
        <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
            কার্ডের পরিষ্কার ছবি আপলোড করলে নাম, পিতা/মাতা, ঠিকানা ইত্যাদি তথ্য স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে। ভুল থাকলে ম্যানুয়ালি ঠিক করে নিন।
        </p>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">নিচে বিষয় নির্বাচন করুন, ফরমটি স্বয়ংক্রিয়ভাবে প্রস্তুত হবে।</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Select 
            label="আবেদনের বিষয়"
            name="subjectSelector"
            value={form.subject}
            onChange={handleSubjectChange}
            options={ALL_SUBJECT_OPTIONS}
            required
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{selectedTemplate.description}</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {selectedTemplate.fields.includes('name') && selectedTemplate.fields.includes('father') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={fieldLabelMap.name} name="name" value={form.name} onChange={handleChange} error={errors.name} required={selectedTemplate.requiredFields.includes('name')} />
                    <Input label={fieldLabelMap.father} name="father" value={form.father} onChange={handleChange} error={errors.father} required={selectedTemplate.requiredFields.includes('father')} />
                </div>
            ) : (
                <>
                {selectedTemplate.fields.includes('name') && <Input label={fieldLabelMap.name} name="name" value={form.name} onChange={handleChange} error={errors.name} required={selectedTemplate.requiredFields.includes('name')} />}
                {selectedTemplate.fields.includes('father') && <Input label={fieldLabelMap.father} name="father" value={form.father} onChange={handleChange} error={errors.father} required={selectedTemplate.requiredFields.includes('father')} />}
                </>
            )}

            {selectedTemplate.fields.includes('mother') && <Input label={fieldLabelMap.mother} name="mother" value={form.mother} onChange={handleChange} error={errors.mother} required={selectedTemplate.requiredFields.includes('mother')} />}
            
            {/* Subject input if manually editing is needed, or for 'Other' */}
            {selectedTemplate.fields.includes('subject') && (
              <>
                <Input 
                  label={fieldLabelMap.subject + " (প্রয়োজন হলে সম্পাদনা করুন)"} 
                  name="subject" 
                  value={form.subject || ''} 
                  onChange={handleChange} 
                  error={errors.subject} 
                  required={selectedTemplate.requiredFields.includes('subject')}
                />
              </>
            )}

            {selectedTemplate.fields.includes('village') && selectedTemplate.fields.includes('postOffice') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={fieldLabelMap.village} name="village" value={form.village} onChange={handleChange} error={errors.village} required={selectedTemplate.requiredFields.includes('village')} />
                    <Input label={fieldLabelMap.postOffice} name="postOffice" value={form.postOffice} onChange={handleChange} error={errors.postOffice} required={selectedTemplate.requiredFields.includes('postOffice')} />
                </div>
            ) : (
                <>
                {selectedTemplate.fields.includes('village') && <Input label={fieldLabelMap.village} name="village" value={form.village} onChange={handleChange} error={errors.village} required={selectedTemplate.requiredFields.includes('village')} />}
                {selectedTemplate.fields.includes('postOffice') && <Input label={fieldLabelMap.postOffice} name="postOffice" value={form.postOffice} onChange={handleChange} error={errors.postOffice} required={selectedTemplate.requiredFields.includes('postOffice')} />}
                </>
            )}

            {selectedTemplate.fields.includes('thana') && selectedTemplate.fields.includes('district') ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={fieldLabelMap.thana} name="thana" value={form.thana} onChange={handleChange} error={errors.thana} required={selectedTemplate.requiredFields.includes('thana')} />
                    <Input label={fieldLabelMap.district} name="district" value={form.district} onChange={handleChange} error={errors.district} required={selectedTemplate.requiredFields.includes('district')} />
                </div>
            ) : (
                 <>
                {selectedTemplate.fields.includes('thana') && <Input label={fieldLabelMap.thana} name="thana" value={form.thana} onChange={handleChange} error={errors.thana} required={selectedTemplate.requiredFields.includes('thana')} />}
                {selectedTemplate.fields.includes('district') && <Input label={fieldLabelMap.district} name="district" value={form.district} onChange={handleChange} error={errors.district} required={selectedTemplate.requiredFields.includes('district')} />}
                </>
            )}

            {selectedTemplate.fields.includes('nid') && <Input label={fieldLabelMap.nid} name="nid" value={form.nid} onChange={handleChange} error={errors.nid} required={selectedTemplate.requiredFields.includes('nid')} />}
            {selectedTemplate.fields.includes('passportNo') && <Input label={fieldLabelMap.passportNo} name="passportNo" value={form.passportNo || ''} onChange={handleChange} error={errors.passportNo} required={selectedTemplate.requiredFields.includes('passportNo')} />}
            
             {selectedTemplate.fields.includes('gdNo') && selectedTemplate.fields.includes('gdDate') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label={fieldLabelMap.gdNo} name="gdNo" value={form.gdNo || ''} onChange={handleChange} error={errors.gdNo} required={selectedTemplate.requiredFields.includes('gdNo')} />
                    <Input label={fieldLabelMap.gdDate} name="gdDate" type="date" value={form.gdDate || ''} onChange={handleChange} error={errors.gdDate} required={selectedTemplate.requiredFields.includes('gdDate')} />
                </div>
            )}

            {selectedTemplate.fields.includes('wrongInfo') && selectedTemplate.fields.includes('correctInfo') && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800 space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">সংশোধন তথ্য (এক বা একাধিক যুক্ত করতে পারেন)</label>
                    
                    {(form.correctionList || [{ wrong: '', correct: '', correctionType: '' }]).map((item, index) => (
                        <div key={index} className="space-y-2 sm:space-y-0 sm:flex sm:gap-2 sm:items-end relative pb-4 sm:pb-0 border-b sm:border-0 border-gray-200 dark:border-gray-700">
                            <div className="w-full sm:w-1/4">
                                <Select
                                    label={index === 0 ? "সংশোধনের বিষয়" : ""}
                                    name={`type-${index}`}
                                    value={item.correctionType || ''}
                                    onChange={(e) => handleCorrectionChange(index, 'correctionType', e.target.value)}
                                    options={correctionTypeOptions}
                                    required={index === 0 && selectedTemplate.requiredFields.includes('wrongInfo')} // Optional for better UX, but encouraged
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <Input 
                                    label={index === 0 ? "ভুল তথ্য (পাসপোর্ট অনুযায়ী)" : ""} 
                                    name={`wrong-${index}`} 
                                    value={item.wrong} 
                                    onChange={(e) => handleCorrectionChange(index, 'wrong', e.target.value)} 
                                    error={index === 0 ? errors.wrongInfo : undefined}
                                    placeholder="ভুল তথ্য লিখুন"
                                    required={index === 0 && selectedTemplate.requiredFields.includes('wrongInfo')}
                                />
                            </div>
                            <div className="flex-1 w-full">
                                <Input 
                                    label={index === 0 ? "সঠিক তথ্য (NID অনুযায়ী)" : ""} 
                                    name={`correct-${index}`} 
                                    value={item.correct} 
                                    onChange={(e) => handleCorrectionChange(index, 'correct', e.target.value)} 
                                    error={index === 0 ? errors.correctInfo : undefined}
                                    placeholder="সঠিক তথ্য লিখুন"
                                    required={index === 0 && selectedTemplate.requiredFields.includes('correctInfo')}
                                />
                            </div>
                            {(form.correctionList && form.correctionList.length > 1) && (
                                <button
                                    type="button"
                                    onClick={() => removeCorrectionRow(index)}
                                    className="sm:mb-2 p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors absolute top-0 right-0 sm:static"
                                    title="এই সারি মুছুন"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                    
                    <button
                        type="button"
                        onClick={addCorrectionRow}
                        className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        আরও যোগ করুন
                    </button>
                </div>
            )}

        </div>
        
        <div className="pt-4">
            <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    জেনারেট করা হচ্ছে...
                </>
            ) : 'আবেদন তৈরি করুন'}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;

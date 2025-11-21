
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header from './Header';
import Input from './common/Input';
import Button from './common/Button';
import Select from './common/Select';
import type { ApplicationData, CorrectionItem } from '../types';

interface UndertakingAppProps {
  onBack: () => void;
}

const UndertakingApp: React.FC<UndertakingAppProps> = ({ onBack }) => {
  const [form, setForm] = useState<ApplicationData>({
    name: '',
    father: '',
    mother: '',
    village: '', 
    postOffice: '',
    thana: '',
    district: '',
    address: '',
    religion: 'ইসলাম',
    nationality: 'বাংলাদেশী',
    nid: '',
    passportNo: '',
    passportIssueDate: '',
    correctionList: [
      { wrong: '', correct: '', correctionType: 'নাম' },
      { wrong: '', correct: '', correctionType: 'পিতার নাম' },
      { wrong: '', correct: '', correctionType: 'মাতার নাম' },
      { wrong: '', correct: '', correctionType: 'জন্ম তারিখ' }
    ]
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCorrectionChange = (index: number, field: keyof CorrectionItem, value: string) => {
    const list = [...(form.correctionList || [])];
    if (!list[index]) list[index] = { wrong: '', correct: '', correctionType: '' };
    list[index][field] = value;
    setForm(prev => ({ ...prev, correctionList: list }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      const prompt = `Extract information from this Bangladesh National ID (NID), Birth Certificate, or Passport image. 
      Return ONLY a JSON object with the following keys. If a field is not found or unclear, use an empty string.
      
      Keys:
      - name: Name (Bengali preferred)
      - father: Father's Name (Bengali preferred)
      - mother: Mother's Name (Bengali preferred)
      - nid: NID Number (English digits)
      - passportNo: Passport Number (if available)
      - passportIssueDate: Passport Issue Date (YYYY-MM-DD format if available)
      - address: Full Address (Bengali preferred)
      - religion: Religion (e.g., ইসলাম, হিন্দু) - Infer if possible, otherwise empty
      - nationality: Nationality (e.g. বাংলাদেশী)

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
            passportNo: data.passportNo || prev.passportNo,
            passportIssueDate: data.passportIssueDate || prev.passportIssueDate,
            address: data.address || prev.address,
            religion: data.religion || prev.religion,
            nationality: data.nationality || prev.nationality,
        }));

        const missing: string[] = [];
        if (!data.name) missing.push('নাম');
        if (!data.father) missing.push('পিতার নাম');
        
        if (missing.length > 0) {
             alert(`তথ্য স্ক্যান সম্পন্ন হয়েছে, কিন্তু কিছু তথ্য অস্পষ্ট: ${missing.join(', ')}। দয়া করে যাচাই করে ম্যানুয়ালি পূরণ করুন।`);
        }
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("ডকুমেন্ট থেকে তথ্য পড়তে সমস্যা হয়েছে। দয়া করে পরিষ্কার ছবি আপলোড করুন অথবা ম্যানুয়ালি তথ্য পূরণ করুন।");
    } finally {
      setIsAnalyzing(false);
      e.target.value = '';
    }
  };


  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('undertaking-printable');
    if (!element) return;

    window.scrollTo(0, 0);

    // 1. Overlay Container
    const cloneContainer = document.createElement('div');
    cloneContainer.style.position = 'fixed';
    cloneContainer.style.top = '0';
    cloneContainer.style.left = '0';
    cloneContainer.style.width = '794px';
    cloneContainer.style.minHeight = '100vh';
    cloneContainer.style.zIndex = '999999';
    cloneContainer.style.backgroundColor = '#ffffff';
    cloneContainer.style.padding = '0';
    cloneContainer.style.overflow = 'visible';

    // 2. Clone content
    const sheet = element.cloneNode(true) as HTMLElement;

    // 3. Style Sheet
    sheet.style.width = '794px';
    sheet.style.minHeight = '1123px';
    sheet.style.margin = '0';
    sheet.style.padding = '60px 50px';
    sheet.style.backgroundColor = '#ffffff';
    sheet.style.color = '#000000';
    sheet.style.border = 'none';
    sheet.style.boxShadow = 'none';
    
    // Reset visual classes
    sheet.classList.remove('shadow-2xl', 'rounded-lg', 'border', 'dark:border-gray-700', 'overflow-auto', 'max-w-[794px]', 'min-w-[794px]', 'w-full', 'p-[40px]', 'sm:p-[60px]', 'bg-white');

    // 4. Force Black Text & Table Styles
    const allElements = sheet.querySelectorAll('*');
    allElements.forEach(node => {
        const el = node as HTMLElement;
        el.style.color = '#000000';
        el.classList.remove('text-gray-700', 'text-gray-600', 'dark:text-gray-300', 'dark:text-gray-400');
        
        if (el.tagName === 'TABLE') {
            el.style.width = '100%';
            el.style.borderCollapse = 'collapse';
            el.style.border = '1px solid black';
            el.style.tableLayout = 'fixed'; // Ensure fixed layout for table
        }
        if (el.tagName === 'TH' || el.tagName === 'TD') {
            el.style.border = '1px solid black';
            el.style.padding = '4px 8px'; // Slightly tighter padding
            el.style.textAlign = 'left';
            el.style.verticalAlign = 'middle';
        }
        if (el.tagName === 'P') {
            el.style.marginBottom = '12px';
            el.style.lineHeight = '1.6';
            
            // Specific check to keep header subtitle centered
            if (el.textContent && el.textContent.includes('(পাসপোর্ট এর তথ্য পরিবর্তন/সংশোধন সংক্রান্ত)')) {
                el.style.textAlign = 'center';
            } else {
                el.style.textAlign = 'justify';
            }
        }
    });

    cloneContainer.appendChild(sheet);
    document.body.appendChild(cloneContainer);

    // 5. Generate
    const opt = {
      margin: 0,
      filename: `Undertaking_${form.name ? form.name.split(' ')[0] : 'Form'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        windowWidth: 794,
        width: 794,
        scrollY: 0,
        scrollX: 0,
        x: 0,
        y: 0
      },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' }
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(sheet).save()
        .then(() => {
             if(document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
        })
        .catch((err: any) => {
             console.error(err);
             if(document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
        });
    } else {
        if(document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
    }
  };

  // Helpers to get data for the static table
  const getValueByType = (type: string, field: 'wrong' | 'correct') => {
    const item = form.correctionList?.find(i => i.correctionType === type);
    return item ? item[field] : '';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onBack={onBack} />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-fit order-1 lg:order-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2">অঙ্গীকারনামার তথ্য</h2>
            
             {/* Upload Section */}
            <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                <label className="block text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-2">
                    NID বা পাসপোর্ট আপলোড করুন (স্বয়ংক্রিয় পূরণের জন্য)
                </label>
                <div className="flex items-center gap-4">
                    <div className="relative flex-grow">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
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
                    আপনার NID বা পাসপোর্টের ছবি আপলোড করলে নিচের তথ্যগুলো স্বয়ংক্রিয়ভাবে পূরণ হয়ে যাবে।
                </p>
            </div>

            <div className="space-y-4">
              <Input label="নাম" name="name" value={form.name} onChange={handleChange} />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="পিতার নাম" name="father" value={form.father} onChange={handleChange} />
                <Input label="মাতার নাম" name="mother" value={form.mother} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 gap-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ঠিকানা</label>
                  <textarea 
                    name="address" 
                    value={form.address} 
                    onChange={handleChange}
                    rows={2}
                    className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black dark:text-white"
                    placeholder="গ্রাম, ডাকঘর, থানা, জেলা..."
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="ধর্ম" name="religion" value={form.religion} onChange={handleChange} />
                <Input label="জাতীয়তা" name="nationality" value={form.nationality} onChange={handleChange} />
              </div>

              <Input label="জাতীয় পরিচয়পত্র নম্বর (NID)" name="nid" value={form.nid} onChange={handleChange} />

              <div className="grid grid-cols-2 gap-4">
                <Input label="পাসপোর্ট নম্বর" name="passportNo" value={form.passportNo} onChange={handleChange} />
                <Input label="পাসপোর্ট ইস্যুর তারিখ" type="date" name="passportIssueDate" value={form.passportIssueDate} onChange={handleChange} />
              </div>

              {/* Fixed Correction List Inputs for Data Entry */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">সংশোধন বিবরণী (নিচের তথ্যগুলো পূরণ করুন)</label>
                
                {['নাম', 'পিতার নাম', 'মাতার নাম', 'জন্ম তারিখ'].map((type, idx) => {
                    const itemIndex = form.correctionList?.findIndex(i => i.correctionType === type);
                    const item = itemIndex !== undefined && itemIndex !== -1 ? form.correctionList![itemIndex] : { wrong: '', correct: '', correctionType: type };
                    
                    return (
                        <div key={type} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0">
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{type}</p>
                            <div className="grid grid-cols-2 gap-2">
                                <input 
                                    placeholder="ভুল তথ্য (পাসপোর্ট অনুযায়ী)" 
                                    value={item.wrong}
                                    onChange={(e) => {
                                        if (itemIndex !== -1 && itemIndex !== undefined) {
                                            handleCorrectionChange(itemIndex, 'wrong', e.target.value);
                                        } else {
                                            // Add if missing (shouldn't happen with default state)
                                        }
                                    }}
                                    className="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                                />
                                <input 
                                    placeholder="সঠিক তথ্য (NID অনুযায়ী)" 
                                    value={item.correct}
                                    onChange={(e) => {
                                        if (itemIndex !== -1 && itemIndex !== undefined) {
                                            handleCorrectionChange(itemIndex, 'correct', e.target.value);
                                        }
                                    }}
                                    className="px-2 py-1 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                                />
                            </div>
                        </div>
                    )
                })}
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
                <Button onClick={handlePrint}>প্রিন্ট করুন</Button>
                <Button onClick={handleDownloadPdf} variant="secondary">PDF ডাউনলোড</Button>
            </div>
          </div>

          {/* Preview Section - Exact PDF Replica */}
          <div className="flex justify-center bg-gray-200 dark:bg-gray-900/50 p-2 sm:p-4 rounded-lg overflow-auto order-2 lg:order-2">
             <div 
                id="undertaking-printable" 
                className="bg-white text-black shadow-2xl w-[794px] min-w-[794px] min-h-[1123px] p-[60px] relative box-border text-base leading-relaxed"
             >
                {/* Document Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold underline underline-offset-4 mb-1 text-black">অঙ্গীকারনামা</h1>
                    <p className="text-sm font-semibold text-black">(পাসপোর্ট এর তথ্য পরিবর্তন/সংশোধন সংক্রান্ত)</p>
                </div>

                {/* Document Body */}
                <div className="space-y-4 text-justify text-black">
                    <div className="leading-loose">
                        আমি <span className="font-bold border-b border-dotted border-black px-2">{form.name || '....................................'}</span>, 
                        পিতা:- <span className="font-bold border-b border-dotted border-black px-2">{form.father || '...........................'}</span>, 
                        মাতা:- <span className="font-bold border-b border-dotted border-black px-2">{form.mother || '......................................'}</span>,
                        ঠিকানা:- <span className="font-bold border-b border-dotted border-black px-2">{form.address || '........................................................................'}</span> 
                        ধর্ম:- <span className="font-bold border-b border-dotted border-black px-2">{form.religion || '......................'}</span>, 
                        জাতীয়তা:- <span className="font-bold border-b border-dotted border-black px-2">{form.nationality || '.........................'}</span>, 
                        জাতীয় পরিচয়পত্র নম্বর:- <span className="font-bold border-b border-dotted border-black px-2">{form.nid || '................................................................'}</span> এই মর্মে অঙ্গীকার করিতেছি যে,
                    </div>
                    
                    <div className="leading-loose">
                        আমার পাসপোর্ট নম্বর:- <span className="font-bold border-b border-dotted border-black px-2">{form.passportNo || '.............................'}</span> 
                        ইস্যুর তারিখ:- <span className="font-bold border-b border-dotted border-black px-2">{form.passportIssueDate || '..................................'}</span> 
                        এ আবেদনের সময় নিজ নাম/পিতার নাম/মাতার নাম/জন্ম তারিখ ভুল লিপিবদ্ধ করা হইয়াছে। প্রকৃতপক্ষে আমার জাতীয় পরিচয়পত্র অনুযায়ী আমার নিজ নাম/পিতার নাম/মাতার নাম/জন্ম তারিখ এবং পাসপোর্টে উল্লেখিত নিজ নাম/পিতার নাম/মাতার নাম/জন্ম তারিখ নিম্নরূপ :
                    </div>

                    {/* Correction Table - Fixed Structure as per PDF */}
                    <div className="mt-2">
                        <table className="w-full border-collapse border border-black text-sm">
                            <thead>
                                <tr>
                                    <th className="border border-black px-2 py-1 text-center w-1/2 text-black font-bold bg-transparent">বর্তমান পাসপোর্টে প্রদর্শিত ভুল তথ্য</th>
                                    <th className="border border-black px-2 py-1 text-center w-1/2 text-black font-bold bg-transparent">জাতীয় পরিচয়পত্র অনুযায়ী প্রকৃত তথ্য</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Row 1: Name */}
                                <tr>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">নামঃ </span> {getValueByType('নাম', 'wrong')}
                                    </td>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">নামঃ </span> {getValueByType('নাম', 'correct')}
                                    </td>
                                </tr>
                                {/* Row 2: Father's Name */}
                                <tr>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">পিতার নামঃ </span> {getValueByType('পিতার নাম', 'wrong')}
                                    </td>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">পিতার নামঃ </span> {getValueByType('পিতার নাম', 'correct')}
                                    </td>
                                </tr>
                                {/* Row 3: Mother's Name */}
                                <tr>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">মাতার নামঃ </span> {getValueByType('মাতার নাম', 'wrong')}
                                    </td>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">মাতার নামঃ </span> {getValueByType('মাতার নাম', 'correct')}
                                    </td>
                                </tr>
                                {/* Row 4: Date of Birth */}
                                <tr>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">জন্ম তারিখঃ </span> {getValueByType('জন্ম তারিখ', 'wrong')}
                                    </td>
                                    <td className="border border-black px-2 py-2 text-black">
                                        <span className="font-semibold">জন্ম তারিখঃ </span> {getValueByType('জন্ম তারিখ', 'correct')}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="leading-loose">
                        উপর্যুক্ত অঙ্গীকারনামার যাবতীয় তথ্য সঠিক। ইহার কোন অংশ মিথ্যা নহে। আমি কোন তথ্য গোপন করি নাই। কোন মিথ্যা তথ্য দিয়া থাকিলে এই পরিবর্তন/সংশোধনজনিত কারণে ভবিষ্যতে কোন প্রকার আইনগত জটিলতা হইলে আমি দায়ী থাকিব।
                    </p>

                    <p className="leading-loose pt-2">
                        আমি স্বেচ্ছায় ও স্বজ্ঞানে উপর্যুক্ত অঙ্গীকারনামার যাবতীয় মর্ম সম্যক অবগত হইয়া স্বাক্ষর প্রদান করিলাম।
                    </p>
                </div>

                {/* Footer Signature */}
                <div className="mt-24 flex flex-col items-end">
                    <div className="border-t border-black w-[300px] text-center pt-2 text-black font-bold text-sm">
                        স্বাক্ষর/অভিভাবক স্বাক্ষর (আবেদনকারী অপ্রাপ্ত বয়স্ক হইলে)
                    </div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UndertakingApp;

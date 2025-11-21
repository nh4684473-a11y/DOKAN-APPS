
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Header from './Header';
import Input from './common/Input';
import Button from './common/Button';
import type { ApplicationData } from '../types';

interface ChildPermissionAppProps {
  onBack: () => void;
}

const ChildPermissionApp: React.FC<ChildPermissionAppProps> = ({ onBack }) => {
  const [form, setForm] = useState<ApplicationData>({
    name: '',
    father: '',
    mother: '',
    village: '', 
    postOffice: '',
    thana: '',
    district: '',
    nid: '',
    mobile: '',
    
    // Child Fields
    childName: '',
    childDob: '',
    childFather: '',
    childMother: '',
    childBrc: '',
    childAddress: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      
      const prompt = `Extract information from this Bangladesh Birth Registration Certificate. 
      Return ONLY a JSON object with the following keys. If a field is not found or unclear, use an empty string.
      
      Keys:
      - childName: Name of the person (Bengali preferred)
      - childDob: Date of Birth (YYYY-MM-DD format)
      - childBrc: Birth Registration Number (17 digits)
      - childFather: Father's Name (Bengali preferred)
      - childMother: Mother's Name (Bengali preferred)
      - childAddress: Permanent Address (Bengali preferred)
      - district: Extract the District name (Zilla) from the address (Bengali preferred, e.g. কুমিল্লা)

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
            childName: data.childName || prev.childName,
            childDob: data.childDob || prev.childDob,
            childBrc: data.childBrc || prev.childBrc,
            childFather: data.childFather || prev.childFather,
            childMother: data.childMother || prev.childMother,
            childAddress: data.childAddress || prev.childAddress,
            // Auto-fill District from address extraction
            district: data.district || prev.district,
            // Auto-fill Parent Name with Father's Name by default
            parentName: data.childFather || prev.parentName,
        }));

        const missing: string[] = [];
        if (!data.childName) missing.push('নাম');
        if (!data.childBrc) missing.push('জন্ম নিবন্ধন নম্বর');
        
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
    const element = document.getElementById('child-permission-printable');
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
    sheet.style.padding = '60px 60px'; // Matches PDF margin
    sheet.style.backgroundColor = '#ffffff';
    sheet.style.color = '#000000';
    sheet.style.border = 'none';
    sheet.style.boxShadow = 'none';
    sheet.style.fontSize = '14px';
    sheet.style.fontFamily = "'Hind Siliguri', sans-serif";
    
    // Reset visual classes
    sheet.classList.remove('shadow-2xl', 'rounded-lg', 'border', 'dark:border-gray-700', 'overflow-auto', 'max-w-[794px]', 'min-w-[794px]', 'w-full', 'p-[40px]', 'sm:p-[60px]', 'bg-white');

    // 4. Force Black Text & Table Styles
    const allElements = sheet.querySelectorAll('*');
    allElements.forEach(node => {
        const el = node as HTMLElement;
        // STRICTLY FORCE BLACK COLOR
        el.style.setProperty('color', '#000000', 'important');
        
        el.classList.remove('text-gray-700', 'text-gray-600', 'dark:text-gray-300', 'dark:text-gray-400', 'text-indigo-800', 'text-gray-500', 'text-xs');
        
        if (el.tagName === 'TABLE') {
            el.style.width = '100%';
            el.style.borderCollapse = 'collapse';
            el.style.border = '1px solid black';
            el.style.tableLayout = 'fixed';
        }
        if (el.tagName === 'TH' || el.tagName === 'TD') {
            el.style.border = '1px solid black';
            el.style.padding = '6px 8px';
            el.style.verticalAlign = 'middle';
            el.style.setProperty('color', '#000000', 'important');
            // Don't force align left here, handled by specific overrides below
        }
        if (el.tagName === 'P') {
            el.style.marginBottom = '8px';
            el.style.lineHeight = '1.5';
        }
    });

    // Specific overrides for table alignment
    const firstColCells = sheet.querySelectorAll('td:nth-child(1)');
    firstColCells.forEach(td => (td as HTMLElement).style.textAlign = 'center');
    const otherColCells = sheet.querySelectorAll('td:nth-child(2), td:nth-child(3)');
    otherColCells.forEach(td => (td as HTMLElement).style.textAlign = 'left');

    cloneContainer.appendChild(sheet);
    document.body.appendChild(cloneContainer);

    // 5. Generate
    const opt = {
      margin: 0,
      filename: `Child_Passport_Permission_${form.childName ? form.childName.split(' ')[0] : 'Form'}.pdf`,
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onBack={onBack} />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-fit order-1 lg:order-1">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white border-b pb-2">অনুমতিপত্রের তথ্য</h2>
            
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-md border border-indigo-100 dark:border-indigo-800">
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-3">অভিভাবকের তথ্য (আবেদনকারী)</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Input label="পিতা/মাতার নাম (আবেদনকারী)" name="parentName" value={form.parentName || ''} onChange={handleChange} placeholder="যিনি আবেদন করছেন তাঁর নাম" />
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="মোবাইল নম্বর" name="mobile" value={form.mobile || ''} onChange={handleChange} />
                        <Input label="জেলা (পাসপোর্ট অফিস)" name="district" value={form.district} onChange={handleChange} placeholder="যেই অফিসে জমা দিবেন (যেমন: কুমিল্লা)" />
                    </div>
                  </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/20 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">সন্তানের তথ্য</h3>
                  
                  {/* Birth Certificate Upload */}
                  <div className="mb-4 p-3 bg-white dark:bg-gray-800 border border-dashed border-gray-400 rounded-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            জন্ম নিবন্ধন আপলোড করুন (স্বয়ংক্রিয় পূরণের জন্য)
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="relative flex-grow">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    disabled={isAnalyzing}
                                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 dark:file:bg-indigo-800 dark:file:text-indigo-100 disabled:opacity-50 cursor-pointer"
                                />
                            </div>
                            {isAnalyzing && (
                                <div className="flex items-center text-indigo-600 dark:text-indigo-400">
                                    <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="text-xs">বিশ্লেষণ...</span>
                                </div>
                            )}
                        </div>
                  </div>

                  <div className="space-y-3">
                      <Input label="সন্তানের নাম" name="childName" value={form.childName || ''} onChange={handleChange} />
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="জন্ম তারিখ" type="date" name="childDob" value={form.childDob || ''} onChange={handleChange} />
                        <Input label="জন্ম নিবন্ধন নম্বর" name="childBrc" value={form.childBrc || ''} onChange={handleChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="সন্তানের পিতার নাম" name="childFather" value={form.childFather || ''} onChange={handleChange} />
                        <Input label="সন্তানের মাতার নাম" name="childMother" value={form.childMother || ''} onChange={handleChange} />
                      </div>
                      <Input label="স্থায়ী ঠিকানা" name="childAddress" value={form.childAddress || ''} onChange={handleChange} />
                  </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
                <Button onClick={handlePrint}>প্রিন্ট করুন</Button>
                <Button onClick={handleDownloadPdf} variant="secondary">PDF ডাউনলোড</Button>
            </div>
          </div>

          {/* Preview Section - 1:1 Match with PDF */}
          <div className="flex justify-center bg-gray-200 dark:bg-gray-900/50 p-2 sm:p-4 rounded-lg overflow-auto order-2 lg:order-2">
             <div 
                id="child-permission-printable" 
                className="bg-white text-black shadow-2xl w-[794px] min-w-[794px] min-h-[1123px] p-[60px] relative box-border text-base"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
             >
                <div className="mb-6">
                    <p className="font-semibold">প্রতি</p>
                    <div className="pl-8">
                        <p className="font-semibold">উপপরিচালক</p>
                        <p className="font-semibold">আঞ্চলিক পাসপোর্ট অফিস</p>
                        <p className="font-semibold">{form.district || '.........................'}।</p>
                    </div>
                </div>

                <div className="mt-6 mb-2">
                    <p className="font-bold text-black">
                        বিষয়ঃ অপ্রাপ্তবয়স্ক সন্তানের পাসপোর্ট ইস্যুতে পিতা/ মাতার অনুমতিপত্র।
                    </p>
                </div>

                <div className="mb-8">
                    <p className="text-xs text-black">
                        সূত্র: ইমিগ্রেশন ও পাসপোর্ট অধিদপ্তর, ঢাকার স্মারক নং-৫৮.০১.০০০০.২০২.০৫.০০৮.১৯-২৮৯; তারিখ: ২৪ মার্চ ২০২৪খ্রিঃ।
                    </p>
                </div>

                <div className="space-y-4 text-black text-justify">
                    <p className="font-semibold">মহোদয়</p>
                    <p>
                        সবিনয়ে বিনীত নিবেদন এই যে, আমি নিম্নস্বাক্ষরকারী আমার সন্তানের ই-পাসপোর্ট প্রক্রিয়াকরণের জন্য সন্তানসহ সশরীরে হাজির হয়েছি। সন্তানের তথ্যাদি নিম্নরূপঃ
                    </p>

                    <div className="mt-4 mb-4">
                        <table className="w-full border-collapse border border-black text-sm">
                            <tbody>
                                <tr>
                                    <td className="border border-black px-2 py-2 w-10 text-center font-medium text-black">১.</td>
                                    <td className="border border-black px-2 py-2 w-48 font-medium text-black">নাম</td>
                                    <td className="border border-black px-2 py-2 font-semibold text-black">{form.childName}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-2 py-2 text-center font-medium text-black">২.</td>
                                    <td className="border border-black px-2 py-2 font-medium text-black">জন্ম তারিখ</td>
                                    <td className="border border-black px-2 py-2 font-semibold text-black">{form.childDob}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-2 py-2 text-center font-medium text-black">৩.</td>
                                    <td className="border border-black px-2 py-2 font-medium text-black">পিতার নাম</td>
                                    <td className="border border-black px-2 py-2 font-semibold text-black">{form.childFather}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-2 py-2 text-center font-medium text-black">৪.</td>
                                    <td className="border border-black px-2 py-2 font-medium text-black">মাতার নাম</td>
                                    <td className="border border-black px-2 py-2 font-semibold text-black">{form.childMother}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-2 py-2 text-center font-medium text-black">৫.</td>
                                    <td className="border border-black px-2 py-2 font-medium text-black">জন্ম নিবন্ধন নম্বর</td>
                                    <td className="border border-black px-2 py-2 font-semibold text-black">{form.childBrc}</td>
                                </tr>
                                <tr>
                                    <td className="border border-black px-2 py-2 text-center font-medium text-black">৬.</td>
                                    <td className="border border-black px-2 py-2 font-medium text-black">স্থায়ী ঠিকানা</td>
                                    <td className="border border-black px-2 py-2 font-semibold text-black">{form.childAddress}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        অতএব, মহোদয়ের সমীপে প্রার্থনা, আমার সন্তানের আবেদনপত্র গ্রহণ করতঃ বর্ণিত তথ্যে ই-পাসপোর্ট ইস্যুতে আমি সম্মতি প্রদান করছি।
                    </p>
                </div>

                {/* Footer Signature */}
                <div className="mt-24 flex justify-between items-start">
                    <div className="text-black mt-4">
                        <p>তারিখঃ {new Date().toLocaleDateString('bn-BD')} খ্রিঃ।</p>
                    </div>
                    <div className="text-right text-black">
                         <p className="font-bold mb-8 mr-16">বিনীত নিবেদক</p>
                         
                         <div className="space-y-3 text-left">
                             <div className="flex items-baseline">
                                <span className="w-32">পিতা/ মাতার স্বাক্ষর:</span>
                                <span className="border-b border-dotted border-black w-48 inline-block"></span>
                             </div>
                             <div className="flex items-baseline">
                                <span className="w-32">পিতা/ মাতার নাম:</span>
                                <span className="border-b border-dotted border-black w-48 inline-block font-bold">{form.parentName}</span>
                             </div>
                             <div className="flex items-baseline">
                                <span className="w-32">মোবাইল নং-</span>
                                <span className="border-b border-dotted border-black w-48 inline-block">{form.mobile}</span>
                             </div>
                         </div>
                    </div>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ChildPermissionApp;

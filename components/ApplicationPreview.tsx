
import React from 'react';
import type { ApplicationSubmission } from '../types';
import { TemplateKey } from '../types';
import Button from './common/Button';

interface ApplicationPreviewProps {
  data: ApplicationSubmission;
  onReset: () => void;
  onEdit?: () => void; // New prop for editing
}

const CommonHeader: React.FC<{ district: string }> = ({ district }) => (
  <div className="text-left mb-8 space-y-1 text-black">
      <p>বরাবর,</p>
      <p>উপ-পরিচালক,</p>
      <p>আঞ্চলিক পাসপোর্ট অফিস,</p>
      <p>{district}।</p>
  </div>
);

const CommonFooter: React.FC<{ data: ApplicationSubmission }> = ({ data }) => (
  <div className="mt-16 text-left text-black">
      <p>বিনীত নিবেদক,</p>
      <br />
      <br />
      <p className="font-bold">{data.name}</p>
      <p>পিতা: {data.father}</p>
      {data.passportNo && <p>পাসপোর্ট নম্বর: {data.passportNo}</p>}
      <p>মোবাইল: .....................</p>
  </div>
);

const PassportCorrectionPreview: React.FC<{ data: ApplicationSubmission }> = ({ data }) => {
  const rawItems = data.correctionList && data.correctionList.length > 0 
    ? data.correctionList 
    : (data.wrongInfo && data.correctInfo ? [{ wrong: data.wrongInfo, correct: data.correctInfo }] : []);

  // Filter out empty rows where both wrong and correct are empty strings
  const correctionItems = rawItems.filter(item => 
    (item.wrong && item.wrong.trim() !== '') || 
    (item.correct && item.correct.trim() !== '')
  );

  return (
    <>
        <CommonHeader district={data.district} />
        
        <h3 className="text-lg font-bold text-left mb-6 text-black">বিষয়: {data.subject || 'জাতীয় পরিচয়পত্র (NID) অনুযায়ী পাসপোর্টের তথ্য সংশোধনের আবেদন।'}</h3>
        
        <div className="space-y-4 text-black text-left text-base leading-relaxed text-justify">
            <p>মহোদয়,</p>
            <p>
                সবিনয় নিবেদন এই যে, আমি নিম্ন স্বাক্ষরকারী, {data.name}, পিতা: {data.father}, মাতা: {data.mother}, গ্রাম: {data.village}, ডাকঘর: {data.postOffice}, থানা: {data.thana}, জেলা: {data.district}-এর একজন স্থায়ী বাসিন্দা।
            </p>
            <p>
                আমার পূর্ববর্তী পাসপোর্টের তথ্যের সাথে জাতীয় পরিচয়পত্র/জন্মনিবন্ধনের তথ্যের অমিল রয়েছে। আমার জাতীয় পরিচয়পত্র/জন্মনিবন্ধন নম্বর হলো {data.nid} এবং আমার পাসপোর্ট নম্বর হলো {data.passportNo}। আমি সঠিক তথ্য অনুযায়ী আমার পাসপোর্টের তথ্য সংশোধন করতে ইচ্ছুক।
            </p>

            {correctionItems.length > 0 && (
              <div className="my-6">
                <p className="mb-2 font-bold text-black">সংশোধন বিবরণী:</p>
                <table className="w-full border-collapse border border-black text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black px-4 py-2 text-left font-bold text-black">বর্তমান পাসপোর্টে প্রদর্শিত ভুল তথ্য</th>
                      <th className="border border-black px-4 py-2 text-left font-bold text-black">জাতীয় পরিচয়পত্র/জন্ম সনদ অনুযায়ী প্রকৃত তথ্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    {correctionItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border border-black px-4 py-2 align-top whitespace-pre-wrap break-words text-black">
                            {item.correctionType && <strong className="text-black">{item.correctionType}: </strong>}
                            {item.wrong}
                        </td>
                        <td className="border border-black px-4 py-2 align-top font-semibold whitespace-pre-wrap break-words text-black">
                            {item.correctionType && <strong className="text-black">{item.correctionType}: </strong>}
                            {item.correct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p>
                অতএব, মহোদয়ের নিকট আমার বিনীত অনুরোধ, আমার আবেদনটি গ্রহণ করে উল্লিখিত প্রমাণাদি অনুযায়ী পাসপোর্টের তথ্য সংশোধন করার প্রয়োজনীয় ব্যবস্থা গ্রহণ করলে আমি আপনার প্রতি চিরকৃতজ্ঞ থাকব।
            </p>
        </div>

        <CommonFooter data={data} />
    </>
  );
};

const PassportNameChangePreview: React.FC<{ data: ApplicationSubmission }> = ({ data }) => {
  const rawItems = data.correctionList && data.correctionList.length > 0 
    ? data.correctionList 
    : (data.wrongInfo && data.correctInfo ? [{ wrong: data.wrongInfo, correct: data.correctInfo }] : []);

  // Filter out empty rows
  const correctionItems = rawItems.filter(item => 
    (item.wrong && item.wrong.trim() !== '') || 
    (item.correct && item.correct.trim() !== '')
  );

  return (
    <>
        <CommonHeader district={data.district} />
        
        <h3 className="text-lg font-bold text-left mb-6 text-black">বিষয়: {data.subject || 'পাসপোর্টে নাম পরিবর্তনের জন্য আবেদন।'}</h3>
        
        <div className="space-y-4 text-black text-left text-base leading-relaxed text-justify">
            <p>মহোদয়,</p>
            <p>
                বিনীত নিবেদন এই যে, আমি {data.name}, পিতা: {data.father}, মাতা: {data.mother}, গ্রাম: {data.village}, ডাকঘর: {data.postOffice}, থানা: {data.thana}, জেলা: {data.district}।
            </p>
            <p>
                আমার বর্তমান পাসপোর্ট নম্বর {data.passportNo}। আমার পাসপোর্টে নাম/তথ্য ভুলভাবে লিপিবদ্ধ হয়েছে অথবা আমি এফিডেভিট মূলে আমার নাম পরিবর্তন করেছি। আমার জাতীয় পরিচয়পত্র/জন্মনিবন্ধন নম্বর {data.nid}। আমি আমার পাসপোর্টের নাম পরিবর্তন করে সঠিক নাম অন্তর্ভুক্ত করতে ইচ্ছুক।
            </p>

            {correctionItems.length > 0 && (
              <div className="my-6">
                <p className="mb-2 font-bold text-black">পরিবর্তন বিবরণী:</p>
                <table className="w-full border-collapse border border-black text-sm sm:text-base">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-black px-4 py-2 text-left font-bold text-black">পাসপোর্টে বিদ্যমান নাম/তথ্য</th>
                      <th className="border border-black px-4 py-2 text-left font-bold text-black">প্রার্থিত নতুন নাম/তথ্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    {correctionItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border border-black px-4 py-2 align-top whitespace-pre-wrap break-words text-black">
                            {item.correctionType && <strong className="text-black">{item.correctionType}: </strong>}
                            {item.wrong}
                        </td>
                        <td className="border border-black px-4 py-2 align-top font-semibold whitespace-pre-wrap break-words text-black">
                            {item.correctionType && <strong className="text-black">{item.correctionType}: </strong>}
                            {item.correct}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p>
                অতএব, মহোদয়ের নিকট বিনীত আবেদন, আমার নাম পরিবর্তনের আবেদনটি গ্রহণ করে নতুন পাসপোর্ট ইস্যু করার প্রয়োজনীয় ব্যবস্থা গ্রহণ করতে মর্জি হয়।
            </p>
        </div>

        <CommonFooter data={data} />
    </>
  );
};

const PassportTypeChangePreview: React.FC<{ data: ApplicationSubmission }> = ({ data }) => (
    <>
        <CommonHeader district={data.district} />
        
        <h3 className="text-lg font-bold text-left mb-6 underline text-black">বিষয়: {data.subject || 'অফিসিয়াল পাসপোর্টের পরিবর্তে সাধারণ ই-পাসপোর্ট ইস্যুর অনুমতি চেয়ে আবেদন।'}</h3>
        
        <div className="space-y-4 text-black text-left text-base leading-relaxed text-justify">
            <p>মহোদয়,</p>
            <p>
                বিনীত নিবেদন এই যে, আমি {data.name}, পিতা: {data.father}, মাতা: {data.mother}, গ্রাম: {data.village}, ডাকঘর: {data.postOffice}, উপজেলা: {data.thana}, জেলা: {data.district}। আমি বর্তমানে একজন সরকারি চাকরিজীবী।
            </p>
            <p>
                আমি ই-পাসপোর্টের জন্য আবেদন করার সময় ভুলবশত পাসপোর্টের ধরন “Official” হিসেবে নির্বাচন করেছি। কিন্তু বর্তমানে আমার সরকারি দপ্তর হতে অফিসিয়াল পাসপোর্ট ইস্যুর জন্য কোনো অনুমোদন প্রদান করা হয়নি। তাই আমি আমার পাসপোর্টটি সাধারণ (Ordinary) ই-পাসপোর্ট হিসেবে ইস্যু করার জন্য আবেদন করছি।
            </p>
            <p>
                অতএব, জনাবের নিকট আমার বিনীত আবেদন, উপরোক্ত তথ্যের ভিত্তিতে আমার আবেদনটি অফিসিয়াল পাসপোর্টের পরিবর্তে সাধারণ ই-পাসপোর্ট ইস্যুর জন্য প্রয়োজনীয় অনুমোদন ও ব্যবস্থা গ্রহণের জন্য অনুরোধ করছি।
            </p>
        </div>

        <CommonFooter data={data} />
    </>
);

const PassportReissuePreview: React.FC<{ data: ApplicationSubmission }> = ({ data }) => (
  <>
      <CommonHeader district={data.district} />
      
      <h3 className="text-lg font-bold text-left mb-6 text-black">বিষয়: পাসপোর্ট রি-ইস্যু করার জন্য আবেদন।</h3>
      
      <div className="space-y-4 text-black text-left text-base leading-relaxed text-justify">
          <p>মহোদয়,</p>
          <p>
              সবিনয় নিবেদন এই যে, আমি নিম্ন স্বাক্ষরকারী, {data.name}, পিতা: {data.father}, মাতা: {data.mother}, ঠিকানা: গ্রাম- {data.village}, ডাকঘর- {data.postOffice}, থানা- {data.thana}, জেলা- {data.district}।
          </p>
          <p>
              আমার বর্তমান পাসপোর্ট নম্বর {data.passportNo}, যার মেয়াদ উত্তীর্ণ হয়েছে / পাতা শেষ হয়ে গেছে। এমতাবস্থায়, আমার জরুরি ভিত্তিতে পাসপোর্ট রি-ইস্যু করা প্রয়োজন।
          </p>
          <p>
              অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, আমার পাসপোর্টটি রি-ইস্যু করার প্রয়োজনীয় ব্যবস্থা গ্রহণ করে আমাকে বাধিত করবেন।
          </p>
      </div>

      <CommonFooter data={data} />
  </>
);

const PassportLossPreview: React.FC<{ data: ApplicationSubmission }> = ({ data }) => (
  <>
      <CommonHeader district={data.district} />
      
      <h3 className="text-lg font-bold text-left mb-6 text-black">বিষয়: হারানো পাসপোর্টের পরিবর্তে নতুন পাসপোর্ট ইস্যুর আবেদন।</h3>
      
      <div className="space-y-4 text-black text-left text-base leading-relaxed text-justify">
          <p>মহোদয়,</p>
          <p>
              যথাযথ সম্মানপূর্বক নিবেদন এই যে, আমি {data.name}, পিতা: {data.father}, স্থায়ী ঠিকানা: গ্রাম- {data.village}, ডাকঘর- {data.postOffice}, থানা- {data.thana}, জেলা- {data.district}।
          </p>
          <p>
              আমার পাসপোর্টটি (নম্বর: {data.passportNo}) হারিয়ে গেছে। এ বিষয়ে আমি {data.thana} থানায় একটি সাধারণ ডায়েরি (GD) করেছি, যার নম্বর {data.gdNo}, তারিখ {data.gdDate}। বর্তমানে আমার বিদেশ ভ্রমণের প্রয়োজনে নতুন পাসপোর্ট ইস্যু করা একান্ত প্রয়োজন।
          </p>
          <p>
              অতএব, মহোদয়ের নিকট বিনীত অনুরোধ, হারানো পাসপোর্টের প্রেক্ষিতে আমাকে নতুন পাসপোর্ট ইস্যু করার প্রয়োজনীয় ব্যবস্থা গ্রহণ করতে মর্জি হয়।
          </p>
          <p className="text-sm text-black mt-4">[সংযুক্তি: জিডি কপি ও পূর্ববর্তী পাসপোর্টের ফটোকপি]</p>
      </div>

      <CommonFooter data={data} />
  </>
);

const PassportGeneralPreview: React.FC<{ data: ApplicationSubmission }> = ({ data }) => {
  const rawItems = data.correctionList && data.correctionList.length > 0 
    ? data.correctionList 
    : (data.wrongInfo && data.correctInfo ? [{ wrong: data.wrongInfo, correct: data.correctInfo }] : []);

  // Filter out empty rows
  const correctionItems = rawItems.filter(item => 
    (item.wrong && item.wrong.trim() !== '') || 
    (item.correct && item.correct.trim() !== '')
  );

  return (
    <>
        <CommonHeader district={data.district} />
        
        <h3 className="text-lg font-bold text-left mb-6 text-black">বিষয়: {data.subject || 'আবেদন'}</h3>
        
        <div className="space-y-4 text-black text-left text-base leading-relaxed text-justify">
            <p>মহোদয়,</p>
            <p>
                সবিনয় নিবেদন এই যে, আমি {data.name}, পিতা: {data.father}, মাতা: {data.mother}, গ্রাম: {data.village}, ডাকঘর: {data.postOffice}, থানা: {data.thana}, জেলা: {data.district}। আমার জাতীয় পরিচয়পত্র/জন্মনিবন্ধন নম্বর {data.nid}।
            </p>
            <p>
              উক্ত বিষয়ের প্রেক্ষিতে জানাচ্ছি যে, আমার {data.subject} সংক্রান্ত সমস্যা সমাধানের জন্য আপনার সদয় দৃষ্টি আকর্ষণ করছি।
              {data.passportNo && ` আমার পাসপোর্ট নম্বর ${data.passportNo}।`}
            </p>
            {correctionItems.length > 0 && (
                <div className="my-6">
                  <p className="mb-2 font-bold text-black">সংশোধন বিবরণী:</p>
                  <table className="w-full border-collapse border border-black text-sm sm:text-base">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black px-4 py-2 text-left font-bold text-black">ভুল তথ্য</th>
                        <th className="border border-black px-4 py-2 text-left font-bold text-black">সঠিক তথ্য</th>
                      </tr>
                    </thead>
                    <tbody>
                      {correctionItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="border border-black px-4 py-2 align-top whitespace-pre-wrap break-words text-black">
                            {item.correctionType && <strong className="text-black">{item.correctionType}: </strong>}
                            {item.wrong}
                          </td>
                          <td className="border border-black px-4 py-2 align-top font-semibold whitespace-pre-wrap break-words text-black">
                            {item.correctionType && <strong className="text-black">{item.correctionType}: </strong>}
                            {item.correct}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            <p>
                অতএব, মহোদয়ের নিকট আকুল আবেদন, আমার বিষয়টি বিবেচনা করে প্রয়োজনীয় ব্যবস্থা গ্রহণ করলে আমি আপনার প্রতি চিরকৃতজ্ঞ থাকব।
            </p>
        </div>

        <CommonFooter data={data} />
    </>
  );
};


const ApplicationPreview: React.FC<ApplicationPreviewProps> = ({ data, onReset, onEdit }) => {

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('printable-area');
    if (!element) return;

    // Scroll to top to ensure no viewport clipping issues
    window.scrollTo(0, 0);

    // 1. Create Overlay Container
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

    // 2. Clone the content
    const sheet = element.cloneNode(true) as HTMLElement;
    
    // 3. Style the Sheet (Strict A4 Dimensions)
    sheet.style.width = '794px'; 
    sheet.style.minHeight = '1123px'; 
    sheet.style.margin = '0';
    sheet.style.padding = '60px 50px'; // Print Margins: ~2cm
    sheet.style.backgroundColor = '#ffffff';
    sheet.style.color = '#000000';
    sheet.style.boxShadow = 'none';
    sheet.style.border = 'none';
    
    // Remove visual-only classes from the clone that might interfere
    sheet.classList.remove('shadow-lg', 'rounded-lg', 'border', 'dark:border-gray-700', 'overflow-auto', 'h-full', 'max-w-[794px]', 'w-full', 'p-6', 'sm:p-12', 'bg-white');
    
    // 4. Force Styling on Children (Black Text & Borders)
    const allElements = sheet.querySelectorAll('*');
    allElements.forEach(node => {
        const el = node as HTMLElement;
        // Enforce black text
        el.style.color = '#000000';
        
        // Remove tailwind text color classes
        el.classList.remove('text-gray-700', 'text-gray-600', 'text-gray-500', 'dark:text-gray-300', 'dark:text-gray-400');
        
        if (el.tagName === 'TABLE') {
            el.style.width = '100%';
            el.style.borderCollapse = 'collapse';
            el.style.border = '1px solid black';
            el.style.tableLayout = 'auto'; // Allow column width to adapt
            el.style.marginBottom = '15px';
        }
        if (el.tagName === 'TH' || el.tagName === 'TD') {
            el.style.border = '1px solid black';
            el.style.padding = '8px';
            el.style.textAlign = 'left';
            el.style.color = '#000000';
            el.style.verticalAlign = 'top';
            // Fix for long text wrapping
            el.style.whiteSpace = 'pre-wrap';
            el.style.wordWrap = 'break-word';
            el.style.overflowWrap = 'anywhere';
        }
        if (el.tagName === 'P') {
             el.style.marginBottom = '10px';
             el.style.lineHeight = '1.6';
             el.style.textAlign = 'justify';
        }
    });

    cloneContainer.appendChild(sheet);
    document.body.appendChild(cloneContainer);

    // 5. Generate PDF
    const opt = {
      margin:       0,
      filename:     `Passport_Application_${data.name ? data.name.split(' ')[0] : 'Form'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        scrollY: 0,
        scrollX: 0,
        x: 0,
        y: 0,
        windowWidth: 794, // Important to fix layout width and media queries
        width: 794
      },
      jsPDF:        { 
        unit: 'px', 
        format: [794, 1123], 
        orientation: 'portrait' 
      }
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set(opt).from(sheet).save()
        .then(() => {
            if(document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
        })
        .catch((err: any) => {
            console.error("PDF Generation Error:", err);
            if(document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
        });
    } else {
        if(document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
        alert('PDF মডিউল লোড হয়নি।');
    }
  };
  
  const renderPreview = () => {
    switch (data.template) {
      case TemplateKey.PassportCorrection:
        return <PassportCorrectionPreview data={data} />;
      case TemplateKey.PassportNameChange:
        return <PassportNameChangePreview data={data} />;
      case TemplateKey.PassportTypeChange:
        return <PassportTypeChangePreview data={data} />;
      case TemplateKey.PassportReissue:
        return <PassportReissuePreview data={data} />;
      case TemplateKey.PassportLoss:
        return <PassportLossPreview data={data} />;
      case TemplateKey.PassportGeneral:
      default:
        return <PassportGeneralPreview data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto p-2 sm:p-4 bg-gray-200 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 shadow-inner flex justify-center">
            {/* Paper Simulator - Responsive */}
            <div 
                id="printable-area" 
                className="bg-white text-black shadow-lg w-full max-w-[794px] min-h-[800px] sm:min-h-[1000px] p-6 sm:p-12 relative box-border"
            >
                <div className="text-left mb-8 text-black">
                   <p>তারিখ: {new Date().toLocaleDateString('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                </div>

                {renderPreview()}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 no-print">
            <Button type="button" onClick={handlePrint} fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                প্রিন্ট করুন
            </Button>
            <Button type="button" onClick={handleDownloadPdf} fullWidth>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF ডাউনলোড করুন
            </Button>
            
             {/* Mobile Only: Edit Button */}
             {onEdit && (
                <div className="sm:hidden">
                    <Button type="button" onClick={onEdit} variant="secondary" fullWidth>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        তথ্য সংশোধন করুন (Edit)
                    </Button>
                </div>
             )}

            <div className="sm:col-span-2">
                <Button type="button" onClick={onReset} variant="secondary" fullWidth>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    নতুন আবেদন করুন
                </Button>
            </div>
        </div>
    </div>
  );
};

export default ApplicationPreview;

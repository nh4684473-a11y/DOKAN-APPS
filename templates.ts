
import { Template, TemplateKey } from './types';

export const TEMPLATES: Record<TemplateKey, Template> = {
  [TemplateKey.PassportCorrection]: {
    key: TemplateKey.PassportCorrection,
    name: 'পাসপোর্ট তথ্য সংশোধন',
    description: 'জাতীয় পরিচয়পত্র (NID) বা জন্মনিবন্ধন অনুযায়ী পাসপোর্টের তথ্য সংশোধন করার জন্য আবেদন।',
    fields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'passportNo', 'subject', 'wrongInfo', 'correctInfo'],
    requiredFields: ['name', 'father', 'district', 'nid', 'passportNo', 'subject'],
  },
  [TemplateKey.PassportNameChange]: {
    key: TemplateKey.PassportNameChange,
    name: 'পাসপোর্টে নাম পরিবর্তন',
    description: 'পাসপোর্টে নিজের নাম বা পিতা/মাতার নাম পরিবর্তনের জন্য আবেদন (এফিডেভিট বা NID অনুযায়ী)।',
    fields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'passportNo', 'subject', 'wrongInfo', 'correctInfo'],
    requiredFields: ['name', 'father', 'district', 'nid', 'passportNo', 'subject'],
  },
  [TemplateKey.PassportTypeChange]: {
    key: TemplateKey.PassportTypeChange,
    name: 'পাসপোর্ট ধরন পরিবর্তন',
    description: 'অফিসিয়াল পাসপোর্টের আবেদনকে সাধারণ পাসপোর্টে পরিবর্তনের জন্য।',
    fields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'subject'],
    requiredFields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'subject'],
  },
  [TemplateKey.PassportReissue]: {
    key: TemplateKey.PassportReissue,
    name: 'পাসপোর্ট রি-ইস্যু',
    description: 'মেয়াদোত্তীর্ণ বা পাতা শেষ হয়ে যাওয়া পাসপোর্ট রি-ইস্যুর আবেদন।',
    fields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'passportNo'],
    requiredFields: ['name', 'father', 'district', 'nid', 'passportNo'],
  },
  [TemplateKey.PassportLoss]: {
    key: TemplateKey.PassportLoss,
    name: 'হারানো পাসপোর্ট',
    description: 'পাসপোর্ট হারিয়ে গেলে নতুন পাসপোর্ট ইস্যুর জন্য আবেদন।',
    fields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'passportNo', 'gdNo', 'gdDate'],
    requiredFields: ['name', 'father', 'district', 'nid', 'gdNo', 'gdDate'],
  },
  [TemplateKey.PassportGeneral]: {
    key: TemplateKey.PassportGeneral,
    name: 'সাধারণ আবেদন (পাসপোর্ট অফিস)',
    description: 'পাসপোর্ট অফিসে অন্য কোনো বিষয়ের জন্য সাধারণ আবেদন।',
    fields: ['name', 'father', 'mother', 'village', 'postOffice', 'thana', 'district', 'nid', 'subject', 'passportNo', 'wrongInfo', 'correctInfo'],
    requiredFields: ['name', 'father', 'district', 'nid', 'subject'],
  },
};

export const TEMPLATE_OPTIONS = Object.values(TEMPLATES).map(t => ({
  value: t.key,
  label: t.name,
}));

export const SUGGESTED_SUBJECTS = [
  "পাসপোর্টে তথ্য সংশোধনের জন্য আবেদন।",
  "পাসপোর্ট আবেদন ফরমে থাকা ভুল তথ্য সংশোধনের আবেদন।",
  "জাতীয় পরিচয়পত্র অনুযায়ী পাসপোর্ট তথ্য সংশোধনের জন্য আবেদন।",
  "পূর্ববর্তী পাসপোর্টের তথ্যের অমিল সংশোধনের জন্য আবেদন।",
  "ই-পাসপোর্টে ঠিকানা সংশোধনের জন্য আবেদন।",
  "ই-পাসপোর্টে নাম সংশোধনের জন্য আবেদন।",
  "জন্মতারিখ সংশোধনের জন্য আবেদন।",
  "অফিসিয়াল পাসপোর্টের পরিবর্তে সাধারণ ই-পাসপোর্ট ইস্যুর জন্য আবেদন।",
  "ভুল তথ্যের কারণে নতুন করে ই-পাসপোর্ট ইস্যুর জন্য আবেদন।",
  "আগের আবেদন বাতিল করে নতুনভাবে পাসপোর্ট ইস্যুর জন্য আবেদন।",
  "পিতার নাম/মাতার নাম সংশোধনের জন্য আবেদন।",
  "অনলাইন আবেদন আপডেটের জন্য আবেদন।",
  "পাসপোর্টে ইংরেজি নাম সংশোধনের জন্য আবেদন।",
  "পাসপোর্টে স্থায়ী ঠিকানা সংশোধনের জন্য আবেদন।",
  "জন্মনিবন্ধন অনুযায়ী তথ্য সংশোধনের জন্য আবেদন।",
  "আইডি কার্ড অনুযায়ী নতুন ই-পাসপোর্ট ইস্যুর জন্য আবেদন।"
];

export const getSuggestedSubjects = (templateKey: TemplateKey): string[] => {
  switch (templateKey) {
    case TemplateKey.PassportCorrection:
      return [
        "পাসপোর্টে তথ্য সংশোধনের জন্য আবেদন।",
        "পাসপোর্ট আবেদন ফরমে থাকা ভুল তথ্য সংশোধনের আবেদন।",
        "জাতীয় পরিচয়পত্র অনুযায়ী পাসপোর্ট তথ্য সংশোধনের জন্য আবেদন।",
        "পূর্ববর্তী পাসপোর্টের তথ্যের অমিল সংশোধনের জন্য আবেদন।",
        "ই-পাসপোর্টে ঠিকানা সংশোধনের জন্য আবেদন।",
        "ই-পাসপোর্টে নাম সংশোধনের জন্য আবেদন।",
        "জন্মতারিখ সংশোধনের জন্য আবেদন।",
        "পাসপোর্টে ইংরেজি নাম সংশোধনের জন্য আবেদন।",
        "পাসপোর্টে স্থায়ী ঠিকানা সংশোধনের জন্য আবেদন।",
        "জন্মনিবন্ধন অনুযায়ী তথ্য সংশোধনের জন্য আবেদন।"
      ];
    case TemplateKey.PassportNameChange:
      return [
        "পাসপোর্টে নাম পরিবর্তনের জন্য আবেদন।",
        "পাসপোর্টে নিজের নাম সংশোধনের জন্য আবেদন।",
        "পাসপোর্টে পিতার নাম সংশোধনের জন্য আবেদন।",
        "পাসপোর্টে মাতার নাম সংশোধনের জন্য আবেদন।",
        "এফিডেভিট মূলে পাসপোর্টে নাম পরিবর্তনের আবেদন।"
      ];
    case TemplateKey.PassportTypeChange:
      return [
        "অফিসিয়াল পাসপোর্টের পরিবর্তে সাধারণ ই-পাসপোর্ট ইস্যুর অনুমতি চেয়ে আবেদন।"
      ];
    case TemplateKey.PassportReissue:
       return [
        "পাসপোর্ট রি-ইস্যু করার জন্য আবেদন।"
       ];
    case TemplateKey.PassportLoss:
       return [
        "হারানো পাসপোর্টের পরিবর্তে নতুন পাসপোর্ট ইস্যুর আবেদন।"
       ];
    case TemplateKey.PassportGeneral:
      return SUGGESTED_SUBJECTS;
    default:
      return [];
  }
};

export interface SubjectOption {
  label: string;
  value: string; // This will be used as the subject text
  template: TemplateKey;
}

export const ALL_SUBJECT_OPTIONS: SubjectOption[] = [
  // Correction Subjects
  { label: "পাসপোর্টে তথ্য সংশোধনের জন্য আবেদন।", value: "পাসপোর্টে তথ্য সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "পাসপোর্ট আবেদন ফরমে থাকা ভুল তথ্য সংশোধনের আবেদন।", value: "পাসপোর্ট আবেদন ফরমে থাকা ভুল তথ্য সংশোধনের আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "জাতীয় পরিচয়পত্র অনুযায়ী পাসপোর্ট তথ্য সংশোধনের জন্য আবেদন।", value: "জাতীয় পরিচয়পত্র অনুযায়ী পাসপোর্ট তথ্য সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "পূর্ববর্তী পাসপোর্টের তথ্যের অমিল সংশোধনের জন্য আবেদন।", value: "পূর্ববর্তী পাসপোর্টের তথ্যের অমিল সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "ই-পাসপোর্টে ঠিকানা সংশোধনের জন্য আবেদন।", value: "ই-পাসপোর্টে ঠিকানা সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "ই-পাসপোর্টে নাম সংশোধনের জন্য আবেদন।", value: "ই-পাসপোর্টে নাম সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "জন্মতারিখ সংশোধনের জন্য আবেদন।", value: "জন্মতারিখ সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "পাসপোর্টে ইংরেজি নাম সংশোধনের জন্য আবেদন।", value: "পাসপোর্টে ইংরেজি নাম সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "পাসপোর্টে স্থায়ী ঠিকানা সংশোধনের জন্য আবেদন।", value: "পাসপোর্টে স্থায়ী ঠিকানা সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  { label: "জন্মনিবন্ধন অনুযায়ী তথ্য সংশোধনের জন্য আবেদন।", value: "জন্মনিবন্ধন অনুযায়ী তথ্য সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportCorrection },
  
  // Name Change Subjects
  { label: "পাসপোর্টে নাম পরিবর্তনের জন্য আবেদন।", value: "পাসপোর্টে নাম পরিবর্তনের জন্য আবেদন।", template: TemplateKey.PassportNameChange },
  { label: "পাসপোর্টে নিজের নাম সংশোধনের জন্য আবেদন।", value: "পাসপোর্টে নিজের নাম সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportNameChange },
  { label: "পাসপোর্টে পিতার নাম সংশোধনের জন্য আবেদন।", value: "পাসপোর্টে পিতার নাম সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportNameChange },
  { label: "পাসপোর্টে মাতার নাম সংশোধনের জন্য আবেদন।", value: "পাসপোর্টে মাতার নাম সংশোধনের জন্য আবেদন।", template: TemplateKey.PassportNameChange },
  { label: "এফিডেভিট মূলে পাসপোর্টে নাম পরিবর্তনের আবেদন।", value: "এফিডেভিট মূলে পাসপোর্টে নাম পরিবর্তনের আবেদন।", template: TemplateKey.PassportNameChange },

  // Type Change
  { label: "অফিসিয়াল পাসপোর্টের পরিবর্তে সাধারণ ই-পাসপোর্ট ইস্যুর অনুমতি চেয়ে আবেদন।", value: "অফিসিয়াল পাসপোর্টের পরিবর্তে সাধারণ ই-পাসপোর্ট ইস্যুর অনুমতি চেয়ে আবেদন।", template: TemplateKey.PassportTypeChange },
  
  // Reissue
  { label: "পাসপোর্ট রি-ইস্যু করার জন্য আবেদন।", value: "পাসপোর্ট রি-ইস্যু করার জন্য আবেদন।", template: TemplateKey.PassportReissue },
  
  // Loss
  { label: "হারানো পাসপোর্টের পরিবর্তে নতুন পাসপোর্ট ইস্যুর আবেদন।", value: "হারানো পাসপোর্টের পরিবর্তে নতুন পাসপোর্ট ইস্যুর আবেদন।", template: TemplateKey.PassportLoss },

  // General / Other
  { label: "অন্যান্য / নতুন বিষয় লিখুন", value: "", template: TemplateKey.PassportGeneral },
];

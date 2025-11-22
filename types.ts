
export enum TemplateKey {
  PassportCorrection = 'passport-correction',
  PassportTypeChange = 'passport-type-change',
  PassportGeneral = 'passport-general',
  PassportReissue = 'passport-reissue',
  PassportLoss = 'passport-loss',
  PassportNameChange = 'passport-name-change'
}

export interface CorrectionItem {
  correctionType?: string; // e.g. Name, Father's Name
  wrong: string;
  correct: string;
}

// Add a 'subject' and 'passportNo' field
export interface ApplicationData {
  name: string;
  father: string;
  mother: string;
  village: string;
  postOffice: string;
  thana: string;
  district: string;
  nid: string;
  subject?: string; // Optional subject field
  passportNo?: string; // Optional passport number field
  gdNo?: string; // For lost passport
  gdDate?: string; // For lost passport
  wrongInfo?: string; // What is currently wrong in passport (Legacy/First item)
  correctInfo?: string; // What should be the correct info (Legacy/First item)
  correctionList?: CorrectionItem[]; // List of corrections
  
  // New fields for Undertaking
  religion?: string;
  nationality?: string;
  passportIssueDate?: string;
  address?: string; // Full address string

  // New fields for Child Permission
  childName?: string;
  childDob?: string;
  childFather?: string;
  childMother?: string;
  childBrc?: string; // Birth Registration Certificate
  childAddress?: string;
  parentName?: string;
  mobile?: string;
}

// Define which fields from ApplicationData are used by a template
export type FormField = keyof ApplicationData;

export interface Template {
  key: TemplateKey;
  name: string;
  description: string;
  fields: FormField[];
  requiredFields: FormField[];
}

export type ApplicationSubmission = ApplicationData & { template: TemplateKey };

// Photo App Types
export enum AppState {
  UPLOAD = 'UPLOAD',
  PREVIEW = 'PREVIEW',
  RESULT = 'RESULT'
}

export enum BackgroundColor {
  WHITE = 'white',
  LIGHT_BLUE = '#dbeafe', // Tailwind blue-100
  LIGHT_GRAY = '#f3f4f6', // Tailwind gray-100
  OFF_WHITE = '#f9fafb'   // Tailwind gray-50
}

export interface UploadedFile {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

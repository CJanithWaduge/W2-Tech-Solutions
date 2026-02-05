export interface ContactChannel {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'red' | 'blue' | 'green' | 'purple';
  responseTime: string;
  priority: string;
  contactMethods: ContactMethod[];
  instructions: string[];
}

export interface ContactMethod {
  type: 'email' | 'pgp' | 'github' | 'form' | 'docs' | 'forum' | 'calendar' | 'guideline';
  label: string;
  value: string;
  encrypted?: boolean;
  fingerprint?: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export interface AlternativeMethod {
  type: string;
  label: string;
  value: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  subscribe: boolean;
  attachments?: File[];
}

export interface FormValidation {
  name: { required: boolean; minLength: number; maxLength: number };
  email: { required: boolean; pattern: string };
  subject: { required: boolean; minLength: number; maxLength: number };
  message: { required: boolean; minLength: number; maxLength: number };
}
import type { LocalizedString } from '../utils/localization';

export interface ResumeData {
  _id?: string;
  userId?: string;
  title: LocalizedString;
  profileInfo: {
    profileImg: File | null;
    profilePreviewUrl?: string;
    fullName: LocalizedString;
    designation: LocalizedString;
    summary: LocalizedString;
  };
  contactInfo: {
    email: string;
    phone: string;
    location: LocalizedString;
    linkedin: string;
    github: string;
    website: string;
  };
  workExperience: Array<{
    company: LocalizedString;
    role: LocalizedString;
    description: LocalizedString;
    startDate: string;
    endDate: string;
  }>;
  education: Array<{
    degree: LocalizedString;
    institution: LocalizedString;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: LocalizedString;
    progress: number;
  }>;
  projects: Array<{
    title: LocalizedString;
    description: LocalizedString;
    github: string;
    liveDemo: string;
  }>;
  certifications: Array<{
    title: LocalizedString;
    issuer: LocalizedString;
    year: string;
  }>;
  languages: Array<{
    name: LocalizedString;
    progress: number;
  }>;
  interests: Array<{ name: LocalizedString }>;
  template: {
    theme: string;
    colorPalette: string[];
  };
  thumbnailLink?: string;
}

export const defaultResumeData: ResumeData = {
  title: { en: '', ru: '', kz: '' },
  profileInfo: {
    profileImg: null,
    profilePreviewUrl: '',
    fullName: { en: '', ru: '', kz: '' },
    designation: { en: '', ru: '', kz: '' },
    summary: { en: '', ru: '', kz: '' },
  },
  contactInfo: {
    email: '',
    phone: '',
    location: { en: '', ru: '', kz: '' },
    linkedin: '',
    github: '',
    website: '',
  },
  workExperience: [
    {
      company: { en: '', ru: '', kz: '' },
      role: { en: '', ru: '', kz: '' },
      description: { en: '', ru: '', kz: '' },
      startDate: '',
      endDate: '',
    },
  ],
  education: [
    {
      degree: { en: '', ru: '', kz: '' },
      institution: { en: '', ru: '', kz: '' },
      startDate: '',
      endDate: '',
    },
  ],
  skills: [
    {
      name: { en: '', ru: '', kz: '' },
      progress: 0,
    },
  ],
  projects: [
    {
      title: { en: '', ru: '', kz: '' },
      description: { en: '', ru: '', kz: '' },
      github: '',
      liveDemo: '',
    },
  ],
  certifications: [
    {
      title: { en: '', ru: '', kz: '' },
      issuer: { en: '', ru: '', kz: '' },
      year: '',
    },
  ],
  languages: [
    {
      name: { en: '', ru: '', kz: '' },
      progress: 0,
    },
  ],
  interests: [
    {name: { en: '', ru: '', kz: '' } },
  ],
  template: {
    theme: '',
    colorPalette: [],
  },
  thumbnailLink: '',
};
import type { LocalizedString } from '../../utils/localization'; 

export interface ContactInfo {
  location: LocalizedString;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ProfileInfo {
  fullName: LocalizedString;
  designation: LocalizedString;
  summary: LocalizedString;
  profilePreviewUrl?: string;
}

export interface EducationItem {
  institution: LocalizedString;
  degree: LocalizedString;
  startDate: string;
  endDate: string;
  _id: string;
}

export interface WorkExperienceItem {
  company: LocalizedString;
  role: LocalizedString;
  startDate: string;
  endDate: string;
  description: LocalizedString;
  _id: string;
}

export interface ProjectItem {
  title: LocalizedString;
  description: LocalizedString;
  github?: string;
  liveDemo?: string;
  _id: string;
}

export interface CertificationItem {
  title: LocalizedString;
  issuer: LocalizedString;
  year: string;
  _id: string;
}

export interface SkillItem {
  name: LocalizedString;
  progress: number;
  _id: string;
}

export interface LanguageItem {
  name: LocalizedString;
  progress: number;
  _id: string;
}

export interface InterestItem {
  name: LocalizedString;
  _id: string;
}

export interface Resume {
  _id: string;
  title: LocalizedString;
  template: {
    theme: string;
    colorPalette: string[];
  };
  contactInfo: ContactInfo;
  profileInfo: ProfileInfo;
  education: EducationItem[];
  workExperience: WorkExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  skills: SkillItem[];
  languages: LanguageItem[];
  interests: InterestItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  __v?: number;
  thumbnailLink?: string;
}

export interface ResumeSummary {
  _id: string;
  title: LocalizedString;
  thumbnailLink?: string;
  updatedAt: string;
}
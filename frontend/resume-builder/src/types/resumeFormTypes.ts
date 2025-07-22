import type { ResumeData } from "./resume";

export type ResumeSectionKey = keyof Pick<
  ResumeData,
  'profileInfo' |
  'contactInfo' |
  'workExperience' |
  'education' |
  'projects' |
  'skills' |
  'certifications' |
  'languages' |
  'interests'
>;

export type PageKey =
  | 'profile-info'
  | 'contact-info'
  | 'work-experience'
  | 'education-info'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'additionalInfo';

  export const resumePages: PageKey[] = [
  'profile-info',
  'contact-info',
  'work-experience',
  'education-info',
  'skills',
  'projects',
  'certifications',
  'additionalInfo',
];
import {
  ProfileInfoForm,
  ContactInfoForm,
  WorkExperienceForm,
  EducationDetailsForm,
  ProjectsDetailForm,
  SkillsInfoForm,
  CertificationInfoForm,
  AdditionalInfoForm,
} from '../pages/resumeUpdate/forms';

export const formComponentsMap = {
  'profile-info': ProfileInfoForm,
  'contact-info': ContactInfoForm,
  'work-experience': WorkExperienceForm,
  'education-info': EducationDetailsForm,
  'projects': ProjectsDetailForm,
  'skills': SkillsInfoForm,
  'certifications': CertificationInfoForm,
  'additionalInfo': AdditionalInfoForm,
} as const;

export type ResumeFormPage = keyof typeof formComponentsMap;

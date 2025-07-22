import type { JSX } from 'react';
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
import type { ResumeFormPage } from './formComponentsMap';

interface SharedFormProps {
  profileImgFile?: string | null;
  setProfileImgFile?: (id: string | null) => void;
}

export const renderForm = (
  currentPage: ResumeFormPage,
  props?: SharedFormProps
): JSX.Element | null => {
  
  switch (currentPage) {
    case 'profile-info':
      return (
        <ProfileInfoForm 
          //  profileImgFile={props?.profileImgFile ?? null}
           setProfileImgFile={props?.setProfileImgFile ?? (() => {})}
          />
      )  
    case 'contact-info':
      return <ContactInfoForm  />;
    case 'work-experience':
      return <WorkExperienceForm  />;
    case 'education-info':
      return <EducationDetailsForm  />;
    case 'projects':
      return <ProjectsDetailForm  />;
    case 'skills':
      return <SkillsInfoForm />;
    case 'certifications':
      return <CertificationInfoForm  />;
    case 'additionalInfo':
      return (
        <AdditionalInfoForm />
      );
    default:
      return null;
  }
};
import React from 'react';
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo';
import TemplateThree from './TemplateThree';
import type { ResumeData } from '../../types/resume';

import { useAppSelector } from '../../store/hooks';


interface RenderResumeProps {
  containerWidth?: number;
  overrideTheme?: string;
  overrideColorPalette?: string[];
  resumeData?: ResumeData;
}

const RenderResume: React.FC<RenderResumeProps> = ({ 
  overrideTheme,
  overrideColorPalette,
  resumeData,
  containerWidth = 0 
}) => {
  const storeResume = useAppSelector((s) => s.resume.data);
  const resume = resumeData || storeResume;
  const theme = overrideTheme?.length ? overrideTheme: resume.template.theme;
  const colorPalette = overrideColorPalette?.length ? overrideColorPalette: resume.template.colorPalette;

  switch (theme) {
    case '01':
      return <TemplateOne resumeData={resume} colorPallete={colorPalette} containerWidth={containerWidth} />;
    case '02':
      return <TemplateTwo resumeData={resume} colorPallete={colorPalette} containerWidth={containerWidth} />;
    case '03':
      return <TemplateThree resumeData={resume} colorPallete={colorPalette} containerWidth={containerWidth} />;
    default:
      return <TemplateOne resumeData={resume} colorPallete={colorPalette} containerWidth={containerWidth} />;
  }
};

export default RenderResume;

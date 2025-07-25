import { useState, useRef, useEffect, type FC } from 'react';
import {
  LuMapPinHouse,
  LuPhone,
  LuRss,
  LuGithub,
  LuUser,
  LuMail,
} from 'react-icons/lu';
import { RiLinkedinLine } from 'react-icons/ri';

import ContactInfo from '../ResumeSections/ContactInfo';
import EducationInfo from '../ResumeSections/EducationInfo';
import { LanguageSection } from '../ResumeSections/LanguageSection';
import WorkExperience from '../ResumeSections/WorkExperience';
import SkillSection from '../ResumeSections/SkillSection';
import CertificationInfo from '../ResumeSections/CertificationInfo';
import ProjectInfo from '../ResumeSections/ProjectInfo';

import { formatYearMonth } from './../../utils/helper';
import type { ResumeData } from '../../types/resume'; 
import { useTranslation } from 'react-i18next';
import { getLocalizedString, type LocalizedString } from '../../utils/localization';

const DEFAULT_THEME = ['#EBFDFF', '#A1F4FD', '#CEFAFE', '#00B8D8', '#4A5565'];

type TitleProps = {
  text?: string,
  translationKey?: string;
  color: string;
};

const Title: FC<TitleProps> = ({ text, translationKey, color }) => {
  const { t } = useTranslation('profileInfo')
  const titleText = translationKey ? t(translationKey) : text;

  return (
    <div className='relative w-fit mb-2.5'>
      <span
        className='absolute bottom-0 left-0 w-full h-2'
        style={{ backgroundColor: color }}
      ></span>
      <h2 className='relative text-sm font-bold'>{titleText}</h2>
    </div>
  );
};

type TemplateTwoProps = {
  resumeData: ResumeData;
  colorPallete?: string[];
  containerWidth: number;
};

const TemplateTwo: FC<TemplateTwoProps> = ({
  resumeData,
  colorPallete = DEFAULT_THEME,
  containerWidth,
}) => {
  const themeColors = colorPallete?.length > 0 ? colorPallete : DEFAULT_THEME;

  const resumeRef = useRef<HTMLDivElement | null>(null);
  const [baseWidth, setBaseWidth] = useState<number>(800);
  const [scale, setScale] = useState<number>(1);

  const { i18n } = useTranslation();
  const lang = i18n.language.split('-')[0] as keyof LocalizedString;

  useEffect(() => {
    if (resumeRef.current) {
      const actualBaseWidth = resumeRef.current.offsetWidth;
      setBaseWidth(actualBaseWidth);
      setScale(containerWidth / actualBaseWidth);
    }
  }, [containerWidth]);

  return (
    <div
      ref={resumeRef}
      className='p-3 bg-white'
      style={{
        transform: containerWidth > 0 ? `scale(${scale})` : 'none',
        transformOrigin: 'top left',
        width: containerWidth > 0 ? `${baseWidth}px` : 'auto',
        height: 'auto',
      }}
    >

      <div className='flex items-start gap-5 px-2 mb-5'>
        <div
          className='w-[100px] h-[100px] max-w-[105px] max-h-[105px] rounded-2xl flex items-center justify-center'
          style={{ backgroundColor: themeColors[1] }}
        >
          {resumeData.profileInfo.profilePreviewUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/files/image/${resumeData.profileInfo.profilePreviewUrl}`}
              alt='Profile'
              className='w-[90px] h-[90px] rounded-2xl'
            />
          ) : (
            <div
              className='w-[90px] h-[90px] flex items-center justify-center text-5xl rounded-full'
              style={{ color: themeColors[4]}}
            >
              <LuUser />
            </div>
          )}
        </div>

        <div>
          <div className='grid grid-cols-12 items-center'>
            <div className='col-span-8 mr-2'>
              <h2 className='text-2xl font-bold'>
                {/* {resumeData.profileInfo.fullName?.[lang] || ''} */}
                {getLocalizedString(resumeData.profileInfo.fullName, lang)}
              </h2>
              <p className='text-[15px] font-semibold mb-2'>
                {/* {resumeData.profileInfo.designation?.[lang] || ''} */}
                {getLocalizedString(resumeData.profileInfo.designation, lang)}
              </p>

              <ContactInfo
              icon={<LuMapPinHouse/>}
              iconBG={themeColors[2]}
               value={getLocalizedString(resumeData.contactInfo.location, lang)} 
              />
            </div>

            <div className='col-span-4 flex flex-col gap-5 mt-2 mr-2'>
              <ContactInfo
                icon={<LuMail/>}
                iconBG={themeColors[2]}
                value={resumeData.contactInfo.email}
              />

              <ContactInfo
                icon={<LuPhone/>}
                iconBG={themeColors[2]}
                value={resumeData.contactInfo.phone}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-12 gap-8'>
        {/* Left column */}
        <div className='col-span-4 py-10' style={{ backgroundColor: themeColors[0] }}>

          <div className='my-6 mx-6'>
            <div className='flex flex-col gap-4'>
            
              {resumeData.contactInfo.linkedin && (
                <ContactInfo 
                  icon={<RiLinkedinLine />} 
                  iconBG={themeColors[2]} 
                  value={resumeData.contactInfo.linkedin} />
              )}
              {resumeData.contactInfo.github && (
                <ContactInfo 
                  icon={<LuGithub />} 
                  iconBG={themeColors[2]} 
                  value={resumeData.contactInfo.github} />
              )}
              {resumeData.contactInfo.website && (
                <ContactInfo 
                  icon={<LuRss />} 
                  iconBG={themeColors[2]} 
                  value={resumeData.contactInfo.website} />
              )}
              
            </div>
            
            
            <div className='mt-5'>
              <Title translationKey='education.title' color={themeColors[1]} />
              {resumeData.education.map((data, index) => (
                <EducationInfo
                  key={`education_${index}`}
                  degree={getLocalizedString(data.degree, lang)}
                  institution={getLocalizedString(data.institution, lang)}
                  duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                />
              ))}
            </div>

            <div className='mt-5'>
              <Title translationKey='additional.languages' color={themeColors[1]} />
              <LanguageSection
                languages={resumeData.languages.map((langItem) => ({
                  ...langItem,
                  name: getLocalizedString(langItem.name, lang),
                  progress: langItem.progress ?? 0
                }))}
                accentColor={themeColors[3]}
                bgColor={themeColors[2]}
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className='col-span-8 pt-10 mr-10 pb-5'>
          <div>
            <Title translationKey='profile.summary' color={themeColors[1]} />
            <p className='text-sm font-medium'>
              {getLocalizedString(resumeData.profileInfo.summary, lang)}
            </p>
          </div>

          <div className='mt-4'>
            <Title translationKey='workExperience.title' color={themeColors[1]} />
            {resumeData.workExperience.map((data, index) => (
              <WorkExperience
                key={`work_${index}`}
                company={getLocalizedString(data.company, lang)}
                role={data.role?.[lang] || ''}
                duration={`${formatYearMonth(data.startDate)} - ${formatYearMonth(data.endDate)}`}
                durationColor={themeColors[4]}
                description={getLocalizedString(data.description, lang)}
              />
            ))}
          </div>

          <div className='mt-4'>
              {resumeData.projects?.some(p => p.title?.[lang]?.trim()) && (
                <div className='mt-4'>
                  <Title translationKey='projects.title' color={themeColors[1]} />
                  {resumeData.projects
                  .filter(p => p.title?.[lang]?.trim())
                  .map((project, index) => (
                    <ProjectInfo
                      key={`project_${index}`}
                      title={getLocalizedString(project.title, lang)}
                      description={getLocalizedString(project.description, lang)}
                      githubLink={project.github}
                      liveDemoUrl={project.liveDemo}
                      bgColor={themeColors[2]}
                    />
                  ))}
                </div>
              )}
            </div>

          <div className='mt-4'>
            <Title translationKey='skills.title' color={themeColors[1]} />
            <SkillSection
              skills={resumeData.skills.map((skill) => ({
                ...skill,
                name: getLocalizedString(skill.name, lang),
              }))}
              accentColor={themeColors[3]}
              bgColor={themeColors[2]}
            />
          </div>
          
          <div className='mt-4'>
              {resumeData.certifications?.some(p => p.title?.[lang]?.trim()) && (
                <div className='mt-4'>
                  <Title translationKey='projects.title' color={themeColors[1]} />
                  {resumeData.certifications
                  .filter(p => p.title?.[lang]?.trim())
                  .map((data, index) => (
                    <CertificationInfo
                      key={`cert_${index}`}
                      title={getLocalizedString(data.title, lang)}
                      issuer={getLocalizedString(data.issuer, lang)}
                      year={data.year}
                      bgColor={themeColors[2]}
                    />
                  ))}
                </div>
              )}
            </div>
          
          {resumeData.interests.some(interest => getLocalizedString(interest.name, lang)) && (
            <div className='mt-4'>
              <Title translationKey='additional.interests' color={themeColors[1]} />
              <div className='flex items-center flex-wrap gap-3 mt-4'>
                {resumeData.interests.map((interest, index) => {
                  const interestText = getLocalizedString(interest.name, lang);
  
                  return interestText ? (
                    <div
                      key={`interest_${index}`}
                      className='text-[10px] font-medium py-1 px-3 rounded-lg'
                      style={{ backgroundColor: themeColors[2] }}
                    >
                      {interestText}
                    </div>
                  ) : null
                })
              }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateTwo;
import { useState, useEffect, useRef } from 'react';
import {
  resumeTemplates,
  themeColorPalette,
} from '../../utils/data';
import { LuCircleCheckBig } from 'react-icons/lu';
import Tabs from '../../components/Tabs';
import TemplateCard from '../../components/cards/TemplateCard';
import RenderResume from '../../components/ResumeTemplates/RenderResume';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateTemplate } from '../../features/resume/resumeSlice';
import { updateResumeDetails } from '../../features/resume/helpers';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type ThemeSelectorProps = {
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({onClose,}) => {
  const dispatch = useAppDispatch();
  const resumeData = useAppSelector((state) => state.resume.data);
  const { resumeId } = useParams<{ resumeId: string }>();
  const draft = useAppSelector((s) => s.resume.data);
  
  const resumeRef = useRef<HTMLDivElement | null>(null);
  const [baseWidth, setBaseWidth] = useState<number>(800);
  const { t } = useTranslation('profileInfo');

  const TAB_DATA = [
    { key: 'templates', label: t('tabs.templates') }, 
    { key: 'colors', label: t('tabs.colors') }
  ];
  const [tabValue, setTabValue] = useState<string>('templates');
  const [selectedColorPalette, setSelectedColorPalette] = useState<{
    colors: string[];
    index: number;
  }>({
    colors: resumeData.template?.colorPalette || [],
    index: -1,
  });

  const [selectedTemplate, setSelectedTemplate] = useState<{
    theme: string;
    index: number;
  }>({
    theme: resumeData.template?.theme || '',
    index: resumeTemplates.findIndex(t => t.id === resumeData.template?.theme),
  });

  const handleThemeSelection = () => {
    dispatch(updateTemplate({
      colorPalette: selectedColorPalette.colors,
      theme: selectedTemplate.theme,
    }));
    
    if(resumeId) {
      dispatch(updateResumeDetails({
        resumeId,
        resumeData: { ...draft,
          template: {
            theme: selectedTemplate.theme,
            colorPalette: selectedColorPalette.colors,
          }
        }
      }))
    }
    onClose();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);
    return () => window.removeEventListener('resize', updateBaseWidth);
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />

        <button className="btn-small-light" onClick={handleThemeSelection}>
          <LuCircleCheckBig className="text-[16px]" />
          {t('tabs.done')}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-5 bg-white">
          <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-scroll custom-scrollbar">
            {tabValue === 'templates' &&
              resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`templates_${index}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate.index === index}
                  onSelect={() => {
                    setSelectedTemplate({ theme: template.id, index });
                    // dispatch(updateTemplate({
                    //   theme: template.id,
                    //   colorPalette: selectedColorPalette.colors,
                    // }))
                  }}
                />
              ))}

            {tabValue === 'colors' &&
              themeColorPalette.themeOne.map((colors, index) => (
                <ColorPalette
                  key={`palette_${index}`}
                  colors={colors}
                  isSelected={selectedColorPalette.index === index}
                  onSelect={() => {
                    setSelectedColorPalette({ colors, index });
                    // dispatch(updateTemplate({
                    //   theme: selectedTemplate.theme,
                    //   colorPalette: selectedColorPalette.colors,
                    // }))
                  }}

                />
              ))}
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 bg-white -mt-3" ref={resumeRef}>
          <RenderResume 
            containerWidth={baseWidth}
            overrideTheme={selectedTemplate.theme}
            overrideColorPalette={selectedColorPalette.colors} 
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;


type ColorPaletteProps = {
  colors: string[];
  isSelected: boolean;
  onSelect: () => void;
};

const ColorPalette: React.FC<ColorPaletteProps> = ({
  colors,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`h-28 bg-purple-50 flex rounded-lg overflow-hidden border-2 ${
        isSelected ? 'border-purple-500' : 'border-none'
      }`}
    >
      {colors.map((color, index) => (
        <div
          key={`color_${index}`}
          className="flex-1"
          style={{ backgroundColor: color }}
          onClick={onSelect}
        />
      ))}
    </div>
  );
};
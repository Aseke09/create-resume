import { useEffect, useState } from 'react';
import { getLightColorFromImage } from '../../utils/helper';
import { useAppSelector } from '../../store/hooks';
import { selectResumeById } from '../../features/resume/resumeSlice';
import { useTranslation } from 'react-i18next';
import { getLocalizedString, type LocalizedString } from '../../utils/localization';
import { BASE_URL } from '../../utils/apiPaths';

interface ResumeSummaryCardProps {
  resumeId: string;
  onSelect: () => void;
  thumbnailLink: string | undefined;
}

const ResumeSummaryCard: React.FC<ResumeSummaryCardProps> = ({
  resumeId,
  onSelect,
  thumbnailLink,
}) => {
  const resume = useAppSelector((state) => selectResumeById(state, resumeId))
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const { i18n } = useTranslation('profileInfo');
  const lang = i18n.language.split('-')[0] as keyof LocalizedString;

  const imageSrc = thumbnailLink
  ? `${BASE_URL}/files/image/${thumbnailLink}`
  : null;

 useEffect(() => {
  if (resume?.thumbnailLink) {
    const fullImageUrl = `${BASE_URL}/files/image/${resume.thumbnailLink}`;
    getLightColorFromImage(fullImageUrl)
      .then(setBgColor)
      .catch(() => setBgColor('#ffffff'));
  }
}, [resume?.thumbnailLink]);

if (!resume) return null

  return (
    <div
      className='h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer'
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
    >
      <div className='p-4'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt='resume preview'
            className='w-[100%] h-[200px] rounded'
          />
        ) : (
          <div className='w-[100%] h-[200px] bg-gray-100 rounded'></div>
        )}
      </div>

      <div className='w-full bg-white px-4 py-3'>
        <h5 className='text-sm font-medium truncate overflow-hidden whitespace-nowrap'>
          {getLocalizedString(resume.title, lang)}
        </h5>
        <p className='text-xs font-medium text-gray-500 mt-0.5'>
          Last Updated: {new Date(resume.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ResumeSummaryCard;
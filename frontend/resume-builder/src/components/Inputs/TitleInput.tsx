import { useState, type FC } from 'react';
import { LuCheck, LuPencil } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { getLocalizedString, type LocalizedString } from '../../utils/localization';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTitle } from '../../features/resume/resumeSlice';
import { useParams } from 'react-router-dom';
import { updateResumeDetails } from '../../features/resume/helpers';

const TitleInput: FC = () => {
  const [showInput, setShowInput] = useState<boolean>(false);
  
  const dispatch = useAppDispatch();
  const { resumeId } = useParams();
  const title = useAppSelector((s) => s.resume.data.title);
  const draft = useAppSelector(s => s.resume.data);

  const { t, i18n } = useTranslation('general');
  const lang = i18n.language.split('-')[0] as keyof LocalizedString;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setTitle({ ...title, [lang]: e.target.value }));
    }

  const persistTitle = () => {
    if (!resumeId) return;                     
    dispatch(
      updateResumeDetails({
        resumeId,
        resumeData: { ...draft, title },       
      })
    );
  };
  return (
    <div className='flex items-center gap-3'>
      {showInput ? (
        <>
          <input
            type='text'
            placeholder={t('resume.titlePlaceholder')}
            className='text-sm md:text-[17px] bg-transparent outline-none text-black font-semibold border-b border-gray-300 pb-1'
            value={title[lang] ?? ''}
            onChange={handleChange}
            onBlur={() => {
              persistTitle();
              setShowInput(false)
            }}
          />

          <button className='cursor-pointer'>
            <LuCheck
              className='text-[16px] text-purple-600'
              onClick={() => setShowInput(false)}
            />
          </button>
        </>
      ) : (
        <>
          <h2 className='text-sm md:text-[17px] font-semibold'>
            {getLocalizedString(title, lang)}
          </h2>
          <button className='cursor-pointer'>
            <LuPencil
              className='text-sm text-purple-600'
              onClick={() => setShowInput(true)}
            />
          </button>
        </>
      )}
    </div>
  );
};

export default TitleInput;


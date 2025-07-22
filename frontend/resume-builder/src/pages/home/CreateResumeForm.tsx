import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTitle }  from '../../features/resume/resumeSlice';
import { createResume } from '../../features/resume/helpers';
import Input from '../../components/Inputs/Input';
import type { LocalizedString } from '../../utils/localization';

const CreateResumeForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation('createResume');
  
  const title = useAppSelector((s) => s.resume.data.title);

  const [error, setError] = useState<string | null>(null);

  const currentLang = i18n.language.split('-')[0] as keyof LocalizedString;;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setTitle({
        ...title,
        [currentLang]: e.target.value
      })
    );
  };

  const handleCreateResume = async (e: FormEvent) => {
    e.preventDefault();

    if (!title[currentLang].trim()) {
      setError(t('errors.title_required'));
      return;
    }
    setError(null);

    try {
      const newId = await dispatch(createResume()).unwrap();
      navigate(`/resume/${newId}`)
    } catch (err) {
      setError(
        typeof err === 'string' ? err : t('errors.generic')
      )
    }
  };

  return (
    <div className='w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>
        {t('createResume.title')}
      </h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-3'>
        {t('createResume.title')}
      </p>

      <form onSubmit={handleCreateResume} className='flex flex-col gap-4'>
        <Input
          value={title[currentLang] ?? ''}
          onChange={handleChange}
          label={t('createResume.resumeTitle')}
          placeholder={t('createResume.placeholder')}
          type='text'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          {t('createResume.button')}
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
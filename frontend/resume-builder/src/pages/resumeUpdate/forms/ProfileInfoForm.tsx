import { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import ProfilePhotoSelector from '../../../components/Inputs/ProfilePhotoSelector';
import Input from '../../../components/Inputs/Input';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { updateProfileInfo, patchLocalized } from '../../../features/resume/resumeSlice';
import { getLocalizedString, normalizeLang } from './../../../utils/localization';

interface ProfileInfoFormProps {
  setProfileImgFile: (id: string | null) => void;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({
  setProfileImgFile
}) => {
  const { t, i18n } = useTranslation('profileInfo');
  const dispatch = useAppDispatch();

  const profileInfo = useAppSelector((state) => state.resume.data.profileInfo);
  const resumeId = useAppSelector((state) => state.resume.data?._id)
  const lang = normalizeLang(i18n.language);

  const [localImageId, setLocalImageId] = useState<string | null>(profileInfo.profilePreviewUrl ?? null);
 
  const updateLocalizedField = (field: 'fullName' | 'designation' | 'summary', value: string) => {
    dispatch(
      patchLocalized({
        section: 'profileInfo',
        field,
        locale: lang,
        value,
      })
    );
  };

  const handleImageUrlChange = (url: string | null) => {
    setProfileImgFile(url);
    setLocalImageId(url);
    dispatch(updateProfileInfo({ profilePreviewUrl: url ?? undefined }));
  }

  useEffect(() => {
  setLocalImageId(profileInfo.profilePreviewUrl ?? null);
}, [profileInfo.profilePreviewUrl]);
  
  return (
    <div className='px-5 pt-5'>
      <h2 className='text-lg font-semibold text-gray-900'>
        {t('profile.heading')}
      </h2>

      <div className='mt-4'>
      
        <ProfilePhotoSelector
          imageId={localImageId}
          resumeId={resumeId}
          setImageId={handleImageUrlChange}
          auth={true}
        />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            value={getLocalizedString(profileInfo.fullName, lang)}
            onChange={({ target }) => updateLocalizedField('fullName', target.value)}
            label={t('profile.fullName')}
            placeholder={t('profile.fullNamePlaceholder')}
            type='text'
          />

          <Input
            value={getLocalizedString(profileInfo.designation, lang)}
            onChange={({ target }) => updateLocalizedField('designation', target.value)}
            label={t('profile.designation')}
            placeholder={t('profile.designationPlaceholder')}
            type='text'
          />

          <div className='col-span-2 mt-3'>
            <label htmlFor='summary' className='text-xs font-medium text-slate-600'>
              {t('profile.summary')}
            </label>
            <textarea
              id='summary'
              placeholder={t('profile.summaryPlaceholder')}
              className='form-input'
              rows={4}
              value={getLocalizedString(profileInfo.summary, lang)}
              onChange={({ target }) => updateLocalizedField('summary', target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoForm

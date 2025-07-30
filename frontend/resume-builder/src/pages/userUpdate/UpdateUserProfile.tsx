import { useEffect, useRef, useState, type FC, type FormEvent, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUser, updateUserProfile } from '../../features/user/userSlice';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Input from '../../components/Inputs/Input';


const UpdateUserProfile: FC = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation('general');
    const isMounted = useRef(true);
    const user = useAppSelector((state) => state.user.user);

    const [fullName, setFullName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileImageId, setProfileImageId] = useState<string | null>(user?.profileImageUrl || null);

    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!fullName) {
            setError(t('error.full_name_required'));
            return;
        }

        try {
            const payload = {
                name: fullName,
                email,
                ...(profileImageId ? { profileImageId } : {}),
            }

            const res = await dispatch(updateUserProfile(payload)).unwrap();
            dispatch(updateUser(res));
            if (isMounted.current) setSuccessMsg(t('success.updated'))
        } catch (err: unknown) {
          if (
         axios.isAxiosError(err) && 
         typeof err.response?.data?.message === 'string'
          )
          if (isMounted.current) {
            setError(
                err?.message === 'User already exists'
                  ? t('error.user_exists')
                  : err?.message || t('error.unknown')
            );
          }
      }
    }

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        }
    }, []);

    return (
        <form 
          onSubmit={handleSubmit} 
          className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
          <h3 className='text-lg font-semibold text-black mb-4'>{t('edit_profile_below')}</h3>

          <ProfilePhotoSelector
            imageId={profileImageId}
            setImageId={setProfileImageId}
            auth
          />

          <div className='grid gap-2'>
            <Input
              value={fullName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              label={t('full_name')}
              placeholder={t('placeholder.full_name')}
              type='text'
            />

            <Input
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              label={t('email')}
              placeholder={t('placeholder.email')}
              type='email'
            />
          </div>

          {error && <p className='text-red-500 text-lg py-2'>{error}</p>}
          {successMsg && <p className='text-green-600 text-lg py-2'>{successMsg}</p>}

          <button type='submit' className='btn-primary'>
            {t('submit')}
          </button>
        </form>
    )
}

export default UpdateUserProfile;
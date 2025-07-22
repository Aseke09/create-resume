import { useEffect, useRef, useState, type ChangeEvent, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../features/user/userSlice';
import { useTranslation } from 'react-i18next';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axios from 'axios';

interface SignUpProps {
  setCurrentPage?: (page: string) => void;
}

interface RegisterResponse {
  token: string;
  [key: string]: unknown;
}

const SignUp: FC<SignUpProps> = ({ setCurrentPage }) => {
  const [profileImageId, setProfileImageId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('signup');
  const isMounted = useRef(true);

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName) {
      setError(t('error.full_name_required'));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('error.invalid_email'));
      return;
    }

    if (!password) {
      setError(t('error.password_required'));
      return;
    }

    setError(null);

    try {

      const payload = {
      name: fullName,
      email,
      password,
      ...(profileImageId ? { profileImageId } : {}),
    };
      
      const { data } = await axiosInstance.post<RegisterResponse>(
        API_PATHS.AUTH.REGISTER,
        payload
      );
    
      const token = data.token;
      localStorage.setItem('token', token);
      dispatch(updateUser({ ...data, token: data.token }));

      if (isMounted.current) {
        console.log('✅ Registration successful. Redirecting to dashboard...');
      navigate('/dashboard');
      }
    } catch (err: unknown) {
     
      if (
         axios.isAxiosError(err) && 
         typeof err.response?.data?.message === 'string'
      ) {
        const serverMsg = err.response.data.message;
      
        if (isMounted.current) {
        switch (serverMsg) {
          case 'User already exists':
            setError(t('error.user_exists'));
            break;
          default: 
            setError(serverMsg);  
        }
      }
      } else {
        if (isMounted.current) {
        setError(t('error.unknown'));
      }
     }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>{t('title')}</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>{t('subtitle')}</p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector 
          imageId={profileImageId} 
          setImageId={setProfileImageId} 
          auth={false}
        />

        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
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
            type='text'
          />

          <Input
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            label={t('password')}
            placeholder={t('placeholder.password')}
            type='password'
            autoComplete='new-password'
          />
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          {t('submit')}
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          {t('existing_account')}{' '}
          <button
            className='font-medium text-primary underline cursor-pointer'
            onClick={() => setCurrentPage?.('login')}
          >
            {t('login')}
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
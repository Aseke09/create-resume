import { useEffect, useRef, useState, type ChangeEvent, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail, validatePassword, validateFullName } from '../../utils/helper';
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

  const [fullNameTouched, setFullNameTouched ] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  
  const isValidFullName = validateFullName(fullName);
  const isEmailValid = validateEmail(email);
  const passwordValidation = validatePassword(password);

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
            onBlur={() => setFullNameTouched(true)}
            label={t('full_name')}
            placeholder={t('placeholder.full_name')}
            type='text'
          />
          {fullNameTouched && !isValidFullName && (
            <p className="text-red-500 text-xs">{t('error.full_name_required')}</p>
          )}
          <Input
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            label={t('email')}
            placeholder={t('placeholder.email')}
            type='text'
          />
          {emailTouched && !isEmailValid && (
            <p className="text-red-500 text-xs">{t('error.invalid_email')}</p>
          )}

          <Input
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            label={t('password')}
            placeholder={t('placeholder.password')}
            type='password'
            autoComplete='new-password'
          />

          {passwordTouched && (
            <ul className="text-xs mt-1 space-y-1">
              <li className={passwordValidation.rules.minLength ? 'text-green-600' : 'text-red-500'}>
                • {t('password_rules.min_length')}
              </li>
              <li className={passwordValidation.rules.hasLetter ? 'text-green-600' : 'text-red-500'}>
                • {t('password_rules.has_letter')}
              </li>
              <li className={passwordValidation.rules.hasNumber ? 'text-green-600' : 'text-red-500'}>
                • {t('password_rules.has_number')}
              </li>
              <li className={passwordValidation.rules.noSpaces ? 'text-green-600' : 'text-red-500'}>
                • {t('password_rules.no_spaces')}
              </li>
            </ul>
          )}
        </div>

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button 
          type='submit' 
          className={`btn-primary ${(!isEmailValid || !passwordValidation.isValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isEmailValid || !passwordValidation.isValid}
        >  
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
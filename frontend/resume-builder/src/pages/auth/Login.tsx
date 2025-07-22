import { useState, type ChangeEvent, type FC, type FormEvent } from 'react'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../features/user/userSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface LoginProps {
    setCurrentPage?: (page: string) => void;
    onLoginSuccess?: () => void;
}

interface LoginResponse {
  token: string;
  [key: string]: unknown;
};

const Login: FC<LoginProps> = ({setCurrentPage, onLoginSuccess}) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { t } = useTranslation('login');
    
    const dispatch = useDispatch();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if(!validateEmail(email)) {
        setError(t('invalid_email'))
        return;
      }
      if(!password) {
        setError(t('missing_password'))
        return;
      }

      setError(null);

      try {
        const {data} = await axiosInstance.post<LoginResponse>(API_PATHS.AUTH.LOGIN, {
          email,
          password,
        });

        localStorage.setItem('token', data.token);        
        dispatch(updateUser({ ...data, token: data.token }));

        onLoginSuccess?.();

      } catch (err: unknown) {
        if ( axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(t('generic_error'))
        }
      }
    };

     const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>
        {t('welcome_back')}
      </h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        {t('login_description')}
      </p> 

      <form onSubmit={handleLogin}>

        <Input
          value={email}
          onChange={handleEmailChange}
          label={t('email_label')}
          placeholder={t('email_placeholder')}
          type='text'
          autoComplete='current-password'
        />

        <Input
          value={password}
          onChange={handlePasswordChange}
          label={t('password_label')}
          placeholder={t('password_placeholder')}
          type='password'
        />

        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
            {t('login_button')}
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
            {t('signup_prompt')}{' '}
          <button
           className='font-medium text-primary underline cursor-pointer'
           onClick={() => {
            setCurrentPage?.('signup');
           }}
          >
            {t('signup_button')}
          </button>  
        </p>
      </form>
    </div>
  )
}

export default Login
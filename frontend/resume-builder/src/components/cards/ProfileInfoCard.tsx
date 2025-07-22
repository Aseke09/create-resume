import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../../store/store';
import { BASE_URL } from '../../utils/apiPaths';

const ProfileInfoCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation('general');

     const { user } = useSelector((state: RootState) => state.user);

    const handleLogout = () => {
        localStorage.clear();
        dispatch(clearUser());
        navigate('/');
    };

    if (!user) return null;
    
    const profileImageUrl = user.profileImageUrl
    ? `${BASE_URL}/files/image/${user.profileImageUrl}`
    : null;
   
  return (
    <div className='flex items-center'>
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt={user.name || 'User'}
          className='w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover'
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png';
          }}
        />
      ) : (
        <div className='w-11 h-11 bg-gray-300 rounded-full mr-3' />
      )}

      <div>
        <div className='text-[15px] font-bold leading-3'>{user.name || ''}</div>
        <button
          className='text-purple-500 text-sm font-semibold cursor-pointer hover:underline'
          onClick={handleLogout}
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
};

export default ProfileInfoCard
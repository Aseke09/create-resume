import { useRef, useState } from 'react';
import ProfileInfoCard from './ProfileInfoCard';
import ProfilePortal from '../ui/portal/ProfilePortal';
import type { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../utils/apiPaths';

interface ProfileMenuProps {
  onEditProfile?: () => void;
}

const ProfileMenu = ({ onEditProfile}: ProfileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const avatarRef = useRef<HTMLImageElement | null>(null);

    const { user } = useSelector((state: RootState) => state.user);

    if (!user) return null;

  const profileImageUrl = user.profileImageUrl
    ? `${BASE_URL}/files/image/${user.profileImageUrl}`
    : null;

    return (
        <>
          <img
            ref={avatarRef}
            src={profileImageUrl || undefined}
            alt={user.name || 'User'}
            className='w-11 h-11 rounded-full cursor-pointer'
            onClick={() => setIsOpen(!isOpen)}
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
          />

          {isOpen && avatarRef.current && (
            <ProfilePortal anchorEl={avatarRef.current} onClose={() => setIsOpen(false)}>
                <ProfileInfoCard
                  onEditProfile={() => {
                    if(onEditProfile) onEditProfile()
                    setIsOpen(false)
                  }}
                />
            </ProfilePortal>
          )}
        </>
    );
};

export default ProfileMenu;
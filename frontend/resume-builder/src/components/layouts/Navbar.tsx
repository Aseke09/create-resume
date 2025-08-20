// import ProfileInfoCard from '../cards/ProfileInfoCard';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import ProfileMenu from '../cards/ProfileMenu';

interface NavbarProps {
  activeMenu?: string;
  onEditProfile?: () => void; 
}

const Navbar: FC<NavbarProps> = ({ activeMenu, onEditProfile }) => {
    const { t } = useTranslation('landing');

  return (
    <div className='h-16 bg-white border boredr-b border-gray-200/50 backdrop-blur-[2px] py-2.5 px-4 md:px-0 sticky top-0 z-30'>
      <div className='container mx-auto flex items-center justify-between gap-5'>
        <Link to='/dashboard'>
          <h2 className={`text-lg md:text-xl font-medium leading-5 ${
            activeMenu === 'dashboard' ? 'hover:text-primary' : 'text-black'
          }`}>
            {t('appName')}
          </h2>
        </Link>
        <div className='flex gap-6'>
          <LanguageSwitcher />
          {/* <ProfileInfoCard onEditProfile={onEditProfile}/> */}
          <ProfileMenu onEditProfile={onEditProfile}/>
          </div> 
      </div> 
    </div>
  )
}

export default Navbar
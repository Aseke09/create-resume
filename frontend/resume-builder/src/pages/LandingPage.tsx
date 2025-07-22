import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import  HERO_IMG  from '../assets/HERO.jpg';
import SignUp from './auth/SignUp';
import Modal from '../components/Modal';
import Login from './auth/Login';
import ProfileInfoCard from '../components/cards/ProfileInfoCard';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LandingPage = () => {
    const { user } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();
    const { t } = useTranslation('landing');
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [currentPage, setCurrentPage] = useState("login");

    const handleCTA = () => {
      if (!user) {
        setOpenAuthModal(true);
      } else {
        navigate('/dashboard');
      }
    };

  return (
    <div className='w-full min-h-full bg-white'>
     <div className='container mx-auto px-4 py-6'>
      <header className='flex justify-between items-center mb-16'>
        <div className='text-xl font-bold uppercase'>{t('appName')}</div>
        <div className='flex gap-5'>
          <LanguageSwitcher />
          { user ? (
              <ProfileInfoCard/>
              ) : (
                <button
              className='bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer'
              onClick={() => setOpenAuthModal(true)}
              >
                {t('loginSignup')}
          </button>
          )}
        </div>
      </header>

      <div className='flex flex-col md:flex-row items-center'>
        <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
          <h1 className='text-5xl font-bold mb-6 leading-tight'>
            {t("heading")}{"  "}
            <p className='text-transparent bg-clip-text bg-[radial-gradient(circle,_#7182ff_0%,_#3cff52_100%)] bg-[length:200%_200%] animate-text-shine'>
             {t('subheading')}
            </p>
          </h1>
          <p className='text-lg text-gray-700 mb-8'>
            {t('subheading2')}
          </p>  
          <button 
           className='bg-black text-sm font-semibold text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer'
           onClick={handleCTA}
           >
            {t('getStarted')}
          </button>
        </div>

        <div className='w-full md:w-1/2'>
          <img
            src={HERO_IMG}
            alt='Hero Image'
            className='w-full rounded-lg'
          />  
        </div>
      </div>

      <section className='mt-5'>
        <h2 className='text-2xl font-bold text-center mb-12'>
            {t('featuresTitle')}
        </h2>
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>{t('features.editing.title')}</h3>
              <p className='text-gray-600'>
                {t('features.editing.description')}
              </p>
            </div>

            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>{t('features.templates.title')}</h3>
              <p className='text-gray-600'>
                {t('features.templates.description')}
              </p>  
            </div>

            <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition'>
              <h3 className='text-lg font-semibold mb-3'>{t('features.export.title')}</h3> 
              <p className='text-gray-600'>
                {t('features.export.description')}
              </p> 
            </div>

          </div>  
        </div>
      </section>
     </div>

     <Modal 
       isOpen={openAuthModal}
       onClose={() => {
        setOpenAuthModal(false)
        setCurrentPage("login")
       }}
       hideHeader
      >
        <div className=''>
        {currentPage === "login" && <Login setCurrentPage={setCurrentPage} 
         onLoginSuccess={() => {
            setOpenAuthModal(false)
            navigate('/dashboard')
        }}/>}
        {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage}/>
        )}
        </div>
      </Modal>
    </div>
  )
}

export default LandingPage

import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
} from 'react-icons/lu';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import TitleInput from '../../components/Inputs/TitleInput';
import { useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { renderForm } from '../../utils/renderForm';
import { getLocalizedString, type LocalizedString } from '../../utils/localization';
import StepProgress from '../../components/StepProgress';
import RenderResume from '../../components/ResumeTemplates/RenderResume';
import ThemeSelector from './ThemeSelector';
import Modal from '../../components/Modal';
import {
  openThemeSelector,
  closeThemeSelector,
  openPreview,
  closePreview,
  goBack,
  validateAndNext,
  selectWizard,
} from '../../features/resume/wizardSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteResume, fetchResumeById, uploadResumeImages } from '../../features/resume/helpers';

const EditResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation('general');
  const lang = i18n.language as keyof LocalizedString;

  const resumeRef = useRef<HTMLDivElement>(null!);
  const resumeDownloadedRef = useRef(null);
  const dispatch  = useAppDispatch();
  const draft = useAppSelector((s) => s.resume.data);
  const {
    previewOpen,
    themeSelectorOpen,
    isLoading,
    progress,
    currentPage,
    errorMsg,
  } = useAppSelector(selectWizard);
  
  const [baseWith, setBaseWidth] = useState(800);
  const [profileImgFile, setProfileImgFile] = useState<string | null>(null);

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    if (resumeId) {
      dispatch(fetchResumeById(resumeId));
    }

    return () => {
      window.removeEventListener('resize', updateBaseWidth)
    }
  }, [dispatch, resumeId])
  const handleSave = async () => {
  if (!resumeId || !resumeRef.current) return;

  try {
    await dispatch(
      uploadResumeImages({
        resumeId,
        resumeRef,
        profileImageId: profileImgFile,
      })
    ).unwrap();

    navigate('/dashboard');
  } catch (error) {
    console.error("Failed to capture or upload resume:", error);
  }
};
 
  const handleDelete = () => {
    if (!resumeId) return;
    dispatch(deleteResume({ resumeId, navigate }));
  };

  const handleBack = () => {
  if (currentPage === 'profile-info') {
    navigate('/dashboard');           
  } else {
    dispatch(goBack());               
  }
};
  const fullName = getLocalizedString(draft.profileInfo?.fullName || {}, lang);
  const safeFileName = `${fullName.replace(/\s+/g, '_')}_Resume`;

  const reactToPrintFn = useReactToPrint({
    contentRef: resumeDownloadedRef,
    documentTitle: safeFileName,
  })
   
  return (
    <DashboardLayout>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 py-3 px-4 mb-4'>
          <TitleInput />

          <div className='flex items-center gap-4'>
            <button
              className='btn-small-light'
              onClick={() => dispatch(openThemeSelector())}
            >
              <LuPalette className='text-[16px]'/>
              <span className='hidden md:block'>{t('change_theme')}</span>
            </button>

            <button className='btn-small-light' onClick={handleDelete}>
              <LuTrash2 className='text-[16px]'/>
              <span className='hidden md:block'>{t('delete')}</span>
            </button>

            <button
              className='btn-small-light'
              onClick={() => dispatch(openPreview())}
            >
              <LuDownload className='text-[16px]'/>
              <span className='hidden md:block'>{t('preview_download')}</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='bg-white rounded-lg border border-purple-100 overflow-hidden'>
            
            <StepProgress progress={progress}/>
            
            {renderForm(currentPage, { profileImgFile, setProfileImgFile})}

             <div className='mx-5'>
               {errorMsg && (
                 <div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-100 px-2 py-0.5 my-1 rounded'>
                   <LuCircleAlert className='text-md'/> {errorMsg}
                 </div>
               )}

               <div className='flex items-end justify-end gap-3 mt-3 mb-5'>
                 <button
                   className='btn-small-light'
                   onClick={handleBack}
                   disabled={isLoading}
                 >
                  <LuArrowLeft className='text-[16px]'/>
                 </button>

                 <button
                   className='btn-small-light'
                   onClick={handleSave}
                   disabled={isLoading}
                 >
                   <LuSave className='text-[16px]'/>
                   {isLoading ? t('updating') : t('save_exit')}
                 </button>

                 <button
                   className='btn-small'
                   onClick={() => 
                    dispatch(validateAndNext())}
                    disabled={isLoading}
                 >
                   {currentPage === 'additionalInfo' && (
                    <LuDownload className='text-[16px]'/>
                   )}

                   {currentPage === 'additionalInfo' 
                     ? t('preview_and_download')
                     : t('next')
                    }
                    {currentPage !== 'additionalInfo' && (
                      <LuArrowLeft className='text-[16px] rotate-180'/>
                    )}
                 </button>
               </div>
             </div>
          </div>

          <div ref={resumeRef} className='h-[100vh]'>
            
            <RenderResume containerWidth={baseWith}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={themeSelectorOpen}
        onClose={() => dispatch(closeThemeSelector())}
        title={t('change_color_theme')}
      >
         <div className='w-[90vw] h-[80vh]'>
            <ThemeSelector
               onClose={() => dispatch(closeThemeSelector())}
            />
         </div>
      </Modal>

      <Modal
        isOpen={previewOpen}
        onClose={() => dispatch(closePreview())}
        title={draft.title?.[lang] || ''}
        showActionBtn
        actionBtnText={t('download')}
        actionBtnIcon={<LuDownload className='text-[16px]'/>}
        onActionClick={() => reactToPrintFn()}
      >
        <div ref={resumeDownloadedRef} className='w-[90vw] h-[90vh]'>
          <RenderResume />
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default EditResume
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../../utils/axiosInstance';
// import { API_PATHS } from '../../utils/apiPaths';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import {LuCirclePlus} from 'react-icons/lu';
// import moment from 'moment';
import CreateResumeForm from './CreateResumeForm';
import Modal from '../../components/Modal';
import ResumeSummaryCard from '../../components/cards/ResumeSummaryCard';
// import type { Resume } from './types';
import { useTranslation } from 'react-i18next';
// import { getLocalizedString } from '../../utils/localization';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectResumes,         
  selectResumeLoading,
  selectResumeError,        
} from '../../features/resume/resumeSlice';
import { fetchResumes } from '../../features/resume/helpers';

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  
  const { t } = useTranslation('general');
  const dispatch = useAppDispatch();
  const resumes  = useAppSelector(selectResumes);
 
  const loading = useAppSelector(selectResumeLoading);
  const error   = useAppSelector(selectResumeError);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-0'>
        <div
          className='h=[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border-purple-100 hover:border-purple-300 hover:bg-purple-50/5 cursor-pointer'
          onClick={() => setOpenCreateModal(true)}
        >
          <div className='w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-lg'>
            <LuCirclePlus className='text-xl text-purple-500' />
          </div>

          <h3 className='font-medium text-gray-800'>{t('add_new_resume')}</h3>
        </div>

         {loading && 
           <div className="col-span-full flex justify-center items-center py-6">
             <div className='w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin'>
               <span className='ml-3 text-sm text-gray-700'>
                 {t('loading')}
               </span>
             </div>
           </div>}
        {error && (
          <p className="col-span-full text-sm text-red-500">{error}</p>
        )}

        {resumes.map((resume) => {
          
          return (
          <ResumeSummaryCard
            key={resume?._id}
            resumeId={resume._id}
            onSelect={() => navigate(`/resume/${resume?._id}`)}
            thumbnailLink={resume.thumbnailLink}
          />
          )
      })}
      </div>

      <Modal
       isOpen={openCreateModal}
       onClose={() => {
         setOpenCreateModal(false)
       }}
       hideHeader
      >
        <div className=''>
          <CreateResumeForm/>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard
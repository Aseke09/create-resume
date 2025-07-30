import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import type { RootState } from '../../store/store';
import { useState, type FC, type ReactNode } from 'react';
import Modal from '../Modal';
import UpdateUserProfile from '../../pages/userUpdate/UpdateUserProfile';
import { useTranslation } from 'react-i18next';

interface DashboardLayoutProp {
    activeMenu?: string;
    children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProp> = ({ activeMenu, children }) => {
    const { user } = useSelector((state: RootState) => state.user);
    const { t } = useTranslation('general');
    
    const [showEditModal, setShowEditModal] = useState(false);

    const handleOpenEdit = () => setShowEditModal(true);
    const handleCloseEdit = () => setShowEditModal(false);

  return (
    <div>
        <Navbar activeMenu={activeMenu} onEditProfile={handleOpenEdit} />

        {user && <div className='container mx-auto pt-4 pb-4'>{children}</div>}

        <Modal isOpen={showEditModal} onClose={handleCloseEdit} title={t('edit_profile')}>
          <UpdateUserProfile />
        </Modal>
    </div>
  )
}

export default DashboardLayout
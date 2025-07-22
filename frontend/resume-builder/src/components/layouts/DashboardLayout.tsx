import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import type { RootState } from '../../store/store';
import type { FC, ReactNode } from 'react';

interface DashboardLayoutProp {
    activeMenu?: string;
    children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProp> = ({ activeMenu, children }) => {
    const { user } = useSelector((state: RootState) => state.user);
  return (
    <div>
        <Navbar activeMenu={activeMenu}/>

        {user && <div className='container mx-auto pt-4 pb-4'>{children}</div>}
    </div>
  )
}

export default DashboardLayout
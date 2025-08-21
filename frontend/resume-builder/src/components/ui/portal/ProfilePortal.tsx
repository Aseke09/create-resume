import { type FC, type ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ProfilePortalProps {
    anchorEl: HTMLElement | null;
    onClose: () => void;
    children: ReactNode;
}

const ProfilePortal: FC<ProfilePortalProps> = ({ anchorEl, onClose, children }) => {
    const portalRoot = document.getElementById('profile-portal');
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number}>({ top: 0, left: 0});

    useLayoutEffect(() => {
        if(anchorEl && popoverRef.current) {
            const rect = anchorEl.getBoundingClientRect();
            const popover = popoverRef.current.getBoundingClientRect();
            
            let top = rect.bottom + window.screenY + 8;
            let left = rect.left + window.screenX;

            if (top + popover.height > window.innerHeight + window.scrollY) {
                top = rect.top + window.scrollY - popover.height - 8;
            }

            if (left + popover.width > window.innerWidth + window.scrollX) {
                left = rect.right + window.scrollX - popover.width;
            }
            
            setPosition({ top, left })
        }
    }, [anchorEl, children]);

    if (!portalRoot || !anchorEl) return null;

    return createPortal(
        <div>
            <div className='fixed inset-0 z-40' onClick={onClose} />

            <div
              ref={popoverRef}
              className='absolute z-50 bg-white shadow-lg rounded-xl p-3 min-w-[200px] 
              [transform-origin:top_left] animate-[scaleIn_0.15s_ease-out]'
              style={{ top: position.top, left: position.left}}
            >
              {children}
            </div>
        </div>,
        portalRoot
    );
};

export default ProfilePortal;

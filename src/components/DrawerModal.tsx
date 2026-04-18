import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface DrawerModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  widthClassName?: string;
}

const DrawerModal: React.FC<DrawerModalProps> = ({ 
  open, 
  onClose, 
  title, 
  children, 
  widthClassName 
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on TipTap related elements
      if (
        target.closest('.tiptap') ||
        target.closest('.tippy-box') ||
        target.closest('[data-tippy-root]') ||
        target.closest('.ProseMirror') ||
        target.classList.contains('tiptap-editor') ||
        target.closest('.tiptap-editor')
      ) {
        return;
      }

      // Don't close if clicking inside the drawer
      if (drawerRef.current && drawerRef.current.contains(target)) {
        return;
      }

      // Don't close if clicking on any button or interactive element
      if (
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.getAttribute('role') === 'button'
      ) {
        return;
      }

      // Only close if clicking on the backdrop itself
      if (backdropRef.current && backdropRef.current === target) {
        onClose();
      }
    };

    // Add event listener to document to catch all clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-screen bg-white z-50 flex flex-col border-l border-gray-200 shadow-xl animate-slide-in ${
          widthClassName ? widthClassName : 'w-full md:w-1/2'
        }`}
        style={{ 
          transition: 'transform 0.3s', 
          boxShadow: '0 0 24px rgba(0,0,0,0.08)' 
        }}
      >
        <div className="flex flex-row items-center justify-between px-6 py-4">
          {/* Cross button removed as requested */}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};

export default DrawerModal;

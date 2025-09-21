import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling while open
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-30 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="mobile-bottom-sheet animate-slide-up z-40"
      >
        {/* Handle bar */}
        <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
};

export default MobileBottomSheet; 
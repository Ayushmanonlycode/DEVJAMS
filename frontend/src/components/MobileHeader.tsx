import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
  rightContent?: React.ReactNode;
  transparent?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBackButton = false,
  backTo,
  rightContent,
  transparent = false
}) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <header 
      className={`
        sticky top-0 z-30 px-4 py-3 
        flex items-center justify-between 
        ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}
      `}
    >
      <div className="flex-1 flex items-center">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="mr-2 p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={22} strokeWidth={2.5} className="text-gray-800" />
          </button>
        )}
        <h1 className="font-semibold text-subtitle truncate">{title}</h1>
      </div>
      
      {rightContent && (
        <div className="flex items-center">
          {rightContent}
        </div>
      )}
    </header>
  );
};

export default MobileHeader; 
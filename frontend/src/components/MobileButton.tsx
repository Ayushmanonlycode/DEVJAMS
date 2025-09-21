import React from 'react';
import { Loader2 } from 'lucide-react';

interface MobileButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  variant = 'primary',
  type = 'button',
  fullWidth = true,
  isLoading = false,
  disabled = false,
  onClick,
  icon,
  iconPosition = 'left',
  size = 'md',
  className = '',
}) => {
  // Style variants
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 shadow-sm',
    secondary: 'bg-purple-100 text-purple-700 hover:bg-purple-200 active:bg-purple-300 shadow-xs',
    outline: 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100 active:bg-gray-200',
  };
  
  // Size variants
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3.5 px-5 text-body',
    lg: 'py-4 px-6 text-lg font-medium',
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${fullWidth ? 'w-full' : 'inline-flex'}
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-medium
        flex items-center justify-center
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-60 disabled:pointer-events-none
        tap-highlight-transparent
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin mr-2" />
          <span>Loading...</span>
        </>
      ) : (
        <div className="flex items-center justify-center">
          {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
        </div>
      )}
    </button>
  );
};

export default MobileButton; 
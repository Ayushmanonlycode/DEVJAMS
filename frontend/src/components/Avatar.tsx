import React from 'react';
import { User, PenLine } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onEdit?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  editable = false,
  onEdit,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-white shadow-sm`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center text-gray-500`}>
          <User className="w-1/2 h-1/2" />
        </div>
      )}
      
      {editable && (
        <button
          onClick={onEdit}
          className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1 border-2 border-white shadow-sm cursor-pointer"
          aria-label="Edit profile picture"
        >
          <PenLine size={size === 'lg' ? 16 : 12} className="text-white" />
        </button>
      )}
    </div>
  );
};

export default Avatar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Edit2, LogIn, User } from 'lucide-react';
import Avatar from '../components/Avatar';
import Button from '../components/Button';
import MobileStatusBar from '../components/MobileStatusBar';
import MobileHeader from '../components/MobileHeader';
import MobileButton from '../components/MobileButton';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');
  
  // No longer redirecting if not logged in

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (user) {
      await updateProfile({ bio });
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // If not logged in, show a guest profile view
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <MobileStatusBar />
        <MobileHeader title="Profile" showBackButton backTo="/" />
        
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          
          <h2 className="text-title text-center mb-3">Guest User</h2>
          <p className="text-body text-center mb-8">
            You're currently browsing as a guest. Sign in to access your full profile.
          </p>
          
          <div className="w-full max-w-sm space-y-4">
            <Link to="/login" className="block">
              <MobileButton 
                variant="primary"
                icon={<LogIn size={20} />}
                iconPosition="right"
              >
                Sign In
              </MobileButton>
            </Link>
            <Link to="/signup" className="block">
              <MobileButton 
                variant="secondary"
              >
                Create Account
              </MobileButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Regular profile view for logged in users
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MobileStatusBar />
      <MobileHeader title="Account Settings" showBackButton backTo="/" />
      
      <div className="flex-1 px-4 py-6 animate-fade-in">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-50 p-4 flex items-start space-x-4 border-b border-gray-200">
            <Avatar
              src={user.avatarUrl}
              alt={user.fullName}
              size="lg"
              editable
              onEdit={handleEditProfile}
            />
            
            <div className="flex-1">
              <h2 className="text-subtitle font-semibold">{user.fullName}</h2>
              <p className="text-caption">{user.email}</p>
            </div>
            
            {!isEditing && (
              <button
                onClick={handleEditProfile}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                aria-label="Edit profile"
              >
                <Edit2 size={18} />
              </button>
            )}
          </div>
          
          <div className="p-4">
            {isEditing ? (
              <div className="animate-fade-in">
                <label htmlFor="bio" className="block text-caption font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder="Tell us about yourself"
                />
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setBio(user.bio || '');
                      setIsEditing(false);
                    }}
                    className="w-auto px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    isLoading={isLoading}
                    className="w-auto px-4"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose">
                <p className="text-body whitespace-pre-wrap">
                  {user.bio || 'No bio added yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <MobileButton variant="secondary" onClick={handleLogout} icon={<LogOut size={20} />}>
            Sign Out
          </MobileButton>
        </div>
      </div>
    </div>
  );
};

export default Profile;
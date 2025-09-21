import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KarmWelcome = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    navigate(`/login?role=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-50 font-sans">
      <div className="w-full max-w-sm mx-auto text-center">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex justify-center items-center mb-4">
            <span className="material-symbols-outlined text-blue-500 text-6xl">
              work
            </span>
          </div>
          <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight">
            Karm
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Welcome! Please choose your role.
          </p>
        </div>

        {/* Role Selection Buttons */}
        <div className="space-y-6">
          <RoleButton
            icon="business_center"
            label="I'm an Employer"
            onClick={() => handleRoleSelection('employer')}
            isSelected={selectedRole === 'employer'}
          />
          <RoleButton
            icon="person"
            label="I'm an Employee"
            onClick={() => handleRoleSelection('employee')}
            isSelected={selectedRole === 'employee'}
          />
        </div>
      </div>
    </div>
  );
};

interface RoleButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  isSelected: boolean;
}

const RoleButton: React.FC<RoleButtonProps> = ({ icon, label, onClick, isSelected }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-200 transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
        isSelected
          ? 'bg-blue-50 ring-2 ring-blue-500'
          : 'bg-white hover:shadow-xl'
      }`}
      aria-pressed={isSelected}
    >
      <span className={`material-symbols-outlined text-5xl mb-3 transition-colors ${
        isSelected ? 'text-blue-600' : 'text-blue-500'
      }`}>
        {icon}
      </span>
      <span className={`text-xl font-bold transition-colors ${
        isSelected 
          ? 'text-blue-700' 
          : 'text-gray-900'
      }`}>
        {label}
      </span>
    </button>
  );
};

export default KarmWelcome;

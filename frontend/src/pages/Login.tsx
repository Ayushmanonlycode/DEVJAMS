import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { sendOtp } from '../lib/api';

interface LoginErrors {
  phone?: string;
  submit?: string;
}

const KarmLogin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('employee');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleFromUrl = params.get('role');
    if (roleFromUrl === 'employer' || roleFromUrl === 'employee') {
      setUserRole(roleFromUrl);
    }
  }, [location]);

  const validatePhoneNumber = (number: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(number);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: LoginErrors = {};
    if (!phoneNumber) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const fullPhone = `+91${phoneNumber}`;
      const result = await sendOtp(fullPhone, 'sms');
      if (result?.error) {
        setErrors({ submit: result.error || 'Failed to send OTP. Please try again.' });
        return;
      }
      // Navigate to OTP verification screen with phone context
      navigate('/otp-verification', { state: { phoneNumber: fullPhone } });
    } catch (error) {
      setErrors({ submit: 'Failed to send OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 py-8 bg-gray-50 font-sans">
      <div className="w-full max-w-sm text-center">
        <div className="absolute top-0 left-0 p-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="text-gray-500 mt-2">
            Enter your phone number to log in or sign up.
          </p>
        </header>

        <main>
          {/* Role Selection */}
          <div className="mb-6 p-1 bg-gray-200 rounded-xl flex">
            <RoleOption
              value="employee"
              label="Employee"
              selected={userRole === 'employee'}
              onChange={() => setUserRole('employee')}
            />
            <RoleOption
              value="employer"
              label="Employer"
              selected={userRole === 'employer'}
              onChange={() => setUserRole('employer')}
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 font-medium">
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Your mobile number"
                className={`w-full bg-gray-100 border-2 rounded-xl h-14 pl-12 pr-4 text-base text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-0 ${
                  errors.phone
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-transparent focus:border-blue-500'
                }`}
                disabled={isLoading}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm text-left mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !phoneNumber}
              className={`w-full rounded-xl h-14 text-base font-bold flex items-center justify-center transition-all ${
                isLoading || !phoneNumber
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">Sending OTP...</span>
                </div>
              ) : (
                'Send OTP'
              )}
            </button>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">
                {errors.submit}
              </p>
            )}
          </form>

          {/* Terms and Privacy */}
          <p className="mt-6 text-center text-xs text-gray-400 px-4">
            By continuing, you agree to our{' '}
            <a 
              href="#" 
              className="font-medium text-blue-500 hover:underline focus:outline-none focus:underline"
            >
              Terms of Service
            </a>{' '}
            &{' '}
            <a 
              href="#" 
              className="font-medium text-blue-500 hover:underline focus:outline-none focus:underline"
            >
              Privacy Policy
            </a>.
          </p>
        </main>
      </div>
    </div>
  );
};

interface RoleOptionProps {
  value: string;
  label: string;
  selected: boolean;
  onChange: () => void;
}

const RoleOption: React.FC<RoleOptionProps> = ({ value, label, selected, onChange }) => {
  return (
    <label className="flex-1 cursor-pointer">
      <input
        type="radio"
        name="user_role"
        value={value}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-full block text-center py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
          selected
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {label}
      </span>
    </label>
  );
};

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
);

export default KarmLogin;

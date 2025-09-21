import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FormField from '../components/FormField';
import RadioGroup from '../components/RadioGroup';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    companyName: '',
    isAgency: 'yes',
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    companyName: '',
    isAgency: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, isAgency: value }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signup({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
          isAgency: formData.isAgency === 'yes',
          bio: '',
        });
        navigate('/profile');
      } catch (err) {
        // Error is handled in AuthContext
      }
    }
  };

  return (
    <div className="page-container pb-8">
      <div className="mb-6 animate-fade-in">
        <Link to="/" className="inline-flex items-center text-gray-700 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>Back</span>
        </Link>
        <h1 className="text-2xl font-bold mt-4 mb-1">Create your PopX account</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="animate-slide-up">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        
        <FormField
          label="Full Name"
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter full name"
          required
          error={formErrors.fullName}
        />
        
        <FormField
          label="Phone number"
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Enter phone number"
          required
          error={formErrors.phoneNumber}
        />
        
        <FormField
          label="Email address"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
          error={formErrors.email}
        />
        
        <FormField
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
          error={formErrors.password}
        />
        
        <FormField
          label="Company name"
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name"
          error={formErrors.companyName}
        />
        
        <RadioGroup
          label="Are you an Agency?"
          name="isAgency"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          selectedValue={formData.isAgency}
          onChange={handleRadioChange}
          required
          error={formErrors.isAgency}
        />
        
        <div className="mt-24">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
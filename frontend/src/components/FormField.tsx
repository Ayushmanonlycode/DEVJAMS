import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-purple-600">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormField;
import React from 'react';

interface RadioGroupProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  required = false,
  error,
}) => {
  return (
    <div className="mb-4">
      <p className="form-label mb-2">
        {label}
        {required && <span className="text-purple-600">*</span>}
      </p>
      
      <div className="flex space-x-6">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="h-5 w-5 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor={`${name}-${option.value}`} className="ml-2 text-gray-700 cursor-pointer">
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default RadioGroup;
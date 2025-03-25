import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
  children?: React.ReactNode;
}

export default Input;

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  name,
  id,
  children,
}: InputProps) {
  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-gray-700 text-base font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className='flex'>
        <input
          type={type}
          name={name}
          id={id || name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'
            } rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
        />
        {children}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
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
  maxLength?: number;
}

export default function Input({
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
  maxLength,
}: InputProps) {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (maxLength && type === 'number') {
      const target = e.currentTarget;
      if (Number(target.value) > 10 ** maxLength) {
        target.value = (10 ** maxLength).toString();
      }
    }
  };

  return (
    <div className="mb-3 w-full">
      {label && (
        <label className="mb-2 block text-base font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="flex">
        <input
          type={type}
          name={name}
          id={id || name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onInput={handleInput}
          required={required}
          maxLength={maxLength}
          className={`w-full border px-4 py-3 ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-2xl transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500`}
        />
        {children}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

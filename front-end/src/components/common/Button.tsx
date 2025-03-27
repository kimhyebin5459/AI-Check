import React from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md';

// 'sm' : 높이 48, 폰트 16px
// 'md': 높이 64, 폰트 20px

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  isDisabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-2xl transition-colors focus:outline-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-yellow-300 text-white hover:bg-yellow-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-300',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-12 px-4 whitespace-nowrap flex items-center justify-center text-base',
    md: 'h-16 px-6 whitespace-nowrap flex items-center justify-center text-xl',
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
}

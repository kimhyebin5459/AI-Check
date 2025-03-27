import React from 'react';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

// 'sm' : 높이 48, 폰트 16px
// 'md' : 높이 56, 폰트 16px
// 'lg': 높이 64, 폰트 20px

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isFullWidth = true,
  isDisabled = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  const baseStyles = 'rounded-2xl transition-colors focus:outline-none';
  
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-yellow-300 text-white hover:bg-yellow-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-300',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'font-bold h-12 px-4 flex items-center justify-center text-base',
    md: 'font-semibold h-14 px-6 flex items-center justify-center text-xl',
    lg: 'font-bold h-16 px-6 flex items-center justify-center text-xl',
  };

  const widthStyles = isFullWidth ? 'w-full' : '';
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
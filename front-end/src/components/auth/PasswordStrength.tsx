import React from 'react';
import { PasswordValidation } from '@/types/passwordValidation';

interface Props {
  validation: PasswordValidation;
  showDetails: boolean;
}

export default function PasswordStrength({ validation, showDetails }: Props) {
  const validCount = Object.values(validation.valid).filter(Boolean).length;

  const getStrengthColor = () => {
    if (validCount <= 1) return 'bg-red-500';
    if (validCount <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (validCount <= 1) return '매우 약함';
    if (validCount <= 3) return '보통';
    return '강함';
  };

  const strengthPercent = (validCount / 4) * 100;

  return (
    <div className="mt-1 mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-gray-600">비밀번호 강도:</span>
        <span className="text-xs font-medium">{getStrengthText()}</span>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${strengthPercent}%` }}
        ></div>
      </div>

      {showDetails && (
        <ul className="mt-2 space-y-1 text-xs">
          {Object.entries(validation.valid).map(([key, isValid]) => (
            <li key={key} className="flex items-center">
              <span className={`mr-2 ${isValid ? 'text-green-600' : 'text-red-600'}`}>{isValid ? '✓' : '✗'}</span>
              <span className="text-gray-600">{validation.messages[key as keyof typeof validation.messages]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

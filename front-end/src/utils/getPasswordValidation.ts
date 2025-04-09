import { PasswordValidation } from '@/types/passwordValidation';

export const validatePassword = (password: string): PasswordValidation => {
  const validation = {
    isValid: false,
    messages: {
      length: '8자 이상이어야 합니다',
      hasLetter: '알파벳을 포함해야 합니다',
      hasNumber: '숫자를 포함해야 합니다',
      hasSpecialChar: '특수문자를 포함해야 합니다',
    },
    valid: {
      length: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  };

  validation.isValid = Object.values(validation.valid).every(Boolean);

  return validation;
};

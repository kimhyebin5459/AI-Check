export type PasswordValidation = {
  isValid: boolean;
  messages: {
    length: string;
    hasLetter: string;
    hasNumber: string;
    hasSpecialChar: string;
  };
  valid: {
    length: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
};

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Header from '@/components/common/Header';
import { postEmailVerification, postEmailConfirm, postChildSignUp, postParentSignUp } from '@/apis/user';
import { useUserStore } from '@/stores/useUserStore';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import useDebounce from '@/hooks/useDebounce';
import { validatePassword } from '@/utils/getPasswordValidation';
import { PasswordValidation } from '@/types/passwordValidation';
import PasswordStrength from '@/components/auth/PasswordStrength';
import NoticePage from '@/components/common/NoticePage';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  authCode: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  authCode?: string;
  submit?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { accessToken } = useUserStore();
  const getIsParent = useUserStore((state) => state.getIsParent);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    authCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isSignupComplete, setIsSignupComplete] = useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    isValid: false,
    messages: {
      length: '8자 이상이어야 합니다',
      hasLetter: '알파벳을 포함해야 합니다',
      hasNumber: '숫자를 포함해야 합니다',
      hasSpecialChar: '특수문자를 포함해야 합니다',
    },
    valid: {
      length: false,
      hasLetter: false,
      hasNumber: false,
      hasSpecialChar: false,
    },
  });
  const [showPasswordDetails, setShowPasswordDetails] = useState<boolean>(false);

  const debouncedPassword = useDebounce(formData.password, 500);

  const isLoggedIn = !!accessToken && accessToken !== 'VALUE';
  const isParent = getIsParent();

  const pageTitle = isLoggedIn ? '자녀 계정 등록' : '부모 계정 등록';
  const pageDescription = isLoggedIn ? '자녀의 계정 정보를 입력해주세요' : '부모님 계정 정보를 입력해주세요';

  useEffect(() => {
    if (isLoggedIn && !isParent) {
      alert('부모 계정만 자녀 계정을 등록할 수 있습니다.');
      router.push('/');
    }
  }, [isLoggedIn, isParent, router]);

  useEffect(() => {
    if (debouncedPassword) {
      const validation = validatePassword(debouncedPassword);
      setPasswordValidation(validation);

      if (!validation.isValid) {
        setErrors((prev) => ({
          ...prev,
          password: '비밀번호가 요구사항을 충족하지 않습니다',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          password: undefined,
        }));
      }
    }
  }, [debouncedPassword]);

  const handlePasswordFocus = () => {
    setShowPasswordDetails(true);
  };

  const handlePasswordBlur = () => {
    setShowPasswordDetails(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '비밀번호가 일치하지 않습니다',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: undefined,
        }));
      }
    }

    if (name === 'email') {
      if (!value) {
        setErrors((prev) => ({
          ...prev,
          email: '이메일을 입력해주세요',
        }));
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: '유효한 이메일 주소를 입력해주세요',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: undefined,
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!isEmailVerified) {
      newErrors.authCode = '이메일 인증이 필요합니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (!passwordValidation.isValid) {
      newErrors.password = '비밀번호가 요구사항을 충족하지 않습니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (): Promise<void> => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({
        email: '유효한 이메일 주소를 입력해주세요',
      });
      return;
    }

    setIsLoading(true);
    try {
      await postEmailVerification(formData.email);
      setIsCodeSent(true);
      alert('인증코드가 발송되었습니다.');
    } catch (error) {
      setErrors({
        email: '인증 코드 전송에 실패했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!formData.authCode) {
      setErrors({
        authCode: '인증 코드를 입력해주세요',
      });
      return;
    }

    setIsLoading(true);
    try {
      await postEmailConfirm(formData.email, formData.authCode);
      setIsEmailVerified(true);
      alert('인증되었습니다.');
    } catch (error) {
      setErrors({
        authCode: '인증 코드가 올바르지 않습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isLoggedIn) {
        await postChildSignUp({
          email: formData.email,
          password: formData.password,
        });

        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.CHILD_PROFILE_LIST],
        });
      } else {
        await postParentSignUp({
          email: formData.email,
          password: formData.password,
        });
      }

      // 회원가입 성공 상태로 변경
      setIsSignupComplete(true);
    } catch (error) {
      setErrors({
        submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoticeConfirm = () => {
    if (isLoggedIn) {
      router.push('/');
    } else {
      router.push('/auth/signin');
    }
  };

  if (isSignupComplete) {
    return (
      <NoticePage
        title={isLoggedIn ? '자녀 등록 완료!' : '회원 가입 완료!'}
        message={isLoggedIn ? '자녀 계정으로 로그인하여 계좌를 연동해주세요' : '로그인하여 계좌 연동을 완료하세요'}
        iconType="success"
        buttonText="확인"
        onButtonClick={handleNoticeConfirm}
      />
    );
  }

  return (
    <div className="container">
      <Header hasBorder={false} hasBackButton={true} title={pageTitle}></Header>

      <main className="flex flex-grow flex-col p-5">
        <h1 className="mb-5 text-xl font-bold">{pageDescription}</h1>

        <form onSubmit={handleSubmit} className="flex flex-grow flex-col">
          <Input
            label="이메일"
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          >
            <Button
              type="button"
              onClick={handleSendCode}
              isFullWidth={false}
              size="sm"
              className="ml-3 w-32 whitespace-nowrap"
              isDisabled={isLoading || isCodeSent}
            >
              {isCodeSent ? '재전송' : '코드 전송'}
            </Button>
          </Input>

          <Input
            label="인증 코드"
            type="text"
            name="authCode"
            placeholder="인증 코드"
            value={formData.authCode}
            onChange={handleChange}
            error={errors.authCode}
            required
          >
            <Button
              type="button"
              onClick={handleVerifyCode}
              isFullWidth={false}
              size="sm"
              className="ml-3 w-32 whitespace-nowrap"
              isDisabled={isLoading || isEmailVerified || !isCodeSent}
            >
              {isEmailVerified ? '인증됨' : '인증'}
            </Button>
          </Input>

          <Input
            label="비밀번호"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            error={errors.password}
            required
          />

          {formData.password && <PasswordStrength validation={passwordValidation} showDetails={showPasswordDetails} />}

          <Input
            label="비밀번호 확인"
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          {errors.submit && <p className="mt-4 text-sm text-red-500">{errors.submit}</p>}

          <div className="mt-auto flex pb-5">
            <Button type="submit" isDisabled={isLoading || !isEmailVerified || !passwordValidation.isValid}>
              {isLoading ? '처리 중...' : isLoggedIn ? '자녀 등록하기' : '가입하기'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

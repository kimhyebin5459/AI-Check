'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Header from '@/components/common/Header';
import { postSignUp, postEmailVerification, postEmailConfirm } from '@/apis/user';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  authCode: string;
  isParent: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  authCode?: string;
  general?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    authCode: '',
    isParent: true, // 기본값은 부모계정으로 설정, 필요에 따라 변경 가능
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);

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
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요';
    }

    if (!isEmailVerified) {
      newErrors.email = '이메일 인증이 필요합니다';
    }

    if (!isCodeVerified) {
      newErrors.authCode = '인증 코드 확인이 필요합니다';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async (): Promise<void> => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: '유효한 이메일 주소를 입력해주세요',
      }));
      return;
    }

    setIsSendingCode(true);
    try {
      await postEmailVerification(formData.email);
      setIsEmailVerified(true);
      alert('인증코드가 발송되었습니다. 이메일을 확인해주세요.');
    } catch (error) {
      console.error('Email verification failed:', error);
      setErrors((prev) => ({
        ...prev,
        email: '인증 코드 발송에 실패했습니다. 다시 시도해주세요.',
      }));
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async (): Promise<void> => {
    if (!formData.authCode) {
      setErrors((prev) => ({
        ...prev,
        authCode: '인증 코드를 입력해주세요',
      }));
      return;
    }

    setIsVerifyingCode(true);
    try {
      await postEmailConfirm(formData.email, formData.authCode);
      setIsCodeVerified(true);
      alert('인증되었습니다.');
    } catch (error) {
      console.error('Code verification failed:', error);
      setErrors((prev) => ({
        ...prev,
        authCode: '인증 코드 확인에 실패했습니다. 올바른 코드를 입력해주세요.',
      }));
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await postSignUp({
        isParent: formData.isParent,
        email: formData.email,
        password: formData.password,
      });

      alert('회원가입이 완료되었습니다.');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({
        general: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Header hasBorder={false} hasBackButton={true}></Header>

      <main className="flex flex-grow flex-col p-5">
        <h1 className="mb-5 text-2xl font-bold">
          가입을 위해
          <br />
          필요한 정보를 입력해주세요
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-grow flex-col">
          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-red-500">{errors.general}</div>
          )}

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
              isDisabled={isSendingCode || isEmailVerified}
            >
              {isSendingCode ? '전송 중...' : isEmailVerified ? '전송 완료' : '코드 전송'}
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
              isDisabled={isVerifyingCode || isCodeVerified || !isEmailVerified}
            >
              {isVerifyingCode ? '확인 중...' : isCodeVerified ? '인증 완료' : '인증'}
            </Button>
          </Input>

          <Input
            label="비밀번호"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

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

          <div className="mt-auto flex pb-5">
            <Button type="submit" isDisabled={isLoading || !isEmailVerified || !isCodeVerified}>
              {isLoading ? '처리 중...' : '다음'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Header from '@/components/common/Header';

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
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    authCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    if (!formData.authCode) {
      newErrors.authCode = '인증 코드를 입력해주세요';
    } else if (formData.authCode.length !== 6) {
      newErrors.authCode = '인증 코드는 6자리여야 합니다';
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

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push('/auth/signin');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrors({
        email: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header hasBorder={false} hasBackButton={true}></Header>

      <main className="flex flex-col p-5 flex-grow">
        <h1 className="text-mdl font-bold mb-5">가입을 위해<br />필요한 정보를 입력해주세요</h1>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
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
              onClick={() => alert('인증코드가 발송되었습니다.')}
              fullWidth={false}
              size="sm"
              className="ml-3 whitespace-nowrap w-[25%]"
            >
              인증
            </Button>
          </Input>

          <Input
            label='인증 코드'
            type="text"
            name="authCode"
            placeholder="인증 코드"
            value={formData.authCode}
            onChange={handleChange}
            required
          >
            <Button
              type="button"
              onClick={() => alert('인증되었습니다.')}
              fullWidth={false}
              size="sm"
              className="ml-3 whitespace-nowrap w-[25%]"
            >
              인증 확인
            </Button>
          </Input>
          {errors.authCode && <p className="mt-1 text-sm text-red-500">{errors.authCode}</p>}

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

          <div className="mt-auto flex">
            <Button
              type="submit"
              fullWidth
              isDisabled={isLoading}
              size='md'
            >
              {isLoading ? '처리 중...' : '다음'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
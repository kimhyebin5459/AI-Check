'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Header from '@/components/common/Header';
import Image from 'next/image';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
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
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
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

      router.push('/auth/account-link');
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({
        general: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-white">
        <Header hasBackButton={false} hasBorder={false} />

        <main className="flex flex-col p-5">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/images/aicheck.png"
                alt="AI CHECK"
                width={250}
                height={178}
                priority
                className="object-contain"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <div className="gap-3 mb-9">
              <Input
                label="이메일"
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />

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
            </div>

            <div className="mt-auto">
              <Button
                type="submit"
                variant="primary"
                isFullWidth
                isDisabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>

              <div className="mt-4 text-center">
                <Link href="/auth/signup" className="text-gray-600 font-light underline decoration-1">
                  회원가입
                </Link>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
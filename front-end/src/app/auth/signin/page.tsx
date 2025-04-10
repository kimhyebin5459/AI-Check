'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Header from '@/components/common/Header';
import Image from 'next/image';
import { Aicheck } from '@/public/icons';
import { postSignIn } from '@/apis/user';
import { useUserStore } from '@/stores/useUserStore';
import { authBridge } from '@/apis/authBridge';
import { getUserInfo } from '@/apis/user';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isParent: boolean;
  accountConnected: boolean;
}

export default function Page() {
  const router = useRouter();
  const { setAccessToken, setUser, setHasAccountConnected } = useUserStore();

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
      const response = (await postSignIn(formData)) as LoginResponse;
      const { accessToken, refreshToken, accountConnected } = response;

      authBridge.saveTokens(accessToken, refreshToken);
      setAccessToken(accessToken);

      const userInfo = await getUserInfo();
      setUser(userInfo);

      setHasAccountConnected(accountConnected);

      router.push(`${!accountConnected ? '/auth/account-link' : '/'}`);
    } catch (error) {
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

        <main className="flex flex-col px-5 pt-28">
          <div className="flex justify-center pb-5">
            <Image src={Aicheck} alt="AI CHECK" width={180} height={150} priority className="object-contain" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-grow flex-col">
            {errors.general && <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{errors.general}</div>}

            <div className="mb-9 gap-3">
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
              <Button type="submit" variant="primary" isFullWidth isDisabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>

              <div className="mt-4 text-center">
                <Link href="/auth/signup" className="font-light text-gray-600 underline decoration-1">
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

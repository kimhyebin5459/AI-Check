/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Header from '@/components/common/Header';
import { postCheckAccount } from '@/apis/account';
import { postBankSignUp } from '@/apis/user';
import useDebounce from '@/hooks/useDebounce';
import NoticePage from '@/components/common/NoticePage';

interface FormData {
  email: string;
  name: string;
  brith: string;
  accountNo: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  brith?: string;
  accountNo?: string;
  submit?: string;
}

export default function BankSignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    brith: '',
    accountNo: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(false);
  const [isSignupComplete, setIsSignupComplete] = useState<boolean>(false);

  const debouncedEmail = useDebounce(formData.email, 500);

  useEffect(() => {
    if (debouncedEmail) {
      validateEmail(debouncedEmail);
    }
  }, [debouncedEmail]);

  const validateEmail = (email: string) => {
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: '이메일을 입력해주세요',
      }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: '유효한 이메일 주소를 입력해주세요',
      }));
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
      }));
      return true;
    }
  };

  const validateName = (name: string) => {
    if (!name) {
      setErrors((prev) => ({
        ...prev,
        name: '이름을 입력해주세요',
      }));
      return false;
    } else if (!/^[가-힣]{3}$/.test(name)) {
      setErrors((prev) => ({
        ...prev,
        name: '한글 3글자만 입력 가능합니다',
      }));
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        name: undefined,
      }));
      return true;
    }
  };

  const validateBirth = (birth: string) => {
    if (!birth) {
      setErrors((prev) => ({
        ...prev,
        brith: '생년월일을 입력해주세요',
      }));
      return false;
    } else if (!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(birth)) {
      setErrors((prev) => ({
        ...prev,
        brith: '유효한 생년월일 형식(YYYY-MM-DD)으로 입력해주세요',
      }));
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        brith: undefined,
      }));
      return true;
    }
  };

  const validateAccountNo = (accountNo: string) => {
    if (!accountNo) {
      setErrors((prev) => ({
        ...prev,
        accountNo: '계좌번호를 입력해주세요',
      }));
      return false;
    } else if (!/^\d{12}$/.test(accountNo)) {
      setErrors((prev) => ({
        ...prev,
        accountNo: '계좌번호는 12자리 숫자만 가능합니다',
      }));
      return false;
    } else if (!isAccountVerified) {
      setErrors((prev) => ({
        ...prev,
        accountNo: '계좌번호 중복 확인이 필요합니다',
      }));
      return false;
    } else {
      setErrors((prev) => ({
        ...prev,
        accountNo: undefined,
      }));
      return true;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    // 계좌번호가 변경되면 인증 상태 초기화
    if (name === 'accountNo' && isAccountVerified) {
      setIsAccountVerified(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 실시간 유효성 검사
    if (name === 'email') {
      validateEmail(value);
    } else if (name === 'name') {
      validateName(value);
    } else if (name === 'brith') {
      validateBirth(value);
    } else if (name === 'accountNo') {
      if (!/^\d{0,12}$/.test(value)) {
        return; // 숫자만 입력 가능하도록
      }

      if (value.length === 12) {
        setErrors((prev) => ({
          ...prev,
          accountNo: undefined,
        }));
      }
    }
  };

  const handleCheckAccount = async (): Promise<void> => {
    if (!/^\d{12}$/.test(formData.accountNo)) {
      setErrors({
        accountNo: '계좌번호는 12자리 숫자만 가능합니다',
      });
      return;
    }

    setIsLoading(true);
    try {
      await postCheckAccount(Number(formData.accountNo));
      setIsAccountVerified(true);
      alert('사용 가능한 계좌번호입니다.');
    } catch (error) {
      setErrors({
        accountNo: '이미 사용 중인 계좌번호입니다.',
      });
      setIsAccountVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const isEmailValid = validateEmail(formData.email);
    const isNameValid = validateName(formData.name);
    const isBirthValid = validateBirth(formData.brith);
    const isAccountValid = validateAccountNo(formData.accountNo);

    return isEmailValid && isNameValid && isBirthValid && isAccountValid;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await postBankSignUp({
        email: formData.email,
        name: formData.name,
        brith: formData.brith,
        accountNo: Number(formData.accountNo),
      });

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
    router.push('/auth/signin');
  };

  if (isSignupComplete) {
    return (
      <NoticePage
        title="은행 계정 등록 완료!"
        message="로그인하여 서비스를 이용해보세요."
        iconType="success"
        buttonText="확인"
        onButtonClick={handleNoticeConfirm}
      />
    );
  }

  return (
    <div className="container">
      <Header hasBorder={false} hasBackButton={true} title="은행 계정 등록"></Header>

      <main className="flex flex-grow flex-col p-5">
        <h1 className="mb-5 text-xl font-bold">계정 정보를 입력해주세요</h1>

        <form onSubmit={handleSubmit} className="flex flex-grow flex-col">
          <Input
            label="이메일 (인증 가능한 이메일로 입력해주세요)"
            type="email"
            name="email"
            placeholder="예: example@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="이름 (한글 3글자)"
            type="text"
            name="name"
            placeholder="한글 3글자로 입력해주세요"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            maxLength={3}
          />

          <Input
            label="생년월일"
            type="date"
            name="brith"
            placeholder="YYYY-MM-DD"
            value={formData.brith}
            onChange={handleChange}
            error={errors.brith}
            required
          />

          <Input
            label="계좌번호 (12자리)"
            type="text"
            name="accountNo"
            placeholder="12자리 숫자로 입력해주세요"
            value={formData.accountNo}
            onChange={handleChange}
            error={errors.accountNo}
            required
            maxLength={12}
          >
            <Button
              type="button"
              onClick={handleCheckAccount}
              isFullWidth={false}
              size="sm"
              className="ml-3 w-32 whitespace-nowrap"
              isDisabled={isLoading || formData.accountNo.length !== 12}
            >
              {isAccountVerified ? '확인 완료' : '중복 확인'}
            </Button>
          </Input>

          {errors.submit && <p className="mt-4 text-sm text-red-500">{errors.submit}</p>}

          <div className="mt-auto flex pb-5">
            <Button type="submit" isDisabled={isLoading || !isAccountVerified}>
              {isLoading ? '처리 중...' : '가입하기'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

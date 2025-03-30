'use client';

import { useState, useEffect, useCallback } from 'react';

// DutchPay 타입 정의
interface DutchPayItem {
  dutchPayId: number;
  displayName: string;
  amount: number;
  createdAt: string;
}

interface Props {
  recordId: string | number;
  amount: number;
}

export default function DutchPayDetail({ recordId, amount }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dutchPayItems, setDutchPayItems] = useState<DutchPayItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // useCallback을 사용하여 함수를 메모이제이션
  const fetchDutchPayDetails = useCallback(async () => {
    if (!recordId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/v1/dutch-pays?recordId=${recordId}`);

      if (!response.ok) {
        throw new Error('더치페이 정보를 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      const items = data.dutchPays || [];
      setDutchPayItems(items);

      // 총 금액 계산
      const total = items.reduce((sum: number, item: DutchPayItem) => sum + item.amount, 0) || 0;

      setTotalAmount(total + amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [recordId, amount]); // recordId와 amount를 의존성 배열에 추가

  useEffect(() => {
    if (isOpen) {
      fetchDutchPayDetails();
    }
  }, [isOpen, fetchDutchPayDetails]); // fetchDutchPayDetails를 의존성 배열에 추가

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // 더치페이 내역이 없으면 렌더링하지 않음
  if (!recordId) return null;

  return (
    <div className="mt-2">
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-4 py-2"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <span className="text-sm text-gray-700">1/N 내역 확인하기</span>
        </div>
        <div>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 rounded-lg bg-gray-100 p-4">
          {loading ? (
            <p className="text-center text-sm text-gray-500">로딩 중...</p>
          ) : error ? (
            <p className="text-center text-sm text-red-500">{error}</p>
          ) : (
            <>
              <div className="mb-2 flex justify-between text-right text-base font-medium">
                <span>결제 금액</span>
                <span>{totalAmount.toLocaleString()}원</span>
              </div>
              {dutchPayItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-gray-200 py-1 text-sm">
                  <span>{item.displayName}</span>
                  <span className="text-right">- {item.amount.toLocaleString()}원 (정산됨)</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

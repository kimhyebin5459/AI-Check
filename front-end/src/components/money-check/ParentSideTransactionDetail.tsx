'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/common/Header';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';
import useModal from '@/hooks/useModal';
import RatingModal from '@/components/money-check/RatingModal';

import { getRatingText, getRatingEmoji, getTransactionTypeText } from '@/utils/formatTransaction';
import { Transaction, TransactionType } from '@/types/transaction';

type TransactionDetailResponse = {
  date: string;
  record: Transaction;
};

interface Props {
  paramsId: string;
}

export default function ParentTransactionDetail({ paramsId }: Props) {
  const router = useRouter();
  const recordId = paramsId;

  const [transaction, setTransaction] = useState<TransactionDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isModalOpen, openModal, closeModal } = useModal();
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      if (!recordId) {
        setError('거래 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/aicheck/transaction-records/detail?recordId=${recordId}`);

        if (!response.ok) {
          throw new Error('거래 정보를 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        setTransaction(data);
        setSelectedRating(data.record.rating || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [recordId]);

  const handleRatingSubmit = (rating: number) => {
    setSelectedRating(rating);
    submitRating(rating);
  };

  const submitRating = async (rating: number) => {
    if (!transaction || !transaction.record || !transaction.record.recordId) {
      alert('거래 정보가 없습니다.');
      return;
    }

    try {
      setLoading(true);

      const ratingData = {
        recordId: transaction.record.recordId,
        rating: rating,
      };

      const response = await fetch('/aicheck/transaction-records/rating', {
        method: 'POST', // POST 메서드 사용
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '응답 처리 중 오류가 발생했습니다.' }));
        throw new Error(errorData.message || '평가 등록에 실패했습니다.');
      }

      if (response.status !== 204 && response.status !== 201) {
        const result = await response.json();
        if (result && result.data) {
          setTransaction({
            ...transaction,
            record: {
              ...transaction.record,
              rating: rating,
            },
          });
        }
      } else {
        setTransaction({
          ...transaction,
          record: {
            ...transaction.record,
            rating: rating,
          },
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const confirmHandler = () => {
    router.back();
  };

  if (loading) {
    return <div className="mx-auto max-w-md px-4">로딩 중...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-md px-4">에러: {error}</div>;
  }

  if (!transaction) {
    return <div className="mx-auto max-w-md px-4">거래 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="h-full">
      <div className="container">
        <Header title="거래 상세" hasBackButton></Header>
        <div className="w-full overflow-y-auto px-5 pt-5">
          <section>
            <h2 className="text-xl font-semibold">{transaction.record.displayName}</h2>
            <p className="mt-1 border-b border-gray-200 pb-4 text-sm text-gray-500">{transaction.record.createdAt}</p>
          </section>

          <section className="mt-4">
            <h3 className="mb-1 text-base">대분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              <Tag
                key={transaction.record.firstCategoryName}
                isSelected={true}
                onClick={() => {}} // 비활성화
              >
                {transaction.record.firstCategoryName}
              </Tag>
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">소분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              <Tag
                key={transaction.record.secondCategoryName || '미지정'}
                isSelected={true}
                onClick={() => {}} // 비활성화
              >
                {transaction.record.secondCategoryName || '미지정'}
              </Tag>
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">메모</h3>
            <div className="w-full rounded-lg border border-gray-200 p-3 text-base">
              {transaction.record.description || '메모가 없습니다.'}
            </div>
          </section>

          <section className="mt-3">
            <div className="mb-4 flex justify-between">
              <span className="text-base text-gray-800">거래 금액</span>
              <span className="text-base font-medium">{transaction.record.amount.toLocaleString()}원</span>
            </div>

            <div className="mt-2 mb-4 flex justify-between">
              <span className="text-base text-gray-800">거래 유형</span>
              <span className="text-base font-medium">
                {getTransactionTypeText(transaction.record.type as TransactionType)}
              </span>
            </div>

            <div className="mb-4 flex cursor-pointer justify-between" onClick={openModal}>
              <span className="text-base text-gray-800">평가</span>
              {!!selectedRating ? (
                <span className="text-base font-medium">
                  {getRatingText(selectedRating)} {getRatingEmoji(selectedRating)}
                </span>
              ) : (
                <span className="text-base font-medium text-yellow-500">평가를 남겨주세요 &gt;</span>
              )}
            </div>
          </section>
        </div>
      </div>
      <div className="bottom-btn">
        <Button size="md" onClick={confirmHandler}>
          확인
        </Button>
      </div>

      <RatingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleRatingSubmit}
        initialRating={selectedRating}
      />
    </div>
  );
}

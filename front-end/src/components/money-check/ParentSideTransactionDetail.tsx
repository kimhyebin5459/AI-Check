'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import Header from '@/components/common/Header';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';
import useModal from '@/hooks/useModal';
import RatingModal from '@/components/money-check/RatingModal';
import Spinner from '../common/Spinner';

import { getRatingText, getRatingEmoji, getTransactionTypeText } from '@/utils/formatTransaction';
import { TransactionType, Transaction, UpdateRatingData } from '@/types/transaction';
import { getDetail, updateRating } from '@/apis/moneycheck';

const TRANSACTION_HISTORY_KEY = 'transactionHistory';

interface Props {
  paramsId: string;
}

export default function ParentTransactionDetail({ paramsId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const recordId = paramsId;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
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
        const data = await getDetail(Number(recordId));
        setTransaction(data);
        setSelectedRating(data.rating !== undefined && data.rating !== null ? data.rating : null);
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
    if (!transaction || !transaction.recordId) {
      alert('거래 정보가 없습니다.');
      return;
    }

    try {
      setLoading(true);

      const ratingData: UpdateRatingData = {
        recordId: transaction.recordId,
        rating: rating,
      };

      await updateRating(ratingData);

      setTransaction({
        ...transaction,
        rating: rating,
      });

      queryClient.invalidateQueries({ queryKey: [TRANSACTION_HISTORY_KEY] });
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
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">{error}</div>
      </div>
    );
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
            <h2 className="text-xl font-semibold">{transaction.displayName}</h2>
            <p className="mt-1 border-b border-gray-200 pb-4 text-sm text-gray-500">{transaction.createdAt}</p>
          </section>

          <section className="mt-4">
            <h3 className="mb-1 text-base">대분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              <Tag
                key={transaction.firstCategoryName}
                isSelected={true}
                onClick={() => {}} // 비활성화
              >
                {transaction.firstCategoryName || getTransactionTypeText(transaction.type)}
              </Tag>
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">소분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              <Tag
                key={transaction.secondCategoryName || '미지정'}
                isSelected={true}
                onClick={() => {}} // 비활성화
              >
                {transaction.secondCategoryName || '미지정'}
              </Tag>
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">메모</h3>
            <div className="w-full rounded-lg border border-gray-200 p-3 text-base">
              {transaction.description || '메모가 없습니다.'}
            </div>
          </section>

          <section className="mt-3">
            <div className="mb-4 flex justify-between">
              <span className="text-base text-gray-800">거래 금액</span>
              <span className="text-base font-medium">{transaction.amount.toLocaleString()}원</span>
            </div>

            <div className="mt-2 mb-4 flex justify-between">
              <span className="text-base text-gray-800">거래 유형</span>
              <span className="text-base font-medium">
                {getTransactionTypeText(transaction.type as TransactionType)}
              </span>
            </div>

            <div className="mb-4 flex cursor-pointer justify-between" onClick={openModal}>
              <span className="text-base text-gray-800">평가</span>
              {selectedRating !== null && selectedRating > 0 ? (
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

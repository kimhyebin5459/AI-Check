'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/common/Header';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';

import { FIRST_CATEGORIES, SECOND_CATEGORIES_MAP } from '@/constants/categories';
import { getRatingText, getRatingEmoji, getTransactionTypeText } from '@/utils/formatTransaction';
import { Transaction, UpdateTransactionData } from '@/types/transaction';
import { getDetail, updateTransactionRecord } from '@/apis/moneycheck';

interface Props {
  paramsId: string;
}

export default function TransactionDetail({ paramsId, isParent }: Props & { isParent?: boolean }) {
  const router = useRouter();
  const recordId = paramsId;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFirstCategory, setSelectedFirstCategory] = useState<string>('');
  const [selectedSecondCategory, setSelectedSecondCategory] = useState<string>('');
  const [memo, setMemo] = useState<string>('');

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
        setSelectedFirstCategory(data.firstCategoryName);
        setSelectedSecondCategory(data.secondCategoryName);
        setMemo(data.description);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [recordId]);

  const firstCategoryClickHandler = (category: string) => {
    setSelectedFirstCategory(category);
    setSelectedSecondCategory('');
  };

  const secondCategoryClickHandler = (category: string) => {
    setSelectedSecondCategory(category);
  };

  const memoChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemo(e.target.value);
  };

  const confirmHandler = async () => {
    if (!transaction || !transaction || !transaction.recordId) {
      alert('거래 정보가 없습니다.');
      return;
    }

    if (!selectedFirstCategory) {
      alert('대분류를 선택해주세요.');
      return;
    }

    const updatedData: UpdateTransactionData = {
      recordId: transaction.recordId,
      firstCategoryName: selectedFirstCategory,
      secondCategoryName: selectedSecondCategory || '',
      description: memo || '',
    };

    try {
      setLoading(true);

      await updateTransactionRecord(updatedData);

      // 업데이트 성공 후 상세정보 다시 로드
      const updatedTransaction = await getDetail(Number(recordId));
      setTransaction(updatedTransaction);
      setLoading(false);
      router.back();
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-xl font-semibold">{transaction.displayName}</h2>
            <p className="mt-1 border-b border-gray-200 pb-4 text-sm text-gray-500">{transaction.createdAt}</p>
          </section>

          <section className="mt-4">
            <h3 className="mb-1 text-base">대분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {FIRST_CATEGORIES.map((category) => (
                <Tag
                  key={category}
                  isSelected={selectedFirstCategory === category}
                  onClick={() => firstCategoryClickHandler(category)}
                >
                  {category}
                </Tag>
              ))}
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">소분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFirstCategory &&
                SECOND_CATEGORIES_MAP[selectedFirstCategory] &&
                SECOND_CATEGORIES_MAP[selectedFirstCategory].map((category) => (
                  <Tag
                    key={category}
                    isSelected={selectedSecondCategory === category}
                    onClick={() => secondCategoryClickHandler(category)}
                  >
                    {category}
                  </Tag>
                ))}
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">메모</h3>
            <input
              type="text"
              value={memo}
              onChange={memoChangeHandler}
              placeholder="메모를 입력하세요"
              className="w-full rounded-lg border border-gray-200 p-3 text-base"
            />
          </section>

          <section className="mt-3">
            <div className="mb-4 flex justify-between">
              <span className="text-base text-gray-800">거래 금액</span>
              <span className="text-base font-medium">{transaction.amount.toLocaleString()}원</span>
            </div>

            <div className="mt-2 mb-4 flex justify-between">
              <span className="text-base text-gray-800">거래 유형</span>
              <span className="text-base font-medium">{getTransactionTypeText(transaction.type)}</span>
            </div>
            {!isParent && (
              <div className="mb-4 flex justify-between">
                <span className="text-base text-gray-800">평가</span>
                <span className="text-base font-medium">
                  {getRatingText(transaction.rating)} {getRatingEmoji(transaction.rating)}
                </span>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="bottom-btn">
        <Button size="md" onClick={confirmHandler}>
          확인
        </Button>
      </div>
    </div>
  );
}

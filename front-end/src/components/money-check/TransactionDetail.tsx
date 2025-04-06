'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '@/components/common/Header';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';

import { ALL_CATEGORIES } from '@/constants/categories';
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

  // 카테고리 이름으로 ID 찾기 함수
  const getFirstCategoryId = (categoryName: string): number => {
    const category = ALL_CATEGORIES.find((cat) => cat.displayName === categoryName);
    return category ? category.id : 0;
  };

  const getSecondCategoryId = (firstCategoryName: string, secondCategoryName: string): number => {
    const firstCategory = ALL_CATEGORIES.find((cat) => cat.displayName === firstCategoryName);
    if (!firstCategory) return 0;

    const secondCategory = firstCategory.secondCategories.find((cat) => cat.displayName === secondCategoryName);
    return secondCategory ? secondCategory.id : 0;
  };

  const confirmHandler = async () => {
    if (!transaction || !transaction.recordId) {
      alert('거래 정보가 없습니다.');
      return;
    }

    if (!selectedFirstCategory) {
      alert('대분류를 선택해주세요.');
      return;
    }

    const firstCategoryId = getFirstCategoryId(selectedFirstCategory);
    const secondCategoryId = selectedSecondCategory
      ? getSecondCategoryId(selectedFirstCategory, selectedSecondCategory)
      : 0;

    if (!firstCategoryId) {
      alert('대분류 ID를 찾을 수 없습니다.');
      return;
    }

    const updatedData: UpdateTransactionData = {
      recordId: transaction.recordId,
      firstCategoryId: firstCategoryId,
      secondCategoryId: secondCategoryId,
      description: memo || '',
    };

    try {
      setLoading(true);

      await updateTransactionRecord(updatedData);

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
              {ALL_CATEGORIES.map((category) => (
                <Tag
                  key={category.id}
                  isSelected={selectedFirstCategory === category.displayName}
                  onClick={() => firstCategoryClickHandler(category.displayName)}
                >
                  {category.displayName}
                </Tag>
              ))}
            </div>
          </section>

          <section className="mt-2">
            <h3 className="mb-1 text-base">소분류</h3>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFirstCategory &&
                ALL_CATEGORIES.find((cat) => cat.displayName === selectedFirstCategory)?.secondCategories.map(
                  (category) => (
                    <Tag
                      key={category.id}
                      isSelected={selectedSecondCategory === category.displayName}
                      onClick={() => secondCategoryClickHandler(category.displayName)}
                    >
                      {category.displayName}
                    </Tag>
                  )
                )}
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

'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import Header from '@/components/common/Header';
import Tag from '@/components/common/Tag';
import Button from '@/components/common/Button';

import { ALL_CATEGORIES } from '@/constants/categories';
import { getRatingText, getRatingEmoji, getTransactionTypeText } from '@/utils/formatTransaction';
import { Transaction } from '@/types/transaction';

// UpdateTransactionData 타입 정의 (null 값도 허용)
interface UpdateTransactionData {
  recordId: number;
  firstCategoryId: number | null;
  secondCategoryId: number | null;
  description: string;
}
import { getDetail, updateTransactionRecord } from '@/apis/moneycheck';
import { getTransactionDirection } from '@/utils/formatTransaction';
import Spinner from '../common/Spinner';
import ErrorComponent from '@/app/_components/error-component';

const TRANSACTION_HISTORY_KEY = 'transactionHistory';

interface Props {
  paramsId: string;
}

export default function TransactionDetail({ paramsId, isParent }: Props & { isParent?: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const recordId = paramsId;
  const contentRef = useRef<HTMLDivElement>(null);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFirstCategory, setSelectedFirstCategory] = useState<string>('');
  const [selectedSecondCategory, setSelectedSecondCategory] = useState<string>('');
  const [memo, setMemo] = useState<string>('');
  const [transactionDirection, setTransactionDirection] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  // 원본 데이터 저장용 상태 추가
  const [originalFirstCategory, setOriginalFirstCategory] = useState<string>('');
  const [originalSecondCategory, setOriginalSecondCategory] = useState<string>('');
  const [originalMemo, setOriginalMemo] = useState<string>('');

  // 키보드 열림/닫힘 감지 및 처리
  useEffect(() => {
    // SSR 환경에서는 실행하지 않음
    if (typeof window === 'undefined') return;

    // visualViewport API가 지원되지 않는 경우 처리하지 않음
    if (!window.visualViewport) return;

    const viewportHandler = () => {
      try {
        // 뷰포트 높이가 창 높이보다 작아지면 키보드가 열렸다고 판단
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;
        const keyboardVisible = windowHeight > viewportHeight;

        if (keyboardVisible) {
          // 키보드가 보이는 경우 키보드 높이만큼 bottom 여백 설정
          const heightDiff = windowHeight - viewportHeight;
          setKeyboardHeight(heightDiff);

          // 입력 필드가 가려지지 않도록 스크롤 조정
          if (document.activeElement instanceof HTMLInputElement && contentRef.current) {
            const activeInput = document.activeElement;
            const inputRect = activeInput.getBoundingClientRect();

            // 입력 필드가 키보드에 가려지는지 확인
            if (inputRect.bottom > viewportHeight) {
              // 입력 필드가 화면 중앙에 오도록 스크롤
              const scrollOffset = inputRect.top - viewportHeight / 2;
              contentRef.current.scrollTop += scrollOffset;
            }
          }
        } else {
          // 키보드가 숨겨진 경우
          setKeyboardHeight(0);
        }
      } catch (error) {
        // 에러 발생 시 콘솔에 기록하고 계속 진행
        console.error('Viewport handler error:', error);
        setKeyboardHeight(0);
      }
    };

    // 이벤트 핸들러 생성 및 등록
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', viewportHandler);
      vv.addEventListener('scroll', viewportHandler);

      // 초기 상태 설정
      viewportHandler();
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (vv) {
        vv.removeEventListener('resize', viewportHandler);
        vv.removeEventListener('scroll', viewportHandler);
      }
    };
  }, []);

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

        const firstCat = data.firstCategoryName || '';
        const secondCat = data.secondCategoryName || '';
        const description = data.description || '';

        setSelectedFirstCategory(firstCat);
        setOriginalFirstCategory(firstCat);

        setSelectedSecondCategory(secondCat);
        setOriginalSecondCategory(secondCat);

        setMemo(description);
        setOriginalMemo(description);

        setTransactionDirection(getTransactionDirection(data.type));
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [recordId]);

  // 변경 사항 있는지 확인하는 함수
  const hasChanges = () => {
    return (
      selectedFirstCategory !== originalFirstCategory ||
      selectedSecondCategory !== originalSecondCategory ||
      memo !== originalMemo
    );
  };

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
      alert('거래 내역을 찾을 수 없습니다.');
      return;
    }

    if (!hasChanges()) {
      router.back();
      return;
    }

    if (transactionDirection === 'EXPENSE' && !selectedFirstCategory) {
      alert('대분류를 선택해주세요.');
      return;
    }

    if (transactionDirection === 'EXPENSE' && !selectedSecondCategory) {
      alert('소분류를 선택해주세요.');
      return;
    }

    // firstCategoryId와 secondCategoryId를 계산
    let firstCategoryId: number | null = 0;
    let secondCategoryId: number | null = 0;

    if (transactionDirection === 'EXPENSE') {
      firstCategoryId = getFirstCategoryId(selectedFirstCategory);
      secondCategoryId = selectedSecondCategory
        ? getSecondCategoryId(selectedFirstCategory, selectedSecondCategory)
        : 0;
    } else {
      firstCategoryId = null;
      secondCategoryId = null;
    }

    // UpdateTransactionData 객체 생성
    const updatedData: UpdateTransactionData = {
      recordId: transaction.recordId,
      firstCategoryId: firstCategoryId,
      secondCategoryId: secondCategoryId,
      description: memo || '',
    };

    try {
      setLoading(true);

      await updateTransactionRecord(updatedData);

      queryClient.invalidateQueries({ queryKey: [TRANSACTION_HISTORY_KEY] });

      setLoading(false);
      router.back();
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
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
        <div
          ref={contentRef}
          className="w-full overflow-y-auto px-5 pt-5"
          style={{ paddingBottom: `${keyboardHeight}px` }}
        >
          <section>
            <h2 className="text-xl font-semibold">{transaction.displayName}</h2>
            <p className="mt-1 border-b border-gray-200 pb-4 text-sm text-gray-500">{transaction.createdAt}</p>
          </section>

          {transactionDirection === 'INCOME' ? (
            <section className="mt-4">
              <h3 className="mb-1 text-base">거래 유형</h3>
              <div className="mb-4">
                <Tag isSelected={true} onClick={() => {}}>
                  {getTransactionTypeText(transaction.type)}
                </Tag>
              </div>
            </section>
          ) : (
            <>
              <section className="mt-4">
                <h3 className="mb-1 text-base">대분류</h3>
                <div className="mb-4 flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map((category) => (
                    <Tag
                      key={category.id}
                      isSelected={selectedFirstCategory === category.displayName}
                      onClick={() => firstCategoryClickHandler(category.displayName)}
                      isFullWidth={false}
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
                          isFullWidth={false}
                        >
                          {category.displayName}
                        </Tag>
                      )
                    )}
                </div>
              </section>
            </>
          )}

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
                {transaction.rating && transaction.rating > 0 ? (
                  <span className="text-base font-medium">
                    {getRatingText(transaction.rating)} {getRatingEmoji(transaction.rating)}
                  </span>
                ) : (
                  <span className="text-base font-medium text-yellow-500">아직 평가가 없어요</span>
                )}
              </div>
            )}
          </section>

          {/* 키보드가 열렸을 때 하단 버튼이 보이도록 추가 공간 확보 */}
          <div style={{ height: keyboardHeight > 0 ? 65 : 0 }}></div>
        </div>
      </div>
      <div
        className="bottom-btn"
        style={{
          bottom: keyboardHeight > 0 ? `${keyboardHeight + 10}px` : '10px',
          zIndex: 100,
          transition: 'bottom 0.3s ease-out',
        }}
      >
        <Button size="md" onClick={confirmHandler}>
          확인
        </Button>
      </div>
    </div>
  );
}

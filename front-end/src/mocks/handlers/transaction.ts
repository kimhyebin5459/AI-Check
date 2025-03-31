import { http, HttpResponse } from 'msw';
import { transactionData } from '@/mocks/fixtures/transaction';
import { TransactionRecord } from '@/types/transaction';

// 트랜잭션 기록 API를 위한 MSW 핸들러
export const transactionHandlers = [
  http.get('/aicheck/transaction-records', ({ request }) => {
    // URL 파라미터 가져오기
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const type = url.searchParams.get('type');

    // 파라미터 유효성 검사
    if (!startDate || !endDate) {
      return HttpResponse.json(
        {
          code: 'COMMON4001',
          message: '올바르지 않은 요청입니다.',
        },
        { status: 400 }
      );
    }

    try {
      // 날짜 파싱
      const start = new Date(startDate);
      const end = new Date(endDate);

      // 날짜 순서 검증 (종료일이 시작일 이후인지)
      if (end < start) {
        return HttpResponse.json(
          {
            code: 'COMMON4001',
            message: '올바르지 않은 요청입니다.',
          },
          { status: 400 }
        );
      }

      // 날짜 범위로 데이터 필터링
      let filteredData = transactionData.filter((group) => {
        const groupDate = new Date(group.date);
        return groupDate >= start && groupDate <= end;
      });

      // 트랜잭션 타입으로 데이터 필터링 (지정된 경우)
      if (type && type !== 'ALL') {
        filteredData = filteredData
          .map((group) => {
            return {
              ...group,
              records: group.records.filter((record: TransactionRecord) => {
                // INCOME과 EXPENSE에 따라 적절한 type 값 매핑
                if (type === 'INCOME') {
                  // 수입 타입: DEPOSIT, INBOUND_TRANSFER
                  return ['DEPOSIT', 'INBOUND_TRANSFER'].includes(record.type);
                } else if (type === 'EXPENSE') {
                  // 지출 타입: PAYMENT, WITHDRAW, OUTBOUND_TRANSFER
                  return ['PAYMENT', 'WITHDRAW', 'OUTBOUND_TRANSFER'].includes(record.type);
                }
                // 그 외 타입은 원래 로직대로 직접 비교
                return record.type === type;
              }),
            };
          })
          .filter((group) => group.records.length > 0); // 빈 그룹 제거
      }

      return HttpResponse.json({
        data: filteredData,
      });
    } catch (error) {
      // 파싱 오류 또는 기타 문제에 대해 400 반환
      return HttpResponse.json(
        {
          code: 'COMMON4001',
          message: '올바르지 않은 요청입니다.' + error,
        },
        { status: 400 }
      );
    }
  }),

  // 트랜잭션 상세 정보 조회 핸들러
  http.get('/aicheck/transaction-records/detail', ({ request }) => {
    const url = new URL(request.url);
    const recordId = url.searchParams.get('recordId');

    if (!recordId) {
      return HttpResponse.json({ message: 'recordId is required' }, { status: 400 });
    }

    const recordIdNum = parseInt(recordId);

    let foundRecord: { date: string; record: TransactionRecord & { createdAt: string } } | null = null;
    for (const day of transactionData) {
      const record = day.records.find((rec: TransactionRecord) => rec.recordId === recordIdNum);
      if (record) {
        const transactionRecord: TransactionRecord = record;
        foundRecord = {
          date: day.date,
          record: {
            ...transactionRecord,
            createdAt: day.date + ' ' + transactionRecord.time,
          },
        };
        break;
      }
    }

    if (!foundRecord) {
      return HttpResponse.json({ message: 'Transaction record not found' }, { status: 404 });
    }

    return HttpResponse.json(foundRecord);
  }),

  // 트랜잭션 업데이트 핸들러
  http.patch('/aicheck/transaction-records/update', async ({ request }) => {
    try {
      // 요청 본문 파싱을 try-catch로 감싸기
      const updates = (await request.json()) as {
        recordId: number;
        firstCategoryName?: string;
        secondCategoryName?: string;
        description?: string;
      };

      // null 또는 undefined 체크
      if (!updates || typeof updates !== 'object') {
        return HttpResponse.json({ message: 'Invalid request body' }, { status: 400 });
      }

      const recordId = updates.recordId;

      // recordId가 없는 경우 체크
      if (!recordId) {
        return HttpResponse.json({ message: 'recordId is required' }, { status: 400 });
      }

      let found = false;
      let updatedRecord: { date: string; record: TransactionRecord & { createdAt: string } } | null = null;

      for (const day of transactionData) {
        const recordIndex = day.records.findIndex((rec: TransactionRecord) => rec.recordId === recordId);
        if (recordIndex !== -1) {
          // 안전하게 값을 추출하고 기본값 설정
          const firstCategoryName = updates.firstCategoryName || day.records[recordIndex].firstCategoryName;
          const secondCategoryName = updates.secondCategoryName || day.records[recordIndex].secondCategoryName;
          const description =
            updates.description !== undefined ? updates.description : day.records[recordIndex].description;

          // 레코드 업데이트
          day.records[recordIndex] = {
            ...day.records[recordIndex],
            firstCategoryName,
            secondCategoryName,
            description,
          };

          // 업데이트된 레코드 저장
          const currentRecord: TransactionRecord = day.records[recordIndex];
          updatedRecord = {
            date: day.date,
            record: {
              ...currentRecord,
              createdAt: day.date + ' ' + currentRecord.time,
            },
          };

          found = true;
          break;
        }
      }

      if (!found) {
        return HttpResponse.json({ message: 'Transaction record not found' }, { status: 404 });
      }

      return HttpResponse.json({
        message: 'Transaction updated successfully',
        data: updatedRecord,
      });
    } catch (error) {
      console.error('Error processing request:', error);
      return HttpResponse.json({ message: 'Error processing request' }, { status: 400 });
    }
  }),
];

// MSW 설정에서 사용하기 위해 내보내기
export default transactionHandlers;

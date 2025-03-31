import { http, HttpResponse } from 'msw';
import { transactionData } from '../fixtures/transaction';
import { TransactionGroup, TransactionRecord, TransactionType } from '@/types/transaction';
import { CalendarDataItem, CalendarResponse, ErrorResponse } from '@/types/calendar';

// 년도와 월 기준으로 달력 데이터를 반환하는 핸들러
export const calendarHandlers = [
  http.get('/aicheck/transaction-records/calendar', ({ request }) => {
    // URL 파라미터 가져오기
    const url = new URL(request.url);
    const yearParam = url.searchParams.get('year');
    const monthParam = url.searchParams.get('month');

    // 파라미터 유효성 검사
    if (!yearParam || !monthParam) {
      const errorResponse: ErrorResponse = {
        code: 'COMMON4001',
        message: '올바르지 않은 요청입니다.',
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    const year = Number(yearParam);
    const month = Number(monthParam);

    // 숫자 변환 검증
    if (isNaN(year) || isNaN(month)) {
      const errorResponse: ErrorResponse = {
        code: 'COMMON4001',
        message: '올바르지 않은 요청입니다.',
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    // 월 범위 검증 (1~12)
    if (month < 1 || month > 12) {
      const errorResponse: ErrorResponse = {
        code: 'COMMON4001',
        message: '올바르지 않은 요청입니다.',
      };
      return HttpResponse.json(errorResponse, { status: 400 });
    }

    try {
      // 요청된 연도와 월에 해당하는 트랜잭션 필터링
      const targetMonthStr = String(month).padStart(2, '0');
      const targetYearMonth = `${year}-${targetMonthStr}`;

      // 날짜별 합계 계산을 위한 배열 생성
      const calendarData: CalendarDataItem[] = [];

      // 해당 월의 일수 계산
      const daysInMonth = new Date(year, month, 0).getDate();

      // 각 날짜에 대한 합계 계산
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${targetYearMonth}-${String(day).padStart(2, '0')}`;

        // 해당 날짜의 트랜잭션 찾기
        const dayTransaction: TransactionGroup | undefined = transactionData.find(
          (item: TransactionGroup) => item.date === date
        );

        let sum = 0;

        if (dayTransaction) {
          dayTransaction.records.forEach((record: TransactionRecord) => {
            // 수입 유형인 경우 더하기, 지출 유형인 경우 빼기
            const incomeTypes: TransactionType[] = ['DEPOSIT', 'INBOUND_TRANSFER'];
            if (incomeTypes.includes(record.type)) {
              sum += record.amount;
            } else {
              sum -= record.amount;
            }
          });
        }

        // 결과 배열에 추가 (sum이 0이 아닌 날짜만)
        if (sum !== 0) {
          calendarData.push({
            date: date,
            sum: sum,
          });
        }
      }

      const response: CalendarResponse = {
        calendar: calendarData,
      };

      return HttpResponse.json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Calendar data error:', errorMessage);

      const errorResponse: ErrorResponse = {
        code: 'COMMON4001',
        message: '올바르지 않은 요청입니다.',
      };

      return HttpResponse.json(errorResponse, { status: 400 });
    }
  }),
];

export default calendarHandlers;

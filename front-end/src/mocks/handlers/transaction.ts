import { http, HttpResponse } from 'msw';
import { transactionData } from '@/mocks/fixtures/transaction';

export const transactionHandlers = [
  http.patch('/aicheck/transaction-records/update', async ({ request }) => {
    try {
      // 요청 본문 파싱을 try-catch로 감싸기
      const updates = await request.json();

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
      let updatedRecord = null;

      for (const day of transactionData) {
        const recordIndex = day.records.findIndex((rec) => rec.recordId === recordId);
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
          updatedRecord = {
            date: day.date,
            record: {
              ...day.records[recordIndex],
              createdAt: day.date + ' ' + day.records[recordIndex].time,
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
  http.get('/aicheck/transaction-records/detail', ({ request }) => {
    const url = new URL(request.url);
    const recordId = url.searchParams.get('recordId');

    if (!recordId) {
      return HttpResponse.json({ message: 'recordId is required' }, { status: 400 });
    }

    const recordIdNum = parseInt(recordId);

    let foundRecord = null;
    for (const day of transactionData) {
      const record = day.records.find((rec) => rec.recordId === recordIdNum);
      if (record) {
        foundRecord = {
          date: day.date,
          record: {
            ...record,
            createdAt: day.date + ' ' + record.time,
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
];

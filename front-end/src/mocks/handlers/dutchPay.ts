import { http, HttpResponse } from 'msw';
import { mockDutchPayData } from '@/mocks/fixtures/dutchPay';

export const dutchPayHandlers = [
  http.get('/api/v1/dutch-pays', ({ request }) => {
    const url = new URL(request.url);
    const recordId = url.searchParams.get('recordId');

    if (!recordId) {
      return HttpResponse.json({ message: 'recordId is required' }, { status: 400 });
    }

    const recordIdNum = parseInt(recordId);
    const data = mockDutchPayData.find((item) => item.recordId === recordIdNum);

    if (!data) {
      return HttpResponse.json({ message: 'Record not found' }, { status: 404 });
    }

    return HttpResponse.json(data);
  }),
];

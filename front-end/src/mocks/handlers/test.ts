import { http, HttpResponse } from 'msw';

export const TestHandlers = [
  http.get('/api/endpoint', () => {
    return HttpResponse.json({
      msg: '모킹된 메세지',
    });
  }),
];

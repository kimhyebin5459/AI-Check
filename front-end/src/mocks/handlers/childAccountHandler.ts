import { http, HttpResponse } from 'msw';
import { accountResponse } from '../fixtures/account';

export const accountHandlers = [
  // 모든 계정 목록 조회 API
  http.get('/aicheck/accounts/children', () => {
    return HttpResponse.json(accountResponse);
  }),

  // 특정 계정 상세 조회 API (childId로 필터링)
  http.get('/aicheck/accounts/:childId', ({ params }) => {
    const { childId } = params;
    const account = accountResponse.accounts.find((account) => account.childId === Number(childId));

    if (!account) {
      return new HttpResponse(JSON.stringify({ message: '계정을 찾을 수 없습니다.' }), { status: 404 });
    }

    return HttpResponse.json({ account });
  }),
];

export default accountHandlers;

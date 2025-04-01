import { http, HttpResponse } from 'msw';
import { securityStatsData, securityAlertsData } from '../fixtures/phishing';

export const securityHandlers = [
  // 보안 통계 정보 API 핸들러
  http.get('aicheck/phishings', ({ request }) => {
    // 헤더에서 Authorization 토큰 확인
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'COMMON4001',
          message: '올바르지 않은 요청입니다.',
        },
        { status: 400 }
      );
    }

    // 여기서 토큰 유효성 검사 로직을 추가할 수 있습니다.
    // 실제 구현에서는 토큰 검증 로직이 필요하지만, Mock에서는 간단히 처리

    return HttpResponse.json(securityStatsData);
  }),

  // 보안 알림 목록 API 핸들러
  http.get('aicheck/phishings/family', ({ request }) => {
    // 헤더에서 Authorization 토큰 확인
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'COMMON4001',
          message: '올바르지 않은 요청입니다.',
        },
        { status: 400 }
      );
    }

    // URL 파라미터 (필터링 기능을 위해)
    const url = new URL(request.url);
    const type = url.searchParams.get('type');

    // 타입 필터링
    if (type) {
      const filteredData = securityAlertsData.filter((alert) => alert.type === type);
      return HttpResponse.json(filteredData);
    }

    // 필터링 없이 전체 데이터 반환
    return HttpResponse.json(securityAlertsData);
  }),
];

export default securityHandlers;

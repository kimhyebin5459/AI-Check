import { http, HttpResponse } from 'msw';
import { childProfiles } from '../fixtures/child';

// 자녀 프로필 API 핸들러
export const childProfilesHandlers = [
  // 모든 자녀 프로필 조회 API
  http.get('/aicheck/members/children/profiles', () => {
    try {
      return HttpResponse.json({
        data: childProfiles,
      });
    } catch (error) {
      return HttpResponse.json(
        {
          code: 'COMMON4001',
          message: '올바르지 않은 요청입니다.' + error,
        },
        { status: 400 }
      );
    }
  }),

  // 특정 자녀 프로필 조회 API (추가 기능)
  http.get('/aicheck/members/children/profiles/:childId', ({ params }) => {
    try {
      const { childId } = params;

      if (!childId) {
        return HttpResponse.json(
          {
            code: 'COMMON4001',
            message: 'childId is required',
          },
          { status: 400 }
        );
      }

      const childIdNum = parseInt(childId as string);
      const profile = childProfiles.find((child) => child.childId === childIdNum);

      if (!profile) {
        return HttpResponse.json(
          {
            code: 'COMMON4004',
            message: '자녀 프로필을 찾을 수 없습니다.',
          },
          { status: 404 }
        );
      }

      return HttpResponse.json({
        data: profile,
      });
    } catch (error) {
      return HttpResponse.json(
        {
          code: 'COMMON4001',
          message: '올바르지 않은 요청입니다.' + error,
        },
        { status: 400 }
      );
    }
  }),
];

// MSW 설정에서 사용하기 위해 내보내기
export default childProfilesHandlers;

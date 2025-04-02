import { http, HttpResponse } from 'msw';
import { childChatbotDifficulties, ChatbotDifficulty } from '../fixtures/child';

// 챗봇 난이도 설정 API 핸들러
export const chatbotDifficultyHandlers = [
  // 특정 자녀의 챗봇 난이도 설정 조회 API
  http.get('/aicheck/chatbot/prompt/:childId', ({ params }) => {
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
      const difficulty = childChatbotDifficulties[childIdNum];

      if (!difficulty) {
        return HttpResponse.json(
          {
            code: 'COMMON4004',
            message: '자녀 설정을 찾을 수 없습니다.',
          },
          { status: 404 }
        );
      }

      return HttpResponse.json(difficulty);
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

  // 특정 자녀의 챗봇 난이도 설정 업데이트 API
  http.put('/aicheck/chatbot/prompt/:childId', async ({ params, request }) => {
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

      // 요청 본문 확인
      let requestBody: ChatbotDifficulty;
      try {
        requestBody = (await request.json()) as ChatbotDifficulty;
      } catch (error) {
        return HttpResponse.json(
          {
            code: 'COMMON4001',
            message: '유효하지 않은 요청 본문입니다.' + error,
          },
          { status: 400 }
        );
      }

      // 요청 본문 검증
      if (!requestBody.categoryDifficulties || !Array.isArray(requestBody.categoryDifficulties)) {
        return HttpResponse.json(
          {
            code: 'COMMON4001',
            message: '유효하지 않은 카테고리 난이도 설정입니다.',
          },
          { status: 400 }
        );
      }

      // 데이터 업데이트
      childChatbotDifficulties[childIdNum] = requestBody;

      return HttpResponse.json(
        {
          message: '설정이 성공적으로 업데이트되었습니다.',
          data: childChatbotDifficulties[childIdNum],
        },
        { status: 200 }
      );
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

  // 다른 자녀의 설정을 현재 자녀에게 복사하는 API
  http.post('/aicheck/chatbot/prompt/:targetChildId/copy/:sourceChildId', ({ params }) => {
    try {
      const { targetChildId, sourceChildId } = params;

      if (!targetChildId || !sourceChildId) {
        return HttpResponse.json(
          {
            code: 'COMMON4001',
            message: 'targetChildId와 sourceChildId가 모두 필요합니다.',
          },
          { status: 400 }
        );
      }

      const targetIdNum = parseInt(targetChildId as string);
      const sourceIdNum = parseInt(sourceChildId as string);

      // 소스 자녀 설정 확인
      const sourceSettings = childChatbotDifficulties[sourceIdNum];
      if (!sourceSettings) {
        return HttpResponse.json(
          {
            code: 'COMMON4004',
            message: '소스 자녀의 설정을 찾을 수 없습니다.',
          },
          { status: 404 }
        );
      }

      // 타겟 자녀 존재 확인
      if (!childChatbotDifficulties[targetIdNum]) {
        return HttpResponse.json(
          {
            code: 'COMMON4004',
            message: '타겟 자녀를 찾을 수 없습니다.',
          },
          { status: 404 }
        );
      }

      // 설정 복사
      childChatbotDifficulties[targetIdNum] = JSON.parse(JSON.stringify(sourceSettings));

      return HttpResponse.json(
        {
          message: '설정이 성공적으로 복사되었습니다.',
          data: childChatbotDifficulties[targetIdNum],
        },
        { status: 200 }
      );
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
export default chatbotDifficultyHandlers;

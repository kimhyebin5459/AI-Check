import { http, HttpResponse } from 'msw';
import { ChatType, QuestionResult, PersuadeResponse, QuestionResponse } from '@/types/chat';

// 모의 엄마 AI 초기 메시지
const initialMessages = {
  PERSUADE: '엄마한테 무엇을 사기 위해 용돈이 얼마나 더 필요한지, 필요한 이유는 무엇인지 잘 설명해줄래?',
  QUESTION: '그럼 엄마한테 그게 무엇이며 사고 싶은 이유는 무엇인지, 가격은 얼마인지 잘 설명해줄래?',
};

// 설득 대화를 위한 모의 응답
const persuadeResponses: PersuadeResponse[] = [
  {
    isPersuaded: false,
    message: '그렇구나. 하지만 네 용돈으로는 충분하지 않을까? 이번 달에 특별히 더 필요한 이유가 있니?',
    createdAt: new Date().toISOString(),
  },
  {
    isPersuaded: false,
    message:
      '음... 그 물건이 정말 필요한 것 같네. 하지만 지난번에도 비슷한 이유로 용돈을 올려줬던 것 같은데, 어떻게 관리하고 있니?',
    createdAt: new Date().toISOString(),
  },
  {
    isPersuaded: false,
    message:
      '그래, 네 말도 일리가 있어. 그런데 다른 방법으로 돈을 모을 수는 없을까? 예를 들어 집안일을 더 도와준다든지?',
    createdAt: new Date().toISOString(),
  },
  {
    isPersuaded: true,
    message:
      '알았어. 네가 정말 책임감 있게 용돈을 관리하려는 모습이 보기 좋구나. 이번 달부터 용돈을 조금 올려줄게. 대신 약속한 대로 잘 관리해야 해!',
    createdAt: new Date().toISOString(),
  },
];

// 질문 대화를 위한 모의 응답
const questionResponses: QuestionResponse[] = [
  {
    result: 'JUDGING' as QuestionResult,
    message: '그 물건에 대해 더 자세히 알려줄 수 있니? 어디서 사용할 계획이고, 다른 대안은 고려해봤어?',
    createdAt: new Date().toISOString(),
  },
  {
    result: 'JUDGING' as QuestionResult,
    message: '음... 가격이 꽤 나가는데, 정말 필요한 물건인지 한 번 더 생각해봤니? 지금 당장 필요한 건 아닌 것 같은데.',
    createdAt: new Date().toISOString(),
  },
  {
    result: 'NO' as QuestionResult,
    message:
      '아이야, 엄마 생각에는 지금 그 물건을 사는 것은 적절하지 않은 것 같아. 너의 현재 필요와 예산을 고려했을 때, 조금 더 기다리거나 다른 대안을 찾아보는 게 좋겠어.',
    createdAt: new Date().toISOString(),
  },
  {
    result: 'YES' as QuestionResult,
    message:
      '아이야, 엄마가 생각해봤는데, 네가 설명한 이유와 상황을 고려하면 그 물건을 사는 게 좋을 것 같구나. 하지만 앞으로도 구매 전에 이렇게 신중하게 생각해보는 습관을 들이길 바라.',
    createdAt: new Date().toISOString(),
  },
];

// 응답 인덱스 추적을 위한 변수
const chatState = {
  persuadeIndex: 0,
  questionIndex: 0,
  firstMessage: {
    PERSUADE: true,
    QUESTION: true,
  },
};

// 핸들러 정의
export const chatHandlers = [
  // 채팅 시작 핸들러
  http.post('/chatbot/start', async ({ request }) => {
    try {
      // 요청 바디 파싱
      const body = await request.json();
      const { type } = body as { type: ChatType };

      // 채팅 인덱스 초기화
      chatState.persuadeIndex = 0;
      chatState.questionIndex = 0;
      chatState.firstMessage = {
        PERSUADE: true,
        QUESTION: true,
      };

      return new HttpResponse(null, { status: 201 });
    } catch (error) {
      console.error('채팅 시작 에러:', error);
      return new HttpResponse('잘못된 요청입니다.', { status: 400 });
    }
  }),

  // 설득 채팅 메시지 전송 핸들러
  http.post('/chatbot/persuade', async ({ request }) => {
    try {
      // 요청 바디 파싱
      const body = await request.json();
      const { message } = body as { message: string };

      // 첫 번째 사용자 메시지에 대한 처리
      if (chatState.firstMessage.PERSUADE) {
        chatState.firstMessage.PERSUADE = false;

        // 첫 메시지가 "용돈이 더 필요해요"인 경우
        if (message === '용돈이 더 필요해요') {
          const initialResponse = {
            isPersuaded: false,
            message: initialMessages.PERSUADE,
            createdAt: new Date().toISOString(),
          };
          return HttpResponse.json(initialResponse);
        }
      }

      // 후속 메시지에 대한 응답
      const response = persuadeResponses[chatState.persuadeIndex];

      // 다음 응답을 위해 인덱스 증가 (마지막 응답에 도달하면 유지)
      if (chatState.persuadeIndex < persuadeResponses.length - 1) {
        chatState.persuadeIndex++;
      }

      return HttpResponse.json(response);
    } catch (error) {
      console.error('설득 메시지 전송 에러:', error);
      return new HttpResponse('잘못된 요청입니다.', { status: 400 });
    }
  }),

  // 질문 채팅 메시지 전송 핸들러
  http.post('/chatbot/question', async ({ request }) => {
    try {
      // 요청 바디 파싱
      const body = await request.json();
      const { message } = body as { message: string };

      // 첫 번째 사용자 메시지에 대한 처리
      if (chatState.firstMessage.QUESTION) {
        chatState.firstMessage.QUESTION = false;

        // 첫 메시지가 "어떤 걸 살지 말지 고민돼요"인 경우
        if (message === '어떤 걸 살지 말지 고민돼요') {
          const initialResponse = {
            result: 'JUDGING' as QuestionResult,
            message: initialMessages.QUESTION,
            createdAt: new Date().toISOString(),
          };
          return HttpResponse.json(initialResponse);
        }
      }

      // 후속 메시지에 대한 응답
      const response = questionResponses[chatState.questionIndex];

      // 다음 응답을 위해 인덱스 증가 (마지막 응답에 도달하면 유지)
      if (chatState.questionIndex < questionResponses.length - 1) {
        chatState.questionIndex++;
      }

      return HttpResponse.json(response);
    } catch (error) {
      console.error('질문 메시지 전송 에러:', error);
      return new HttpResponse('잘못된 요청입니다.', { status: 400 });
    }
  }),

  // 채팅 종료 핸들러
  http.post('/chatbot/end', async ({ request }) => {
    try {
      // 요청 바디 파싱
      const body = await request.json();
      const { type } = body as { type: ChatType };

      // 타입에 따른 처리는 이 예제에서는 수행하지 않음
      // 실제 구현에서는 필요한 로직 추가

      return new HttpResponse(null, { status: 204 });
    } catch (error) {
      console.error('채팅 종료 에러:', error);
      return new HttpResponse('잘못된 요청입니다.', { status: 400 });
    }
  }),
];

export default chatHandlers;

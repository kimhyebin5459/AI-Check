import { StartChatParams, SendMessageParams, EndChatParams, PersuadeResponse, QuestionResponse } from '@/types/chat';

// API 경로 상수
const API_BASE_URL = '';
const CHATBOT_API = `${API_BASE_URL}/chatbot`;

/**
 * 채팅 API 서비스
 * 백엔드 API와의 통신을 담당하는 서비스
 */
const chatApi = {
  /**
   * 채팅 세션을 시작합니다
   * @param params 채팅 시작 파라미터
   */
  startChat: async (params: StartChatParams): Promise<void> => {
    try {
      const response = await fetch(`${CHATBOT_API}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('채팅 시작에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅 시작 에러:', error);
      throw error;
    }
  },

  /**
   * 설득형 메시지를 전송합니다
   * @param params 메시지 전송 파라미터
   * @returns 설득 채팅 응답
   */
  sendPersuadeMessage: async (params: SendMessageParams): Promise<PersuadeResponse> => {
    try {
      const response = await fetch(`${CHATBOT_API}/persuade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('메시지 전송에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('메시지 전송 에러:', error);
      throw error;
    }
  },

  /**
   * 질문형 메시지를 전송합니다
   * @param params 메시지 전송 파라미터
   * @returns 질문 채팅 응답
   */
  sendQuestionMessage: async (params: SendMessageParams): Promise<QuestionResponse> => {
    try {
      const response = await fetch(`${CHATBOT_API}/question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('메시지 전송에 실패했습니다.');
      }

      return await response.json();
    } catch (error) {
      console.error('메시지 전송 에러:', error);
      throw error;
    }
  },

  /**
   * 채팅 세션을 종료합니다
   * @param params 종료할 채팅 타입
   */
  endChat: async (params: EndChatParams): Promise<void> => {
    try {
      const response = await fetch(`${CHATBOT_API}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('채팅 종료에 실패했습니다.');
      }
    } catch (error) {
      console.error('채팅 종료 에러:', error);
      throw error;
    }
  },
};

export default chatApi;

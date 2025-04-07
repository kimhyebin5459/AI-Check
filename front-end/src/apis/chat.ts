import { StartChatParams, SendMessageParams, EndChatParams, PersuadeResponse, QuestionResponse } from '@/types/chat';
import fetcher from '@/apis/fetcher';

const chatApi = {
  startChat: async (params: StartChatParams): Promise<void> => {
    return await fetcher.post({ url: 'chatbot/start', body: params });
  },

  sendPersuadeMessage: async (params: SendMessageParams): Promise<PersuadeResponse> => {
    return await fetcher.post({ url: 'chatbot/persuade', body: params });
  },

  sendQuestionMessage: async (params: SendMessageParams): Promise<QuestionResponse> => {
    return await fetcher.post({ url: 'chatbot/question', body: params });
  },

  endChat: async (params: EndChatParams): Promise<void> => {
    return await fetcher.post({ url: 'chatbot/end', body: params });
  },
};

export default chatApi;

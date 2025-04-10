import { StartChatParams, SendMessageParams, EndChatParams } from '@/types/chat';
import fetcher from './fetcher';

export const startChat = async ({ chatType }: StartChatParams) => {
  return await fetcher.post({
    url: 'chatbot/start',
    body: { chatType },
  });
};

export const sendPersuadeMessage = async ({ message }: SendMessageParams) => {
  const response = await fetcher.post({
    url: 'chatbot/persuade',
    body: { message },
  });

  return await response;
};

export const sendQuestionMessage = async ({ message }: SendMessageParams) => {
  const response = await fetcher.post({
    url: 'chatbot/question',
    body: { message },
  });

  return await response;
};

export const endChat = async ({ chatType }: EndChatParams) => {
  return await fetcher.delete({
    url: `chatbot/end?chat-type=${chatType}`,
  });
};

import { ChatbotDifficulty } from '@/types/difficulty';
import fetcher from './fetcher';

export const getChatbotDifficulty = async (childId: number): Promise<ChatbotDifficulty> => {
  const response = await fetcher.get({
    url: `chatbot/prompts/${childId}`,
  });

  return await response;
};

export const updateChatbotDifficulty = async ({
  difficulty,
}: {
  difficulty: ChatbotDifficulty;
}): Promise<ChatbotDifficulty> => {
  const response = await fetcher.patch({
    url: `chatbot/prompts`,
    body: difficulty,
  });

  return await response;
};

export const copyChatbotDifficulty = async ({
  sourceChildId,
}: {
  targetChildId: number;
  sourceChildId: number;
}): Promise<ChatbotDifficulty> => {
  // 소스 자녀의 설정 조회
  const sourceDifficulty = await getChatbotDifficulty(Number(sourceChildId));

  // 타겟 자녀에게 소스 자녀의 설정 적용
  const result = await updateChatbotDifficulty({
    difficulty: sourceDifficulty,
  });

  return result;
};

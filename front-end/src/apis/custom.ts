import { ChatbotDifficulty } from '@/types/difficulty';
import fetcher from './fetcher';

export const getChatbotDifficulty = async (childId: number) => {
  const response = await fetcher.get({
    url: `aicheck/chatbot/prompt/${childId}`,
  });

  return await response.json();
};

export const updateChatbotDifficulty = async ({
  childId,
  difficulty,
}: {
  childId: number;
  difficulty: ChatbotDifficulty;
}) => {
  const response = await fetcher.put({
    url: `aicheck/chatbot/prompt/${childId}`,
    body: difficulty,
  });

  return await response.json();
};

export const copyChatbotDifficulty = async ({
  targetChildId,
  sourceChildId,
}: {
  targetChildId: number;
  sourceChildId: number;
}) => {
  // 소스 자녀의 설정 조회
  const sourceDifficulty = await getChatbotDifficulty(Number(sourceChildId));

  // 타겟 자녀에게 소스 자녀의 설정 적용
  const result = await updateChatbotDifficulty({
    childId: Number(targetChildId),
    difficulty: sourceDifficulty,
  });

  return result;
};

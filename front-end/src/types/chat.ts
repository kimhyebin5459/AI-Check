export type ChatType = 'PERSUADE' | 'QUESTION';

export type MessageRole = 'USER' | 'AI';

export type State = 'BEFORE' | 'PROCEEDING' | 'FINISHED';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface ChatSession {
  sessionId: string;
  chatType: ChatType;
  messages: ChatMessage[];
  isActive: boolean;
  lastActivity: number; // 마지막 활동 시간(타임스탬프)
}

export type QuestionResult = 'JUDGING' | 'YES' | 'NO';

export interface PersuadeResponse {
  message: string;
  isPersuaded: boolean;
  createdAt: string;
}

export interface QuestionResponse {
  message: string;
  judge: QuestionResult;
  createdAt: string;
}

export interface StartChatParams {
  chatType: ChatType;
}

export interface SendMessageParams {
  message: string;
}

export interface EndChatParams {
  chatType: ChatType;
}

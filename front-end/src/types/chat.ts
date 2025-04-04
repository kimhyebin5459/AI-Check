// 채팅 유형(설득 또는 질문)
export type ChatType = 'PERSUADE' | 'QUESTION';

// 채팅 메시지 역할(사용자 또는 AI)
export type MessageRole = 'USER' | 'AI';

export type State = 'BEFORE' | 'PROCEEDING' | 'FINISHED';

// 채팅 메시지 구조
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

// 채팅 세션 정보
export interface ChatSession {
  sessionId: string;
  chatType: ChatType;
  messages: ChatMessage[];
  isActive: boolean;
  lastActivity: number; // 마지막 활동 시간(타임스탬프)
}

// 질문형 채팅 결과 유형
export type QuestionResult = 'JUDGING' | 'YES' | 'NO';

// 설득형 채팅 응답
export interface PersuadeResponse {
  isPersuaded: boolean;
  message: string;
  createdAt: string;
}

// 질문형 채팅 응답
export interface QuestionResponse {
  result: QuestionResult;
  message: string;
  createdAt: string;
}

// 채팅 시작 파라미터
export interface StartChatParams {
  type: ChatType;
}

// 메시지 전송 파라미터
export interface SendMessageParams {
  message: string;
}

// 채팅 종료 파라미터
export interface EndChatParams {
  type: ChatType;
}

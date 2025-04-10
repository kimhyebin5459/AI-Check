import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatType, ChatMessage, ChatSession, PersuadeResponse, QuestionResponse, State } from '@/types/chat';
import { startChat, sendPersuadeMessage, sendQuestionMessage, endChat } from '@/apis/chat';

interface ChatStore {
  session: ChatSession | null;
  isLoading: boolean;
  error: string | null;
  state: State;
  terminationType: 'NORMAL' | 'FORCED' | null;

  startChat: (chatType: ChatType) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  endChat: () => Promise<void>;
  resetState: () => void;
  updateLastActivity: () => void;

  // 비활성 타임아웃 관련
  checkInactivity: () => void;
}

// 비활성 타임아웃 설정 (5분 = 300,000밀리초)
const INACTIVE_TIMEOUT = 300000;

const generateMessageId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      session: null,
      isLoading: false,
      error: null,
      state: 'BEFORE',
      terminationType: null, // 초기값은 null

      // 채팅 시작
      startChat: async (chatType: ChatType) => {
        try {
          set({ isLoading: true, error: null, state: 'PROCEEDING', terminationType: null });

          await startChat({ chatType });

          const firstMessage =
            chatType === 'PERSUADE'
              ? '그렇구나. 그럼 엄마한테 <strong>무엇을 사기 위해 용돈이 얼마나 더 필요한지, 필요한 이유는 무엇인지</strong> 잘 설명해 줄래?'
              : '그렇구나. 그럼 엄마한테 <strong>그게 무엇이며 가격은 얼마인지, 사고 싶은 이유는 무엇인지</strong> 잘 설명해 줄래?';
          // 초기 상태 설정
          const initialMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'AI',
            content: firstMessage,
            createdAt: new Date().toISOString(),
          };

          // 세션 생성
          const newSession: ChatSession = {
            sessionId: generateMessageId(),
            chatType,
            messages: [initialMessage],
            isActive: true,
            lastActivity: Date.now(),
          };

          set({ session: newSession, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '채팅을 시작하는데 실패했습니다.',
            isLoading: false,
          });
        }
      },

      // 메시지 전송
      sendMessage: async (message: string) => {
        const { session } = get();
        if (!session) {
          set({ error: '활성화된 채팅 세션이 없습니다.' });
          return;
        }

        if (!session.isActive) {
          set({ error: '채팅 세션이 이미 종료되었습니다.' });
          return;
        }

        try {
          set({ isLoading: true, error: null });

          // 사용자 메시지 추가
          const userMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'USER',
            content: message,
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            session: state.session
              ? {
                  ...state.session,
                  messages: [...state.session.messages, userMessage],
                  lastActivity: Date.now(),
                }
              : null,
          }));

          // API 호출 (채팅 타입에 따라 다른 엔드포인트 사용)
          let response;
          if (session.chatType === 'PERSUADE') {
            response = await sendPersuadeMessage({ message });
          } else {
            response = await sendQuestionMessage({ message });
          }

          // 특정 메시지 확인하여 자동 종료 처리
          const shouldTerminate = response.message.includes('대화를 종료하였습니다. 새로 시작하시겠습니까?');

          // 응답 메시지 추가
          const aiMessage: ChatMessage = {
            id: generateMessageId(),
            role: 'AI',
            content: response.message,
            createdAt: response.createdAt,
          };

          // 응답 메시지 추가 후 상태 업데이트 부분
          set((state) => ({
            session: state.session
              ? {
                  ...state.session,
                  messages: [...state.session.messages, aiMessage],
                  lastActivity: Date.now(),
                  // 설득이 성공했거나 질문에 대한 최종 답변이 나왔거나 특정 메시지가 왔으면 자동으로 비활성화
                  isActive:
                    session.chatType === 'PERSUADE'
                      ? !(response as PersuadeResponse).isPersuaded && !shouldTerminate
                      : (response as QuestionResponse).judge === 'JUDGING' && !shouldTerminate,
                }
              : null,
            isLoading: false,
            terminationType: shouldTerminate
              ? 'FORCED'
              : (session.chatType === 'PERSUADE' && (response as PersuadeResponse).isPersuaded) ||
                  (session.chatType === 'QUESTION' && (response as QuestionResponse).judge !== 'JUDGING')
                ? 'NORMAL'
                : state.terminationType, // 설득이 성공했거나 최종 답변이 나왔거나 특정 메시지가 왔으면 state를 'FINISHED'로 변경
            state:
              (session.chatType === 'PERSUADE' && (response as PersuadeResponse).isPersuaded) ||
              (session.chatType === 'QUESTION' && (response as QuestionResponse).judge !== 'JUDGING') ||
              shouldTerminate
                ? 'FINISHED'
                : state.state,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '메시지를 전송하는데 실패했습니다.',
            isLoading: false,
          });
        }
      },

      // 채팅 종료
      endChat: async () => {
        const { session, state } = get();
        if (!session) {
          set({ error: '활성화된 채팅 세션이 없습니다.' });
          return;
        }

        try {
          set({ isLoading: true, error: null });

          // 이미 종료되지 않았고 세션이 활성 상태일 때만 API 호출
          if (state !== 'FINISHED' && session.isActive) {
            await endChat({ chatType: session.chatType });
          }
          // 세션 상태 업데이트
          set((state) => ({
            session: state.session ? { ...state.session, isActive: false } : null,
            isLoading: false,
            state: 'FINISHED',
            terminationType: state.terminationType || 'NORMAL',
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '채팅을 종료하는데 실패했습니다.',
            isLoading: false,
          });
        }
      },

      // 상태 초기화
      resetState: () => {
        set({ session: null, isLoading: false, error: null, state: 'BEFORE', terminationType: null });
      },

      // 마지막 활동 시간 업데이트
      updateLastActivity: () => {
        set((state) => ({
          session: state.session ? { ...state.session, lastActivity: Date.now() } : null,
        }));
      },

      // 비활성 체크 (5분 이상 활동이 없으면 자동 종료)
      checkInactivity: () => {
        const { session, state } = get();
        if (!session || !session.isActive || state === 'FINISHED') return;

        const now = Date.now();
        const timeSinceLastActivity = now - session.lastActivity;

        if (timeSinceLastActivity > INACTIVE_TIMEOUT) {
          get().endChat(); // 비활성 시간초과 시 채팅 종료 (이 경우 endChat API 호출)
        }
      },
    }),
    {
      name: 'chat-store', // 세션 스토리지에 저장될 키 이름
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);

export default useChatStore;

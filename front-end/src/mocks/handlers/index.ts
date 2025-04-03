import { dutchPayHandlers } from './dutchPay';
import { transactionHandlers } from './transaction';
import calendarHandlers from './calendar';
import securityHandlers from './phishing';
import childProfilesHandlers from './childProfile';
import chatbotDifficultyHandlers from './chatbotDifficulty';
import accountHandlers from './childAccountHandler';
import chatHandlers from './chat';

export const handlers = [
  ...dutchPayHandlers,
  ...transactionHandlers,
  ...calendarHandlers,
  ...securityHandlers,
  ...childProfilesHandlers,
  ...chatbotDifficultyHandlers,
  ...accountHandlers,
  ...chatHandlers,
];

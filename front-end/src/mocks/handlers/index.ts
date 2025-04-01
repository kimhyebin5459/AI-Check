import { dutchPayHandlers } from './dutchPay';
import { transactionHandlers } from './transaction';
import calendarHandlers from './calendar';
import securityHandlers from './phishing';

export const handlers = [...dutchPayHandlers, ...transactionHandlers, ...calendarHandlers, ...securityHandlers];

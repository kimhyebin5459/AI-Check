import { dutchPayHandlers } from './dutchPay';
import { transactionHandlers } from './transaction';
import calendarHandlers from './calendar';

export const handlers = [...dutchPayHandlers, ...transactionHandlers, ...calendarHandlers];

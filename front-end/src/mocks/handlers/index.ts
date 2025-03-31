import { dutchPayHandlers } from './dutchPay';
import { transactionHandlers } from './transaction';

export const handlers = [...dutchPayHandlers, ...transactionHandlers];

import { TestHandlers } from '@/mocks/handlers/test';
import { dutchPayHandlers, transactionUpdateHandler, transactionDetailHandler } from '../fixtures/money-check';

export const handlers = [
  ...TestHandlers,
  ...dutchPayHandlers,
  transactionDetailHandler,
  dutchPayHandlers[0],
  transactionUpdateHandler,
];

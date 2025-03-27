import { TestHandlers } from '@/mocks/handlers/test';
import { dutchPayHandlers } from '../fixtures/money-check';

export const handlers = [...TestHandlers, ...dutchPayHandlers];

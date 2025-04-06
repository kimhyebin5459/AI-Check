export type TransactionType = 'PAYMENT' | 'DEPOSIT' | 'WITHDRAW' | 'INBOUND_TRANSFER' | 'OUTBOUND_TRANSFER';

export type TransactionFilterType = 'ALL' | 'INCOME' | 'EXPENSE';

export interface TransactionReq {
  childId?: number;
  startDate: string;
  endDate: string;
  type?: TransactionFilterType;
}

export interface TransactionRecord {
  recordId: number;
  firstCategoryName: string;
  secondCategoryName: string | null;
  displayName: string;
  type: TransactionType;
  amount: number;
  description: string;
  rating: number | null;
  time: string;
}

export interface TransactionGroup {
  date: string;
  records: TransactionRecord[];
}

export interface Transaction {
  recordId: number;
  firstCategoryName: string;
  secondCategoryName: string;
  displayName: string;
  type: TransactionType;
  amount: number;
  description: string;
  rating: number;
  createdAt: string;
}

export type TransactionDetailResponse = {
  date: string;
  record: Transaction;
};

export interface UpdateTransactionData {
  recordId: number;
  firstCategoryName: string;
  secondCategoryName?: string;
  description?: string;
}

export interface UpdateRatingData {
  recordId: number;
  rating: number;
}

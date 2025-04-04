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
  // isDutchPay?: boolean;
}

export interface TransactionGroup {
  date: string;
  records: TransactionRecord[];
}

// export interface GroupedTransactionRecord {
//   displayName: string;
//   amount: number;
//   time: string;
//   description: string;
// }

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
  // isDutchPay?: boolean;
}

export type TransactionDetailResponse = {
  date: string;
  record: Transaction;
};

// First, let's define the UpdateTransactionData type
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

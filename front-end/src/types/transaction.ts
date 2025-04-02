export type TransactionType = 'PAYMENT' | 'DEPOSIT' | 'WITHDRAW' | 'INBOUND_TRANSFER' | 'OUTBOUND_TRANSFER';

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
  isDutchPay?: boolean;
}

export interface TransactionGroup {
  date: string;
  records: TransactionRecord[];
}

export interface GroupedTransactionRecord {
  displayName: string;
  amount: number;
  time: string;
  description: string;
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
  isDutchPay?: boolean;
}

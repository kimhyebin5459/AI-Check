export type TransactionType = 'PAYMENT' | 'DEPOSIT' | 'WITHDRAW' | 'INBOUND_TRANSFER' | 'OUTBOUND_TRANSFER';

export interface TransactionRecord {
  recordId: number;
  firstCategoryName: string;
  secondCategoryName: string;
  isDutchPay: boolean;
  displayName: string;
  type: TransactionType;
  amount: number;
  description: string;
  rating: number;
  time: string;
}

export interface TransactionGroup {
  date: string;
  records: TransactionRecord[];
}

export interface GroupedTransactionRecord {
  dutchPayId: number;
  displayName: string;
  amount: number;
  time: string;
  description: string;
}

export interface TransactionDetail {
  recordId: number;
  firstCategoryName: string;
  secondCategoryName: string;
  isDutchPay: boolean;
  displayName: string;
  type: TransactionType;
  amount: number;
  description: string;
  rating: number;
  createdAt: string;
}

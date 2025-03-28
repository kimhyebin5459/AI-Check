export type TransactionType = 'PAYMENT' | 'DEPOSIT' | 'OUTBOUND_TRANSFER' | 'INBOUND_TRANSFER';

export interface TransactionRecord {
  record_id: number;
  first_category_name: string;
  second_category_name: string;
  is_dutch_pay: boolean;
  display_name: string;
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
  dutch_pay_id: number;
  display_name: string;
  amount: number;
  time: string;
  description: string;
}

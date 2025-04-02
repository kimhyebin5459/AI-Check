export type CategoryName = '교통' | '식비' | '교육' | '여가' | '생활';

export interface secondCategory {
  name: string;
  amount: number;
}

export interface firstCategory {
  name: CategoryName;
  amount: number;
  secondCategory: secondCategory[];
}

export interface peerCategory {
  name: CategoryName;
  amount: number;
  peerAmount: number;
}

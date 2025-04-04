export interface Account {
  accountId: number;
  accountName: string;
  accountNo: string;
  balance?: number;
}

export interface ChildAccount {
  memberId: number;
  image: string;
  name: string;
  balance: number;
  accountNo: string;
  accountName: string;
}

export interface Memo {
  memoCount: number;
  totalCount: number;
}

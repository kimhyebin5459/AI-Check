export type RequestType = 'INCREASE' | 'ONE_TIME';

export type StatusType = 'ACCEPTED' | 'REJECTED' | 'WAITING';

export interface MoneyRequest {
  id: number;
  type: RequestType;
  status: StatusType;
  childId: 1;
  image: string;
  childName: string;
  description: string;
  createdAt: string;
}

export interface TransferRequest extends MoneyRequest {
  amount: number;
}
export interface IncreaseRequest extends MoneyRequest {
  prevAmount: number;
  afterAmount: number;
}

export interface IncreasePostForm {
  reportId: number;
  increaseAmount: number;
  description: string;
}

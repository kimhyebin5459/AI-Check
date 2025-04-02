export type RequestType = 'INCREASE' | 'ONE_TIME';

export type StatusType = 'ACCEPTED' | 'REJECTED' | 'WAITING';

export interface Request {
  id: number;
  type: RequestType;
  status: StatusType;
  childName: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface Request {
  id: number;
  type: '용돈 인상' | '용돈 요청';
  status: 'ACCEPTED' | 'REJECTED' | 'WAITING';
  childName: string;
  amount: number;
  description: string;
  createdAt: string;
}

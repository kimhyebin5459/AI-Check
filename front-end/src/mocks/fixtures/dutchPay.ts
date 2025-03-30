// Dutch Pay 타입 정의
interface DutchPay {
  dutchPayId: number;
  displayName: string;
  amount: number;
  createdAt: string;
}

interface DutchPayResponse {
  recordId: number;
  dutchPays: DutchPay[];
}

interface DutchPay {
  dutchPayId: number;
  displayName: string;
  amount: number;
  createdAt: string;
}

interface DutchPayResponse {
  recordId: number;
  dutchPays: DutchPay[];
}

export const mockDutchPayData: DutchPayResponse[] = [
  {
    recordId: 1002,
    dutchPays: [
      {
        dutchPayId: 20021,
        displayName: '김민준',
        amount: 6250,
        createdAt: '2025-03-01 19:45:00',
      },
    ],
  },
  {
    recordId: 1003,
    dutchPays: [
      {
        dutchPayId: 20031,
        displayName: '박서연',
        amount: 4900,
        createdAt: '2025-03-01 12:40:00',
      },
    ],
  },
  {
    recordId: 1008,
    dutchPays: [
      {
        dutchPayId: 20081,
        displayName: '강도윤',
        amount: 14000,
        createdAt: '2025-03-05 18:45:00',
      },
      {
        dutchPayId: 20082,
        displayName: '조하준',
        amount: 14000,
        createdAt: '2025-03-05 19:10:00',
      },
    ],
  },
  {
    recordId: 1021,
    dutchPays: [
      {
        dutchPayId: 20211,
        displayName: '윤지우',
        amount: 28000,
        createdAt: '2025-03-30 20:15:00',
      },
      {
        dutchPayId: 20212,
        displayName: '장예준',
        amount: 28500,
        createdAt: '2025-03-30 20:30:00',
      },
    ],
  },
];

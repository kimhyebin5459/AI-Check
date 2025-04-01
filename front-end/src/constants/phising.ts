import { Shield, TriangleAlert } from '@/public/icons';

export const PHISHING_ITEM = [
  {
    lines: ['가족에게서', '발견된 위험', '확인하기'],
    image: TriangleAlert,
    color: 'yellow-100',
    to: '/request',
  },
  {
    lines: ['피싱 예방 수칙', '확인하기'],
    image: Shield,
    color: 'gradation1',
    to: '/phishing',
  },
];

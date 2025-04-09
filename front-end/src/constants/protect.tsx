import { Phone, MessageCircle, Users } from 'lucide-react';
import { ReactNode } from 'react';

export interface GuideDetail {
  title: string;
  details: string[];
}

export interface SectionData {
  id: string;
  title: string;
  icon: ReactNode;
  items: GuideDetail[];
}

// 가이드 섹션 최근 업데이트 날짜
export const lastUpdated = '2025년 4월';

export const phishingData: SectionData[] = [
  {
    id: 'section1',
    title: '가족 사칭 보이스피싱 예방하기',
    icon: <Phone size={20} className="text-yellow-600" />,
    items: [
      {
        title: '딥보이스 기술을 이용한 가족 목소리 사칭에 주의하세요',
        details: [
          '자녀나 부모의 목소리로 급한 도움이나 돈을 요구하는 전화가 오면 즉시 의심하세요',
          '"지금 급해서 그러는데..."로 시작하는 가족 전화는 반드시 확인 질문을 하세요',
        ],
      },
      {
        title: '가족만 알 수 있는 비밀 확인 질문을 미리 정해두세요',
        details: [
          '가족 여행지, 애완동물 이름 등 쉽게 알 수 없는 정보로 확인 질문 설정',
          '평소에 가족들과 확인 방법을 공유해두세요',
        ],
      },
      {
        title: '긴급 상황 주장에도 반드시 본인 확인을 하세요',
        details: ['원래 가족의 연락처로 직접 전화해 확인하기', '영상통화로 얼굴 확인하기'],
      },
    ],
  },
  {
    id: 'section2',
    title: '스미싱(SMS+피싱) 대응하기',
    icon: <MessageCircle size={20} className="text-yellow-600" />,
    items: [
      {
        title: '가족을 사칭한 메시지의 URL 절대 클릭하지 마세요',
        details: [
          '"엄마, 이거 봐봐" 등 가족처럼 친근한 메시지 뒤에 첨부된 링크는 위험',
          '특히 단축 URL(bit.ly 등)은 더욱 주의하세요',
        ],
      },
      {
        title: '공식 앱이나 웹사이트만 이용하세요',
        details: [
          '메시지 링크를 통해 앱 설치나 웹사이트 접속하지 말고 공식 스토어에서 직접 설치',
          '금융앱은 반드시 공식 앱스토어에서 다운로드하세요',
        ],
      },
      {
        title: '가족 행세를 하며 개인정보를 요구하는 메시지에 응답하지 마세요',
        details: [
          '가족이라도 문자로 계좌번호, 비밀번호, 인증번호를 요구하면 의심하세요',
          '전화로 직접 확인 후 중요 정보는 안전한 방법으로 공유하세요',
        ],
      },
    ],
  },
  {
    id: 'section3',
    title: '가족 간 안전한 소통 방법',
    icon: <Users size={20} className="text-yellow-600" />,
    items: [
      {
        title: '가족 그룹채팅방을 만들어 공식 소통 창구로 활용하세요',
        details: [
          '급한 연락은 가족 그룹채팅방을 통해 공유하는 원칙 세우기',
          '새로운 연락처로 온 메시지는 그룹채팅방에서 먼저 확인하기',
        ],
      },
      {
        title: '새 전화번호로 연락이 오면 반드시 확인하세요',
        details: [
          '"번호가 바뀌었어"라는 메시지는 항상 의심하고 기존 번호로 확인',
          '직접 통화나 영상통화로 확인 후 연락처 저장하기',
        ],
      },
      {
        title: '주기적으로 가족 간 보안 수칙을 공유하세요',
        details: ['최신 보이스피싱/스미싱 수법 정보 공유하기', '가족 중 디지털 취약계층(어르신 등)에게 자주 알려주기'],
      },
    ],
  },
];

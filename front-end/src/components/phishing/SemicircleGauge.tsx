import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  familyPhishingCount: number;
  averagePhishingCount: number;
}

// 부드러운 감속 이징 함수 (바운스 효과 없음)
const easeOutQuad = (x: number): number => {
  return 1 - (1 - x) * (1 - x);
};

// 극좌표를 데카르트 좌표로 변환
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// SVG 경로 생성 함수
const createArcPath = (centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
};

// 상태 텍스트 계산 함수
const getStatusText = (position: number) => {
  if (position < 30) return { text: '안전', color: 'text-green-600', bgColor: 'bg-green-50' };
  if (position < 60) return { text: '보통', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  if (position < 80) return { text: '주의', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  return { text: '위험', color: 'text-red-600', bgColor: 'bg-red-50' };
};

const PhishingRiskGauge = ({ familyPhishingCount, averagePhishingCount }: Props) => {
  // 실제 목표 위치
  const [targetPosition, setTargetPosition] = useState(50);
  // 애니메이션용 현재 위치
  const [needlePosition, setNeedlePosition] = useState(0); // 시작점은 0 (가장 왼쪽)
  // 애니메이션 상태 추적
  const animationRef = useRef<number | null>(null);
  // 애니메이션 시작 시간
  const startTimeRef = useRef<number | null>(null);
  // 애니메이션 완료 여부
  const animationCompleteRef = useRef(false);

  // 게이지 설정 상수
  const viewBoxSize = 300;
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  const outerRadius = 130;
  const innerRadius = 110;
  const startAngle = -84; // 정확히 위쪽 (12시 방향)
  const endAngle = 84; // 정확히 아래쪽 (6시 방향)
  const angleRange = endAngle - startAngle; // 각도 범위 (전체 168도)

  // 애니메이션 함수를 useCallback으로 메모이제이션
  const animateNeedle = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      // 애니메이션 경과 시간
      const elapsedTime = timestamp - startTimeRef.current;
      const duration = 1300; // 애니메이션 지속 시간 (ms)

      // 애니메이션 진행률 계산 (0~1)
      const progress = Math.min(elapsedTime / duration, 1);

      // 이징 함수 적용 (부드러운 가속/감속)
      const easeProgress = easeOutQuad(progress);

      // 현재 위치 계산
      const currentPosition = easeProgress * targetPosition;
      setNeedlePosition(currentPosition);

      // 애니메이션 계속 진행 여부 결정
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateNeedle);
      } else {
        animationCompleteRef.current = true;
      }
    },
    [targetPosition]
  );

  // 실제 목표 위치 계산 및 애니메이션 시작
  useEffect(() => {
    // 표준 정규 분포 기반 계산
    const stdDev = 2;
    const zScore = (familyPhishingCount - averagePhishingCount) / stdDev;
    const position = Math.min(Math.max(((zScore + 3) / 6) * 100, 0), 100);
    setTargetPosition(position);

    // 애니메이션 초기화
    animationCompleteRef.current = false;
    startTimeRef.current = null;

    // 이전 애니메이션 정리
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // 시작 위치 설정 (0으로 리셋)
    setNeedlePosition(0);

    // 새 애니메이션 시작
    animationRef.current = requestAnimationFrame(animateNeedle);

    // 클린업 함수
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [familyPhishingCount, averagePhishingCount, animateNeedle]);

  // needlePosition(0-100)에 따른 포인터 각도 계산
  const pointerAngle = startAngle + (needlePosition / 100) * angleRange;

  // 포인터 위치 계산
  const pointerCoords = polarToCartesian(centerX, centerY, outerRadius - 15, pointerAngle);

  // 상태 텍스트 계산 (애니메이션 중에는 실제 목표값 기준으로 텍스트 표시)
  const status = getStatusText(animationCompleteRef.current ? needlePosition : targetPosition);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* 상태 텍스트 박스 - 게이지 위에 절대 위치로 배치 */}
        <div
          className={`absolute bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-lg ${status.bgColor} px-6 py-2 text-xl font-bold ${status.color}`}
          style={{ width: 'auto', minWidth: '120px', textAlign: 'center' }}
        >
          {status.text}입니다
        </div>

        <svg viewBox={`0 -30 ${viewBoxSize} ${viewBoxSize}`} width="300" height="300">
          <defs>
            {/* 그라데이션 정의 */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9fe659" />
              <stop offset="25%" stopColor="#d9e84a" />
              <stop offset="50%" stopColor="#f8d836" />
              <stop offset="75%" stopColor="#f6a338" />
              <stop offset="100%" stopColor="#e84c3d" />
            </linearGradient>

            {/* 클리핑 패스 정의 */}
            <clipPath id="halfCircleClip">
              <rect x="0" y="0" width={viewBoxSize} height={centerY} />
            </clipPath>

            {/* 부드러운 그림자 효과를 위한 필터 정의 */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              {/* 원하는 그림자 색상 지정 */}
              <feFlood floodColor="#A9BCF5" floodOpacity="0.3" result="colored-shadow" />
              <feComposite in="colored-shadow" in2="SourceAlpha" operator="in" result="colored-shadow-shape" />
              <feGaussianBlur in="colored-shadow-shape" stdDeviation="2" result="blur" />
              <feOffset in="blur" dx="0" dy="-4" result="offsetBlur" />
              <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 레이어 1: 바깥쪽 게이지 호 */}
          <path
            d={createArcPath(centerX, centerY, outerRadius, startAngle, endAngle)}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* 레이어 2: 포인터 (삼각형) - 바깥쪽으로 뾰족하게 */}
          <polygon
            points={`${pointerCoords.x},${pointerCoords.y} 
                    ${pointerCoords.x + 16},${pointerCoords.y - 9} 
                    ${pointerCoords.x + 16},${pointerCoords.y + 9}`}
            fill="#e84c3d"
            transform={`rotate(${pointerAngle + 90}, ${pointerCoords.x}, ${pointerCoords.y})`}
          />

          {/* 레이어 3: 안쪽 큰 흰색 반원형 배경 */}
          <path
            d={createArcPath(centerX, centerY, innerRadius - 10, startAngle, endAngle)}
            fill="white"
            stroke="none"
            filter="url(#softShadow)"
          />

          {/* 반원 하단을 닫는 직선 */}
          <line
            x1={centerX - (innerRadius - 10)}
            y1={centerY}
            x2={centerX + (innerRadius - 10)}
            y2={centerY}
            stroke="white"
            strokeWidth="1"
            fill="none"
          />

          {/* 레이어 4: 피싱 카운트 표시 */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fontSize="48"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            {familyPhishingCount}
            <tspan fontSize="24" dy="-2">
              건/
            </tspan>
            <tspan className="font-thin" fontSize={14}>
              {averagePhishingCount}건(평균)
            </tspan>
          </text>
        </svg>
      </div>
    </div>
  );
};

export default PhishingRiskGauge;

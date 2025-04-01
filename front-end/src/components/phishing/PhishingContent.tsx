'use client';

import { useState, useEffect } from 'react';
import NavButton from '@/components/main/NavButton';
import SemicircleGauge from '@/components/phishing/SemicircleGauge';
import { PHISHING_ITEM } from '@/constants/phising';

interface PhisingStats {
  totalCountAverage: number;
  urlCount: number;
  voiceCount: number;
  familyCount: number;
}

interface PhisingAlert {
  id: number;
  displayName: string;
  type: string;
  url: string | null;
  phoneNumber: string | null;
  score: number;
  createdAt: string;
}

export default function PhishingContent() {
  const [stats, setStats] = useState<PhisingStats | null>(null);
  const [alerts, setAlerts] = useState<PhisingAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock 토큰 (실제 환경에서는 인증 상태에서 가져와야 함)
        const accessToken = 'mock-jwt-token';

        // 통계 데이터 가져오기 - MSW에서 가로챔
        const statsResponse = await fetch('aicheck/phishings', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!statsResponse.ok) {
          throw new Error('통계 데이터를 불러오는데 실패했습니다.');
        }

        const statsData = await statsResponse.json();
        setStats(statsData);

        const alertsResponse = await fetch('aicheck/phishings/family', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!alertsResponse.ok) {
          throw new Error('알림 데이터를 불러오는데 실패했습니다.');
        }

        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 오류가 발생했습니다.');
        console.error('Error fetching phishing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-lg">데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-md">
        <div className="w-full">
          <div className="w-full text-left">
            <h2 className="mb-2 text-xl font-bold">
              우리 가족 <span className="text-amber-500">👨‍👩‍👧‍👦</span>
            </h2>
            <span className="mb-6 text-3xl font-bold">피싱 위험</span>
            <span className="text-2xl"> 지수는</span>
          </div>

          <div className="flex w-full justify-center">
            {stats && (
              <SemicircleGauge averagePhishingCount={stats.totalCountAverage} familyPhishingCount={stats.familyCount} />
            )}
          </div>

          <div className="w-full space-y-3 text-xl">
            <div className="flex items-end justify-between">
              <p className="text-slate-700">내가 받은 피싱 전화 :</p>
              <p className="font-semibold">
                <span className="text-2xl font-bold text-blue-600">{stats?.voiceCount || 0}건</span>
              </p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-slate-700">내가 받은 피싱 문자 :</p>
              <p className="font-semibold">
                <span className="text-2xl font-bold text-blue-600">{stats?.urlCount || 0}건</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-row gap-4">
        <NavButton {...PHISHING_ITEM[0]} caseCnt={stats?.familyCount || 0}></NavButton>
        <NavButton {...PHISHING_ITEM[1]}></NavButton>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import NavButton from '@/components/main/NavButton';
import SemicircleGauge from '@/components/phishing/SemicircleGauge';
import { PHISHING_ITEM } from '@/constants/phising';
import { PhishingStats } from '@/types/phishing';
import { getPhishing } from '@/apis/phishing';

export default function PhishingContent() {
  const [stats, setStats] = useState<PhishingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsData = await getPhishing();
        setStats(statsData);
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

      <div className="flex flex-1 flex-row gap-5">
        <NavButton {...PHISHING_ITEM[0]} caseCnt={stats?.familyCount || 0}></NavButton>
        <NavButton {...PHISHING_ITEM[1]}></NavButton>
      </div>
    </>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import PhishingCard from '@/components/phishing/PhishingCard';

interface PhisingAlert {
  id: number;
  displayName: string;
  type: string;
  url: string | null;
  phoneNumber: string | null;
  score: number;
  createdAt: string;
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PhisingAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const accessToken = 'mock-jwt-token';

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
    <div className="container bg-gray-50">
      <Header hasBackButton hasBorder={false} title="우리 가족 피싱 알림" />
      <div className="w-full space-y-2 overflow-y-auto p-5">
        {alerts.map((alert) => (
          <PhishingCard key={alert.id + alert.type} {...alert} />
        ))}
      </div>
    </div>
  );
}

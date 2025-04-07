'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import PhishingCard from '@/components/phishing/PhishingCard';
import { PhishingAlert } from '@/types/phishing';
import { getPhishingAlerts } from '@/apis/phishing';

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PhishingAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const alertsData = await getPhishingAlerts();

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

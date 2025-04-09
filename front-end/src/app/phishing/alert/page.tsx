'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import PhishingCard from '@/components/phishing/PhishingCard';
import { PhishingAlert } from '@/types/phishing';
import { getPhishingAlerts } from '@/apis/phishing';
import Spinner from '@/components/common/Spinner';

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<PhishingAlert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const alertsData = await getPhishingAlerts();
        setAlerts(alertsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 오류가 발생했습니다.');
        console.error('Error fetching phishing data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container bg-gray-50">
      <Header hasBackButton hasBorder={false} title="우리 가족 피싱 알림" />
      <div className="h-full w-full space-y-2 overflow-y-auto p-5">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert) => <PhishingCard key={alert.id + alert.type} {...alert} />)
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-lg p-4">
            <p className="text-center text-gray-500">아직 감지된 위험이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

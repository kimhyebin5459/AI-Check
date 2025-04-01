'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/common/Header';
import DifficultySettings from '@/components/mother-ai/DifficultySettings';
import MotherAIClient from '@/components/mother-ai/MotherAIClient';
import { DifficultyProvider } from '@/contexts/DifficultyContext';

interface PageProps {
  params: Promise<{ childId: string }>;
}

export default function CustomizePage({ params }: PageProps) {
  const [childId, setChildId] = useState<string>('');

  useEffect(() => {
    // Resolve the promise in useEffect
    const fetchChildId = async () => {
      const resolvedParams = await params;
      setChildId(resolvedParams.childId);
    };

    fetchChildId();
  }, [params]);

  // Only render the full component when childId is available
  if (!childId) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="h-full">
      <div className="container">
        <Header title="엄마 AI 설정" hasBackButton />
        <main className="scrollbar-hide w-full overflow-y-auto p-5">
          <DifficultyProvider childId={childId}>
            <MotherAIClient childId={childId}>
              <DifficultySettings />
            </MotherAIClient>
          </DifficultyProvider>
        </main>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import Header from '@/components/common/Header';
import DifficultySettings from '@/components/mother-ai/DifficultySettings';
import MotherAIClient from '@/components/mother-ai/MotherAIClient';
import { useDifficultyStore } from '@/stores/useDifficultyStore';

interface Props {
  params: Promise<{ childId: string }>;
}

export default function CustomizePage({ params }: Props) {
  const { setChildId, fetchDifficultySettings, loading } = useDifficultyStore();

  useEffect(() => {
    const initializeChildId = async () => {
      const resolvedParams = await params;
      setChildId(resolvedParams.childId);
      fetchDifficultySettings();
    };

    initializeChildId();
  }, [params, setChildId, fetchDifficultySettings]);

  return (
    <div className="h-full">
      <div className="container h-full">
        <Header title="엄마 AI 설정" hasBackButton />
        <main className="scrollbar-hide h-full w-full overflow-y-auto p-5">
          {loading && !useDifficultyStore.getState().difficultyData ? (
            <div>Loading...</div>
          ) : (
            <MotherAIClient>
              <DifficultySettings />
            </MotherAIClient>
          )}
        </main>
      </div>
    </div>
  );
}

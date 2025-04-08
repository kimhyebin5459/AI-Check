'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
  initialRating: number | null;
}

export default function RatingModal({ isOpen, onClose, onSubmit, initialRating }: Props) {
  const [selectedRating, setSelectedRating] = useState<number | null>(initialRating || null);

  useEffect(() => {
    setSelectedRating(initialRating);
  }, [initialRating]);

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (selectedRating) onSubmit(selectedRating);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center" title="거래 평가하기">
      <div className="w-full space-y-6">
        <p className="text-center text-base">이 거래에 대해 어떻게 평가하시나요?</p>

        <div className="flex justify-center space-x-6">
          <div
            className={`flex cursor-pointer flex-col items-center transition-transform ${selectedRating === 1 ? 'scale-110' : ''}`}
            onClick={() => handleRatingSelect(1)}
          >
            <div
              className={`flex aspect-square w-13 items-center justify-center rounded-full text-5xl transition-all ${selectedRating === 1 ? 'shadow-[0_0_15px_rgba(255,193,7,1)]' : ''}`}
            >
              <p>😢</p>
            </div>
            <span className="text-sm">아쉬워요</span>
          </div>

          <div
            className={`flex cursor-pointer flex-col items-center transition-transform ${selectedRating === 2 ? 'scale-110' : ''}`}
            onClick={() => handleRatingSelect(2)}
          >
            <div
              className={`flex aspect-square w-13 items-center justify-center rounded-full text-5xl transition-all ${selectedRating === 2 ? 'shadow-[0_0_15px_rgba(255,193,7,1)]' : ''}`}
            >
              <p>😊</p>
            </div>
            <span className="text-sm">좋아요</span>
          </div>

          <div
            className={`flex cursor-pointer flex-col items-center transition-transform ${selectedRating === 3 ? 'scale-110' : ''}`}
            onClick={() => handleRatingSelect(3)}
          >
            <div
              className={`flex aspect-square w-13 items-center justify-center rounded-full text-5xl transition-all ${selectedRating === 3 ? 'shadow-[0_0_15px_rgba(255,193,7,1)]' : ''}`}
            >
              <p>😍</p>
            </div>
            <span className="text-sm">최고예요</span>
          </div>
        </div>

        <Button onClick={handleSubmit} isDisabled={selectedRating === null}>
          평가 완료
        </Button>
      </div>
    </Modal>
  );
}

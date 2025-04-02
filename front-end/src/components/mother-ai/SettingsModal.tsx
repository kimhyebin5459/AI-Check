'use client';

import React from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} position="center" title="엄마 AI 설득 난이도 설정">
      <div className="w-full">
        <p className="mb-4 font-semibold text-gray-900">
          엄마 AI의 난이도를 설정할 수 있어요.
          <br />
          난이도 별 설득 성공 예시를 보여 드릴게요.
        </p>

        <div className="mb-4 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">쉬움</h3>
            <p className="text-sm text-gray-700">&quot;배가 고파서 떡볶이를 먹고 싶어요. 3500원이 필요해요.&quot;</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">중간</h3>
            <p className="text-sm text-gray-700">
              &quot;배가 고파서 떡볶이를 먹고 싶어요. 이따 학원도 가야 하는데, 배가 고파서 집중이 되지 않을 것 같아요.
              3500원이 필요해요.&quot;
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">어려움</h3>
            <p className="text-sm text-gray-700">
              &quot;배가 고파서 떡볶이를 먹고 싶어요. 이따 학원도 가야 하는데, 배가 고파서 집중이 되지 않을 것 같아요.
              이번 달에 용돈이 많이 나가서 돈이 남지 않았어요. 3500원이 필요해요.&quot;
            </p>
          </div>
        </div>

        <p className="mb-4 text-base text-gray-700">
          이렇듯 설득에 필요한 근거와 증거를 얼마나 잘 제시해야 하는지 설정할 수 있어요. 하지만 AI는 완벽하지 않으니,
          <span className="font-semibold text-gray-900"> 반드시 설득 내용을 확인해주세요!</span>
        </p>

        <Button onClick={onClose}>닫기</Button>
      </div>
    </Modal>
  );
}

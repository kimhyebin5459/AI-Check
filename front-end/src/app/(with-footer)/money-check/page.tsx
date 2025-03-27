'use client';

import React, { useState } from 'react';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Link from 'next/link';
import { ChartButton, CalendarButton, Bank } from '@/public/icons';

export default function Page() {
  const [currentBalance, setCurrentBalance] = useState(230560);
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      date: '3.21',
      time: '15:12',
      type: '푸르파파역삼언주로',
      amount: -9800,
      memo: '여기는 메모입니다.',
      emoji: '😭'
    },
    {
      id: 2,
      date: '3.21',
      time: '15:12',
      type: '결제처',
      amount: -3000,
      memo: '여기는 메모입니다.',
      emoji: '😊'
    },
    {
      id: 3,
      date: '3.20',
      time: '15:12',
      type: '결제처',
      amount: -3000,
      memo: '여기는 메모입니다.',
      emoji: '😍'
    }
  ]);

  return (
    <div className="flex flex-col h-screen">
      <Header title="용돈 기록장" />

      <main className="bg-white pb-16 mx-5">
        <div>
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <span className="font-medium">김○○ 님</span>
              <span className="ml-1">&gt;</span>
            </div>
            <div className="flex space-x-2">
              <ChartButton />
              <CalendarButton />
            </div>
          </div>
        </div>

        {/* 계좌 카드 */}
        <div className="mx-4 my-4 bg-white rounded-lg shadow">
          <div className="p-4 bg-yellow-400 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span>⊗</span>
              </div>
              <span className="text-sm">씨피뱅크 입출금 통장</span>
            </div>
            <div className="py-2">
              <div className="text-2xl font-bold">
                {currentBalance.toLocaleString()}원
              </div>
            </div>
          </div>
          <div className="p-2 bg-white rounded-b-lg">
            <Button
              variant="primary"
              className="w-full py-2 bg-yellow-400 text-black rounded-md"
            >
              송금
            </Button>
          </div>
        </div>

        {/* 거래 내역 필터 */}
        <div className="mx-4 bg-white rounded-lg shadow">
          <div className="px-4 py-3 flex justify-between items-center border-b">
            <div>
              <span className="font-medium">한달 | 전체 ▼</span>
            </div>
            <div>
              <span className="text-sm">최근순 | 전체 ▼</span>
            </div>
          </div>

          {/* 거래 내역 목록 */}
          <div className="divide-y">
            {recentTransactions.map((transaction) => (
              <Link key={transaction.id} href={`/money-check/detail?id=${transaction.id}`}>
                <div className="px-4 py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-600">{transaction.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                      <span>🚌</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{transaction.type}</div>
                      <div className="text-xs text-gray-500">
                        {transaction.time} | 소분류
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-red-500">
                        {transaction.amount.toLocaleString()}원
                      </div>
                      <div className="text-xs">{transaction.emoji}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
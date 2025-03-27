'use client';

import React from 'react';
import Link from 'next/link';

import { TransactionType, TransactionRecord } from '@/types/money-check/transaction';
import { Bus, Tableware, Study, Enjoy, Living } from '@/public/icons';

import Image from 'next/image';

export default function GroupedTransactionCard({
    record_id,
    first_category_name,
    second_category_name,
    is_dutch_pay,
    display_name,
    type,
    amount,
    description,
    rating,
    time
}: TransactionRecord) {
    const getAmountDisplay = (type: TransactionType, amount: number): number => {
        if (type === 'DEPOSIT' || type === 'INBOUND_TRANSFER') {
            return +Math.abs(amount); // 항상 음수로 표시
        } else {
            return -Math.abs(amount); // 항상 양수로 표시
        }
    };

    const displayAmount = getAmountDisplay(type, amount);

    const getCategoryIcon = (category: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            '교통비': Bus,
            '식비': Tableware,
            '교육비': Study,
            '여가비': Enjoy,
            '생활비': Living,
        };

        return iconMap[category] || null;
    };

    const categoryIcon = getCategoryIcon(first_category_name);
    const ratingEmoji = (rating: number) => {
        switch (rating) {
            case 1:
                return '😢';
            case 2:
                return '😊';
            case 3:
                return '😍'
            default:
                return '';
        }
    }

    return (
        <Link href={`/money-check/detail?id=${record_id}`}>
            <div className="px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center">
                    <div className='flex flex-col h-16'>
                        <div className="w-6 h-6 rounded-md flex items-center justify-center mr-3 mb-auto">
                            {categoryIcon && <Image src={categoryIcon as string} alt={first_category_name} width={24} height={24} />}
                        </div>
                        <div className="w-6 h-6 rounded-md flex items-center justify-center mr-3">
                            {categoryIcon && <Image src={categoryIcon as string} alt={first_category_name} width={24} height={24} />}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="font-medium">{display_name}</div>
                        <div className="text-xs">
                            {time} | {second_category_name}
                        </div>
                        <div className='font-light text-gray-500'>{description}</div>
                    </div>
                    <div className="text-right">
                        <div className={`font-medium ${displayAmount < 0 ? 'text-red-500' : 'text-blue-500'}`}>
                            {displayAmount < 0 ? '-' : '+'}{Math.abs(displayAmount).toLocaleString()}원
                        </div>
                        <div className="text-xs">{ratingEmoji(rating)}</div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
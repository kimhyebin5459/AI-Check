import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
}

export default function AlertBanner({ message }: Props) {
  return (
    <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-100 p-4">
      <div className="flex items-center">
        <AlertTriangle size={24} className="mr-3 flex-shrink-0 text-yellow-600" />
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}

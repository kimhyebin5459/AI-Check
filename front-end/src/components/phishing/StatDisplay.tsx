'use client';

interface PhisingStats {
  totalCountAverage: number;
  urlCount: number;
  voiceCount: number;
  familyCount: number;
}

interface StatDisplayProps {
  stats: PhisingStats;
}

export default function StatDisplay({ stats }: StatDisplayProps) {
  return (
    <div className="w-full space-y-3 text-xl">
      <div className="flex items-end justify-between">
        <p className="text-slate-700">내가 받은 피싱 전화 :</p>
        <p className="font-semibold">
          <span className="text-2xl font-bold text-blue-600">{stats.voiceCount || 0}건</span>
        </p>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-slate-700">내가 받은 피싱 문자 :</p>
        <p className="font-semibold">
          <span className="text-2xl font-bold text-blue-600">{stats.urlCount || 0}건</span>
        </p>
      </div>
    </div>
  );
}

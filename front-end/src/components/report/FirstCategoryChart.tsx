import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { firstCategory } from '@/types/report';
import { formatMoney } from '@/utils/formatMoney';

Chart.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        font: {
          size: 16,
          family: 'Pretendard',
          weight: 600,
        },
        color: '#8A91A1',
        padding: 18,
        usePointStyle: true,
        pointStyle: 'rectRounded',
      },
    },
  },
  cutout: '65%',
};

interface Props {
  reportData: firstCategory[];
  totalAmount: number;
}

export default function FirstCategoryChart({ reportData, totalAmount }: Props) {
  const chartData = {
    labels: reportData.map((category) => category.name),
    datasets: [
      {
        data: reportData.map((category) => category.amount),
        backgroundColor: ['#235DD8', '#3BA2EB', '#2CC9D5', '#79DD88', '#C2E996'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="relative flex w-70 items-center justify-center">
      <Doughnut data={chartData} options={chartOptions} />
      <div className="absolute left-0 w-50 text-center">
        <p className="text-xl font-bold">{formatMoney(totalAmount)}</p>
      </div>
    </div>
  );
}

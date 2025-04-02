import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { secondCategory } from '@/types/report';
import { formatMoney } from '@/utils/formatMoney';

Chart.register(ArcElement, Tooltip, Legend);

const chartOptions = {
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: '65%',
};

interface Props {
  reportData: secondCategory[];
  amount: number;
}

export default function SecondCategoryChart({ reportData, amount }: Props) {
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
    <div className="relative flex w-44 items-center justify-center">
      <Doughnut data={chartData} options={chartOptions} />
      <div className="absolute">
        <p className="text-lg font-bold tracking-tight">{formatMoney(amount)}</p>
      </div>
    </div>
  );
}

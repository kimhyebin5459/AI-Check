import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js';
import { peerCategory } from '@/types/report';

Chart.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const options = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        font: {
          family: 'Pretendard',
          weight: 700,
        },
        color: '#000000',
        padding: 10,
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
  },
  scales: {
    x: {
      stacked: false,
      grid: { display: false },
      border: { display: false },
      ticks: {
        font: {
          size: 14,
          family: 'Pretendard',
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: { display: false },
      grid: { display: false },
      border: { display: false },
    },
  },
};

interface Props {
  name: string;
  reportData: peerCategory[];
}

export default function PeerChart({ name, reportData }: Props) {
  const data = {
    labels: reportData.map((category) => category.name),
    datasets: [
      {
        label: '또래',
        data: reportData.map((category) => category.peerAmount),
        backgroundColor: '#DFE2E6',
        borderRadius: 10,
      },
      {
        label: `${name} 님`,
        data: reportData.map((category) => category.amount),
        backgroundColor: '#FEC400',
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="h-52 max-w-70">
      <Bar data={data} options={options} />
    </div>
  );
}

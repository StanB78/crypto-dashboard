import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function MarketCapChart({ coins }) {
    if (!coins || coins.length === 0) return <p style={{ textAlign: 'center' }}>Loading chart...</p>;

    const topCoins = coins
        .sort((a, b) => b.TOTAL_MKT_CAP_USD - a.TOTAL_MKT_CAP_USD)
        .slice(0, 5);

    const data = {
        labels: topCoins.map(c => c.NAME),
        datasets: [
            {
                label: 'Market Cap USD',
                data: topCoins.map(c => parseFloat(c.TOTAL_MKT_CAP_USD)),
                backgroundColor: [
                    '#ff6384',
                    '#36a2eb',
                    '#ffcd56',
                    '#4bc0c0',
                    '#9966ff'
                ],
                borderWidth: 1,
            }
        ]
    };

    return <Doughnut data={data} />;
}

export default MarketCapChart;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import "./index.css";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function CoinPage() {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [error, setError] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);

    useEffect(() => {
        fetch("https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100")
            .then(res => res.json())
            .then(data => {
                const found = data?.Data?.LIST?.find(c => c.ID === parseInt(id));
                setCoin(found);
            })
            .catch(() => {
                console.error("Error fetching coin data:");
                setError("Failed to load coin data.");
            });
    }, [id]);

    if (error) return <p className="error-text">{error}</p>;
    if (!coin) return <p className="center-text">Loading...</p>;

    const getChartData = () => ({
        labels: historicalData.labels,
        datasets: [
            {
                label: `${coin.NAME} Price (USD) in 24 Hours`,
                data: historicalData.priceData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${coin.NAME} 24-Hour Price Change`,
            },
        },
    };

    return (
        <div className="coin-container">
            <h1 className="coin-title">{coin.NAME}</h1>
            <p><strong>💸 Price (USD):</strong> ${parseFloat(coin.PRICE_USD).toFixed(2)}</p>
            <p><strong>🏦 Market Cap:</strong> ${parseFloat(coin.TOTAL_MKT_CAP_USD).toLocaleString()}</p>
            <p><strong>📦 Supply:</strong> ${parseFloat(coin.SUPPLY_TOTAL).toLocaleString()}</p>
            <p><strong>📈 24h Change:</strong> {parseFloat(coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD).toFixed(2)}%</p>

            <div className="chart-container">
                {historicalData.priceData?.length > 0 ? (
                    <Line options={options} data={getChartData()} />
                ) : (
                    <p>Dit ding werkt weer niet...</p>
                )}
            </div>

            <div className="nav-links">
                <Link to="/">← Back to Home</Link>
                <Link to="/favorites">← Back to Favorites</Link>
            </div>
        </div>
    );
}

export default CoinPage;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary Chart.js components
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
        // Fetching the coin details
        fetch("https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100")
            .then(res => res.json())
            .then(data => {
                const found = data?.Data?.LIST?.find(c => c.ID === parseInt(id));
                setCoin(found);
            })
            .catch(err => {
                console.error("Error fetching coin data:");
                setError("Failed to load coin data.");
            });
    }, [id]);

    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    if (!coin) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    // Chart data structure
    const getChartData = () => {
        return {
            labels: historicalData.labels,
            datasets: [
                {
                    label: `${coin.NAME} Price (USD) in 24 Hours`,
                    data: historicalData.priceData,
                    borderColor: 'rgba(75, 192, 192, 1)', // Line color
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
                    fill: true, // Fill area under the line
                },
            ],
        };
    };

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
        <div style={{
            maxWidth: "600px",
            margin: "50px auto",
            padding: "30px",
            borderRadius: "16px",
            background: "#1e1e2f",
            color: "#f5f5f5",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
        }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px", fontSize: "2rem" }}>{coin.NAME}</h1>
            <p><strong>💸 Price (USD):</strong> ${parseFloat(coin.PRICE_USD).toFixed(2)}</p>
            <p><strong>🏦 Market Cap:</strong> ${parseFloat(coin.TOTAL_MKT_CAP_USD).toLocaleString()}</p>
            <p><strong>📦 Supply:</strong> ${parseFloat(coin.SUPPLY_TOTAL).toLocaleString()}</p>
            <p><strong>📈 24h Change:</strong> {parseFloat(coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD).toFixed(2)}%</p>

            {/* Chart Section */}
            <div style={{ marginTop: "30px" }}>
                {historicalData.priceData.length > 0 ? (
                    <Line options={options} data={getChartData()} />
                ) : (
                    <p>Dit kut ding werkt niet...</p>
                )}
            </div>

            {/* Links */}
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between" }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: '#ff4d4f',
                    fontWeight: 'bold'
                }}>← Back to Home</Link>
                <Link to="/favorites" style={{
                    textDecoration: 'none',
                    color: '#ff4d4f',
                    fontWeight: 'bold'
                }}>← Back to Favorites</Link>
            </div>
        </div>
    );
}

export default CoinPage;

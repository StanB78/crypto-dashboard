import { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

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

function LineChart() {
    const [cryptos, setCryptos] = useState(null); // State for storing cryptocurrency data
    const [historicalData, setHistoricalData] = useState({}); // State for storing historical data for each crypto

    // Fetch cryptocurrency data
    useEffect(() => {
        fetch('https://api.coincap.io/v2/assets') // New API call for assets list
            .then((response) => response.json())
            .then((jsonResponse) => {
                setCryptos(jsonResponse.data); // Update the state with cryptocurrency data
                jsonResponse.data.forEach(crypto => {
                    // Fetch historical data for each crypto (example for the last 30 days)
                    fetch(`https://api.coincap.io/v2/assets/${crypto.id}/history?interval=d1`) // Adjust API for historical data
                        .then(res => res.json())
                        .then(data => {
                            setHistoricalData(prevData => ({
                                ...prevData,
                                [crypto.id]: data.data // Storing historical data for each crypto
                            }));
                        })
                        .catch((error) => console.error('Error fetching historical data:', error));
                });
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Generate chart data for each cryptocurrency based on historical data
    const getChartData = (crypto) => {
        const dataPoints = historicalData[crypto.id] ? historicalData[crypto.id].map(item => parseFloat(item.priceUsd)) : [];
        const labels = historicalData[crypto.id] ? historicalData[crypto.id].map(item => new Date(item.timestamp).toLocaleDateString()) : [];

        return {
            labels: labels,
            datasets: [
                {
                    label: `${crypto.name} Price (USD)`,
                    data: dataPoints,
                    borderColor: 'rgba(75, 192, 192, 1)', // Line color
                    backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fill color
                    fill: true, // Fill area under the line
                },
            ],
        };
    };

    // Chart options
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cryptocurrency Price Over Time',
            },
        },
    };

    return (
        <div>
            {/* Render a line chart for each cryptocurrency */}
            {cryptos ? (
                cryptos.map((crypto) => (
                    <div key={crypto.id} style={{ marginBottom: '20px' }}>
                        <h2>{crypto.name} ({crypto.symbol})</h2>
                        {historicalData[crypto.id] ? (
                            <Line options={options} data={getChartData(crypto)} />
                        ) : (
                            <p>Loading historical data...</p>
                        )}
                    </div>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default LineChart;

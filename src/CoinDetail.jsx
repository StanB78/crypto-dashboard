import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MarketCapChart from "./MarketCapChart";
import "./index.css";

function CoinPage() {
    const { id } = useParams();
    const [coins, setCoins] = useState([]);
    const [coin, setCoin] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100")
            .then(res => res.json())
            .then(data => {
                const list = data?.Data?.LIST || [];
                setCoins(list);
                const selectedCoin = list.find(c => c.ID === parseInt(id));
                setCoin(selectedCoin);
            })
            .catch(err => {
                console.error("Error fetching coin data:", err);
                setError("Failed to load coin data.");
            });
    }, [id]);

    if (error) return <p className="error-text">{error}</p>;
    if (!coin) return <p className="center-text">Loading...</p>;

    return (
        <div className="coin-container">
            <h1 className="coin-title">{coin.NAME}</h1>
            <p><strong>💸 Price (USD):</strong> ${parseFloat(coin.PRICE_USD).toFixed(2)}</p>
            <p><strong>🏦 Market Cap:</strong> ${parseFloat(coin.TOTAL_MKT_CAP_USD).toLocaleString()}</p>
            <p><strong>📦 Supply:</strong> {parseFloat(coin.SUPPLY_TOTAL).toLocaleString()}</p>
            <p><strong>📈 24h Change:</strong> {parseFloat(coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD).toFixed(2)}%</p>

            <div className="chart-container">
                <MarketCapChart coins={coins} />
            </div>

            <div className="nav-links">
                <Link to="/">← Back to Home</Link>
                <Link to="/favorites">← Back to Favorites</Link>
            </div>
        </div>
    );
}

export default CoinPage;

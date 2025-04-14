import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import MarketCapChart from "./MarketCapChart";


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

    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    if (!coin) return <p style={{ textAlign: 'center' }}>Loading...</p>;

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
            <p><strong>📦 Supply:</strong> {parseFloat(coin.SUPPLY_TOTAL).toLocaleString()}</p>
            <p><strong>📈 24h Change:</strong> {parseFloat(coin.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD).toFixed(2)}%</p>

            <div style={{ marginTop: "30px" }}>
                <MarketCapChart coins={coins} />
            </div>

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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Favorites = () => {
    const [favorites, setFavorites] = useState({});
    const [coins, setCoins] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("favorites")) || {};
        setFavorites(stored);

        fetch('https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100')
            .then(response => response.json())
            .then(data => {
                const allCoins = data.Data.LIST;
                const favoriteCoins = allCoins.filter(coin => stored[coin.ID]);
                setCoins(favoriteCoins);
            })
            .catch(err => console.error("Error fetching favorites:", err));
    }, []);

    if (coins.length === 0) {
        return <p style={{ padding: "20px", textAlign: "center", fontSize: "1.1rem", color: "#888" }}>No favorites selected.</p>;
    }

    return (
        <div style={{
            maxWidth: "700px",
            margin: "50px auto",
            padding: "30px",
            borderRadius: "16px",
            background: "#1e1e2f",
            color: "#f5f5f5",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
        }}>
            <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>Your Favorite Cryptos</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {coins.map(coin => (
                    <li key={coin.ID} style={{
                        marginBottom: "15px",
                        background: "#2e2e3f",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        transition: "transform 0.2s",
                        cursor: "pointer"
                    }}>
                        <Link to={`/coin/${coin.ID}`} style={{
                            textDecoration: 'none',
                            color: '#61dafb',
                            fontWeight: 'bold',
                            display: 'block'
                        }}>
                            {coin.NAME} — ${parseFloat(coin.PRICE_USD).toFixed(2)}
                        </Link>
                    </li>
                ))}
            </ul>
            <div style={{ marginTop: "30px", textAlign: "center" }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: '#ff4d4f',
                    fontWeight: 'bold'
                }}>← Back to Home</Link>
            </div>
        </div>
    );
};

export default Favorites;

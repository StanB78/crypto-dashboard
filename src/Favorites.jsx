import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

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
        return <p className="no-favorites-text">No favorites selected.</p>;
    }

    return (
        <div className="favorites-container">
            <h1 className="favorites-title">Your Favorite Cryptos</h1>
            <ul className="favorites-list">
                {coins.map(coin => (
                    <li key={coin.ID} className="favorite-item">
                        <Link to={`/coin/${coin.ID}`} className="favorite-link">
                            {coin.NAME} — ${parseFloat(coin.PRICE_USD).toFixed(2)}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="back-home-container">
                <Link to="/" className="back-home-link">← Back to Home</Link>
            </div>
        </div>
    );
};

export default Favorites;

import { useState, useEffect } from "react";
import './coinList.css';
import FavToggle from "./FavToggle";
import { Link } from "react-router-dom";
import MarketCapChart from "./MarketCapChart";

const App = () => {
    const [coins, setCoins] = useState([]);
    const [toggledStates, setToggledStates] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch('https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100')
            .then(httpResponse => httpResponse.json())
            .then(jsonResponse => {
                setCoins(jsonResponse.Data.LIST);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleToggle = (coinId) => {
        setToggledStates(prevState => {
            const newState = {
                ...prevState,
                [coinId]: !prevState[coinId]
            };
            localStorage.setItem("favorites", JSON.stringify(newState));
            return newState;
        });
    };

    const filteredCoins = coins.filter(coin =>
        coin.NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (coin.SYMBOL && coin.SYMBOL.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="coin-list-container">
            <h1 className="page-title">Cryptocurrency List</h1>

            <div className="top-bar">
                <input
                    type="text"
                    placeholder="Search coins..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Link to="/favorites">
                    <button className="addFavorites">Check favorites</button>
                </Link>
            </div>

            <ul className="coin-list">
                {filteredCoins.map(coin => (
                    <li key={coin.ID} className="crypto-styling">
                        <span>{coin.NAME} (${parseFloat(coin.PRICE_USD).toFixed(2)})</span>
                        <FavToggle
                            toggled={toggledStates[coin.ID]}
                            onToggle={() => handleToggle(coin.ID)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;

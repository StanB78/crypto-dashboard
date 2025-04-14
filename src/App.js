import { useState, useEffect } from "react";
import './coinList.css';
import FavToggle from "./FavToggle";
import { Link } from "react-router-dom";
import MarketCapChart from "./MarketCapChart";

const App = () => {
    const [coins, setCoins] = useState([]);
    const [toggledStates, setToggledStates] = useState({});

    useEffect(() => {
        fetch('https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=100')
            .then(httpResponse => httpResponse.json())
            .then(jsonResponse => {
                setCoins(jsonResponse.Data.LIST);
                console.log(jsonResponse.Data.LIST);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    const handleToggle = (coinId) => {
        setToggledStates(prevState => {
            const newState = {
                ...prevState,
                [coinId]: !prevState[coinId]
            };
            localStorage.setItem("favorites", JSON.stringify(newState)); // Svae to local storage
            return newState;
        });
    };

    if (!coins || !coins.length) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <h1 style={{color: '#ffffff', margin: '40px'}}>Cryptocurrency List</h1>
            <Link to="/favorites">
                <button className="addFavorites">Check favorites</button>
            </Link>
            <ul>
                {coins.map(coin => (
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

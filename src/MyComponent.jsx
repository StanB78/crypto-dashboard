import React, { useState } from 'react';

function MyComponent() {
    let [name, setName] = useState('');

    // The updateName function should use the setter to update the state
    const updateName = () => {
        setName("Stan"); // Correct way to update state
        console.log("Name updated to:", name); // This will still log the old value due to the async nature of state updates
    };

    return (
        <div>
            <p>Name: {name}</p>
            <button onClick={updateName}>Set Name</button>
        </div>
    );
}

export default MyComponent;

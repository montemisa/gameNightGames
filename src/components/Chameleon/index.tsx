import React from 'react';
import { useNavigate } from "react-router-dom";

export default function Chameleon() {
    const navigate = useNavigate();

    const onCreateGameClick = () => {
        console.log("Create game was clicked");
        navigate("/chameleon/create");
    };

    const onJoinGameClick = () => {
        console.log("Join game was clicked");
    };

    return(
        <div className='chameleon-container App'>
            <h1>Chameleon</h1>
            <button onClick={onCreateGameClick}>Create a new game</button>
            <button onClick={onJoinGameClick}>Join a game</button>
        </div>
    );
}
import React from 'react';

export default function Chameleon() {

    const onCreateGameClick = () => {
        console.log("Create game was clicked");
    }

    const onJoinGameClick = () => {
        console.log("Join game was clicked");
    }

    return(
        <div className='chameleon-container'>
            <h1>Chameleon</h1>
            <button onClick={onCreateGameClick}>Create game</button>
            <button onClick={onJoinGameClick}>Join game</button>
        </div>
    );
}
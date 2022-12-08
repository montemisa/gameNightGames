import React from 'react';
import { useAppSelector } from '../../hooks'



export default function ChameleonLobby() {
    const state = useAppSelector((state) => state.chameleonState);

    return (
        <div className="App">
            <h1>Hello {state.currentPlayer} Waiting for other players</h1>
            <div>GameId {state.gameId}</div>
            <ul>{state.playerNames.map(pn => <li key={pn}>{pn}</li>)}</ul>
        </div>
    );
}
import React from 'react';
import { useAppSelector } from '../../hooks'
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';



export default function ChameleonLobby() {
    const state = useAppSelector((state) => state.chameleonState);
    const sessionState = useAppSelector((state) => state.sessionState);

    return (
        <div className="App">
            <h1>Hello {state.currentPlayer} Waiting for other players</h1>
            <span>The WebSocket is currently {CONNECTION_READY_STATE_DESCRIPTIONS[sessionState.socketState]}</span>
            <div>GameId {state.gameId}</div>
            <ul>{state.playerNames.map(pn => <li key={pn}>{pn}</li>)}</ul>
        </div>
    );
}

// Figure out how to work with step functions to create a workflow that will join a game and then broadcast the GameStateChanged event to all the connected players.
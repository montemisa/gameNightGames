import React from 'react';
import { useAppSelector } from '../../hooks'



export default function ChameleonLobby() {
    const state = useAppSelector((state) => state.chameleonState);

    return (
        <div className="App">
            <h1>Hello {state.currentPlayer} Waiting for other players</h1>
        </div>
    );
}
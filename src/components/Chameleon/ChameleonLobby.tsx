import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';
import { GameStatus, LoadState } from '../../types';
import { createGameAsync, joinGameAsync, startGameAsync } from './ChameleonSlice';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { ReadyState } from 'react-use-websocket';
import { Navigate, useNavigate } from 'react-router-dom';



export default function ChameleonLobby() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const state = useAppSelector((state) => state.chameleonState);
    const sessionState = useAppSelector((state) => state.sessionState);

    useEffect(() => {
        if (!sessionState.socketNeeded) {
            // dispatch(setSocketNeeded(true))
        }
    }, [sessionState.socketNeeded]);

    useEffect(() => {
        if (state.gameStatus === GameStatus.STARTED) {
            console.log('The game started send to that page with word ', state.assignedWord)
            navigate("/chameleon/play");
        }
    }, [state.gameStatus]);

    useEffect(() => {
        if (sessionState.socketState === ReadyState.OPEN && state.loadState === LoadState.INIT) {
            if (state.gameId !== '') {
                console.log('attempting to join game');
                dispatch(joinGameAsync({sessionId: sessionState.sessionId, gameId: state.gameId, displayName: state.currentPlayer}))
            } else {
                console.log('attempting to create game');
                dispatch(createGameAsync({displayName: state.currentPlayer, sessionId: sessionState.sessionId}));
            }
        }
    }, [sessionState.socketState, state.loadState, state.gameId]);

    const onStartGameClick = () => {
        dispatch(startGameAsync({sessionId: sessionState.sessionId, gameId: state.gameId}));
        console.log('starting game');
    }

    return (
        <div className="App">
            <h1>Hello {state.currentPlayer}</h1>
            <div>{state.isHost ? <span>Click start game when ready</span> : <span>Waiting for host to start the game</span>}</div>
            <span>The WebSocket is currently {CONNECTION_READY_STATE_DESCRIPTIONS[sessionState.socketState]}</span>
            <div>Invite others using this link <a>gameNightgames.xyz/{state.gameId}</a></div>
            <h1></h1>
            <div>
                <span>How many chameleons?   </span><input type='text' placeholder='How many chameleons?' />
            </div>
            <div>
                <span>Use random word?</span><label>Yes</label><input type="radio" id="yes_rando" name="fav_language" value="Yes"/> <label>No</label> <input type="radio" id="no_rando" name="fav_language" value="No"/>
            </div>
            
            <h3>Connected players</h3>
            <ul>{state.playerNames.map(pn => <li key={pn}>{pn}</li>)}</ul>
            {state.isHost &&<button onClick={onStartGameClick}>Start game</button>}
        </div>
    );
}

// Figure out how to work with step functions to create a workflow that will join a game and then broadcast the GameStateChanged event to all the connected players.
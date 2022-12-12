import React, { useEffect, useState, ChangeEvent } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';
import { GameStatus, LoadState } from '../../types';
import { createGameAsync, joinGameAsync, startGameAsync } from './ChameleonSlice';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { ReadyState } from 'react-use-websocket';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Toggle from 'react-toggle';

import './Chameleon.css';
import "react-toggle/style.css"


export default function ChameleonLobby() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { gameId } = useParams();
    const state = useAppSelector((state) => state.chameleonState);
    const sessionState = useAppSelector((state) => state.sessionState);
    const [customGameId, setCustomGameId] = useState('');
    const [shouldUseRandomWord, setShouldUseRandomWord] = useState(true);
    const gameUrl = "http://d32su7xngve4bg.cloudfront.net/chameleon/" + state.gameId
    useEffect(() => {
        if (!sessionState.socketNeeded) {
            console.log(gameId);
            // dispatch(setSocketNeeded(true));
        };
    }, [sessionState.socketNeeded])
    

    // const onCreateGameClick = () => {
    //     dispatch(setCurrentPlayer(displayName));

    //     if (sessionState.socketState === ReadyState.OPEN) {
    //         dispatch(createGameAsync({displayName, sessionId: sessionState.sessionId}));
    //         navigate("/chameleon/lobby");
    //     } else {
    //         console.log('websocket not ready');
    //     }
    // };

    const onRandomWordToggle = () => {
        setShouldUseRandomWord(!shouldUseRandomWord);
    };

    useEffect(() => {
        if (!sessionState.socketNeeded) {
            // dispatch(setSocketNeeded(true))
        }
    }, [sessionState.socketNeeded]);

    useEffect(() => {
        if (state.gameStatus === GameStatus.STARTED) {
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

    const onCopyUrlClick = () => {
        navigator.clipboard.writeText(gameUrl)
    }

    return (
        <div className="App">
            <h1>Chameleon</h1>
            <div className='chameleon-lobby-main'>
                <div className='chameleon-lobby-connected'>
                    <h3>Connected players</h3>
                    <ul>{state.playerNames.map(pn => <li key={pn}>{pn}{state.currentPlayer === pn && "(You)"}</li>)}</ul>
                 </div>
                <div className='chameleon-lobby-main-details'>
                    <h3>{state.isHost ? <span>Click start game when ready</span> : <span>Waiting for host to start the game...</span>}</h3>

                    <input 
                        className='chameleon-create-input' 
                        type='text' 
                        placeholder='Enter custom room id (Optional)' 
                        value={customGameId} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomGameId(e.target.value)}
                    />
                    <div className='chameleon-create-random'>
                        <label 
                            className='chameleon-create-random-label'
                            htmlFor='use-random-word'
                        >
                                Use a random secret word
                        </label>
                        <Toggle 
                            id='use-random-word' 
                            defaultChecked={shouldUseRandomWord} 
                            onChange={onRandomWordToggle}  
                        />
                    </div>
                    {!shouldUseRandomWord && <input 
                        className='chameleon-create-input'
                        type='text' 
                        placeholder='Enter secret word' 
                    />}
                    <div className="chameleon-lobby-invite">
                       <p>Invite others using this link:  </p>
                       <span>
                            <input type='text' readOnly={true} value={gameUrl} />
                            <button className="chameleon-lobby-invite-button" onClick={onCopyUrlClick}>Copy</button>
                        </span>
                       
                    </div>
                    {
                        state.isHost &&
                        <button 
                            className="chameleon-lobby-start-button"
                            onClick={onStartGameClick}
                        >
                            Start game
                        </button>}
                    <span>The WebSocket is currently {CONNECTION_READY_STATE_DESCRIPTIONS[sessionState.socketState]}</span>
                </div>
            </div>
        
            
        </div>
    );
}

// Figure out how to work with step functions to create a workflow that will join a game and then broadcast the GameStateChanged event to all the connected players.
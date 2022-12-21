import React, {useEffect, useState, ChangeEvent} from 'react';
import {useAppDispatch} from '../../hooks';
import {createGameAsync,  setCurrentPlayer, resetGameState} from './ChameleonSlice';
import { useNavigate, useLocation } from "react-router-dom";
import { ReadyState } from 'react-use-websocket';
import { useAppSelector } from '../../hooks';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';
import './Chameleon.css';
import { LoadState } from '../../types';

export default function Chameleon() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [gameIdToJoin, setGameIdToJoin] = useState('');
    const sessionState = useAppSelector((state) => state.sessionState);
    const gameState = useAppSelector((state) => state.chameleonState);
    const location = useLocation();

    useEffect(() => {
        if (!sessionState.socketNeeded) {
            dispatch(setSocketNeeded(true));
        };
    }, [sessionState.socketNeeded]);

    useEffect(() => {
        console.log(location)
    },[location]);



    useEffect(() => {
        // Need to clear out any previous game states on initial load of this page.
        dispatch(resetGameState());
    }, []);

    useEffect(() => {
        // From this page game state should only get to loaded after they click
        // create game so we forward them to the lobby after
        if (gameState.loadState === LoadState.LOADED) {
            navigate("/chameleon/" + gameState.gameId,{replace:false});
        }
    }, [gameState.loadState]);

    
    const onCreateGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        dispatch(createGameAsync({displayName, sessionId: sessionState.sessionId}));
    };

    const onJoinGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        // dispatch(setGameId(gameIdToJoin));
        // navigate("/chameleon/lobby")
        console.log("Add player to random public game")
    };

    return(
        <div className='chameleon-container App'>
            <h1>Chameleon</h1>
            <input className="chameleon-display-name-input" type='text' placeholder='Enter display name' value={displayName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}/>
            <button className="chameleon-button" onClick={onJoinGameClick}>Play now</button>
            <button className="chameleon-button" onClick={onCreateGameClick}>Create a new game</button>
            <div className="chameleon-how-to-play">
                <h2>How to play</h2>
                <ul>
                    <li>Get a group of friends</li>
                    <li>Select the secret world (or we can pick one for you)</li>
                    <li>When the game starts everyone will get the secret word except for the Chameleon(s)</li>
                    <li>Go around in a circle and everyone will say one word that is related to the secret word</li>
                    <li>The chameleon tries to figure out what the secret word might be by using the hints everyone else gave</li>
                    <li>The chameleon gives a hint based on what other hints were given</li>
                    <li>After everyone has gone once. We vote on who we think the chameleon is</li>
                </ul>
            </div>
        </div>
    );
}
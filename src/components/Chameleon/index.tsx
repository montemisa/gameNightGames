import React, {useEffect, useState, ChangeEvent} from 'react';
import {useAppDispatch} from '../../hooks';
import {createGameAsync,  setCurrentPlayer, setGameId} from './ChameleonSlice';
import { useNavigate } from "react-router-dom";
import { ReadyState } from 'react-use-websocket';
import { useAppSelector } from '../../hooks';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';


export default function Chameleon() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [gameIdToJoin, setGameIdToJoin] = useState('');
    const sessionState = useAppSelector((state) => state.sessionState);
    const gameState = useAppSelector((state) => state.chameleonState);


    useEffect(() => {
        if (!sessionState.socketNeeded) {
            dispatch(setSocketNeeded(true));
        };
    }, [sessionState.socketNeeded])

    
    const onCreateGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        navigate("/chameleon/lobby");
    };

    const onJoinGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        dispatch(setGameId(gameIdToJoin));
        navigate("/chameleon/lobby")
    };

    return(
        <div className='chameleon-container App'>
            <h1>Chameleon</h1>
            <input type='text' placeholder='Enter display name' value={displayName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}/>
            <button onClick={onCreateGameClick}>Create a new game</button>
            <div>
                <button onClick={onJoinGameClick}>Join a game</button>
                <input type='text' placeholder='Enter game id (Ask host for the game id)' value={gameIdToJoin} onChange={(e: ChangeEvent<HTMLInputElement>) => setGameIdToJoin(e.target.value)}/>
            </div>
        </div>
    );
}
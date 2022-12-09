import React, {ChangeEvent, useEffect, useState} from 'react';
import {useAppDispatch} from '../../hooks';
import {createGameAsync,  setCurrentPlayer} from './ChameleonSlice';
import { useNavigate } from "react-router-dom";
import { ReadyState } from 'react-use-websocket';
import { useAppSelector } from '../../hooks';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';

export default function CreateChameleonGame() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const sessionState = useAppSelector((state) => state.sessionState);

    useEffect(() => {
        if (!sessionState.socketNeeded) {
            dispatch(setSocketNeeded(true));
        };
    }, [sessionState.socketNeeded])
    

    const onCreateGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        if (sessionState.socketState === ReadyState.OPEN) {
            dispatch(createGameAsync({displayName, sessionId: sessionState.sessionId}));
        } else {
            console.log('websocket not ready');
        }
        navigate("/chameleon/lobby");
    };

    return(
        <div className='App'>
            <input type='text' placeholder='Enter display name' value={displayName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}/>
            <button onClick={onCreateGameClick}>Create game</button>
            <span>The WebSocket is currently {CONNECTION_READY_STATE_DESCRIPTIONS[sessionState.socketState]}</span>
        </div>
    );
}

// Need to send the call to actually create the game now and then implement the join game features.

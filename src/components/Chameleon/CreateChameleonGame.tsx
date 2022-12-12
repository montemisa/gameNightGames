import React, {ChangeEvent, useEffect, useState} from 'react';
import {useAppDispatch} from '../../hooks';
import {createGameAsync,  setCurrentPlayer} from './ChameleonSlice';
import { useNavigate } from "react-router-dom";
import { ReadyState } from 'react-use-websocket';
import { useAppSelector } from '../../hooks';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';
import Toggle from 'react-toggle';

import './Chameleon.css';
import "react-toggle/style.css"

export default function CreateChameleonGame() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const sessionState = useAppSelector((state) => state.sessionState);
    const [shouldUseRandomWord, setShouldUseRandomWord] = useState(true);

    useEffect(() => {
        if (!sessionState.socketNeeded) {
            // dispatch(setSocketNeeded(true));
        };
    }, [sessionState.socketNeeded])
    

    const onCreateGameClick = () => {
        dispatch(setCurrentPlayer(displayName));

        if (sessionState.socketState === ReadyState.OPEN) {
            dispatch(createGameAsync({displayName, sessionId: sessionState.sessionId}));
            navigate("/chameleon/lobby");
        } else {
            console.log('websocket not ready');
        }
    };

    const onRandomWordToggle = () => {
        setShouldUseRandomWord(!shouldUseRandomWord);
    };

    return(
        <div className='App'>
            <h1>Chameleon</h1>
            <input 
                className='chameleon-create-input' 
                type='text' 
                placeholder='Enter custom room id (Optional)' 
                value={displayName} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
            />
            <input 
                className='chameleon-create-input'
                type='text' 
                placeholder='Enter display name' 
                value={displayName} 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
            />
            <div className='chameleon-create-random'>
                <label htmlFor='use-random-word'>Use a random secret word</label>
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
            <button className='chameleon-button' onClick={onCreateGameClick}>Create game</button>
            <span>The WebSocket is currently {CONNECTION_READY_STATE_DESCRIPTIONS[sessionState.socketState]}</span>
        </div>
    );
}

// Need to send the call to actually create the game now and then implement the join game features.


// [{"M":{"isHost":{"BOOL":true},"sessionId":{"S":"c7a756d96d1a4f3067e4dd01d7242c30"},"websocketId":{"S":"c8yV6cNOvHcCGfA="},"word":{"S":"Ocean"},"displayName":{"S":"Krystle"}}},{"M":{"isHost":{"BOOL":false},"sessionId":{"S":"d0c795dfe59a9c61a7ff4863b2b11f77"},"websocketId":{"S":"c8yBydCEPHcCFrw="},"word":{"S":"Ocean"},"displayName":{"S":"papi"}}},{"M":{"isHost":{"BOOL":false},"sessionId":{"S":"6c3ade520f86974de99fa18f3d8f2f5d"},"websocketId":{"S":"c8yCEf5KvHcCFOw="},"word":{"S":"Chameleon"},"displayName":{"S":"my laptop"}}},{"M":{"isHost":{"BOOL":false},"sessionId":{"S":"4d9e86b5f58d528cf284382299b6a508"},"websocketId":{"S":"c8yrDcAsPHcCGlg="},"word":{"S":"Ocean"},"displayName":{"S":"your laptop"}}}]
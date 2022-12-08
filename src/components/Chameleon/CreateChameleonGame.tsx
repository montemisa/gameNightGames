import React, {ChangeEvent, useState, useEffect} from 'react';
import {useAppDispatch} from '../../hooks';
import {createGameAsync,  setCurrentPlayer} from './ChameleonSlice';
import { useNavigate } from "react-router-dom";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAppSelector } from '../../hooks';


export default function CreateChameleonGame() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const socketUrl = 'wss://7ts72qhc81.execute-api.us-west-2.amazonaws.com/production';
    const [messageHistory, setMessageHistory] = useState<Array<MessageEvent<any>>>([]);
    const sessionState = useAppSelector((state) => state.sessionState);

    const onSocketOpen = (evt:any) => {
        console.log(evt);
    }

    const { lastMessage, readyState, getWebSocket } = useWebSocket(socketUrl, {onOpen: onSocketOpen, queryParams: {sessionId: sessionState.sessionId}}, sessionState.valid);

    useEffect(() => {
        if (lastMessage !== null) {
          setMessageHistory((prev) => prev.concat(lastMessage));
        }
        console.log(messageHistory);
      }, [lastMessage, setMessageHistory]);

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            console.log(getWebSocket());
        }

    }, [readyState]);

      const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[readyState];


    const onCreateGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        if (readyState === ReadyState.OPEN) {
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
            <span>The WebSocket is currently {connectionStatus}</span>

        </div>
    );
}

// Need to send the call to actually create the game now and then implement the join game features.

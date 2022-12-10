import  {  useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import useWebSocket  from 'react-use-websocket';
import { setSocketState } from '../../reducers/sessionsSlice';
import { handleGameUpdate } from '../Chameleon/ChameleonSlice';

export default function SocketHandler() {
    const dispatch = useAppDispatch();
    const socketUrl = 'wss://7ts72qhc81.execute-api.us-west-2.amazonaws.com/production';
    const sessionState = useAppSelector(state => state.sessionState);

    const onSocketOpen = (evt:any) => {
        console.log(evt);
    }
    const onSocketClose = (evt:any) => {
        console.log('socket closed');
    }
    const onSocketMessage = (evt:any) => {
        console.log('received msg', JSON.parse(evt.data));
        dispatch(handleGameUpdate(JSON.parse(evt.data)));
    }
    const onSocketError = (evt:any) => {
        console.log('socket error', evt)
    }

    const options = {
        onOpen: onSocketOpen,
        onClose: onSocketClose,
        onError: onSocketError,
        onMessage: onSocketMessage, 
        queryParams: {
            sessionId: sessionState.sessionId
        },
        shouldReconnect: (evt:any) => true,
    }

    const { readyState } = useWebSocket(socketUrl,  options, sessionState.valid && sessionState.socketNeeded);

    useEffect(() => {
        dispatch(setSocketState(readyState));
    }, [readyState]);

    return(<></>);
}
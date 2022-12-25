import  {  useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../hooks';
import useWebSocket  from 'react-use-websocket';
import { setSocketState } from '../../reducers/sessionsSlice';
import { handleGameUpdate } from '../Chameleon/ChameleonSlice';
// import { useLocation } from 'react-router-dom';

export default function SocketHandler() {
    const dispatch = useAppDispatch();
    const socketUrl = 'wss://bkq8bd27q8.execute-api.us-west-2.amazonaws.com/development';
    const sessionState = useAppSelector(state => state.sessionState);
    // const location = useLocation();
    const gameId = useAppSelector((state) => state.chameleonState.gameId);


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
            sessionId: sessionState.sessionId,
            gameId,
        },
        shouldReconnect: (evt:any) => true,
    }

    const { readyState } = useWebSocket(socketUrl,  options, sessionState.valid && sessionState.socketNeeded);

    useEffect(() => {
        dispatch(setSocketState(readyState));
    }, [readyState]);
    

    return(<></>);
}
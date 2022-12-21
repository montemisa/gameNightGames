import React, { useEffect, useState, ChangeEvent,FocusEventHandler } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';
import { GameStatus, LoadState } from '../../types';
import { createGameAsync, joinGameAsync, setCurrentPlayer, setGameId, startGameAsync } from './ChameleonSlice';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { ReadyState } from 'react-use-websocket';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import Toggle from 'react-toggle';
import Modal from 'react-modal';
import { ColorRing } from 'react-loader-spinner';

import './Chameleon.css';
import "react-toggle/style.css"

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

export default function ChameleonLobby() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { gameId } = useParams();
    const state = useAppSelector((state) => state.chameleonState);
    const sessionState = useAppSelector((state) => state.sessionState);
    const [customGameId, setCustomGameId] = useState('');
    const [shouldUseRandomWord, setShouldUseRandomWord] = useState(true);
    const [customWord, setCustomWord] = useState('');
    const [displayName, setDisplayName] = useState('');
    const gameUrl = "http://d32su7xngve4bg.cloudfront.net/chameleon/" + state.gameId
    const [showDisplayNameModal, setShowDisplayNameModal] = useState(false);

    useEffect(() => {
        if (state.gameId !== gameId) {
            dispatch(setGameId(gameId));
        }
        if (state.loadState === LoadState.LOADED) {
        } else if (state.loadState === LoadState.INIT) {
            setShowDisplayNameModal(true);
        } else {
            console.log("Unexpected state");
        }
    }, [])

    useEffect(() => {
        if (!sessionState.socketNeeded) {
            dispatch(setSocketNeeded(true))
        }
    }, [sessionState.socketNeeded]);

    useEffect(() => {
        if (state.gameStatus === GameStatus.STARTED) {
            navigate(`/chameleon/${gameId}/play`);
        }
    }, [state.gameStatus]);

    useEffect(() => {
        if (sessionState.socketState === ReadyState.OPEN && state.loadState === LoadState.INIT && state.currentPlayer.length >  0) {
            if (state.gameId !== '') {
                dispatch(joinGameAsync({sessionId: sessionState.sessionId, gameId: state.gameId, displayName: state.currentPlayer}))
            } else {
                dispatch(createGameAsync({displayName: state.currentPlayer, sessionId: sessionState.sessionId}));
            }
        }
    }, [sessionState.socketState, state.loadState, state.gameId, state.currentPlayer]);

    const onRandomWordToggle = () => {
        setShouldUseRandomWord(!shouldUseRandomWord);
    };

    const onStartGameClick = () => {
        let startRequest = {
            sessionId: sessionState.sessionId,
            gameId: state.gameId,
            customWord,
        };
        dispatch(startGameAsync(startRequest));
    }

    const onCopyUrlClick = () => {
        navigator.clipboard.writeText(gameUrl)
    }


    const closeModal = () => {
        navigate("/chameleon");
        setShowDisplayNameModal(false);
    }

    const joinGame = () => {
        setShowDisplayNameModal(false);
        dispatch(setCurrentPlayer(displayName));
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
                    <ColorRing
                        visible={state.loadState === LoadState.LOADING || sessionState.socketState === ReadyState.CONNECTING}
                        height="80"
                        width="80"
                        ariaLabel="blocks-loading"
                        wrapperStyle={{}}
                        wrapperClass="blocks-wrapper"
                        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                    />
                    <input 
                        className='chameleon-create-input' 
                        type='text' 
                        placeholder='Enter custom room id (Optional)' 
                        value={customGameId} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomGameId(e.target.value)}
                        onBlur={(e:any) => console.log(e)}
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
                        value={customWord}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomWord(e.target.value)}
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

            <Modal
                isOpen={showDisplayNameModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <p>Enter display name to join the game</p>
                <input 
                    className='chameleon-create-input' 
                    type='text' 
                    placeholder='Display name' 
                    value={displayName} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
                />
                <button onClick={closeModal}>close</button>
                <button onClick={joinGame}>Join game</button>
            </Modal>
        </div>
    );
}

// Figure out how to work with step functions to create a workflow that will join a game and then broadcast the GameStateChanged event to all the connected players.
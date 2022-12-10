import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks'
import { CONNECTION_READY_STATE_DESCRIPTIONS } from '../../constants';
import { GameStatus, LoadState } from '../../types';
import { createGameAsync, joinGameAsync, startGameAsync } from './ChameleonSlice';
import { setSocketNeeded } from '../../reducers/sessionsSlice';
import { ReadyState } from 'react-use-websocket';



export default function ChameleonGamePlay() {
    const dispatch = useAppDispatch()
    const state = useAppSelector((state) => state.chameleonState);
    const sessionState = useAppSelector((state) => state.sessionState);


    return (
        <div className="App">
            <h1>{state.assignedWord}</h1>
        </div>
    );
}


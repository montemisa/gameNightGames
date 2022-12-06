import React, {ChangeEvent, useState} from 'react';
import {useAppDispatch} from '../../hooks';
import {setCurrentPlayer} from './ChameleonSlice';
import { useNavigate } from "react-router-dom";

export default function CreateChameleonGame() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');

    const onCreateGameClick = () => {
        dispatch(setCurrentPlayer(displayName));
        navigate("/chameleon/lobby");
    };

    return(
        <div className='App'>
            <input type='text' placeholder='Enter display name' value={displayName} onChange={(e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}/>
            <button onClick={onCreateGameClick}>Create game</button>
        </div>
    );
}
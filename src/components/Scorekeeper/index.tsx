import React, { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

export default function Scorekeeper() {
    const location = useLocation();

    const [round, setRounds] = useState(1);
    const [players, setPlayers ]



    return (
        <div className="scorekeep-container">
            <table>
                

            </table>
            <button className="scorekeeper-add-button">Add player</button>
        </div>
    );
}
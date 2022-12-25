import React, { useState, ChangeEvent } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Modal from 'react-modal';

export default function Scorekeeper() {

    interface Player {
        name: string;
        scores: string[]
    }
    const location = useLocation();

    const [round, setRounds] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [players, setPlayers ] = useState<Player[]>([]);
    const [playerEditIndex, setPlayerEditIndex] = useState<number | undefined>(undefined);
    const [tempPlayerName, setTempPlayerName] = useState('');

    const getHeaders = () => {
        const lst = [];

        for (let i = 0; i < round; i += 1) {
            lst.push(<th>Round {i+1}</th>)
        }
        return lst;
    };

    const getPlayerRows = () => {
        return players.map(p => <tr>
            <td>{p.name}</td>
            {p.scores.map(s => <td>s</td>)}
        </tr>)
    }

    const getTotalRow = () => {
        const totals = Array(round).fill(0);
        players.forEach(p => {
            for (let i = 0; i < p.scores.length; i += 1) {
                totals[i] += p.scores[i];
            }
        });
        return totals.map(t => <td>{t}</td>)
    }

    const onCloseModal = () => {
        setPlayerEditIndex(undefined);
    };

    const onAddPlayer = () => {
        const newPlayer = {
            name: 'New player',
            scores: [],
        }
        setPlayers([...players, newPlayer]);
        setTempPlayerName(newPlayer.name);
        setPlayerEditIndex(players.length);
    }

    const onSaveEditClick = () => {
        if (playerEditIndex !== undefined) {
            console.log("Edit index undefined");
            players[playerEditIndex].name = tempPlayerName;
            setPlayers([...players]);
        }
        setPlayerEditIndex(undefined);
    }

    const onNextRoundClick = () => {
        setRounds(round + 1);
    }

    return (
        <div className="scorekeep-container">
            <h1>Current round: {round}</h1>
            <table>
                <tr>
                    <th>
                        Players
                    </th>
                    {getHeaders()}
                </tr>
                {getPlayerRows()}
                <tr>
                    <td>Total</td>
                    {getTotalRow()}
                </tr>
                

            </table>
            <button className="scorekeeper-add-button" onClick={onAddPlayer}>Add player</button>
            <button className="scorekeeper-enter-scores-button">Enter scores</button>
            <button className="scorekeeper-next-round-button" onClick={onNextRoundClick}>Next round</button>
            {/* <button className="scorekeeper-enter-scores-button" onClick={} */}
            <Modal
                isOpen={playerEditIndex !== undefined}
                onRequestClose={onCloseModal}
                contentLabel="Example Modal"
            >
                <h1>Enter player name</h1>
                <input value={tempPlayerName} onChange={(e: ChangeEvent<HTMLInputElement>) => setTempPlayerName(e.target.value)} />
                <button onClick={onCloseModal}>Cancel</button>
                <button onClick={onSaveEditClick}>Ok</button>
            </Modal>
        </div>
    );
}
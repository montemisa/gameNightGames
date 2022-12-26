import React, { useState, ChangeEvent } from 'react';
import Modal from 'react-modal';

import './Scorekeeper.css'

export default function Scorekeeper() {

    interface Player {
        name: string;
        scores: (number | undefined)[];
    }

    const [round, setRounds] = useState(1);
    const [currentRound, setCurrentRound] = useState(1);
    const [players, setPlayers ] = useState<Player[]>([{name: 'Player 1', scores: [undefined]}]);
    const [playerEditIndex, setPlayerEditIndex] = useState<number | undefined>(undefined);
    const [tempPlayerName, setTempPlayerName] = useState('');
    const [tempPlayerScore, setTempPlayerScore] = useState('');
    const [playerEditScoreIndex, setPlayerEditScoreIndex] = useState<number | undefined>(undefined);
    
    
    const getHeaders = () => {

        return players.map((p, idx) => 
        <th className="scorekeeper-player-name" onClick={() => onPlayerNameClick(idx)}>
            {p.name}
        </th>);
    };

    const getRoundRows = () => {
        const lst = [];

        for (let i = 0; i < round; i += 1) {
            lst.push(
                <tr>
                    <td 
                        className="scorekeeper-round-name"
                        onClick={() => onRoundClick(i+1)}
                    >
                        Round {i + 1}
                    </td>
                    {
                        players.map(p => {
                            if (i < p.scores.length) {
                                return(<td className="scorekeeper-score-cell">{p.scores[i]}</td>)
                            } 
                            return(<td></td>)
                        })
                    }
                </tr>
            )
        }
        return lst;
    }

    const getTotalRow = () => {
        return players.map(p => {
            let total = 0;
            p.scores.forEach(s => total += s || 0)
            return <td className="scorekeeper-score-cell">{total}</td>
        });
    }

    const onCloseModal = () => {
        setPlayerEditIndex(undefined);
        setPlayerEditScoreIndex(undefined);        
    };

    const onPlayerNameClick = (idx: number) => {
        setTempPlayerName(players[idx].name);
        setPlayerEditIndex(idx);
    }

    const onAddPlayer = () => {
        const newPlayer = {
            name: 'New player',
            scores: Array(round).fill(undefined),
        }
        setPlayers([...players, newPlayer]);
        setTempPlayerName(newPlayer.name);
        setPlayerEditIndex(players.length);
    }

    const onSaveEditClick = () => {
        if (playerEditIndex !== undefined) {
            players[playerEditIndex].name = tempPlayerName;
            setPlayers([...players]);
        }
        onCloseModal();
    }

    const onRoundClick = (roundNum: number) => {
        setCurrentRound(roundNum);
    }

    const onNextRoundClick = () => {
        setCurrentRound(currentRound + 1);
        if (currentRound === round) {
            players.forEach(p => p.scores.push(undefined));
            setPlayers([...players]);
            setRounds(round + 1);
        }
    }

    const saveScore = () => {

    }

    const onBackClick = () => {
        const idx = Math.max(0, playerEditScoreIndex! - 1);
        const score = players[idx].scores.length < currentRound ?
        0 : players[idx].scores[currentRound - 1];
        setTempPlayerScore(score ? score.toString() : '0');
        setPlayerEditScoreIndex(idx);
    }

    const onNextClick = () => {
        players[playerEditScoreIndex!].scores[currentRound - 1] = parseInt(tempPlayerScore);
        setPlayers([...players]);
        const idx = Math.min(players.length - 1, playerEditScoreIndex! + 1);
        const score = players[idx].scores.length < currentRound ?
        0 : players[idx].scores[currentRound - 1];
        setTempPlayerScore(score ? score.toString() : '0');
        setPlayerEditScoreIndex(idx);
    }

    const onDoneClick = () => {
        players[playerEditScoreIndex!].scores[currentRound - 1] = parseInt(tempPlayerScore);
        setPlayers([...players]);
        onCloseModal();
    }

    const onEnterScoresClick = () => {
        const score = players[0].scores.length < currentRound ?
        0 : players[0].scores[currentRound - 1];
        setTempPlayerScore(score ? score.toString() : '0');
        setPlayerEditScoreIndex(0);
    }

    const onKeyPressed = (e: any) => {
        if (e.key === "Enter") {
            if (playerEditIndex !== undefined) {
                onSaveEditClick();
            } else if (playerEditScoreIndex !== undefined) {
                if (playerEditScoreIndex === players.length - 1) {
                    onDoneClick();
                } else {
                    onNextClick();
                }
            }
        }
        e.cancelBubble = true;
        e.stopPropagation();
    }

    return (
        <div className="scorekeeper-container">
            <h1>Current round: {currentRound}</h1>
            <table>
                <thead>
                    <tr>
                        <th>
                            Players
                        </th>
                        {getHeaders()}
                    </tr>
                </thead>
                <tbody>
                    {getRoundRows()}
                    <tr>
                        <td>Total</td>
                        {getTotalRow()}
                    </tr>
                </tbody>
            </table>
            <div className="scorekeeper-edit-buttons">
                <button 
                    className="scorekeeper-add-button" 
                    onClick={onAddPlayer}
                    disabled={playerEditIndex !== undefined}
                >
                    Add player
                </button>
                <button 
                    className="scorekeeper-enter-scores-button" 
                    onClick={onEnterScoresClick}
                    disabled={playerEditScoreIndex !== undefined}
                >
                    Enter scores
                </button>
                <button className="scorekeeper-next-round-button" onClick={onNextRoundClick}>Next round</button>
            </div>
            <Modal
                isOpen={playerEditIndex !== undefined}
                onRequestClose={onCloseModal}
                contentLabel="Example Modal"
            >
                <h1>Enter player name</h1>
                <input 
                    value={tempPlayerName} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTempPlayerName(e.target.value)} 
                    type="text"
                    onKeyDown={onKeyPressed}
                    autoFocus
                    onFocus={(e) => {e.target.select()}}
                />
                <button onClick={onCloseModal}>Cancel</button>
                <button onClick={onSaveEditClick}>Ok</button>
            </Modal>
            {playerEditScoreIndex !== undefined && <Modal
                isOpen={playerEditScoreIndex !== undefined}
                onRequestClose={onCloseModal}
                contentLabel="Example Modal"
            >
                <h1>Enter score for {players.length > (playerEditScoreIndex || 0) && players[playerEditScoreIndex!].name}</h1>
                <input 
                    key={playerEditScoreIndex}
                    value={tempPlayerScore} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTempPlayerScore((e.target.value))} 
                    type="number"
                    autoFocus
                    onKeyDown={onKeyPressed}
                    onFocus={(e) => {e.target.select()}}
                />
                <button onClick={onCloseModal}>Cancel</button>
                {playerEditScoreIndex !== undefined && playerEditScoreIndex > 0 && <button onClick={onBackClick}>Back</button>}
                {playerEditScoreIndex !== undefined && playerEditScoreIndex < players.length - 1 && <button onClick={onNextClick}>Next</button>}
                {playerEditScoreIndex !== undefined && playerEditScoreIndex === players.length - 1 && <button onClick={onDoneClick}>Done</button>}
            </Modal>}
        </div>
    );
}
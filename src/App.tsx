import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navigate, useNavigate } from "react-router-dom";
import {useAppSelector} from './hooks';
import {sessionService} from 'redux-react-session';

function App() {
  const navigate = useNavigate();
  const sessionState = useAppSelector((state) => state.sessionState);
  console.log(sessionState);
  sessionService.loadSession()
.then(currentSession => console.log(currentSession))
.catch(err => console.log(err))
  return (
    <div className="App">
      <h1>Select your favorite game to play</h1>
      <div onClick={() => navigate("/chameleon")} className="app-select-game-card">
        <h1>Play Chameleon</h1>
      </div>
    </div>
  );
}

export default App;

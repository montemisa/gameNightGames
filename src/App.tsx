import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Navigate, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
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

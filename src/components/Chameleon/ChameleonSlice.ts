import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadState, GameStatus,  PlayerInfo, JoinGameRequest } from '../../types';
import { createGame, joinGame } from '../../api/chameleonGame';


interface ChameleonState {
    gameStatus: GameStatus,
    currentPlayer: string,
    loadState: LoadState,
    gameId: string,
    playerNames: Array<string>,
    isHost: boolean,
};

const initialState: ChameleonState  = {
    loadState: LoadState.INIT,
    gameStatus:  GameStatus.UNKNOWN,
    currentPlayer: '',
    gameId: '',
    playerNames: [],
    isHost: false,
    
};

export const createGameAsync = createAsyncThunk(
    'chameleonGameState/createGame',
    async (playerInfo: PlayerInfo) => {
      const response = await createGame(playerInfo.sessionId,  playerInfo.displayName);
      return response;
    }
);

export const joinGameAsync = createAsyncThunk(
    'chameleonGameState/joinGame',
    async (req: JoinGameRequest) => {
        const resp = await joinGame(req.sessionId, req.gameId, req.displayName);
        return resp;
    }
);

export const chameleonSlice = createSlice({
    name: 'chameleonState',
    initialState,
    reducers: {
        setCurrentPlayer: (state, action) => {
            state.currentPlayer = action.payload;
        },
        handleGameUpdate: (state, action) => {
          state.playerNames = action.payload.connectedPlayers.map((cp: any) => cp.displayName);
          state.gameId = action.payload.gameId;
          state.isHost = action.payload.connectedPlayers.some((cp:  any) => cp.displayName === state.currentPlayer && cp.isHost)
        },
        setGameId: (state, action) => {
          state.gameId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(createGameAsync.pending, (state) => {
            state.loadState = LoadState.LOADING;
          })
          .addCase(createGameAsync.fulfilled, (state, action) => {
            state.loadState = LoadState.LOADED;
            state.gameId = action.payload.gameId;
            state.gameStatus = GameStatus.LOBBY;
            state.isHost = true;
            state.playerNames = action.payload.connectedPlayers.map((p: any) => p.displayName);
          })
          .addCase(createGameAsync.rejected, (state, action) => {
            state.loadState = LoadState.ERROR;
          })
          .addCase(joinGameAsync.pending, (state) => {
            state.loadState = LoadState.LOADING;
          })
          .addCase(joinGameAsync.fulfilled, (state, action) => {
            state.loadState = LoadState.LOADED;
          })
          .addCase(joinGameAsync.rejected, (state, action) => {
            state.loadState = LoadState.ERROR;
          });
      },
});

export const { setCurrentPlayer, handleGameUpdate, setGameId } = chameleonSlice.actions;

export default chameleonSlice.reducer;
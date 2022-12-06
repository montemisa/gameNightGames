import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadState } from '../../types';


interface ChameleonState {
    loadState: LoadState,
    gameStatus: string,
    players: Array<string>,
    currentPlayer: string,
};

const initialState: ChameleonState  = {
    loadState: LoadState.INIT,
    gameStatus: "INIT",
    players: [],
    currentPlayer: '',
};

export const chameleonSlice = createSlice({
    name: 'ChameleonState',
    initialState,
    reducers: {
        setCurrentPlayer: (state, action) => {
            state.currentPlayer = action.payload;
        },
    },
});

export const { setCurrentPlayer } = chameleonSlice.actions;

export default chameleonSlice.reducer;
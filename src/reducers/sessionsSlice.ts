import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoadState } from '../types';
import { createSession, validateSession } from '../api/sessions';
import { ReadyState } from 'react-use-websocket';


interface SessionState {
    loadState: LoadState,
    checked: boolean,
    valid: boolean,
    user: string,
    sessionId: string,
    socketNeeded: boolean,
    socketState: ReadyState,
};

const initialState: SessionState  = {
    loadState: LoadState.INIT,
    checked: false,
    valid: false,
    user: '',
    sessionId: '',
    socketNeeded: false,
    socketState: ReadyState.UNINSTANTIATED,
};


export const createSessionAsync = createAsyncThunk(
    'sessionState/createSession',
    async (_, obj) => {
        console.log(obj);
      const response = await createSession();
      return response;
    }
);


export const getValidSessionAsync = createAsyncThunk(
    'sessionState/getValidSession',
    async (sessionId: string, config) => {
        const valid = await validateSession(sessionId);
        if (!valid){
            config.dispatch(createSessionAsync());
            return null;
        }
        return sessionId;
    }
);

export const sessionSlice = createSlice({
    name: 'SessionState',
    initialState,
    reducers: {
        setSessionChecked: (state) => {
          state.checked = true;
        },
        setSessionId: (state, action) => {
          state.checked = true;
          state.sessionId = action.payload;
        },
        setSocketNeeded: (state, action) => {
          state.socketNeeded = action.payload;
        },
        setSocketState: (state, action) => {
          state.socketState = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(createSessionAsync.pending, (state) => {
            state.loadState = LoadState.LOADING;
          })
          .addCase(createSessionAsync.fulfilled, (state, action) => {
            state.loadState = LoadState.LOADED;
            state.sessionId = action.payload.sessionId;
            state.checked = true
            state.valid = true;
            localStorage.setItem('sessionId', action.payload.sessionId);
            console.log(action);
          })
          .addCase(createSessionAsync.rejected, (state, action) => {
            state.loadState = LoadState.ERROR;
            state.checked = true;
            state.valid = false;
            console.log(action);
          })
          .addCase(getValidSessionAsync.pending, (state) => {
            state.loadState = LoadState.LOADING;
          })
          .addCase(getValidSessionAsync.fulfilled, (state, action) => {
            state.loadState = LoadState.LOADED;
            if (action.payload !== null) state.sessionId = action.payload;
            state.checked = true
            state.valid = action.payload !== null;
          })
          .addCase(getValidSessionAsync.rejected, (state, action) => {
            state.loadState = LoadState.ERROR;
            state.checked = true;
            state.valid = false;
            console.log(action);
          });
      },
});

export const { 
  setSessionChecked, 
  setSessionId,  
  setSocketNeeded, 
  setSocketState 
} = sessionSlice.actions;

export default sessionSlice.reducer;



import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import rootReducer from '../reducers/rootReducer';
import { createSession } from '../api/sessions';
import { createSessionAsync, getValidSessionAsync, setSessionChecked, setSessionId } from '../reducers/sessionsSlice';

const store = configureStore({
    reducer: rootReducer
});

const sessionIdFromStorage = localStorage.getItem('sessionId');

if (sessionIdFromStorage === null) {
  store.dispatch(createSessionAsync());
} else {
  store.dispatch(getValidSessionAsync(sessionIdFromStorage));
}


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
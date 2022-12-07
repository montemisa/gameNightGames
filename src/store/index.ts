import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import rootReducer from '../reducers/rootReducer';
import { sessionService, SessionServiceOptions } from 'redux-react-session';

const store = configureStore({
    reducer: rootReducer
});

const validateSession = (session:any) => {
    // check if your session is still valid
    return true;    
}

const options: SessionServiceOptions = { refreshOnCheckAuth: true, driver: 'COOKIES', validateSession , expires: 30};
 
sessionService.initSessionService(store, options)
  .then(() => console.log('Redux React Session is ready and a session was refreshed from your storage'))
  .catch(() => console.log('Redux React Session is ready and there is no session in your storage'));

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
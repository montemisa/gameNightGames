import { combineReducers } from 'redux';
import chameleonReducer from '../components/Chameleon/ChameleonSlice';
import sessionReducer from './sessionsSlice';

const rootReducer = combineReducers({
    chameleonState: chameleonReducer,
    sessionState: sessionReducer,
});

export default rootReducer;
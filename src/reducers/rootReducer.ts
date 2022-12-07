import { combineReducers } from 'redux';
import chameleonReducer from '../components/Chameleon/ChameleonSlice';
import { sessionReducer } from 'redux-react-session';


const rootReducer = combineReducers({
    chameleonState: chameleonReducer,
    sessionState: sessionReducer,
});

export default rootReducer;
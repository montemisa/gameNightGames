import { combineReducers } from 'redux';
import chameleonReducer from '../components/Chameleon/ChameleonSlice';


const rootReducer = combineReducers({
    chameleonState: chameleonReducer,
});

export default rootReducer;
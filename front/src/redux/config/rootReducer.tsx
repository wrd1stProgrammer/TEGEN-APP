import {combineReducers} from 'redux';
import userSlice from '../reducers/userSlice';
import carbonSlice from '../reducers/carbonSlice';
import missionSlice from '../reducers/missionSlice';
import languageSlice from '../reducers/languageSlice';

const rootReducer = combineReducers({
    user: userSlice,  
    carbon: carbonSlice,
    mission: missionSlice,
    language: languageSlice,
});

export default rootReducer;
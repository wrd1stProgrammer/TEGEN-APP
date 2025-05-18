import {combineReducers} from 'redux';
import userSlice from '../reducers/userSlice';
import carbonSlice from '../reducers/carbonSlice';
import missionSlice from '../reducers/missionSlice';

const rootReducer = combineReducers({
    user: userSlice,  
    carbon: carbonSlice,
    mission: missionSlice,
});

export default rootReducer;
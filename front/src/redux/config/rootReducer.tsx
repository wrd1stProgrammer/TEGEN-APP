import {combineReducers} from 'redux';
import userSlice from '../reducers/userSlice';
import languageSlice from '../reducers/languageSlice';

const rootReducer = combineReducers({
    user: userSlice,  
    language: languageSlice,
});

export default rootReducer;
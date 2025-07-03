// redux/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { lang: 'ko' };

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => { state.lang = action.payload; },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;



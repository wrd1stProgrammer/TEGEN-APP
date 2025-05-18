import { createSlice } from '@reduxjs/toolkit';
import { Mission } from './types';

interface State {
  list    : Mission[];
  loading : boolean;
}

const initialState: State = { list: [], loading: false };

const missionSlice = createSlice({
  name: 'mission',
  initialState,
  reducers: {
    SET_LIST: (s, a) => { s.list = a.payload; },
    COMPLETE_SUCCESS: (s, a) => {
      const { mission } = a.payload;
      const idx = s.list.findIndex(m => m._id === mission._id);
      if (idx > -1) s.list[idx] = mission;
    },
  },
});

export const { SET_LIST, COMPLETE_SUCCESS } = missionSlice.actions;
export default missionSlice.reducer;

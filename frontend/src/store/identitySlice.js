import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // 'SDE' or '3D'. We default to SDE based on the design's primary mode
  mode: 'SDE',
};

export const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    setIdentity: (state, action) => {
      state.mode = action.payload;
    },
    toggleIdentity: (state) => {
      state.mode = state.mode === 'SDE' ? '3D' : 'SDE';
    },
  },
});

export const { setIdentity, toggleIdentity } = identitySlice.actions;
export default identitySlice.reducer;
